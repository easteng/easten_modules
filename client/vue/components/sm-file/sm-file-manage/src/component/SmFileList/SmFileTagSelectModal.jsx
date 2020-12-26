// 资源标签选择模态框

import SmFileTagSelect from './SmFileTagSelect';
import { ModalStatus } from '../../../../../_utils/enum';
import { form as formConfig } from '../../../../../_utils/config';
import ApiTag from '../../../../../sm-api/sm-file/tag';
import ApiFileManage from '../../../../../sm-api/sm-file/fileManage';
import { requestIsSuccess } from '../../../../../_utils/utils';

let apiTag=new ApiTag();
let apiFileManage=new ApiFileManage();
export default {
  name: 'SmFileTagSelectModal',
  props: {
    axios: { type: Function, default: null },
    title: { type: String, default: '文件' },
  },
  data() {
    return {
        status: ModalStatus.Hide, // 当前状态
        dataSource: [], // 树数据
        selectArray: [], // 选中的值
        organizationId:'',
    };
  },
  computed: {
    visible() {
      return this.status != ModalStatus.Hide;
    },
    tags(){
      return this.dataSource;
    },
    selectedValues(){
      return this.selectArray;
    },
  },
  watch: {},
  created() {
    this.initAxios();
  },
  methods: {
    initAxios(){
      apiTag=new ApiTag(this.axios);
      apiFileManage=new ApiFileManage(this.axios);
    },
    async active(organizationId,tags) {
      console.log(organizationId);
      this.status = ModalStatus.Add;
      this.organizationId=organizationId;
      this.selectArray=tags;// 用于反选
      // 数据源
      await this.getTagList();
    },
    // 确认事件
   async ok() {
      this.$emit('success',this.selectArray); // 提交成功事件
      this.close();
    },
    close() {
      this.status = ModalStatus.Hide;
    },
    // 获取标签列表
    async getTagList(){
      let response=await apiTag.getList(this.organizationId);
      if (requestIsSuccess(response)){
        this.dataSource=response.data;
      }
    },
    // 保存新增的标签信息
    async saveTagInfo(value,id){
      let response=null;
      if(id==null||id==""){
        let data={
          organizationId:this.organizationId,
          name:value,
        };
        response=await apiTag.create(data);
      }else{
        // 更新标签
        let data={
          id:id,
          name:value,
        };
        response=await apiTag.update(data);
      }
      if (requestIsSuccess(response)){
        //刷新列表
        this.getTagList();
        // 给父组件提交
        this.$emit("tagChange");
      }
    },
  },
  render() {
    return (
      <a-modal title={this.title} onOk={this.ok} visible={this.visible} onCancel={this.close} bodyStyle={{height:'330px'}}>
        <a-form form={this.form}>
          <a-form-item
            label="标签"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmFileTagSelect
             value={this.selectArray}
             dataSource={this.tags}
             onChange={values=>{
               this.selectArray=values;
             }}
             onSubmit={this.saveTagInfo}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
