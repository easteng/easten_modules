import { requestIsSuccess } from '../../_utils/utils';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import moment from 'moment';
import SmExamCategoryModal from './SmExamCategoryModal';
import ApiCategory from '../../sm-api/sm-exam/Category';
import { deleteEmptyProps } from '../../_utils/tree_array_tools';
let apiCategory = new ApiCategory();

export default {
  name: 'SmExamCategories',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      categories: [], //数据存储
      loading: false,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        name: null, // 名称搜索
        maxResultCount: paginationConfig.defaultPageSize,
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          ellipsis: true,
        },
        {
          title: '描述',
          dataIndex: 'description',
          ellipsis: true,
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'creationTime' },
        },
        {
          title: '排序',
          dataIndex: 'order',
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '182px',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  async created() {
    this.initAxios();
    this.initMinio();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiCategory = new ApiCategory(this.axios);
    },
    //添加分类
    add(parentId) {
      this.$refs.SmExamCategoryModal.add(parentId);
    },

    // 编辑分类
    edit(record) {
      this.$refs.SmExamCategoryModal.edit(record);
    },

    // 分类详情
    view(record) {
      this.$refs.SmExamCategoryModal.view(record);
    },

    //删除分类
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiCategory.delete(record.id);
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
    },

    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiCategory.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        // if (response.data.items.length > 0) {
        let _categories = deleteEmptyProps(response.data.items, 'children', ['children']);
        this.categories = this.sortByOrder(_categories);
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
    initMinio() { },
  },
  render() {
    return (
      <div class="sm-exam-categories">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.name = '';
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
            ></a-input>
          </a-form-item>
          <template slot="buttons">
            <a-button type="primary" onClick={() => this.add()} icon="plus">
              添加
            </a-button>
          </template>
        </sc-table-operator>
        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.categories}
          rowKey={record => record.id}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                return text;
              },
              description: (text, record) => {
                return text;
              },
              creationTime: (text, record) => {
                return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
              },
              order: (text, record) => {
                return text;
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
                              this.add(record.id);
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

        {/* 添加/编辑模板 */}
        <SmExamCategoryModal
          ref="SmExamCategoryModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
