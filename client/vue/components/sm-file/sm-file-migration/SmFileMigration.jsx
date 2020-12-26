/**
 * 说明：文件迁移组件
 * 作者：easten
 */
import ApiOss from '../../sm-api/sm-file/oss';
import ApiMigration from '../../sm-api/sm-file/migration';
import { requestIsSuccess } from '../../_utils/utils';
let apiOss = new ApiOss();
let apiMigration=new ApiMigration();

// 按钮文本
let buttonText = {
  contrast: 1, // 对比
  start: 2, // 开始
  cancel: 3, // 取消
};

export default {
  name: 'SmFileMigration',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      ossList: [],
      originalId: '', // 原有库的选中id
      targetId: '', // 目标库的选中id
      btnText: buttonText.contrast, //按钮文本
      progress: 0,
      // 定义进度信息
      titleState:{
         migration:'可迁移-',
         migrating:'正在迁移-',
         migrated:'已完成-',
      },
      // 定义迁移状态
      migrationState:{
        waiting:1,// 等待对比
        start:2, // 未开始状态
        process:3, // 迁移进行中
        complete:4,// 完成状态
        cancel:5,
      },
      state:null,
    };
  },
  computed: {
    originalData() {
      return this.ossList.filter(a => a.id != this.targetId);
    },
    targetData() {
      return this.ossList.filter(a => a.id != this.originalId);
    },
    original() {
      return this.ossList.find(a => a.id == this.originalId) || {};
    },
    target() {
      return this.ossList.find(a => a.id == this.targetId) || {};
    },
    btnState() {
      console.log(this.getBtnState());
      return this.getBtnState();
    },
    // 按钮的可用性
    btnEnable() {
      if (
        this.original != null &&
        this.target != null &&
        this.original.state == '正常' &&
        this.target.state == '正常'
      )
        return true;
      else return false;
    },
    completeCount() {
      return this.count;
    },
  },
  watch: {},
  async created() {
    this.initAxios();
    this.getOssList();
    this.checkState();
  },
  methods: {
    initAxios() {
      apiOss = new ApiOss(this.axios);
      apiMigration = new ApiMigration(this.axios);
    },
    // 获取服务列表
    async getOssList() {
      let response = await apiOss.getList();
      if (requestIsSuccess(response)) {
        this.ossList = response.data;
      }
    },
    // 原服务检测
    async originalCheck(id) {
      let response = await apiOss.check(id);
      if (requestIsSuccess(response)) {
        this.original.state = response.data.state;
      }
    },
    // 目标库检测
    async targetCheck(id) {
      let response = await apiOss.check(id);
      if (requestIsSuccess(response)) {
        this.target.state = response.data.state;
      }
    },

    // 获取按钮的当前状态
    getBtnState() {
      switch (this.btnText) {
        case 1:
          return '对比';
        case 2:
          return '开始';
        case 3:
          return '取消';
        default:
          return '';
      }
    },
    // 按钮事件
    async btnEvent() {
      switch (this.btnText) {
        case 1:
          await this.contrast();
          break;
        case 2:
          await this.start();
          break;
        case 3:
          await this.cancel();
          break;
        default:
          break;
      }
    },
    // 初始化获取迁移的状态
    async checkState(){
      let response=await apiMigration.getProcess();
      if (requestIsSuccess(response)){
         let data=response.data;
         if(!data.success&&data.count===0){
           this.state=this.migrationState.waiting
         }else if(data.success){
           this.state=this.migrationState.complete;
         }else if(data.count!=0&&data.progress!=0){
          this.progress=data.progress;
          this.state=this.migrationState.process;
         }
      }
    },
    // 对比文件
    async contrast() {

      if(this.original.count===0){
        this.$message.error('源仓库数据为空，无法完成数据对比,请刷新重试');
        return;
      }
      if(this.state===this.migrationState.process){
        this.$message.error('后台有文件迁移在进行中');
        return;
      }
      //TODO 执行文件对比接口，返回相应参数，同时修改当前的按钮状态
      let srouceId=this.originalId;
      let targetId=this.targetId;
      let response=await apiMigration.dataContrast({
        srouceId,
        targetId
      });
      if (requestIsSuccess(response)){
         this.state=this.migrationState.start; // 等待开始
         this.original.count=response.data.count;
         this.btnText = buttonText.start;
      }
    },
    // 开始迁移
    async start() {
      // 恢复进度
      this.progress=0;
      //TODO 调用开始迁移接口，同时提示不能关闭当前页面，要是离开当前页面，需要给出必要的提示。
      let response=await apiMigration.start();
      if (requestIsSuccess(response)){
        this.getProcess();
        this.state=this.migrationState.process;
        this.btnText = buttonText.cancel;
      }
    },
    // 取消迁移
    async cancel() {
      //TODO 调用取消迁移接口，同时友情提示
      let response=await apiMigration.cancel();
      if (requestIsSuccess(response)){
         this.state=this.migrationState.cancel;
         this.btnText = buttonText.contrast;
      }
    },
    getProcess(){
      let timeout=0;
      let interval=setInterval(async () => {
        let response=await apiMigration.getProcess();
        if (requestIsSuccess(response)){
          timeout++;
          let data=response.data;
           if(data.count!==0){
             this.progress=data.progress;
           }
           if(data.success){
            this.progress=100;
            this.state=this.migrationState.complete;
            this.btnText = buttonText.contrast;
            clearInterval(interval);
           }

           if(timeout==10){
            this.state=this.migrationState.waiting;
            clearInterval(interval);
           }
        }
      }, 1000); 
    }
  },
  render() {
    return (
      <div class="f-migration">
        <div class="f-repository">
          <div class="target">
            <div class="icon">
              <span style="color:#37A273">
                <a-icon type="database" />
              </span>
              <span>源仓库</span>
            </div>
            <a-select
              style="width:  90%"
              onChange={v => (this.originalId = v)}
              placeholder="请选择原仓库"
            >
              {this.originalData.map(item => {
                return <a-select-option value={item.id}>{item.name}</a-select-option>;
              })}
            </a-select>
            <div class="info">
              <p>信息</p>
              <p>EndPoint：{this.original.endPoint} </p>
              <p>⽂件数量：{this.original.count} 项</p>
              <p>
                状态：
                {this.original.state == '正常' ? (
                  '正常'
                ) : (
                    <span style="color:red">{this.original.state}</span>
                  )}{' '}
                {this.originalId == '' ? (
                  ''
                ) : (
                    <a-button style="padding:0px" type="link" onClick={() => this.originalCheck(this.original.id)}>
                      测试
                    </a-button>
                  )}
              </p>
            </div>
          </div>
          <div class="arror">
            <a-icon type="arrow-right" />
          </div>
          <div class="target">
            <div class="icon">
              <span style="color:#E6BA2E">
                <a-icon type="database" />
              </span>
              <span>目标仓库</span>
            </div>
            <a-select
              style="width: 90%"
              onChange={v => (this.targetId = v)}
              placeholder="请选择目标仓库"
            >
              {this.targetData.map(item => {
                return <a-select-option value={item.id}>{item.name}</a-select-option>;
              })}
            </a-select>
            <div class="info">
              <p>信息</p>
              <p>EndPoint：{this.target.endPoint} </p>
              <p>⽂件数量：{this.target.count} 项</p>
              <p>
                状态：
                {this.target.state == '正常' ? (
                  '正常'
                ) : (
                    <span style="color:red">{this.target.state}</span>
                  )}{' '}
                {this.targetId == '' ? (
                  ''
                ) : (
                    <a-button style="padding:0px" type="link" onClick={() => this.targetCheck(this.targetId)}>
                      测试
                    </a-button>
                  )}
              </p>
            </div>
          </div>
        </div>
        <div class="f-progress">
          {this.state===this.migrationState.waiting?<span>请对比文件</span>:null}
          {this.state===this.migrationState.start?<span>可迁移文件数({this.original.count})</span>:null}
          {this.state===this.migrationState.process?<span>正在迁移({this.original.count})</span>:null}
          {this.state===this.migrationState.complete?<span>文件迁移完成({this.original.count})</span>:null}
          <a-progress percent={this.progress} status="active" />
          <a-button type="primary" onClick={this.btnEvent} disabled={!this.btnEnable}>
            {this.btnState}
          </a-button>
        </div>
      </div>
    );
  },
};
