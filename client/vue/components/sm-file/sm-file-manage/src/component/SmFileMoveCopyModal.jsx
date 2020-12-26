// 文件移动复制对话框
import SmFileCatalogSelect from './SmFileCatalogSelect';
import { ModalStatus } from '../../../../_utils/enum';
import { form as formConfig } from '../../../../_utils/config';
import ApiFileManage from '../../../../sm-api/sm-file/fileManage';
import { FileModalType,ResourceType,GetTreeNodeById } from '../common';
import { requestIsSuccess } from '../../../../_utils/utils';

let apiFileManage = new ApiFileManage();
export default {
  name: 'SmFileMoveCopyModal',
  props: {
    axios: { type: Function, default: null },
    title: { type: String, default: '文件' },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 当前状态
      dataSource: [], // 树数据
      selectedValue: null, // 选中的值，
      selectedTitle: '', // 选中值对应的标题
      selectedType: '', // 选中值对应的类型，组织机构或文件夹
      form: {}, // 表单
      modalType: FileModalType.Move, // 当前模态框的作用
      resourceType: ResourceType.Unknown, // 资源类型
      resourceId: '', // 资源id
      publishDatas:null, // 需要发布的资源集合
      allTreeData:[
        {
          name: '我的组织',
          id: '0-1',
          slots: { icon: 'organ' },
          children: [],
        },
        {
          name: '我的',
          id: '0-2',
          slots: { icon: 'mine' },
          children: [],
        },
      ],
      defaultSelect:null,// 默认的选中值，应该为null
    };
  },
  computed: {
    visible() {
      return this.status != ModalStatus.Hide;
    },
    treeData() {
      return this.dataSource;
    },
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiFileManage = new ApiFileManage(this.axios);
    },
    // 激活组件
    async active(modalType, fileType, resourceId ,publishDatas) {
      this.modalType = modalType;
      this.resourceType = fileType;
      this.resourceId = resourceId;
      this.status = ModalStatus.View;
      this.publishDatas=publishDatas;
      // 备注：文件移动移动和还原只能在同一个组织机构下进行
      if (this.modalType === FileModalType.Move) {
        let organizationId = await this.getOrganiaztionId();
        if (organizationId != null)
          this.dataSource = GetTreeNodeById(this.dataSource, organizationId);
      }
      if(this.modalType===FileModalType.Restore){
        let response = await apiFileManage.getOrganizationTreeList();
        if (requestIsSuccess(response)) this.allTreeData[0].children = response.data;
        this.dataSource=this.allTreeData;
        await this.getMineSource();
      }else{
        await this.getDataSource();
      }

      // 初始化选择框组件
      this.$refs.SmFileCatalogSelect.initial();
    },
    // 获取组织结构树
    async getDataSource() {
      let response = await apiFileManage.getOrganizationTreeList();
      if (requestIsSuccess(response)) this.dataSource = response.data;
    },

    // 新增逻辑，需要将文件可以恢复到“我的目录”
    async getMineSource() {
      let response = await apiFileManage.getMineTreeList();
      if (requestIsSuccess(response)) {
        let data = Array.from(response.data);
        this.allTreeData[1].children = data;
      }
    },
    // 获取组织结构id
    async getOrganiaztionId() {
      let param = {
        type: this.resourceType,
        id: this.resourceId,
      };
      let response = await apiFileManage.getOragniaztionId(param);
      if (requestIsSuccess(response)) return response.data;
      else return null;
    },
    // 确认事件
    ok() {
      // 提交确认时需要判断资源时文件还是文件夹，是文件夹要提示操作所有的子文件夹及文件夹
      if (this.modalType === FileModalType.Move) this.moveResource();
      else if (this.modalType === FileModalType.Copy) this.copyResource();
      else if (this.modalType === FileModalType.Restore) this.reStoreResource();
      else if (this.modalType === FileModalType.Publish) this.publishResource();
    },
    close() {
      this.selectedValue = null;
      this.status = ModalStatus.Hide;
    },
    // 获取面板标题
    getTitle() {
      switch (this.modalType) {
        case FileModalType.Move:
          return `移动(${this.title})`;
        case FileModalType.Copy:
          return `复制(${this.title})`;
        case FileModalType.Restore:
          return `还原到`;
        case FileModalType.Publish:
          return `发布资源`;
        default:
          return '';
      }
    },
    // 移动文件或者文件夹
    moveResource() {
      // 如果是文件
      let _this = this;
      if (this.resourceType == ResourceType.File) {
        this.confirmInfo(`确定要将文件移动到${this.selectedTitle}路径下吗?`, async () => {
          let param = {
            //targetId: _this.selectedType === 1 ? _this.selectedValue : null,
            targetId:_this.selectedValue,
            targetType: this.selectedType, // 文件夹
            id: _this.resourceId,
            type: 2,
          };
          let response = await apiFileManage.createFileMove(param);
          if (requestIsSuccess(response)) {
            _this.$emit('success'); // 提交成功事件
            _this.close();
          }
        });
      } else if (this.resourceType == ResourceType.Folder) {
        this.confirmInfo(`确定要将该文件夹移动到${this.selectedTitle}路径下吗?`, async () => {
          let param = {
            //targetId: _this.selectedType === 1 ? _this.selectedValue : null,
            targetId: _this.selectedValue,
            targetType: this.selectedType, // 文件夹/机构节点id
            id: _this.resourceId,
            type: 1,
          };
          let response = await apiFileManage.createFileMove(param);
          if (requestIsSuccess(response)) {
            _this.$emit('success'); // 提交成功事件
            _this.close();
          }
        });
      }
    },
    // 复制文件或者文件夹
    copyResource() {
      let _this = this;
      if (this.resourceType == ResourceType.File) {
        this.confirmInfo(`确定要将文件复制到${this.selectedTitle}目录下吗?`, async () => {
          let param = {
            targetId: _this.selectedValue,
            targetType: _this.selectedType, // 文件夹
            id: _this.resourceId,
            type: 2,
          };
          let response = await apiFileManage.createFileCopy(param);
          if (requestIsSuccess(response)) {
            _this.$emit('success'); // 提交成功事件
            _this.close();
            _this.$message.success(`文件已复制${this.selectedTitle}目录`);
          }
        });
      }else if (this.resourceType == ResourceType.Folder) {
        this.confirmInfo(`确定要将该文件夹复制到${this.selectedTitle}目录下吗?`, async () => {
          let param = {
            targetId: _this.selectedValue,
            targetType: _this.selectedType, // 文件夹
            id: _this.resourceId,
            type: 1,
          };
          let response = await apiFileManage.createFileCopy(param);
          if (requestIsSuccess(response)) {
            _this.$emit('success'); // 提交成功事件
            _this.close();
            _this.$message.success(`文件夹已复制${this.selectedTitle}目录`);
          }
        });
      }
    },
    // 还原文件或者文件夹
    reStoreResource() {
      let _this=this;
      if(this.selectedTitle===''||this.selectedTitle===null){
        this.$message.warning("请选择需要还原的目录");
        return;
      }
      this.ConfirmModal(`确定要将已删除文件还原到：${this.selectedTitle}目录下吗?`, async () => {
        let data=this.publishDatas;
        data.targetId=_this.selectedValue;
        data.targetType= _this.selectedType;
        let response=await apiFileManage.restore(data);
        if (requestIsSuccess(response)){
          _this.$message.success('资源还原成功');
          _this.$emit('success');
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
    // 发布文件或者文件夹
    publishResource(){
      if(this.selectedTitle===''){
        this.$message.error("请选择目标目录");
        return;
      }
      let _this=this;
      this.confirmInfo(`确定要将该资源发布到${this.selectedTitle}目录下吗?`, async () => {
        let param = {
          targetId: _this.selectedValue,
          targetType: _this.selectedType, // 文件夹
          ..._this.publishDatas,
        };
        console.log(param);
        let response = await apiFileManage.PublishResource(param);
        if (requestIsSuccess(response)) {
          _this.$emit('success'); // 提交成功事件
          _this.close();
          _this.$message.success(`文件夹已发布到${this.selectedTitle}目录`);
        }
      });
    },
    // 确认提示信息
    confirmInfo(content, onOk) {
      this.$confirm({
        title: '温馨提示',
        content,
        okText: '确认',
        cancelText: '取消',
        onOk,
      });
    },
  },
  render() {
    return (
      <a-modal title={this.getTitle()} onOk={this.ok} visible={this.visible} onCancel={this.close}>
        <a-form form={this.form}>
          <a-form-item
            label="目标位置"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmFileCatalogSelect
              ref="SmFileCatalogSelect"
              treeData={this.treeData}
              value={this.defaultSelect}
              onChange={v => {
                if (v.type === 0) this.selectedTitle = v.name;//组织机构节点
                if (v.type === 1) this.selectedTitle = v.field;//文件夹节点
                this.selectedValue = v.id;
                this.selectedType = v.type;
              }}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
