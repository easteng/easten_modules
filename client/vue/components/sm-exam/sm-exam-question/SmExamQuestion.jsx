import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getQuestionType } from '../../_utils/utils';
import moment from 'moment';
import { QuestionType } from '../../_utils/enum';
import SmExamQuestionModal from './SmExamQuestionModal';
import CategoriesTreeSelect from '../sm-exam-category-tree-select';
import ApiQuestion from '../../sm-api/sm-exam/Question';
import './style/index.less';

let apiQuestion = new ApiQuestion();

export default {
  name: 'SmExamQuestion',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      questions: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        questionType: null, //类型
        title: null, // 标题搜索
        categories: [], //分类ids

        startdifficultyCoefficient: null, //开始的难度系数
        enddifficultyCoefficient: null, //结束的难度系数
        maxResultCount: paginationConfig.defaultPageSize,
      },
      difficultyCoefficientRange: [0, 1],  //难度系数
      knowledgePoints: [], //知识点
      loading: false,
      viewState: 'disable',
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '类型',
          dataIndex: 'questionType',
          ellipsis: true,
          scopedSlots: { customRender: 'questionType' },
        },
        {
          title: '分类',
          dataIndex: 'categories',
          ellipsis: true,
          scopedSlots: { customRender: 'categories' },
        },
        {
          title: '题目',
          dataIndex: 'title',
          ellipsis: true,
        },
        {
          title: '难度系数',
          dataIndex: 'difficultyCoefficient',
        },
        {
          title: '知识点',
          dataIndex: 'knowledgePoint',
          ellipsis: true,
          scopedSlots: { customRender: 'knowledgePoint' },
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'creationTime' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '140px',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {},
  async created() {
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiQuestion = new ApiQuestion(this.axios);
    },

    // 添加
    add() {
      this.$refs.SmExamQuestionModal.add();
    },

    // 编辑
    edit(record) {
      this.$refs.SmExamQuestionModal.edit(record);
    },

    // 详情
    view(record) {
      this.$refs.SmExamQuestionModal.view(record);
    },

    //删除
    remove(multiple, selectedQuestionIds) {
      if (selectedQuestionIds && selectedQuestionIds.length > 0) {
        let _this = this;
        this.$confirm({
          title: tipsConfig.remove.title,
          content: h => (
            <div style="color:red;">
              {multiple ? '确定要删除这几条数据？' : tipsConfig.remove.content}
            </div>
          ),
          okType: 'danger',
          onOk() {
            return new Promise(async (resolve, reject) => {
              let response = await apiQuestion.delete(selectedQuestionIds);
              if (requestIsSuccess(response)) {
                _this.refresh();
                setTimeout(resolve, 100);
              } else {
                setTimeout(reject, 100);
              }
            });
          },
          onCancel() { },
        });
      } else {
        this.$message.error('请选择要删除的题库！');
      }
    },

    //刷新列表
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let queryParams = {
        questionType: this.queryParams.questionType,
        title: this.queryParams.title,
        categoryIds: this.queryParams.categories.map(item => item),
        startdifficultyCoefficient: this.difficultyCoefficientRange[0],
        enddifficultyCoefficient: this.difficultyCoefficientRange[1],
        maxResultCount: this.queryParams.maxResultCount,
      };


      let response = await apiQuestion.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });

      if (requestIsSuccess(response) && response.data) {
        // if (response.data.items && response.data.items.length > 0) {
        this.questions = response.data.items;
        this.totalCount = response.data.totalCount;
        // } else {
        //   if (this.pageIndex > 1) {
        //     this.pageIndex -= 1;
        //     this.refresh(false);
        //   }
        // }
      }
      this.loading = false;
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
  },

  render() {
    //题目类型枚举
    let Options = [];
    for (let item in QuestionType) {
      Options.push(
        <a-select-option key={`${QuestionType[item]}`}>
          {getQuestionType(QuestionType[item])}
        </a-select-option>,
      );
    }
    return (
      <div class="sm-exam-question">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              title: null,
              categories: [],
              questionType: null,

            };
            this.difficultyCoefficientRange = [0, 1],
            this.refresh();
          }}
        >
          <a-form-item label="类型">
            <a-select
              value={this.queryParams.questionType}
              onChange={value => {
                this.queryParams.questionType = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
          </a-form-item>

          <a-form-item label="分类">
            <CategoriesTreeSelect
              axios={this.axios}
              treeCheckable={true}  //是否多选
              treeCheckStrictly={true} //父子级是否严格

              value={this.queryParams.categories}
              maxTagCount={2}

              onInput={value => {
                this.queryParams.categories = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="题目">
            <a-input
              placeholder="请输入"
              value={this.queryParams.title}
              onInput={event => {
                this.queryParams.title = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="难度系数">
            <a-col span="12">
              <a-slider
                min={0}
                max={1}
                step={0.1}
                range={true}
                value={this.difficultyCoefficientRange}
                onChange={value => {
                  this.difficultyCoefficientRange = value;
                  this.refresh();
                }}
              ></a-slider>
            </a-col>
          </a-form-item>

          <template slot="buttons">
            <a-button type="primary" onClick={this.add} icon="plus">
              添加
            </a-button>
            <a-button onClick={() => this.remove(true, this.selectedQuestionIds)}>批量删除</a-button>
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.questions}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          rowSelection={{
            columnWidth: 60,
            onChange: selectedRowKeys => {
              this.selectedQuestionIds = selectedRowKeys;
            },
          }}
          pagination={false}
          {...{
            scopedSlots: {
              //日期格式化
              creationTime: (text, record, index) => {
                return record.creationTime ? moment(record.creationTime).format('YYYY-MM-DD HH:MM:SS') : '';
              },

              categories: (text, record, index) => {
                let result = '';
                record.questionRltCategories.map(
                  (item, index) => (result += `${index == 0 ? '' : '，'}${item.category.name}`),
                );
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },

              knowledgePoint: (text, record, index) => {
                let result = '';
                record.questionRltKnowledgePoints.map(
                  (item, index) => (result += `${index == 0 ? '' : ','}${item.knowledgePoint.name}`),
                );
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>
                      {result}
                    </span>
                  </a-tooltip>
                );
              },

              questionType: (text, record) => {
                return getQuestionType(record.questionType);
              },


              operations: (text, record) => {
                return [
                  <span>
                    <a
                      onClick={() => {
                        this.view(record);
                      }}
                    >
                      详情
                    </a>
                    <a-divider type="vertical" />

                    <a-dropdown trigger={['click']}>
                      <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        更多 <a-icon type="down" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a
                            onClick={() => {
                              this.edit(record);
                            }}
                          >
                            编辑
                          </a>
                        </a-menu-item>

                        <a-menu-item>
                          <a
                            onClick={() => {
                              this.remove(false, [record.id]);
                            }}
                          >
                            删除
                          </a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </span>,
                ];
              },
            },
          }}
        ></a-table>

        {/* 分页器 */}

        <a-pagination
          style="float:right; margin-top:10px"
          total={this.totalCount}
          pageSize={this.queryParams.maxResultCount}
          current={this.pageIndex}
          onChange={this.onPageChange}
          onShowSizeChange={this.onPageChange}
          showSizeChanger
          showQuickJumper
          showTotal={paginationConfig.showTotal}
        />


        {/* 添加/编辑模板 */}
        <SmExamQuestionModal
          ref="SmExamQuestionModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
