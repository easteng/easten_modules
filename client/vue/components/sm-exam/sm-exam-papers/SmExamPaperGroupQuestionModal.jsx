import * as utils from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import ApiExamPaper from '../../sm-api/sm-exam/ExamPaper';
import ApiCategory from '../../sm-api/sm-exam/Category';
import ApiExamPaperTemplate from '../../sm-api/sm-exam/ExamPaperTemplate';
import { QuestionType } from '../../_utils/enum';
import { requestIsSuccess, getQuestionType } from '../../_utils/utils';
import KnowledgePointTreeSelect from '../sm-exam-knowledge-point-tree-select';



let apiExamPaper = new ApiExamPaper();
let apiExamPaperTemplate = new ApiExamPaperTemplate();
let apiCategory = new ApiCategory();



// 定义表单字段常量
const formFields = [

];

export default {
  name: 'SmExamPapeGroupQuestionModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态

      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      loading: false, //确定按钮加载状态
      categoryId: '',
      examPaperTemplateId: '',
      groupQuestionType: 2,
      name: '',
      questionTotalNumber: 0,
      totalScore: 0,   //总分
      questionConfigue: [],
      key: 0,
      questions: [],   //题库中的题目
      config: {
        categoryName: '',
        examPaperTemplateName: '',
        groupQuestionTypeName: '',
        name: '',
      },
      knowledgeData: [],// 知识点树
    };
  },
  computed: {
    title() {
      // 计算模态框的标题变量
      //return utils.getModalTitle(this.status);
      return this.groupQuestionType === 1 ? '随机' : '手动';
    },
    visible() {
      // 计算模态框的显示变量k
      return this.status !== ModalStatus.Hide;
    },

    sum() {
      let sum1 = 0;
      this.questionConfigue.map(item => {
        sum1 += Number(item.content.score);
      });
      return sum1;
    },

    number() {
      return this.questionConfigue.length;
    },

  },

  watch: {
    sum() { this.totalScore = this.sum; },
    number() { this.questionTotalNumber = this.number; },
  },

  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },


  methods: {
    initAxios() {
      apiExamPaperTemplate = new ApiExamPaperTemplate(this.axios);
      apiExamPaper = new ApiExamPaper(this.axios);
      apiCategory = new ApiCategory(this.axios);
    },



    async add(record) {
      this.config = record;
      this.config.categoryId = record.categoryId;
      this.config.examPaperTemplateName = record.examPaperTemplateId != null ? (await apiExamPaperTemplate.get(record.examPaperTemplateId)).data.name : '';
      let respone = await apiCategory.get(record.categoryId);
      if (utils.requestIsSuccess(respone)) {
        this.config.categoryName = respone.data.name;
      }
      this.config.groupQuestionTypeName = record.groupQuestionType === 1 ? '随机' : '手动';
      this.config.name = record.name;
      this.status = ModalStatus.Add;
    },


    async initQuestion(record) {
      let question = {
        KnowledgePointId: record.knowledgePointId,
        StartDifficultyCoefficient: 0,
        EndDifficultyCoefficient: record.difficultyCoefficient,
      };


      let response = await apiExamPaper.getQuestionList(question);
      this.questions = response.data.items.map(item => {
        return {
          title: item.title,
          value: item.id,
          key: item.id,
        };
      });
    },




    //手动/随机试题配置
    async addExamPaper() {
      // 获取知识点
      if (this.groupQuestionType === 1) {

      } else {
        this.key++;
        return this.questionConfigue.push({
          id: this.key,
          content: {
            questionType: QuestionType.SingleChoice, //类型
            knowledgePointId: null, //知识点id
            difficultyCoefficient: 0,//难度系数
            questionId: null,//题目
            score: 0,  //题目得分
            order: 0, //排序
          },
        });
      }


    },

    //删除
    remove(index) {
      this.questionConfigue.splice(index, 1);
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
        let data = {
          categoryId: this.config.categoryId,
          examPaperTemplateId: this.config.examPaperTemplateId,
          groupQuestionType: this.config.groupQuestionType,
          name: this.config.name,

          questionTotalNumber: this.questionTotalNumber,
          totalScore: this.totalScore,

          ExamPaperRltQuestions: this.questionConfigue.map(item => item.content),
        };
        this.loading = true;
        let response = null;
        if (this.status === ModalStatus.Add) {
          //添加
          response = await apiExamPaper.create(data);
          if (utils.requestIsSuccess(response)) {
            this.$message.success('添加成功');
            this.$emit('success');
            this.close();
          }
        }
      });
      this.loading = false;
    },
  },




  render() {
    //题目类型枚举
    let TypeOptions = [];
    for (let item in QuestionType) {
      TypeOptions.push(
        <a-select-option key={QuestionType[item]} value={QuestionType[item]}>
          {getQuestionType(QuestionType[item])}
        </a-select-option>,
      );
    }

    return (
      <a-modal
        title={`添加试卷-${this.title}组题`}
        visible={this.visible}
        cancelText="上一步"
        onCancel={this.close}
        loading={this.loading}
        destroyOnClose={true}
        okText="完成"
        onOk={this.ok}
        width={800}
      >

        <a-form form={this.form} layout='inline'>
          <div><h3>试卷配置</h3></div>
          <div>
            <a-row>
              <a-col span='13'>
                <a-form-item>
                  <label slot='label'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分类</label>
                  {this.config.categoryName}
                </a-form-item>
              </a-col>
              <a-col >
                <a-form-item label='模板'>
                  {this.config.examPaperTemplateName}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span='13'>
                <a-form-item label='组题方式'>
                  {this.config.groupQuestionTypeName}
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item label='名称'>
                  {this.config.name}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row >
              <a-col span='13'>
                <a-form-item label='试题数量' >
                  {this.questionTotalNumber}
                </a-form-item>
              </a-col>
              <a-col span='11'>
                <a-form-item label='总分' >
                  {this.totalScore}
                </a-form-item>
              </a-col>
            </a-row>
          </div><br />
        </a-form>

        <div><h3>试题配置</h3></div>
        <div style="overflow-y: auto; height:300px;overflow-x: hidden; border:0.5px solid #D3D3D3;margin:10px 0;">
          {this.questionConfigue.map((item, index) => {
            return <div style="padding:5px;">
              <a-form >
                <a-row >

                  <a-col span={8}>
                    <a-form-item label='类型'
                      label-col={{ span: 5 }}
                      wrapper-col={{ span: 17 }}>
                      <a-select
                        placeholder="请选择"
                        value={item.content.questionType}
                        onChange={value => {
                          item.content.questionType = value;
                        }}
                      >

                        {TypeOptions}
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col span={8}>
                    <a-form-item label='知识点'
                      label-col={{ span: 5 }}
                      wrapper-col={{ span: 17 }}>
                      <KnowledgePointTreeSelect
                        ref="KnowledgePointTreeSelect"
                        axios={this.axios}
                        placeholder='请选择知识点'
                        categoryId={this.config.categoryId}
                        //  value={item.content.knowledgePointId}
                        onChange={value => {
                          item.content.knowledgePointId = value;
                          this.initQuestion(item.content);
                        }}
                      />
                    </a-form-item>
                  </a-col>



                  <a-col span={8}>
                    <a-form-item label='难度'
                      label-col={{ span: 5 }}
                      wrapper-col={{ span: 17 }}
                    >

                      <a-slider
                        min={0}
                        max={1}
                        step={0.1}

                        value={item.content.difficultyCoefficient}
                        onChange={value => {
                          item.content.difficultyCoefficient = value;
                          this.initQuestion(item.content);
                        }}
                      >

                      </a-slider>


                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col span={8}>
                    <a-form-item label='题目'
                      label-col={{ span: 5 }}
                      wrapper-col={{ span: 17 }}>
                      <a-select
                        options={this.questions}
                        value={item.content.questionId}
                        onChange={value => {
                          item.content.questionId = value;


                          item.content.order = index + 1;   //排序
                        }}
                      />
                    </a-form-item>
                  </a-col>

                  <a-col span={8}>
                    <a-form-item label='分值'
                      label-col={{ span: 5 }}
                      wrapper-col={{ span: 17 }}>
                      <a-input-number
                        style="width:100%"
                        value={item.content.score}
                        onChange={value => {
                          if (value < 0)
                            value = 0;
                          item.content.score = value;
                        }}
                      >
                      </a-input-number>
                    </a-form-item>
                  </a-col>

                  <a-col span={8}>
                    <a-form-item label-col={{ span: 5 }}
                      wrapper-col={{ span: 17, offset: 16 }}>
                      <a-button type='danger' onClick={() => { this.remove(index); }}>删除</a-button>
                    </a-form-item>
                  </a-col>

                </a-row>
              </a-form>
              <a-divider style='margin:10px 0 0 0 ' />
            </div>;
          })}
        </div>
        <a-button type="button" onClick={() => { this.addExamPaper(); console.log(this.$refs.KnowledgePointTreeSelect); }}>添加</a-button>
      </a-modal>
    );
  },
};
