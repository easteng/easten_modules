import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import moment from 'moment';
import { requestIsSuccess } from '../../_utils/utils';
import ApiSmExamExamPaperTemplate from '../../sm-api/sm-exam/SmExamExamPaperTemplate';
import './style/index.less';
import SmExamExamPaperTemplateModal from './SmExamExamPaperTemplateModal';
let apiSmExamExamPaperTemplate = new ApiSmExamExamPaperTemplate();
import SmExamCategoriesTreeSelect from '../sm-exam-category-tree-select';

export default {
  name: 'SmExamExamPaperTemplate',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      SmExamExamPaperTemplate: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        categoryId: null, // 分类
        name: null, // 名称
        maxResultCount: paginationConfig.defaultPageSize,
      },
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '分类',
          dataIndex: 'categoryId',
          scopedSlots: { customRender: 'categoryName' },
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '题目总数',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
        },
        {
          title: '总分',
          dataIndex: 'score',
          scopedSlots: { customRender: 'score' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true,
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
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
      apiSmExamExamPaperTemplate = new ApiSmExamExamPaperTemplate(this.axios);
    },

    // 添加
    add() {
      this.$refs.SmExamExamPaperTemplateModal.add();
    },

    // 编辑
    edit(record) {
      this.$refs.SmExamExamPaperTemplateModal.edit(record);
    },

    // 详情
    view(record) {
      this.$refs.SmExamExamPaperTemplateModal.view(record);
    },


    // 删除
    remove(multiple, selectedExamPaperTemplateIds) {
      if (selectedExamPaperTemplateIds && selectedExamPaperTemplateIds.length > 0) {

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
              let response = await apiSmExamExamPaperTemplate.delete(selectedExamPaperTemplateIds);

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
        this.$message.error('请选择要删除的试卷模板！');
      }
    },
    // 刷新列表
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiSmExamExamPaperTemplate.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        categoryId: this.queryParams.categoryId,
        name: this.queryParams.name,
      });
      if (requestIsSuccess(response) && response.data) {
        // if (response.data.items && response.data.items.length > 0) {
        this.SmExamExamPaperTemplate = response.data.items;
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


  },


  render() {
    return (
      <div class="sm-exam-exam-paper-template">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              categoryId: null,
              name: null,
            };
            this.refresh();
          }}
        >
          <a-form-item label="分类">
            <SmExamCategoriesTreeSelect
              placeholder="请选择"
              axios={this.axios}
              treeCheckStrictly={true}
              value={this.queryParams.categoryId}
              onInput={value => {
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
            <a-button type="primary" onClick={this.add} icon="plus">
              新建
            </a-button>
            <a-button onClick={() => this.remove(true, this.selectedExamPaperTemplateIds)}>批量删除</a-button>
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.SmExamExamPaperTemplate}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          rowSelection={{

            onChange: selectedRowKeys => {
              this.selectedExamPaperTemplateIds = selectedRowKeys;
            },
          }}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              categoryName: (text, record, index) => {
                return record.category.name;


              },
              count: (text, record, index) => {
                let examPaperTemplateConfigs = record.examPaperTemplateConfigs;
                let count = 0;
                for (let i = 0; i < examPaperTemplateConfigs.length; i++) {
                  count += examPaperTemplateConfigs[i].count;
                }
                return count;
              },

              score: (text, record, index) => {
                let examPaperTemplateConfigs = record.examPaperTemplateConfigs;
                let score = 0;
                for (let i = 0; i < examPaperTemplateConfigs.length; i++) {
                  score += examPaperTemplateConfigs[i].score;
                }
                return score;
              },
              creationTime: (text, record, index) => {
                return record.creationTime ? moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss') : '';
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
        <SmExamExamPaperTemplateModal
          ref="SmExamExamPaperTemplateModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />


      </div>
    );
  },
};
