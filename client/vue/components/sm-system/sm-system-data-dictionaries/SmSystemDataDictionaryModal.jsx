import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiDataDictionary from '../../sm-api/sm-system/DataDictionary';
let apiDataDictionary = new ApiDataDictionary();

// 定义表单字段常量
const formFields = ['name', 'partKey', 'remark', 'order'];
export default {
  name: 'SmSystemDataDictionaryModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      parentId: null,
      groupCode: null,
      parentKey: '',
      isNoParent: false,
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
      apiDataDictionary = new ApiDataDictionary(this.axios);
    },

    add(parentId, key) {
      this.status = ModalStatus.Add;
      this.parentId = parentId;
      this.parentKey = key;
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },

    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.parentId = record.parentId;
      let index = record.key.lastIndexOf('.');
      this.parentKey = record.key.substring(0, index);
      this.record.partKey = record.key.substring(index + 1, record.key.length);
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
      this.parentId = null;
    },

    // 数据提交
    ok() {
      if (this.status === ModalStatus.View) {
        this.close();
        return;
      }
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response = null;
          let data = {
            ...values,
            order: values.order === null ? 0 : values.order,
            parentId: this.parentId,
            key: this.parentKey != undefined && this.parentKey != null && this.parentKey != ''
              ? this.parentKey + '.' + values.partKey
              : values.partKey,
          };

          // 添加
          if (this.status === ModalStatus.Add) {
            response = await apiDataDictionary.create(data);
          } else if (this.status === ModalStatus.Edit) {
            // 编辑
            response = await apiDataDictionary.update(this.record.id, data);
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
        title={`${this.title}数据字典`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="字典值"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入字典值'}
              v-decorator={[
                'name',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入字典值', whitespace: true }],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="标识"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            {this.status == ModalStatus.View ? (
              <a-input disabled={true} value={this.record.key} />
            ) : (
              <a-input-group compact>
                <a-input style="width: 50%" value={this.parentKey} readOnly />
                <a-input
                  style="width: 50%"
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入标识'}
                  v-decorator={[
                    'partKey',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '请输入标识', whitespace: true }],
                    },
                  ]}
                />
              </a-input-group>
            )}
          </a-form-item>

          <a-form-item
            label="备注"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入备注'}
              v-decorator={[
                'remark',
                {
                  initialValue: '',
                  rules: [{ max: 1000, message: '备注最多输入 1000 字符', whitespace: true }],
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
              style="width:100%"
              min={0}
              max={200000}
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
