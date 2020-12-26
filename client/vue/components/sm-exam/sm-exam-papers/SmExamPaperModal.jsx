import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiExamPaper from '../../sm-api/sm-exam/ExamPaper';
import { form as formConfig, tips } from '../../_utils/config';
//import CategoryTreeSelect from '../sm-exam-category-tree-select';
import CategoryTreeSelect from '../sm-exam-category-tree-select';
import ApiExamPaperTemplate from '../../sm-api/sm-exam/ExamPaperTemplate';



let apiExamPaper = new ApiExamPaper();
let apiExamPaperTemplate = new ApiExamPaperTemplate();

// 定义表单字段常量
const formFields = [
  'categoryId',
  'name',
  'examPaperTemplateId',
  'groupQuestionType',
  'questionTotalNumber',
  'totalScore',
  'examinationDuration',
];
export default {
  name: 'SmExamPaperModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      confirmLoading: false, //确定按钮加载状态
      examPaperTempaltes: [],
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
    this.initExamPaper();
    this.form = this.$form.createForm(this, {});
  },


  methods: {
    initAxios() {
      apiExamPaper = new ApiExamPaper(this.axios);
      apiExamPaperTemplate = new ApiExamPaperTemplate(this.axios);
    },

    async edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    // 详情
    async details(record) {
      this.status = ModalStatus.View;
      this.record = record;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
      this.record = null;
      this.confirmLoading = false;

    },

    async initExamPaper() {
      let response = await apiExamPaperTemplate.getList();
      this.examPaperTempaltes = response.data.items.map(item => {
        return {
          title: item.name,
          value: item.id,
          key: item.id,
        };
      });
    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let data = JSON.parse(JSON.stringify(values));


          let response = null;
          if (this.status === ModalStatus.Edit) {
            this.confirmLoading = true;
            response = await apiExamPaper.update({ id: this.record.id, ...data });
            if (utils.requestIsSuccess(response)) {
              this.$message.success('修改成功');
              this.$emit('success');
              this.close();
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
        title={`${this.title}试卷管理`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.confirmLoading}
        destroyOnClose={true}
        okText="确定"
        onOk={this.ok}
      >

        <a-form form={this.form}>
          <a-form-item
            label="分类"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <CategoryTreeSelect
              disabled={this.status === ModalStatus.View}
              placeholder={this.status === ModalStatus.View ? '' : '请选择分类名称'}
              axios={this.axios}
              v-decorator={[
                'categoryId',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请选择分类名称',
                    },
                  ],
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
              disabled={this.status === ModalStatus.View}
              placeholder={this.status === ModalStatus.View ? '' : '请输入名称'}
              v-decorator={[
                'name',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请输入名称',
                    },
                  ],
                },
              ]}
            />
          </a-form-item>


          <a-form-item
            label="模板"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >

            <a-select
              disabled={this.status === ModalStatus.View}
              options={this.examPaperTempaltes}

              v-decorator={[
                'examPaperTemplateId',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>


          <a-form-item
            label="组题方式"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-radio-group
              disabled={this.status === ModalStatus.View}
              v-decorator={[
                'groupQuestionType',
                {
                  initialValue: 2,
                },
              ]}
            >
              <a-radio value={1}>随机</a-radio>
              <a-radio value={2}>手动</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            label="题目总数"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status === ModalStatus.View || this.status === ModalStatus.Edit}
              placeholder={this.status === ModalStatus.View ? '' : '请输入题目总数'}
              v-decorator={[
                'questionTotalNumber',
                {
                  initialValue: 0,
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="总分"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status === ModalStatus.View || this.status === ModalStatus.Edit}
              placeholder={this.status === ModalStatus.View ? '' : '请输入总分'}
              v-decorator={[
                'totalScore',
                {
                  initialValue: 0,
                },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="考试时长"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              disabled={this.status === ModalStatus.View || this.status === ModalStatus.Edit}
              placeholder={this.status === ModalStatus.View ? '' : '请输入考试时长'}
              v-decorator={[
                'examinationDuration',
                {
                  initialValue: 0,
                },
              ]}
            />
          </a-form-item>

        </a-form>

      </a-modal>



    );
  },
};
