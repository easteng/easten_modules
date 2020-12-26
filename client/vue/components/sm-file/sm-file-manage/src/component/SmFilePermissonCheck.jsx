// 资源权限选择配置组件
import { FileModalType } from '../common';
export default {
  name: 'SmFilePermissonCheck',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    type: { type: Number, default: 0 }, // 是否都是允许状态
    value: { type: Object , default: null }, // 是否都是允许状态
  },
  data() {
    return {
      // 权限内容定义,完全控制内容
      completeItem: {
        title: '完全控制',
        name: 'all',
        state: null,
        uncertain:false,
      },
      // 权限信息定义
      permissionList: [
        {
          title: '编辑（重命名|移动|上传|新建文件夹|共享|权限）',
          name: 'edit',
          state: null,
        },
        {
          title: '查看（列表|预览|下载|复制）',
          name: 'view',
          state: null,
        },
        {
          title: '删除',
          name: 'delete',
          state: null,
        },
        {
          title: '引用（选择模式是否可选）',
          name: 'use',
          state: null,
        },
      ],

      iValue: null,
      currentType: FileModalType.Share, // 默认分享状态
      shareDefault: {
        edit: true,
        view: true,
        delete: false,
        use: false,
      },
      permissionDefault: {
        edit: true,
        view: true,
        delete: false,
        use: true,
      },
    };
  },
  computed: {
    permissionArray() {
      return this.permissionList;
    },
    completeState(){
      return this.checkCompleteState();
    },
    // 返回到父组件的结果值
    retureResult(){
      return this.getCheckResult();
    },
  },
  watch: {
    value: {
      handler(nVal, oVal) {
        this.iValue = nVal;
        this.initCheckState();
      },
      immediate: true,
    },
    type: {
      handler(nVal, oVal) {
        this.currentType = nVal;
        this.initCheckState();
      },
      immediate: true,
    },
  },
  created() {
    //this.initCheckState();
  },
  methods: {
    // 共享状态下默认值
    shareStateDefault() {
      this.permissionList.forEach(a => {
        a.state=this.iValue==null? this.shareDefault[a.name]:this.iValue[a.name];
      });
    },
    // 权限状态下的默认值
    permissionStateDefault() {
      this.permissionList.forEach(a => {
        a.state = this.iValue==null? this.permissionDefault[a.name]:this.iValue[a.name];
      });
    },
    // 初始化复选框状态
    initCheckState() {
      switch (this.currentType) {
        case FileModalType.Share:
          this.shareStateDefault();
          break;
        case FileModalType.Permission:
          this.permissionStateDefault();
          break;
        default:
          break;
      }
    },

    // 计算完全控制的状态
    checkCompleteState(){
      // 权限中allow 有一个选中，则all 状态为不确定，都选中为true，都不选中为false
      let states=this.permissionList.map(item=>{
        return item.state;
      });
      this.completeItem.state=!states.includes(false);
      this.completeItem.uncertain=states.includes(false)&&states.includes(true);

      // 提交一次数据
      this.iValue=this.retureResult;
      this.$emit('change',this.retureResult);
      return this.completeItem;
    },

    // 获取计算后的结果
    getCheckResult(){
      let result={};
      this.permissionList.forEach(a=>{
        result[a.name]=a.state;
      });
      return result;
    },
    allChecked(state){
      this.permissionList.forEach(a =>a.state=state);
    },
  },
  render() {
    return (
      <div class="f-promission-panel">
        <div class="panel-head">
          <li class="f-promission-item">
            <span class="item-title">权限定义 </span>
            <span class="item-checkbox">允许</span>
            {/* <span class="item-checkbox">拒绝</span> */}
          </li>
        </div>
        <div class="panel-body">
          <ul>
            <li class="f-promission-item">
              <span class="item-title">{this.completeState.title}</span>
              <span class="item-checkbox">
                <a-checkbox
                  checked={this.completeState.state}
                  indeterminate={this.completeState.uncertain}
                  onChange={v => {                     
                    this.completeState.state=v.target.checked;
                    this.allChecked(v.target.checked);
                  }}
                ></a-checkbox>
              </span>
            </li>
            {this.permissionArray.map(item => {
              return (
                <li class="f-promission-item">
                  <span class="item-title">{item.title}</span>
                  <span class="item-checkbox">
                    <a-checkbox
                      checked={item.state}
                      onChange={v => {
                        item.state = v.target.checked;
                      }}
                    ></a-checkbox>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
};
