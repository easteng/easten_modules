import { form as formConfig, tips, form } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import CategoryTreeSelect from '../sm-exam-category-tree-select';
import ApiCategory from '../../sm-api/sm-exam/Category';
let apiCategory = new ApiCategory();


// 定义表单字段常量
const formFields = ['parentId', 'name', 'description', 'order'];
export default {
  name: 'SmExamCategoryModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      categories: [],//父级数据源
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      confirmLoading: false, //确定按钮加载状态
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
      apiCategory = new ApiCategory(this.axios);
    },

    add(parentId) {
      this.status = ModalStatus.Add;
      this.record.parentId = parentId; //根节点编码;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({
          parentId: this.record.parentId,
        });
      });
    },

    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
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
      this.confirmLoading = false;
      this.parentId = null;
    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response = null;
          if (this.status === ModalStatus.View) {
            this.close();
          } else if (this.status === ModalStatus.Add) {
            // 添加
            let data = {
              ...values,
              order: values.order === null ? 0 : values.order,
            };
            this.confirmLoading = true;
            response = await apiCategory.create(data);
            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
          } else if (this.status === ModalStatus.Edit) {
            // 编辑
            let data = {
              ...values,
              id: this.record.id,
              order: values.order === null ? 0 : values.order,
            };

            this.confirmLoading = true;
            response = await apiCategory.update(data);
            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');

            }
          }
        }
      });
      this.confirmLoading = false;
    },
  },
  render() {
    return (
      <a-modal
        title={`${this.title}分类`}
        visible={this.visible}
        okText="保存"
        confirmLoading={this.confirmLoading}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="父级"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <CategoryTreeSelect
              disabled={
                (this.status == ModalStatus.Add && this.record.parentId != null) ||
                this.status == ModalStatus.View
              }
              childrenIsDisabled={this.status !== ModalStatus.Add}
              placeholder="请输入"
              axios={this.axios}
              disabledIds={this.status !== ModalStatus.Add ? [this.record.id] : []}
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
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'name',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请输入名称',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="描述"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'description',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 200,
                      message: '描述最多可输入200字',
                    },
                    {
                      message: '请输入描述',
                      whitespace: true,
                    },
                  ],
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
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              style="width:100%"
              min={0}
              precision={0}
              v-decorator={[
                'order',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
