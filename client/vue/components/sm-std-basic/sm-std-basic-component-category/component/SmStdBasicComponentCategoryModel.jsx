import * as utils from '../../../_utils/utils';
import { ModalStatus } from '../../../_utils/enum';
import ApiComponentCategory from '../../../sm-api/sm-std-basic/ComponentCategory';
import SmStdBasicComponentCategoryTreeSelect from '../../sm-std-basic-component-category-tree-select/SmStdBasicComponentCategoryTreeSelect';
import { form as formConfig } from '../../../_utils/config';
import SmStdBasicProductCategoryTreeSelect from '../../sm-std-basic-product-category-tree-select/SmStdBasicProductCategoryTreeSelect';
let apiComponentCategory = new ApiComponentCategory();

// 定义表单字段常量
const formFields = [
  'parentId',
  'name',
  'code',
  'extendCode',
  'extendName',
  'productCategoryId',
  'unit',
  'remark',
];
export default {
  name: 'SmStdBasicComponentCategoryModel',
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
      apiComponentCategory = new ApiComponentCategory(this.axios);
    },
    //添加
    add(record) {

      this.record = record;
      this.status = ModalStatus.Add;
      if (record != null || record != undefined) {
        this.parentId = record.id;

      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ parentId: this.parentId });
      });
    },
    // 编辑
    edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      if (record != null) {
        if (record.componentCategoryRltProductCategories.length > 0) {
          let productCategoryId = record.componentCategoryRltProductCategories[0].productionCategoryId;
          record.productCategoryId = productCategoryId;
        }
        let code = record.code.split('.').pop().toString();
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields), code: code });
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
            await this.getGeneratedCode();
            let data = {
              ...values,
              code: values ? this.code + values.code : '',
              levelName: this.record ? this.record.LevelName : '',
            };
            if (this.status === ModalStatus.Add) {
              response = await apiComponentCategory.create(data);
            } else if (this.status === ModalStatus.Edit) {
              data = {
                ...data,
                id: this.record ? this.record.id : '',
              };
              response = await apiComponentCategory.update(data);
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
    // 生成编码
    async generatedCode() {
      let num = '001';
      let response = await apiComponentCategory.getListCode(
        this.record ? this.record.id : null,
      );
      if (utils.requestIsSuccess(response) && response.data) {

        let result = response.data;
        if (result) {
          let arr = result.code.split('.');
          let code = arr[arr.length - 1];
          num = (parseInt(code) + 1).toString();
          if (num.length == 1) {
            num = "00" + num;
          }
          if (num.length == 2) {
            num = "0" + num;
          }
        }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ code: num });
      });
    },
    //存数据库的时候拼接
    getGeneratedCode() {
      let code = null;
      if (this.record != null) {
        code = this.record.code;
      }
      if (this.record != null && this.status == ModalStatus.Edit) {
        let arr = this.record.code.split('.');
        code = arr.slice(0, arr.length - 1).toString().replace(/,/g, '.');

      }
      this.togGetGeneratedCode(code);
    },
    togGetGeneratedCode(code) {
      let codeLength = null;
      if (code == null) {
        codeLength = 1;
      } else {
        let codes = code.split('.');
        if (codes.length > 1 || codes.length == 1) {
          codeLength = 2;
        }
      }
      switch (codeLength) {
      case 1:
        this.code = "SCC" + '.';
        break;
      case 2:
        this.code = code + '.';

        break;
      }
    },
  },
  render() {
    return (
      <a-modal
        title={`${this.title}构件`}
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
              <SmStdBasicComponentCategoryTreeSelect
                axios={this.axios}
                disabled
                v-decorator={[
                  'parentId',
                  {
                    initialValue: null,
                    rules: [
                      {
                        message: '请选择父级',
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
                      message: '请输入构件名称',
                      required: true,
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="编码"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input-search
              disabled={this.status == ModalStatus.View ||this.status == ModalStatus.Edit}
              placeholder={this.status == ModalStatus.View ||this.status == ModalStatus.Edit ? '' : '请生成编码'}
              enter-button="自动编码"
              onSearch={this.generatedCode}
              v-decorator={[
                'code',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请输入编码',
                      whitespace: true,
                    },

                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="扩展名称"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              allowClear
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'extendName',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>
          <a-form-item

            label="扩展编码"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              allowClear
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'extendCode',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="关联产品"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmStdBasicProductCategoryTreeSelect
              axios={this.axios}
              showSearch={true}
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请选择'}
              v-decorator={[
                'productCategoryId',
              ]}
            />
          </a-form-item>
          <a-form-item
            label="单位"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              allowClear
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入'}
              v-decorator={[
                'unit',
                {
                  initialValue: null,
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
              allowClear
              rows="3"
              placeholder="请输入备注"
              v-decorator={[
                'remark',
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
