import * as utils from '../../../_utils/utils';
import { ModalStatus } from '../../../_utils/enum';
import ApiEquipmentGroup from '../../../sm-api/sm-resource/EquipmentGroup';
import { form as formConfig } from '../../../_utils/config';
import SmSystemOrganizationTreeSelect from '../../../sm-system/sm-system-organization-tree-select';
import SmResourceEquipmentGroupTreeSelect from '../../sm-resource-equipment-group-tree-select/SmResourceEquipmentGroupTreeSelect';
let apiEquipmentGroup = new ApiEquipmentGroup();
//定义表单字段常量
const formFields = [
  'parentId',
  'name',
  'order',
  'organizationId',
];
export default {
  name: 'SmResourceEquipmentGroupModel',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      confirmLoading: false,//确定按钮加载状态
      parentId: null,//父节点的id
      record: null,//当前数据记录
      code: null,//自动生成的编码
      organizationId: null,//组织机构id
    };
  },
  computed: {
    title() {
      // 计算模态框的标题变量
      return utils.getModalTitle(this.status);
    },
    visible() {
      // 计算模态框的显示变量k
      return this.status !== ModalStatus.Hide;
    },
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiEquipmentGroup = new ApiEquipmentGroup(this.axios);
    },
    //添加
    add(record) {
      this.record = record;
      this.status = ModalStatus.Add;
      if (record) {
        this.parentId = record.id;
        this.organizationId = record.organizationId;
        this.$nextTick(() => {
          this.form.setFieldsValue(
            {
              parentId: this.parentId,
              organizationId: this.organizationId,
            });
        });
      }
  
    },
    // 编辑
    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      if (record != null) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
        });
      }
      if (record == null) {
        this.status = ModalStatus.Hide;
      }

    },
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.confirmLoading = false;
      this.parentId = null;
    },

    ok() {
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let response = null;
            let data = {
              ...values,
              order: values ? values.order ? values.order : 0 : 0,
            };
            if (this.status === ModalStatus.Add) {
              response = await apiEquipmentGroup.create(data);
            } else if (this.status === ModalStatus.Edit) {
              data = {
                ...data,
                id: this.record ? this.record.id : '',
              };
              response = await apiEquipmentGroup.update(data);
            }
            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              if (this.status === ModalStatus.Add) {
                this.$emit('success', 'Add');

              }
              if (this.status === ModalStatus.Edit) {
                this.$emit('success', data);
                this.$emit('getParent');
              }
              this.close();

            }
          }
        });
      }
    },
  },
  render() {
    return (
      <a-modal
        title={`${this.title}设备分组`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.confirmLoading}
        destroyOnClose={true}
        okText={this.status !== ModalStatus.View ? "保存" : '确定'}
        onOk={this.ok}
        width={600}
      >
        <a-form form={this.form}>
          {((this.status == ModalStatus.Add && this.parentId != null) ||
            this.status == ModalStatus.Edit ||
            this.status == ModalStatus.View) ?
            <a-form-item
              label="父级"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <SmResourceEquipmentGroupTreeSelect
                axios={this.axios}
                disabled
                v-decorator={[
                  'parentId',
                  {
                    initialValue: null,
                    rules: [
                      {
                        message: '请选择父级',
                        whitespace: true,
                      },
                    ],
                  },
                ]}
              />
            </a-form-item>
            : ''
          }
          <a-form-item
            label="名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              allowClear
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'name',
                {
                  initialValue: null,
                  rules: [
                    {
                      message: '请输入分组名称',
                      required: true,
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="顺序"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-number
              min={0}
              precision={0}
              style="width:100%"
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入顺序'}
              v-decorator={[
                'order',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="组织机构"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              disabled={this.status == ModalStatus.View }
              placeholder={this.status == ModalStatus.View ? '' : '请选择'}
              v-decorator={[
                'organizationId',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请选择组织机构',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
