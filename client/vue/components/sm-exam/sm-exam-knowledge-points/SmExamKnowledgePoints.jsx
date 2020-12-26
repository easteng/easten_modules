import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess } from '../../_utils/utils';
//import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiKonwledgePoint from '../../sm-api/sm-exam/KonwledgePoint';
import moment from 'moment';
import SmExamKnowledgePointsModal from './SmExamKnowledgePointsModal';
import SmExamCategoryTree from '../sm-exam-category-tree-select';
import { deleteEmptyProps } from '../../_utils/tree_array_tools';
import './style/index.less';

let apiKonwledgePoint = new ApiKonwledgePoint();
export default {
  name: 'SmExamKnowledgePoints',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      knowledgePoints: [], //知识点数据源
      totalCount: 0, //数据条数
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
        categories: [], //分类
        name: null, //名称搜索
      },
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '名称',
          dataIndex: 'name',
          width: '15%',
          ellipsis: true,
        },
        {
          title: '分类',
          dataIndex: 'knowledgePointRltCategories',
          ellipsis: true,
          scopedSlots: { customRender: 'category' },
          width: '15%',
        },
        {
          title: '描述',
          dataIndex: 'description',
          width: '15%',
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'creationTime' },
          width: '15%',
        },
        {
          title: '排序',
          dataIndex: 'order',
          width: '15%',
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '25%',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiKonwledgePoint = new ApiKonwledgePoint(this.axios);
    },
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = {
        name: this.queryParams.name,
        categoryIds: this.queryParams.categories.map(item => item),
      };
      let response = await apiKonwledgePoint.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        // if (response.data.items && response.data.items.length > 0) {
        let _categories = deleteEmptyProps(response.data.items, 'children', ['children']);
        this.knowledgePoints = this.sortByOrder(_categories);
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

    // 根据order字段对栏目进行排序
    sortByOrder(array) {
      array
        .sort((a, b) => b.order - a.order)
        .map(item => {
          if (item.children && item.children.length > 0) {
            this.sortByOrder(item.children);
          }
        });
      return array;
    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
    //查看详情
    details(record) {
      this.$refs.SmExamKnowledgePointsModal.details(record);
    },

    //编辑
    edit(record) {
      this.$refs.SmExamKnowledgePointsModal.edit(record);
    },

    //创建
    add(record) {
      this.$refs.SmExamKnowledgePointsModal.add(record);
    },

    //删除
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiKonwledgePoint.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.refresh();
              _this.$message.success('删除成功');
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },
  },
  render() {
    return (
      <div class="SmExamKnowledgePoints">
        {/*操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            (this.queryParams.categories = []), (this.queryParams.name = '');
            this.refresh();
          }}
        >
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

          <a-form-item label="分类">
            <SmExamCategoryTree
              axios={this.axios}
              treeCheckable={true}
              treeCheckStrictly={true}
              value={this.queryParams.categories}
              onInput={value => {
                this.queryParams.categories = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons">
            <a-button type="primary" onClick={this.add}>
              添加
            </a-button>
          </template>
        </sc-table-operator>

        {/* 表格展示 */}
        <a-table
          columns={this.columns}
          dataSource={this.knowledgePoints}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              //日期格式化
              creationTime: (text, record, index) => {
                return record.creationTime
                  ? moment(record.creationTime).format('YYYY-MM-DD HH:MM:SS')
                  : '';
              },

              category: (text, record, index) => {
                let result = '';

                record.knowledgePointRltCategories.map(
                  (item, index) => (result += `${index == 0 ? '' : '，'}${item.category.name}`),
                );
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
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
                      <a class="ant-dropdown-link" onClick={''}>
                        更多 <a-icon type="down" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a
                            onClick={() => {
                              this.add(record);
                            }}
                          >
                            添加子项
                          </a>
                        </a-menu-item>
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
                              this.remove(record);
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

        {/* 添加、编辑  模版 */}
        <SmExamKnowledgePointsModal
          ref="SmExamKnowledgePointsModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
