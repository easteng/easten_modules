import * as utils from '../../_utils/utils';
import { ModalStatus, QuestionType } from '../../_utils/enum';
import ApiQuestion from '../../sm-api/sm-exam/Question';
import CategoriesTreeSelect from '../sm-exam-category-tree-select';
import KnowledgePointTreeSelect from '../sm-exam-knowledge-point-tree-select';
let apiQuestion = new ApiQuestion();

// 定义表单字段常量
const formFields = [
  'questionType',
  'questionRltCategories',
  'title',
  'difficultyCoefficient',
  'questionRltKnowledgePoints',
  'answer',
  'analysis',
];

export default {
  name: 'SmExamQuestionModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      singleCheckedId: '',
      multipleChoiceId: [],
      counter1: 1,
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      loading: false, //确定按钮加载状态
      content: '',
      editor: null,
      typeSelect: QuestionType.SingleChoice, //类型选择
      forceRender: false,
      questionAnswerList: [
        {
          name: 'singleChoice',
          content: [
            { id: utils.CreateGuid(), answer: '' },
            { id: utils.CreateGuid(), answer: '' },
          ],
        },
        {
          name: 'multipleChoice',
          content: [
            { id: utils.CreateGuid(), answer: '' },
            { id: utils.CreateGuid(), answer: '' },
          ],
        },
        {
          name: 'gapFilling',
          content: [
            { id: 1, answer: '' },
          ],
        },
      ],
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
      apiQuestion = new ApiQuestion(this.axios);
    },

    add() {
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue();
      });
    },

    async edit(record) {
      this.status = ModalStatus.Edit;
      let response = await apiQuestion.get(record.id);
      if (utils.requestIsSuccess(response) && response.data) {
        let _record = response.data;
        this.record = {
          ..._record,
          questionRltCategories: _record.questionRltCategories.map(item => { return item.category.id; }),
          questionRltKnowledgePoints: _record.questionRltKnowledgePoints
            ? _record.questionRltKnowledgePoints.map(item => {
              return { value: item.knowledgePoint.id };
            })
            : [],

          difficultyCoefficient: _record.difficultyCoefficient
            ? _record.difficultyCoefficient : 0,
          title: _record.title,
          answer: _record.answer,
          analysis: _record.analysis,
        };

        if (_record.questionType === QuestionType.SingleChoice) {
          this.questionAnswerList.find(answer => answer.name === 'singleChoice').content.length = 0;
          for (let item of _record.answerOptions) {
            this.questionAnswerList.find(answer => answer.name === 'singleChoice').content.push({
              id: item.id,
              answer: item.content,
            });
          }
          this.singleCheckedId = _record.answer;
        } else if (_record.questionType === QuestionType.MultipleChoice) {
          this.questionAnswerList.find(answer => answer.name === 'multipleChoice').content.length = 0;
          for (let item of _record.answerOptions) {
            this.questionAnswerList.find(answer => answer.name === 'multipleChoice').content.push({
              id: item.id,
              answer: item.content,
            });
          }
          this.multipleChoiceId = _record.answer.split(',');
        } else if (_record.questionType === QuestionType.GapFilling) {
          this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content.length = 0;
          for (let item of _record.answer.split(',')) {
            this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content.push({
              id: this.counter1++,
              answer: item,
            });
          }
        } else if (_record.questionType === QuestionType.TrueOrFalseQuestions || _record.questionType === QuestionType.ShortAnswerQuestion) {
          _record.answer = _record.answer;
        }
        this.typeSelect = this.record.questionType;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    // 详情
    async view(record) {
      this.status = ModalStatus.View;
      let response = await apiQuestion.get(record.id);
      if (utils.requestIsSuccess(response) && response.data) {
        let _record = response.data;
        this.record = {
          ..._record,

          questionRltCategories: _record.questionRltCategories.map(item => { return item.category.id; }),
          questionRltKnowledgePoints: _record.questionRltKnowledgePoints
            ? _record.questionRltKnowledgePoints.map(item => {
              return { value: item.knowledgePoint.name };
            })
            : [],
          difficultyCoefficient: _record.difficultyCoefficient
            ? _record.difficultyCoefficient : 0,
          title: _record.title,
          analysis: _record.analysis,
          answer: _record.answer,
        };

        if (_record.questionType === QuestionType.SingleChoice) {
          this.questionAnswerList.find(answer => answer.name === 'singleChoice').content.length = 0;
          for (let item of _record.answerOptions) {
            this.questionAnswerList.find(answer => answer.name === 'singleChoice').content.push({
              id: item.id,
              answer: item.content,
            });
          }
          this.singleCheckedId = _record.answer;
        } else if (_record.questionType === QuestionType.MultipleChoice) {
          this.questionAnswerList.find(answer => answer.name === 'multipleChoice').content.length = 0;
          for (let item of _record.answerOptions) {
            this.questionAnswerList.find(answer => answer.name === 'multipleChoice').content.push({
              id: item.id,
              answer: item.content,
            });
          }
          this.multipleChoiceId = _record.answer.split(',');
        } else if (_record.questionType === QuestionType.GapFilling) {
          this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content.length = 0;
          for (let item of _record.answer.split(',')) {
            this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content.push({
              id: this.counter1++,
              answer: item,
            });
          }
        } else if (_record.questionType === QuestionType.TrueOrFalseQuestions || _record.questionType === QuestionType.ShortAnswerQuestion) {
          _record.answer = _record.answer;
        }

      }
      this.typeSelect = this.record.questionType;
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
      });
    },

    //添加选项
    addItemSingle() {
      if (this.questionAnswerList.find(a => a.name === 'singleChoice').length != 8) {
        return this.questionAnswerList.find(a => a.name === 'singleChoice').content.push({
          id: utils.CreateGuid(),
          answer: null,
        });
      }
    },

    addItemMultiple() {
      if (this.questionAnswerList.find(a => a.name === 'multipleChoice').length != 8) {
        return this.questionAnswerList.find(a => a.name === 'multipleChoice').content.push({
          id: utils.CreateGuid(),
          answer: null,
        });
      }
    },

    //删除选项
    delteFormItemSingle(id) {
      let singleChoiceQuestionAnswerList = [...this.questionAnswerList.find(a => a.name === 'singleChoice').content];
      this.questionAnswerList.find(a => a.name === 'singleChoice').content = singleChoiceQuestionAnswerList.filter(item => item.id != id);
    },
    delteFormItemMultiple(id) {
      let multipleChoiceQuestionAnswerList = [...this.questionAnswerList.find(a => a.name === 'multipleChoice').content];
      this.questionAnswerList.find(a => a.name === 'multipleChoice').content = multipleChoiceQuestionAnswerList.filter(item => item.id != id);
    },

    // 关闭模态框
    close() {
      this.singleCheckedId = '';
      this.multipleChoiceId = [];
      this.content = null;
      this.form.resetFields();
      this.record = null;
      this.status = ModalStatus.Hide;
      this.loading = false;
      this.counter1 = 1;
      this.typeSelect = QuestionType.SingleChoice;
      this.questionAnswerList.find(questionType => questionType.name === 'singleChoice').content = [{ id: utils.CreateGuid(), answer: '' }, { id: utils.CreateGuid(), answer: '' }];
      this.questionAnswerList.find(questionType => questionType.name === 'multipleChoice').content = [{ id: utils.CreateGuid(), answer: '' }, { id: utils.CreateGuid(), answer: '' }];
      this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content = [{ id: 1, answer: '' }];
    },

    //切换选题类型清空之前输入
    closeInput() {
      this.singleCheckedId = '';
      this.multipleChoiceId = [];
      this.content = null;
      this.form.resetFields();
      this.record = null;
      this.loading = false;
      this.counter1 = 1;
      this.questionAnswerList.find(questionType => questionType.name === 'singleChoice').content = [{ id: utils.CreateGuid(), answer: '' }, { id: utils.CreateGuid(), answer: '' }];
      this.questionAnswerList.find(questionType => questionType.name === 'multipleChoice').content = [{ id: utils.CreateGuid(), answer: '' }, { id: utils.CreateGuid(), answer: '' }];
      this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content = [{ id: 1, answer: '' }];
    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {

        if (!err) {
          let _values = JSON.parse(JSON.stringify(values));
          let data = {
            ..._values,
            questionRltCategories: _values.questionRltCategories
              ? _values.questionRltCategories.map(item => {
                return { id: item };
              })
              : [],
            questionRltKnowledgePoints: _values.questionRltKnowledgePoints
              ? _values.questionRltKnowledgePoints.map(item => {
                return { id: item };
              })
              : [],
            questionType: _values.questionType
              ? _values.questionType : '',
            difficultyCoefficient: _values.difficultyCoefficient
              ? _values.difficultyCoefficient : 0,
            title: _values.title,
            analysis: _values.analysis,
          };

          if (_values.questionType === QuestionType.SingleChoice) {
            data.answerOptions = this.questionAnswerList.find(answer => answer.name === 'singleChoice').content.map(items => {
              return {
                content: items.answer,
                id: items.id,
              };
            });
            data.answer = this.singleCheckedId;
          } else if (_values.questionType === QuestionType.MultipleChoice) {
            data.answerOptions = this.questionAnswerList.find(answer => answer.name === 'multipleChoice').content.map(items => {
              return {
                content: items.answer,
                id: items.id,
              };
            });
            data.answer = this.multipleChoiceId.join(',');
          } else if (_values.questionType === QuestionType.GapFilling) {
            data.answer = this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content.map(item => {
              return item.answer;
            }).join(',');
          } else if (_values.questionType === QuestionType.TrueOrFalseQuestions || _values.questionType === QuestionType.ShortAnswerQuestion) {
            data.answer = _values.answer;
          }



          this.loading = true;
          let response = null;
          if (this.status === ModalStatus.Add) {
            //添加
            response = await apiQuestion.create(data);
          } else if (this.status === ModalStatus.Edit) {
            // 编辑
            response = await apiQuestion.update({ id: this.record.id, ...data });
          } else {
            this.close();
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

    //填空题空的数量
    gapFillingNum() {
      this.form.validateFields((err, values) => {
        let nums = values.title.split('()').length - 1;
        if (nums > this.counter1) {
          this.counter1 = nums;
          return this.questionAnswerList.find(a => a.name === 'gapFilling').content.push({
            id: this.counter1,
            answer: null,
          });
        } else if (nums < this.counter1 && this.counter1 !== 1) {
          let gapFillingQuestionAnswerList = [...this.questionAnswerList.find(a => a.name === 'gapFilling').content];
          this.questionAnswerList.find(a => a.name === 'gapFilling').content = gapFillingQuestionAnswerList.filter(item => item.id != this.counter1);
          this.counter1--;
        }
      });
    },

    //单选选中按钮
    singleChoiceValue(e) {
      this.singleCheckedId = e.target.value;
    },
    //多选选中按钮
    multipleChoiceValue(checkedValues) {
      this.multipleChoiceId = checkedValues;
    },


  },



  render() {
    let singleChoice = (
      <a-col sm={24} md={24}>
        <a-form-item
          label="选项"
          label-col={{ span: 2 }}
          wrapper-col={{ span: 22 }}
        >
          <a-radio-group
            disabled={this.status == ModalStatus.View}
            value={this.singleCheckedId}
          >
            {this.questionAnswerList.find(questionType => questionType.name === 'singleChoice').content.map(item => {
              return (<div>
                <a-radio
                  value={item.id}
                  onChange={event => this.singleChoiceValue(event)}
                >
                  <a-input
                    disabled={this.status == ModalStatus.View}
                    // style='wdith:985px'
                    style={this.status == ModalStatus.View ? "width:635px" : "width:555px"}
                    value={item.answer}
                    onInput={event => {
                      item.answer = event.target.value;
                    }}
                  ></a-input>

                </a-radio>

                {this.status !== ModalStatus.View ? <a-button type="primary" onClick={() => { this.delteFormItemSingle(item.id); }}  >删除</a-button> : null}

              </div>
              );
            })}
          </a-radio-group>
        </a-form-item>
        <a-form-item label-col={{ span: 5 }} wrapper-col={{ span: 20 }}>
          <a-button type="primary" style="margin-left:64px" onClick={() => { this.addItemSingle(); }} v-show={this.status == ModalStatus.View ? false : true}>
            增加
        </a-button>
        </a-form-item>
      </a-col >
    );
    let multipleChoice = (
      <a-col sm={24} md={24}>
        <a-form-item
          label="选项"
          label-col={{ span: 2 }}
          wrapper-col={{ span: 22 }}
        >
          <a-checkbox-group
            disabled={this.status == ModalStatus.View}
            onChange={checkedValue => this.multipleChoiceValue(checkedValue)}
            value={this.multipleChoiceId}
          >
            {this.questionAnswerList.find(questionType => questionType.name === 'multipleChoice').content.map(item => {
              return (
                <div>
                  <a-checkbox value={item.id}>
                    <a-input
                      disabled={this.status == ModalStatus.View}
                      style={this.status == ModalStatus.View ? "width:635px;margin-bottom:7px;margin-top:3px;" : "width:564px;margin-bottom:7px;margin-top:3px;"}
                      //style="width:564px;margin-bottom: 7px;margin-top:3px"
                      value={item.answer}
                      onInput={event => {
                        item.answer = event.target.value;
                      }}
                    ></a-input>
                  </a-checkbox>
                  <a-button type="primary" onClick={() => { this.delteFormItemMultiple(item.id); }} v-show={this.status == ModalStatus.View ? false : true}>
                    删除
                  </a-button>
                </div>
              );
            })}
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label-col={{ span: 5 }} wrapper-col={{ span: 20 }}>
          <a-button type="primary" style="margin-left:64px" onClick={() => { this.addItemMultiple(); }} v-show={this.status == ModalStatus.View ? false : true}>
            增加
        </a-button>
        </a-form-item>
      </a-col>
    );
    let trueOrFalseQuestions = (
      <a-col sm={24} md={24}>
        <a-form-item
          label="选项"
          label-col={{ span: 2 }}
          wrapper-col={{ span: 22 }}
        >
          <a-radio-group
            disabled={this.status == ModalStatus.View}
            v-decorator={[
              'answer',
            ]
            }
          >
            <a-radio value="1" style="display:block;height:30px;lineheight:30px;margin-top:9px;">
              正确
            </a-radio>
            <a-radio value="0" style="display:block;height:30px;lineheight:30px">
              错误
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    );
    let gapFilling = (
      <a-col sm={24} md={24}>
        <a-form-item
          label="答案"
          label-col={{ span: 2 }}
          wrapper-col={{ span: 22 }}
        >
          {this.questionAnswerList.find(questionType => questionType.name === 'gapFilling').content.map(item => {
            return (<div>
              <a-form-item label={item.id} label-col={{ span: 1 }} wrapper-col={{ span: 22 }}>
                <a-input
                  disabled={this.status == ModalStatus.View}
                  value={item.answer}
                  onInput={event => {
                    item.answer = event.target.value;
                  }
                  }
                >

                </a-input>
              </a-form-item>
            </div>
            );
          })}

        </a-form-item>
      </a-col>
    );
    let shortAnswerQuestion = (
      <a-col sm={24} md={24}>
        <a-form-item
          label="答案"
          label-col={{ span: 2 }}
          wrapper-col={{ span: 21 }}
        >
          <a-textarea
            v-decorator={[
              'answer',
            ]
            }
            rows="3"
            disabled={this.status == ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请输入答案'}
          />
        </a-form-item>
      </a-col>
    );

    //题目类型枚举
    let Options = [];
    for (let item in QuestionType) {
      Options.push(
        <a-select-option key={QuestionType[item]} value={QuestionType[item]}>
          {utils.getQuestionType(QuestionType[item])}
        </a-select-option>,
      );
    }

    return (
      <a-modal
        title={`${this.title}题库`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.loading}
        destroyOnClose={true}
        forceRender={this.forceRender}
        okText="确定"
        onOk={this.ok}
        width={800}
      >
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={12} md={12}>
              <a-form-item label="分类" label-col={{ span: 4 }} wrapper-col={{ span: 18 }}>
                <CategoriesTreeSelect
                  axios={this.axios}
                  disabled={this.status == ModalStatus.View}
                  treeCheckable={true}  //是否多选
                  treeCheckStrictly={true} //父子级是否严格
                  placeholder={this.status == ModalStatus.View ? '' : '请选择分类'}
                  v-decorator={[
                    'questionRltCategories',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择分类',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="知识点" label-col={{ span: 5 }} wrapper-col={{ span: 17 }}>
                <KnowledgePointTreeSelect
                  axios={this.axios}
                  disabled={this.status == ModalStatus.View}
                  treeCheckable={true}  //是否多选
                  treeCheckStrictly={true} //父子级是否严格
                  placeholder={this.status == ModalStatus.View ? '' : '请选择知识点'}
                  maxTagCount={2}
                  v-decorator={[
                    'questionRltKnowledgePoints',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择知识点',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="类型" label-col={{ span: 4 }} wrapper-col={{ span: 18 }}>
                <a-select
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请选择类型'}
                  onChange={value => {
                    this.typeSelect = value;
                    this.closeInput();
                  }}
                  v-decorator={[
                    'questionType',
                    {
                      initialValue: QuestionType.SingleChoice,
                      rules: [
                        {
                          required: true,
                          message: '请选择类型',
                        },
                      ],
                    },
                  ]}
                >
                  {Options}
                </a-select>
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item label="难度系数" label-col={{ span: 5 }} wrapper-col={{ span: 16 }}>
                <a-slider
                  min={0}
                  max={1}
                  step={0.1}
                  disabled={this.status == ModalStatus.View}
                  v-decorator={[
                    'difficultyCoefficient',
                    {
                      initialValue: 0,
                      rules: [
                        {
                          required: true,
                          pattern: /^(0.\d+|1)$/,
                          message: '请选择难度系数',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="题目" label-col={{ span: 2 }} wrapper-col={{ span: 21 }}>
                <a-textarea
                  onInput={() => this.gapFillingNum()}
                  rows="3"
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入题目'}
                  v-decorator={[
                    'title',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            {/* <div v-show={}>{danxuan}</div> */}
            <div v-show={this.typeSelect === QuestionType.SingleChoice}>{singleChoice}</div>
            <div v-show={this.typeSelect === QuestionType.MultipleChoice}>{multipleChoice}</div>
            <div v-show={this.typeSelect === QuestionType.TrueOrFalseQuestions}>{trueOrFalseQuestions}</div>
            <div v-show={this.typeSelect === QuestionType.GapFilling}>{gapFilling}</div>
            <div v-show={this.typeSelect === QuestionType.ShortAnswerQuestion}>{shortAnswerQuestion}</div>

            <a-col sm={24} md={24}>
              <a-form-item label="解析" label-col={{ span: 2 }} wrapper-col={{ span: 21 }}>
                <a-textarea
                  rows="3"
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入解析'}
                  v-decorator={[
                    'analysis',
                    {
                      initialValue: '',
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    );
  },
};
