import { form as formConfig, tips } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiCategory from '../../sm-api/sm-cms/Category';
import CategoryTreeSelect from '../sm-cms-category-tree-select';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';

let apiCategory = new ApiCategory();

// 定义表单字段常量
const formFields = ['parentId', 'title', 'thumb', 'code', 'summary', 'order', 'remark'];
export default {
  name: 'SmCmsCategoryModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
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
        this.form.setFieldsValue({ parentId: this.record.parentId });
      });
    },

    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiCategory.get(record.id);
      if (utils.requestIsSuccess(response) && response.data) {
        this.record = response.data;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    // 详情
    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiCategory.get(record.id);
      if (utils.requestIsSuccess(response) && response.data) {
        this.record = response.data;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
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
              thumbId: values.thumb.id,
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
              thumbId: values.thumb.id,
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
        title={`${this.title}栏目`}
        visible={this.visible}
        okText={this.status !== ModalStatus.View ? "保存" : '确定'}
        // confirmLoading={this.confirmLoading}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="上级"
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
            label="标题"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'title',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 100,
                      message: '标题最多可输入100字',
                    },
                    {
                      required: true,
                      message: '请输入标题',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="标识"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'code',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 30,
                      message: '标识最多可输入30字',
                    },
                    {
                      required: true,
                      message: '请输入标识',
                      whitespace: true,
                    },
                    {
                      pattern: /^\w+$/,
                      message: '标识中只能输入字母或下划线或数字',
                    },
                  ],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="概要"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'summary',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 200,
                      message: '概要最多可输入200字',
                    },
                    {
                      required: true,
                      message: '请输入概要',
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
              max={2147483647}
              precision={0}
              v-decorator={[
                'order',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="缩略图"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmFileManageSelect
              disabled={this.status == ModalStatus.View}
              axios={this.axios}
              height={73}
              multiple={false}
              placeholder={this.status == ModalStatus.View ? '' : '请选择'}
              enableDownload={true}
              v-decorator={[
                'thumb',
                {
                  initialValue: {},
                  rules: [{ required: true, message: '请添加缩略图' }],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="备注"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'remark',
                {
                  initialValue: '',
                  rules: [{ max: 200, message: '备注最多输入 200 字符' }],
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
