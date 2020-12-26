import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import FileManageModal from '../../sm-file/sm-file-manage-modal';
import OrganizationTreeSelect from '../sm-system-organization-tree-select';
import { conforms } from 'lodash';
import { div } from '@antv/util/lib/matrix/vec3';
let apiOrganization = null;

// 定义表单字段常量
const formFields = [
  'name',
  'nature',
  'description',
  'remark',
  'parentId',
  'order',
  'sealImageUrl',
  'typeId',
];
export default {
  name: 'SmSystemOrganizationModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: null, // 表单绑定的对象
      treeData: [], // 组织机构树
      formFields: [],
      sealUrl: "",//印章url
      fileSelectVisible: false,
    };
  },
  computed: {
    title() {
      // 计算模态框的标题变量
      return utils.getModalTitle(this.status);
    },
    visible() {
      // 计算模态框的显示变量
      return this.status !== ModalStatus.Hide;
    },
    btnTitle() {
      return this.sealUrl === "" ? '上传印章' : '更改印章';
    },
    sealImageUrl() {
      return utils.getFileUrl(this.sealUrl);
    },
  },
  watch: {
  },
  created() {

    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
    },

    add(record) {
      this.status = ModalStatus.Add;
      this.record = record; //根节点编码;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({ parentId: record ? record.id : null });
      });
    },

    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.sealUrl = record.sealImageUrl === null ? '' : this.record.sealImageUrl;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
        this.form.setFieldsValue({ typeId: record.type == null ? '' : record.type.id });
      });
    },

    // 详情
    view(record) {
      this.status = ModalStatus.View;
      this.record = record;
      this.sealUrl = record.sealImageUrl === null ? '' : this.record.sealImageUrl;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
        this.form.setFieldsValue({ typeId: record.type == null ? '' : record.type.id });
      });
    },

    // 关闭模态框
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.record = null;
    },

    // 数据提交
    ok() {
      if (this.status === ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let response = null;
            values.order = values.order ? values.order : 0;
            values.sealImageUrl = this.sealUrl;
            if (this.status === ModalStatus.Add) {
              // 添加
              response = await apiOrganization.create({
                ...values,
              });
              if (utils.requestIsSuccess(response)) {
                this.$emit('success', "Add", response.data);
              }
            } else if (this.status === ModalStatus.Edit) {
              let data = {
                id: this.record.id,
                ...values,
                code: this.record.code,
                csrgCode: this.record.csrgCode,
              };
              // 编辑
              response = await apiOrganization.update(data);
              if (utils.requestIsSuccess(response)) {
                this.$emit('success', "Edit", response.data);
              }
            }
            if (utils.requestIsSuccess(response)) {
              // 更新子组件组织机构数据源
              // console.log(this.$refs.OrganizationTreeSelect);
              // this.$refs.OrganizationTreeSelect.loadByParentId();

              this.$message.success('操作成功');
              this.close();
            }
          }
        });
      }
    },
    //文件确认
    fileOk(data) {
      if (data === undefined) {
        this.$message.waring("请选择印章文件");
        return;
      }
      let imgtypes = ['.jpg', '.png', '.tif', '.gif', '.jpeg', '.JPG', '.PNG', '.TIF', '.GIF', '.JPEG'];
      if (!imgtypes.includes(data.type)) {
        this.$message.waring("请选择有效得印章文件");
        return;
      }
      this.sealUrl = data.url;
    },
  },
  render() {
    return (
      <div>
        <a-modal
          title={`${this.title}组织机构`}
          visible={this.visible}
          onCancel={this.close}
          onOk={this.ok}
          destroyOnClose={true}
        >
          <a-form form={this.form}>
            <a-form-item
              label="父级"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <OrganizationTreeSelect
                ref="OrganizationTreeSelect"
                axios={this.axios}
                showSearch={true}
                disabled={this.record !== null}
                placeholder={this.status === ModalStatus.View || (this.record && this.record.parentId == null) ? '' : '请选择父级'}
                v-decorator={[
                  'parentId',
                  {
                    initialValue: null,
                  },
                ]}
              />
            </a-form-item>
            <a-form-item
              label="名称"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-input
                disabled={this.status == ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请输入组织机构名称'}
                v-decorator={[
                  'name',
                  {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请输入组织机构名称！', whitespace: true },
                      { max: 100, message: '简介最多输入100字符' },
                    ],
                  },
                ]}
              />
            </a-form-item>

            <a-form-item
              label="单位性质"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-input
                disabled={this.status == ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请输入单位性质'}
                v-decorator={[
                  'nature',
                  {
                    initialValue: '',
                    rules: [{ max: 100, message: '简介最多输入100字符', whitespace: true }],
                  },
                ]}
              />
            </a-form-item>

            <a-form-item
              label="组织类型"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <DataDictionaryTreeSelect
                axios={this.axios}
                placeholder={this.status == ModalStatus.View ? '' : '请选择组织机构类型'}
                disabled={this.status == ModalStatus.View}
                groupCode={'OrganizationType'}
                v-decorator={[
                  'typeId',
                  {
                    initialValue: '',
                  },
                ]}
              />
            </a-form-item>

            <a-form-item
              label="简介"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-textarea
                disabled={this.status == ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请输入组织机构简介'}
                v-decorator={[
                  'description',
                  {
                    initialValue: '',
                    rules: [{ max: 200, message: '简介最多输入200字符', whitespace: true }],
                  },
                ]}
              />
            </a-form-item>
            <a-form-item
              label="印章"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              {
                this.sealUrl !== "" ?
                  <div>
                    <img onClick={() => { if (this.status !== ModalStatus.View) { this.fileSelectVisible = true; } }} style="width:65px;height:65px" src={this.sealImageUrl} alt="印章" />
                    {this.status !== ModalStatus.View ? <span style="font-size: 10px;margin-left: 10px;">(点击印章可更改)</span> : null}</div> :
                  <div>
                    {
                      this.status === ModalStatus.View ? <span style="font-size: 10px;margin-left: 10px;">(未上传印章)</span> :
                        <a-button onClick={() => this.fileSelectVisible = true} size="small">{this.btnTitle}</a-button>
                    }
                  </div>
              }
              <span v-decorator={['sealImageUrl']}></span>
            </a-form-item>
            <a-form-item
              label="备注"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-textarea
                disabled={this.status == ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请输入备注'}
                v-decorator={[
                  'remark',
                  {
                    initialValue: '',
                    rules: [{ max: 255, message: '描述最多输入255字符', whitespace: true }],
                  },
                ]}
              />
            </a-form-item>
            <a-form-item
              label="排序"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-input-number
                disabled={this.status == ModalStatus.View}
                placeholder={this.status == ModalStatus.View ? '' : '请输入排序'}
                style="width:100%;"
                min={0}
                max={1000}
                precision={0}
                v-decorator={[
                  'order',
                  {
                    initialValue: 0,
                  },
                ]}
              // value={this.order}
              // onChange={(value, label, extra) => {
              //   if (value == null || value == undefined || value == '') {
              //     value = 0;
              //   }
              //   this.order = value;
              // }}
              />
            </a-form-item>
          </a-form>
        </a-modal>
        {/* 文件选择框 */}
        <FileManageModal
          axios={this.axios}
          selected={[]}
          onOk={this.fileOk}
          onChange={(a) => this.fileSelectVisible = a}
          multiple={false}
          height={500}
          visible={this.fileSelectVisible}
        />
      </div>
    );
  },
};
