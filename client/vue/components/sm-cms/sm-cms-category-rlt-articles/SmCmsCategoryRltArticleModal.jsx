import { form as formConfig, tips } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiCategoryRltArticle from '../../sm-api/sm-cms/CategoryRltArticle';
import CategoryTreeSelect from '../sm-cms-category-tree-select';
import ArticleSelect from '../sm-cms-article-select';

let apiCategoryRltArticle = new ApiCategoryRltArticle();

// 定义表单字段常量
const formFields = ['categoryId', 'articleId', 'order'];
export default {
  name: 'SmCmsCategoryRltArticleModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      categoryId: null, //当前选中栏目id
      loading: false, // 数据保存加载状态
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
      apiCategoryRltArticle = new ApiCategoryRltArticle(this.axios);
    },

    // 添加
    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue();
      });
    },

    // 编辑
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
      this.categoryId = null;
      this.loading = false;
      this.status = ModalStatus.Hide;
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
              order: values.order ? values.order : 0,
            };
            this.loading = true;
            response = await apiCategoryRltArticle.create(data);
          } else if (this.status === ModalStatus.Edit) {
            // 编辑
            let data = {
              ...values,
              id: this.record.id,
              order: values.order ? values.order : 0,
              enable: this.record.enable,
            };
            this.loading = true;
            response = await apiCategoryRltArticle.update(data);
          }

          if (utils.requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }
        }
      });
      this.loading = false;
    },
  },
  render() {
    return (
      <a-modal
        title={`${this.title}栏目文章`}
        visible={this.visible}
        confirmLoading={this.loading}
        okText={this.status !== ModalStatus.View ? "保存" : '确定'}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="栏目"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <CategoryTreeSelect
              axios={this.axios}
              disabled={this.status == ModalStatus.View}
              showSearch={true}
              placeholder={this.status == ModalStatus.View ? '' : '请选择'}
              onChange={value => {
                this.categoryId = value;
              }}
              v-decorator={[
                'categoryId',
                {
                  initialValue: null,
                  rules: [{ required: true, message: '请选择栏目' }],
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="文章"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <ArticleSelect
              axios={this.axios}
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请选择'}
              categoryId={this.categoryId}
              v-decorator={[
                'articleId',
                {
                  initialValue: null,
                  rules: [{ required: true, message: '请选择文章' }],
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
              min={0}
              max={2147483647}
              precision={0}
              style="width:100%;"
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
