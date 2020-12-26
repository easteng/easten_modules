// 选择关联文件版本
import { ModalStatus } from '../../../../../_utils/enum';
import { requestIsSuccess } from '../../../../../_utils/utils';
import { form as formConfig } from '../../../../../_utils/config';
import ApiFile from '../../../../../sm-api/sm-file/file';
let apiFile=new ApiFile();
export default {
  name: 'SmFileVersionModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 当前状态
      dataSource: [], // 数据源
      selected:'',// 选中的值
      record:null,//文件记录
    };
  },
  computed: {
    visible() {
      return this.status != ModalStatus.Hide;
    },
    datas() {
      return this.dataSource;
    },
  },
  watch: {},
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiFile=new ApiFile(this.axios);
    },
    // 激活组件
    active(dataSource, record) {
      this.selected=null;
      this.record=record;
      if (dataSource) {
        // 只展示当前节点下的文件，而且文件类型要相同，不同的文件类型谈不上文件版本问题
        this.dataSource = dataSource.filter(item => {
          if (item.resourceType == 2 && item.id != record.id && item.type == record.type)
            return item;
        });
      }
      this.status = ModalStatus.View;
    },
    // 确认事件
    ok() {
      // 选中的文件
      let _this=this;
      let selectedFile=this.dataSource.find(a=>a.id==this.selected);
      let content=`确定将${selectedFile.name}${selectedFile.type}作为${this.record.name}${this.record.type}的版本文件吗?确定后原文件将被删除`;
      this.ConfirmModal(content,async()=>{
        // 确定
        let data={
           id:_this.record.id,//指定的文件id
           selectId:_this.selected,// 选中的版本文件
        };
        console.log(data);
        let response=await apiFile.selectNewVersion(data);
        if (requestIsSuccess(response)){
          _this.$emit('success'); // 提交成功事件
          _this.$message.success('版本关联成功!');
          _this.close();
        }
      });
    },
    ConfirmModal(content, onOk, onCancel) {
      this.$confirm({
        title: '温馨提示',
        content,
        okText: '确认',
        cancelText: '取消',
        onOk,
        onCancel,
      });
    },
    close() {
      this.status = ModalStatus.Hide;
    },
  },
  render() {
    return (
      <a-modal
        title="选择文件"
        onOk={this.ok}
        visible={this.visible}
        onCancel={this.close}
        bodyStyle={{ height: '250px' }}
      >
        <a-form>
          <a-form-item
            label="文件"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-select value={this.selected} style="width: 100%" onSelect={(v,option)=>{
              this.selected=v;
              console.log(option);
            }}>
              {this.datas.map(item=>{
                return <a-select-option value={item.id}>{item.name}{item.type}</a-select-option>;
              })}
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
