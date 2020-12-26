import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getCategoryEnable, vP, vIf } from '../../_utils/utils';
import { CategoryEnable } from '../../_utils/enum';
import SmCmsCategoryRltArticleModal from './SmCmsCategoryRltArticleModal';

import ApiCategoryRltArticle from '../../sm-api/sm-cms/CategoryRltArticle';
import CategoryTreeSelect from '../sm-cms-category-tree-select';
import './style/index.less';
import permissionsSmCms from '../../_permissions/sm-cms';
let apiCategoryRltArticle = new ApiCategoryRltArticle();

export default {
  name: 'SmCmsCategoryRltArticles',
  props: {
    permissions: { type: Array, default: () => [] },
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      categoryRltArticles: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        title: '', // 标题搜索
        enable: CategoryEnable.All, //栏目状态
        categories: [], //栏目id
        maxResultCount: paginationConfig.defaultPageSize,
      },
      selectedIds: [],
      loading: false,
      order: null,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '栏目',
          dataIndex: 'categoryTitle',
          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'order',
          scopedSlots: { customRender: 'order' },
        },
        {
          title: '文章标题',
          dataIndex: 'articleTitle',
          ellipsis: true,
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'enable' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '180px',
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
      apiCategoryRltArticle = new ApiCategoryRltArticle(this.axios);
    },

    // 添加栏目
    add(parentId) {
      this.$refs.SmCmsCategoryRltArticleModal.add(parentId);
    },

    //编辑
    edit(record) {
      this.$refs.SmCmsCategoryRltArticleModal.edit(record);
    },

    // 查看
    view(record) {
      this.$refs.SmCmsCategoryRltArticleModal.view(record);
    },

    // 删除
    remove(multiple, selectedIds) {
      if (selectedIds && selectedIds.length > 0) {
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
              let response = await apiCategoryRltArticle.delete(selectedIds);
              if (requestIsSuccess(response)) {
                _this.refresh(false, _this.pageIndex);
                setTimeout(resolve, 100);
              } else {
                setTimeout(reject, 100);
              }
            });
          },
          onCancel() { },
        });
      } else {
        this.$message.error('请选择要删除的栏目文章！');
      }
    },

    // 修改文章排序
    async changeOrder(record) {
      let response = await apiCategoryRltArticle.updateOrder({
        id: record.id,
        order: record.order ? record.order : 0,
      });
      if (requestIsSuccess(response)) {
        this.$message.success('操作成功');
        record.isChangeOrder = false;
        this.refresh(false);
      }
    },

    // 刷新列表
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let queryParams = {
        title: this.queryParams.title,
        enable: this.queryParams.enable,
        categoryIds: this.queryParams.categories.map(item => item.value),
        maxResultCount: this.queryParams.maxResultCount,
      };
      let response = await apiCategoryRltArticle.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        let _categoryRltArticles = response.data.items;
        this.categoryRltArticles = _categoryRltArticles.map(item => {
          return {
            ...item,
            isChangeOrder: false,
          };
        });

        this.totalCount = response.data.totalCount;
        if (page && this.totalCount && this.queryParams.maxResultCount) {
          let currentPage = parseInt(this.totalCount / this.queryParams.maxResultCount);
          if (this.totalCount % this.queryParams.maxResultCount !== 0) {
            currentPage = page + 1;
          }
          if (page > currentPage) {
            this.pageIndex = currentPage;
            this.refresh(false, this.pageIndex);
          }
        }
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

    // 编辑栏目启用状态
    async onChange(checked, record) {
      let response = await apiCategoryRltArticle.updateEnable({ id: record.id, enable: checked });
      if (requestIsSuccess(response)) {
        this.refresh(false);
      }
    },
  },
  render() {
    //栏目启用状态
    let Options = [];
    for (let item in CategoryEnable) {
      Options.push(
        <a-select-option key={`${CategoryEnable[item]}`}>
          {getCategoryEnable(CategoryEnable[item])}
        </a-select-option>,
      );
    }

    return (
      <div class="sm-cms-category-rlta-rticles">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              title: '',
              categories: [],
              enable: CategoryEnable.All,
            };
            this.refresh();
          }}
        >
          <a-form-item label="栏目">
            <CategoryTreeSelect
              placeholder="请选择"
              axios={this.axios}
              treeCheckStrictly={true}
              treeCheckable={true}
              maxTagCount={2}
              value={this.queryParams.categories}
              onInput={value => {
                this.queryParams.categories = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="标题">
            <a-input
              placeholder="请输入"
              value={this.queryParams.title}
              onInput={event => {
                this.queryParams.title = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="是否启用">
            <a-select
              placeholder="请选择"
              value={this.queryParams.enable}
              onChange={value => {
                this.queryParams.enable = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
          </a-form-item>

          <template slot="buttons">
            {vIf(
              <a-button type="primary" onClick={() => this.add()} icon="plus">
                新建
              </a-button>,
              vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Create),
            )}
            {vIf(
              <a-button onClick={() => this.remove(true, this.selectedIds)}>批量删除</a-button>,
              vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Delete),
            )}

          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.categoryRltArticles}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          rowSelection={{
            columnWidth: 30,
            onChange: selectedRowKeys => {
              this.selectedIds = selectedRowKeys;
            },
          }}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },

              order: (text, record, index) => {
                return record.isChangeOrder ? (
                  <a-input-Number
                    min={0}
                    precision={0}
                    max={2147483647}
                    value={record.order}
                    onChange={value => {
                      record.order = value;
                    }}
                  />
                ) : (
                  record.order
                );
              },
              enable: (text, record, index) => {
                return vIf(
                  <a-switch
                    checked-children="是"
                    un-checked-children="否"
                    defaultChecked={record.enable}
                    onChange={checked => this.onChange(checked, record)}
                  />,
                  vP(this.permissions, permissionsSmCms.CategoriesRltArticles.UpdateEnable),
                );
              },
              operations: (text, record) => {
                return record.isChangeOrder ? (
                  <span>
                    <a
                      onClick={() => {
                        this.changeOrder(record);
                      }}
                    >
                      保存
                    </a>
                    <a-divider type="vertical" />
                    <a
                      onClick={() => {
                        record.isChangeOrder = false;
                        record.order = this.order;
                      }}
                    >
                      取消
                    </a>
                  </span>
                ) : (
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          record.isChangeOrder = true;
                          this.order = record.order;
                        }}
                      >
                          排序
                      </a>,
                      vP(this.permissions, permissionsSmCms.CategoriesRltArticles.UpdateOrder),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      (vP(this.permissions, permissionsSmCms.CategoriesRltArticles.UpdateOrder) &&
                          vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Update)) ||
                        (vP(this.permissions, permissionsSmCms.CategoriesRltArticles.UpdateOrder) &&
                          vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Delete)),
                    )}
                    {vIf(
                      <a
                        onClick={() => {
                          this.edit(record);
                        }}
                      >
                          编辑
                      </a>,
                      vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Update),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      (vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Update) &&
                          vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Delete)),
                    )}
                    {vIf(
                      <a
                        onClick={() => {
                          this.remove(false, [record.id]);
                        }}
                      >
                          删除
                      </a>,
                      vP(this.permissions, permissionsSmCms.CategoriesRltArticles.Delete),
                    )}
                  </span>
                );
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
        <SmCmsCategoryRltArticleModal
          ref="SmCmsCategoryRltArticleModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
