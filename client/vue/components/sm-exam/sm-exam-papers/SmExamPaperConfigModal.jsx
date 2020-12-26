import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiExamPaper from '../../sm-api/sm-exam/ExamPaper';
import ApiExamPaperTemplate from '../../sm-api/sm-exam/ExamPaperTemplate';
import { form as formConfig, tips } from '../../_utils/config';
import CategoryTreeSelect from '../sm-exam-category-tree-select';
import SmExamPaperGroupQuestionModal from './SmExamPaperGroupQuestionModal';



let apiExamPaper = new ApiExamPaper();
let apiExamPaperTemplate = new ApiExamPaperTemplate();



// 定义表单字段常量
const formFields = [
  'categoryId',
  // 'groupQuestionType',
  'name',
  'examPaperTemplateId',
];
export default {
  name: 'SmExamPaperConfigModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      loading: false, //确定按钮加载状态
      isChoseTemplate: false,   //是否选择了模板
      groupQuestionType: 2,   //组题方式默认是手动
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
      apiExamPaperTemplate = new ApiExamPaperTemplate(this.axios);
      apiExamPaper = new ApiExamPaper(this.axios);
    },

    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.setFieldsValue();
      });
    },

    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
      this.record = null;
      this.loading = false;

    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let _values = JSON.parse(JSON.stringify(values));
          let data = {
            ..._values,
            groupQuestionType: this.groupQuestionType,

          };
          this.loading = true;
          let response = null;
          if (this.status === ModalStatus.Add) {
            //添加
            this.$refs.SmExamPaperGroupQuestionModal.add(data);
          }
        }
      });
      this.loading = false;
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
  },


  render() {

    return (
      <div class="sm-exam-papers">
        <a-modal
          title={`试卷配置`}
          visible={this.visible}

          onCancel={this.close}

          confirmLoading={this.loading}
          destroyOnClose={true}
          okText="下一步"
          onOk={this.ok}
          destroyOnClose={true}
        >

          <a-form form={this.form}>

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
                placeholder={'请选择模板'}
                disabled={this.status === ModalStatus.View}
                allowClear={true}
                options={this.examPaperTempaltes}
                v-decorator={[
                  'examPaperTemplateId',
                  {
                    initialValue: undefined,
                  },
                ]}
                onChange={(val) => {
                  if (val == undefined) {
                    this.isChoseTemplate = false;
                    this.groupQuestionType = 2;
                  } else {
                    this.isChoseTemplate = true;
                  }
                }}
              />
            </a-form-item>


            <a-form-item
              label="组题方式"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-radio-group
                disabled={this.status === ModalStatus.View}
                value={this.groupQuestionType}
              >
                <a-radio value={1} disabled={!this.isChoseTemplate}
                  onClick={() => {
                    this.groupQuestionType = 1;
                  }} >随机</a-radio>
                <a-radio value={2} onClick={() => {
                  this.groupQuestionType = 2;
                }} >手动</a-radio>

              </a-radio-group>
            </a-form-item>


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


          </a-form>
        </a-modal>


        <SmExamPaperGroupQuestionModal
          ref="SmExamPaperGroupQuestionModal"
          axios={this.axios}
          onSuccess={() => {
            this.$emit('success');
            this.close();
          }}
        />
      </div>

    );
  },
};
