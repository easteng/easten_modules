import { requestIsSuccess, getQuestionType } from '../../_utils/utils';
import { form as formConfig, tips, form } from '../../_utils/config';
import './style/index';
import * as utils from '../../_utils/utils';
import { ModalStatus, QuestionType } from '../../_utils/enum';
import ApiSmExamExamPaperTemplate from '../../sm-api/sm-exam/SmExamExamPaperTemplate';
let apiSmExamExamPaperTemplate = new ApiSmExamExamPaperTemplate();
import SmExamCategoriesTreeSelect from '../sm-exam-category-tree-select';
import moment from 'moment';
import { set } from 'vuedraggable';
// 定义表单字段常量
const formFields = [
  'categoryId',
  'name',
  'remark',
];
export default {
  name: 'SmExamExamPaperTemplateModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      counter: 0,
      SmExamExamPaperTemplateModalData: [],
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      record: {}, // 表单绑定的对象,
      loading: false, //确定按钮加载状态
      type: QuestionType,
      sumCount: 0,
      sumScore: 0,
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
    newData() {

      return this.SmExamExamPaperTemplateModalData;
    },
    columns() {
      return [
        {
          title: '题目类型',
          width: '135px',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },

        },
        {
          title: '难度系数',
          width: '150px',
          dataIndex: 'difficultyDegree',
          scopedSlots: { customRender: 'difficultyDegree' },
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
        },
        {
          title: '分数',
          dataIndex: 'score',
          scopedSlots: { customRender: 'score' },
        },
        {
          title: '顺序',
          width: "80px",
          dataIndex: 'order',
          scopedSlots: { customRender: 'order' },
        },
      ];
    },
    viewColumns() {
      return [
        {
          title: '题目类型',
          width: '135px',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },

        },
        {
          title: '难度系数',
          width: '150px',
          dataIndex: 'difficultyDegree',
          scopedSlots: { customRender: 'difficultyDegree' },
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
        },
        {
          title: '分数',
          dataIndex: 'score',
          scopedSlots: { customRender: 'score' },
        },
      ];
    },
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});

  },
  methods: {
    // 控制题目类型
    addType() {
      for (let item in QuestionType) {
        this.counter = this.counter + 1;
        this.SmExamExamPaperTemplateModalData.push({
          key: this.counter,
          type: QuestionType[item],
          difficultyDegree: 0,
          count: 0,
          score: 0,
          order: this.counter,
        });
      }
      return this.SmExamExamPaperTemplateModalData;
    },
    //向上变换题的顺序
    arrowUp(upOrDown, record, index) {
      if (upOrDown === "up" && index != 0) {
        this.SmExamExamPaperTemplateModalData[index] = this.SmExamExamPaperTemplateModalData.splice(index - 1, 1, this.SmExamExamPaperTemplateModalData[index])[0];
      }
      else if (upOrDown === "down" && index != this.SmExamExamPaperTemplateModalData.length - 1) {
        this.SmExamExamPaperTemplateModalData[index] = this.SmExamExamPaperTemplateModalData.splice(index + 1, 1, this.SmExamExamPaperTemplateModalData[index])[0];
      }
    },
    initAxios() {
      apiSmExamExamPaperTemplate = new ApiSmExamExamPaperTemplate(this.axios);
    },
    // //删除题目类型
    // remove(key) {
    //   let SmExamExamPaperTemplateModalData = [...this.SmExamExamPaperTemplateModalData];
    //   this.SmExamExamPaperTemplateModalData = SmExamExamPaperTemplateModalData.filter(item => item.key !== key);

    // },
    add() {

      this.form.resetFields();
      this.status = ModalStatus.Add;
      this.SmExamExamPaperTemplateModalData = [];
      this.addType();
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },
    //编辑
    async edit(record) {
      this.status = ModalStatus.Edit;
      let examPaperTemplateConfigs = record.examPaperTemplateConfigs;
      for (let i = 0; i < examPaperTemplateConfigs.length; i++) {
        this.sumCount += examPaperTemplateConfigs[i].count;
        this.sumScore += examPaperTemplateConfigs[i].score;
      }
      let response = await apiSmExamExamPaperTemplate.get(record.id);
      if (requestIsSuccess(response)) {
        this.record = response.data;

        this.setSmExamExamPaperTemplateModalData();

        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },
    compare(property) {
      return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      };
    },
    setSmExamExamPaperTemplateModalData() {
      this.SmExamExamPaperTemplateModalData = [];
      for (let i = 0; i < this.record.examPaperTemplateConfigs.length; i++) {

        let examPaperTemplateConfigs = this.record.examPaperTemplateConfigs.sort(this.compare('order'));
        const ele = examPaperTemplateConfigs[i];
        if (this.status == ModalStatus.View && ele.count != 0) {
          this.SmExamExamPaperTemplateModalData.push({
            key: ele.order,
            type: ele.type,
            difficultyDegree: ele.difficultyDegree,
            count: ele.count,
            score: ele.score,
            order: ele.order,
          });
        }
        if (this.status == ModalStatus.Edit) {
          this.SmExamExamPaperTemplateModalData.push({
            key: ele.order,
            type: ele.type,
            difficultyDegree: ele.difficultyDegree,
            count: ele.count,
            score: ele.score,
            order: ele.order,
          });
        }
      }
    },
    // 详情
    async view(record) {
      this.status = ModalStatus.View;
      let examPaperTemplateConfigs = record.examPaperTemplateConfigs;
      for (let i = 0; i < examPaperTemplateConfigs.length; i++) {
        this.sumCount += examPaperTemplateConfigs[i].count;
        this.sumScore += examPaperTemplateConfigs[i].score;
      }
      let response = await apiSmExamExamPaperTemplate.get(record.id);

      if (requestIsSuccess(response)) {

        this.record = response.data;

        this.setSmExamExamPaperTemplateModalData();

        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },
    // 关闭模态框
    close() {
      this.form.resetFields();
      this.record = null;
      this.status = ModalStatus.Hide;
      this.loading = false;
      this.sumCount = 0;
      this.sumScore = 0;
    },

    // 数据提交
    ok() {

      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let relateInfos = [];
            for (let i = 0; i < this.SmExamExamPaperTemplateModalData.length; i++) {
              const ele = this.SmExamExamPaperTemplateModalData[i];
              relateInfos.push({
                type: ele.type,
                difficultyDegree: ele.difficultyDegree,
                count: ele.count,
                score: ele.score,
                order: i,
              });

            }
            values.examPaperTemplateConfigs = relateInfos;
            let data = {
              ...values,

            };
            this.loading = true;
            let response = null;
            if (this.status === ModalStatus.Add) {
              //添加
              response = await apiSmExamExamPaperTemplate.create(data);
            } else if (this.status === ModalStatus.Edit) {
              // 编辑
              response = await apiSmExamExamPaperTemplate.update({ id: this.record.id, ...data });
            }
            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }

          }
        });
      }
      this.loading = false;
    },
  },

  render() {
    return (
      <a-modal
        title={`${this.title}试卷模板`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.loading}
        destroyOnClose={true}
        okText="保存"
        onOk={
          this.ok
        }
        width={800}
      >
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={24}>
              <a-form-item label="分类" label-col={{ span: 3 }} wrapper-col={{ span: 20 }} >
                <SmExamCategoriesTreeSelect
                  axios={this.axios}
                  disabled={this.status == ModalStatus.View}

                  placeholder={this.status == ModalStatus.View ? '' : '请选择分类'}
                  v-decorator={[
                    'categoryId',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择分类',
                          whitespace: true,
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="名称" label-col={{ span: 3 }} wrapper-col={{ span: 20 }} >
                <a-input
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入名称'}
                  v-decorator={[
                    'name',
                    {
                      initialValue: '',
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
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item class="a-form-item-labe" label="配置" label-col={{ span: 3 }} wrapper-col={{ span: 20 }} >
                <a-table
                  columns={this.status == ModalStatus.View ? this.viewColumns : this.columns}
                  rowKey={record => record.key}
                  dataSource={this.SmExamExamPaperTemplateModalData}
                  bordered={false}
                  loading={this.loading}
                  pagination={false}
                  {...{
                    scopedSlots: {
                      type: (text, record, index) => {
                        return record.type ? getQuestionType(record.type) : '';
                      },
                      difficultyDegree: (text, record, index) => {
                        return (
                          <span>
                            <a-slider
                              default-value={0}
                              max={1}
                              step={0.1}
                              disabled={this.status == ModalStatus.View}
                              value={record.difficultyDegree}
                              onChange={val => {
                                record.difficultyDegree = val;
                              }}
                            />
                          </span>
                        );
                      },

                      count: (text, record, index) => {
                        return (
                          <a-input-number
                            placeholder="数量"
                            min={0}
                            disabled={this.status == ModalStatus.View}
                            value={record.count}
                            onChange={value => {
                              this.sumCount = 0;
                              record.count = value;
                              this.SmExamExamPaperTemplateModalData.map(item => {
                                this.sumCount += item.count;
                              });
                            }}
                          />
                        );
                      },
                      score: (text, record, index) => {
                        return (
                          <a-input-number
                            min={0}
                            placeholder="分数"
                            disabled={this.status == ModalStatus.View}
                            value={record.score}
                            onChange={value => {
                              this.sumScore = 0;
                              record.score = value;
                              this.SmExamExamPaperTemplateModalData.map(item => {
                                this.sumScore += item.score;
                              });
                            }} />
                        );
                      },
                      order: (text, record, index) => {
                        return (
                          <span>
                            <a-icon style="font-size:20px" type="arrow-up"
                              onClick={() => {
                                this.arrowUp("up", record, index);
                              }}

                              disabled={this.status == ModalStatus.View}
                            />
                            <a-icon style="font-size:20px" type="arrow-down" disabled={this.status == ModalStatus.View}
                              onClick={() => {
                                this.arrowUp("down", record, index);
                              }}
                              value={index}
                            />
                          </span>

                        );
                      },
                    },
                  }}
                ></a-table>
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="总计" label-col={{ span: 4 }} wrapper-col={{ span: 25 }}>
                <span >题目数量：{this.sumCount}</span>
                <span class="a-form-item-span">总分：{this.sumScore}</span>
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="备注" label-col={{ span: 3 }} wrapper-col={{ span: 20 }} >
                <a-textarea
                  rows="3"
                  disabled={this.status == ModalStatus.View}
                  placeholder={this.status == ModalStatus.View ? '' : '请输入备注'}
                  v-decorator={[
                    'remark',
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
