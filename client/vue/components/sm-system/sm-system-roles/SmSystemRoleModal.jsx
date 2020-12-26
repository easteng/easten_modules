import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';

import ApiRole from '../../sm-api/sm-system/Role';
let apiRole = new ApiRole();

// 定义表单字段常量
const formFields = ['name', 'isPublic'];

export default {
  name: 'SmSystemRoleModal',
  props: {
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },

  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象
      isSystem: false,//是否是系统角色
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
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiRole = new ApiRole(this.axios);
    },

    // 添加
    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },

    // 编辑
    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.isSystem=false;
      if (this.record && this.record.isStatic && !this.record.isDefault) {
        this.isSystem=true;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
      });
    },

    // 详情
    view(record) {
      this.status = ModalStatus.View;
      this.record = record;

      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
      });
    },

    // 关闭模态框
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {
        // console.log(values);
        if (!err) {
          let name = this.form.getFieldValue('name');
          values.name = name.replace(/[, ]/g, '');
          let response = null;

          if (this.status === ModalStatus.Add) {
            // 添加角色
            response = await apiRole.add({
              organizationId: this.organizationId,
              ...values,
            });
          } else if (this.status == ModalStatus.View) {
            this.close();
          } else if (this.status === ModalStatus.Edit) {
            // 获取角色
            response = await apiRole.get(this.record.id);
            if (utils.requestIsSuccess(response)) {
              this.record = response.data;
            }

            let input = {
              concurrencyStamp: this.record.concurrencyStamp,
              ...values,
            };
            // 编辑角色
            response = await apiRole.edit(this.record.id, input);
          }

          if (utils.requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }
        }
      });
    },
  },
  render() {
    return (
      <a-modal
        title={`${this.title}角色`}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              v-decorator={[
                'name',
                {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入角色名！', whitespace: true },
                  ],
                },
              ]}
              placeholder={this.status == ModalStatus.View ? '' : '请输入角色名'}
            />
          </a-form-item>

          <a-form-item wrapper-col={formConfig.wrapperColTail}>
            <a-checkbox
              disabled={this.status == ModalStatus.View || this.isSystem}
              v-decorator={[
                'isPublic',
                {
                  valuePropName: 'checked',
                  initialValue: false,
                },
              ]}
            >
              公开
            </a-checkbox>
          </a-form-item>

          <a-form-item wrapper-col={formConfig.wrapperColTail}>
            {apiRole.checkDefaultRole ? undefined //查看是否有默认角色
              : <a-checkbox
                disabled={this.status == ModalStatus.View}
                v-decorator={[
                  'isDefault',
                  {
                    valuePropName: 'checked',
                    initialValue: false,
                  },
                ]}
              >
                默认
              </a-checkbox>
            }
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
