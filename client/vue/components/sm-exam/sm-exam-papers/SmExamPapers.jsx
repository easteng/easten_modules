import './style/index.less';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess } from '../../_utils/utils';
import ApiExamPaper from '../../sm-api/sm-exam/ExamPaper';
//import CategoryTreeSelect from '../sm-exam-category-tree-select';
import CategoryTreeSelect from '../sm-exam-category-tree-select';
import moment from 'moment';
import SmExamPaperModal from './SmExamPaperModal';
import SmExamPaperConfigModal from './SmExamPaperConfigModal';
let apiExamPaper = new ApiExamPaper();

export default {
  name: 'SmExamPapers',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },

  data() {
    return {
      exampapers: [], //列表数据源
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
        name: null, //名称搜索
        categoryId: null,
      },
      loading: false,
      viewState: 'disable',
    };
  },

  computed: {
    columns() {
      return [
        {
          title: '分类',
          dataIndex: 'categoryId',
          ellipsis: true,
          scopedSlots: { customRender: 'categoryId' },
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '模板',
          dataIndex: 'examPaperTemplate',
          ellipsis: true,
          scopedSlots: { customRender: 'examPaperTemplate' },
        },
        {
          title: '组题方式',
          dataIndex: 'groupQuestionType',
          ellipsis: true,
          scopedSlots: { customRender: 'groupQuestionType' },
        },
        {
          title: '题目总数',
          dataIndex: 'questionTotalNumber',
        },
        {
          title: '总分',
          dataIndex: 'totalScore',
        },
        {
          title: '考试时长',
          dataIndex: 'examinationDuration',
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          ellipsis: true,
          scopedSlots: { customRender: 'creationTime' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
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
      apiExamPaper = new ApiExamPaper(this.axios);
    },

    //添加试卷配置
    add() {
      this.$refs.SmExamPaperConfigModal.add();
    },


    //刷新列表
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = {
        name: this.queryParams.name,
        categoryId: this.queryParams.categoryId,
      };
      let response = await apiExamPaper.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });

      if (requestIsSuccess(response) && response.data) {
        // if (response.data.items && response.data.items.length > 0) {
        this.exampapers = response.data.items;
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

    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    //详情
    details(record) {
      this.$refs.SmExamPaperModal.details(record);
    },

    //编辑
    edit(record) {
      this.$refs.SmExamPaperModal.edit(record);
    },

    //删除
    remove(multiple, selectedExamPaperIds) {
      if (selectedExamPaperIds && selectedExamPaperIds.length > 0) {
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
              let response = await apiExamPaper.delete(selectedExamPaperIds);
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
        this.$message.error('请选择要删除的试卷！');
      }
    },
  },

  render() {
    return (
      <div class="sm-exam-papers">
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}

          onReset={() => {
            this.queryParams = {
              name: null,
              categoryId: null,
            };
            this.refresh();
          }}>



          <a-form-item label="分类">
            <CategoryTreeSelect
              axios={this.axios}
              maxTagCount={3}
              treeCheckable={false}
              showSearch={true}
              value={this.queryParams.categoryId}
              onChange={value => {
                this.queryParams.categoryId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="名称">
            <a-input
              placeholder="请输入"
              value={this.queryParams.name}
              onInput={event => {
                this.queryParams.name = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons">
            <a-button type="primary" onClick={() => this.add()} icon="plus">
              添加
            </a-button>
            <a-button onClick={() => this.remove(true, this.selectedExamPaperIds)}>
              批量删除
            </a-button>
          </template>
        </sc-table-operator>

        {/* 表格展示 */}
        <a-table
          columns={this.columns}
          dataSource={this.exampapers}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}

          // 表格前面的方框
          rowSelection={{
            columnWidth: 30,
            onChange: selectedRowKeys => {
              this.selectedExamPaperIds = selectedRowKeys;
            },
          }}

          pagination={false}
          {...{
            scopedSlots: {
              categoryId: (text, record) => {
                return record.category.name;
              },

              examPaperTemplate: (text, record) => {
                if (record.examPaperTemplate != null)
                  return record.examPaperTemplate.name;
                else
                  return null;
              },

              creationTime: (text, record) => {
                return <a-tooltip placement="topLeft" title={record.creationTime ? moment(record.creationTime).format('YYYY-MM-DD HH:MM:SS') : ''}>
                  {record.creationTime ? moment(record.creationTime).format('YYYY-MM-DD HH:MM:SS') : ''}
                </a-tooltip>;
              },

              groupQuestionType: (text, record) => {
                if (record.groupQuestionType == 1)
                  text = '随机';
                if (record.groupQuestionType == 2)
                  text = '手动';
                return text;
              },

              operations: (text, record) => {
                return [
                  <span>
                    <a
                      onClick={() => {
                        this.details(record);
                      }}
                    >
                      详情
                    </a>
                    <a-divider type="vertical" />
                    <a-dropdown trigger={['click']}>
                      <a class="ant-dropdown-link" onClick={""}>
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
        > </a-table>

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
        <SmExamPaperModal
          ref="SmExamPaperModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />


        <SmExamPaperConfigModal
          ref="SmExamPaperConfigModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

      </div>
    );
  },
};
