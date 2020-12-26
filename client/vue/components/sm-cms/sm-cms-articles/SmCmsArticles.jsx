import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vP, vIf } from '../../_utils/utils';
import moment from 'moment';
import SmCmsArticleModal from './SmCmsArticleModal';
import CategoryTreeSelect from '../sm-cms-category-tree-select';
import ApiArticle from '../../sm-api/sm-cms/Article';
import { getFileUrl } from '../../_utils/utils';
import ThumbView from './src/ThumbView';
import './style/index.less';
import permissionsSmCms from '../../_permissions/sm-cms';


let apiArticle = new ApiArticle();

export default {
  name: 'SmCmsArticles',
  props: {
    permissions: { type: Array, default: () => [] },
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      articles: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        title: null, // 标题搜索
        categories: [], //栏目
        author: null, //作者
        startTime: null, //开始时间
        endTime: null, //结束时间
        maxResultCount: paginationConfig.defaultPageSize,
      },
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
      loading: false,
      viewState: 'disable',
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '栏目',
          dataIndex: 'categories',
          ellipsis: true,
          scopedSlots: { customRender: 'categories' },
        },
        {
          title: '标题',
          dataIndex: 'title',
          ellipsis: true,
        },
        {
          title: '缩略图',
          dataIndex: 'thumb',
          scopedSlots: { customRender: 'thumb' },
        },
        {
          title: '概要',
          dataIndex: 'summary',
          ellipsis: true,
        },
        {
          title: '作者',
          dataIndex: 'author',
        },
        {
          title: '发布时间',
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' },
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
      apiArticle = new ApiArticle(this.axios);
    },

    // 添加
    add() {
      this.$refs.SmCmsArticleModal.add();
    },

    // 编辑
    edit(record) {
      this.$refs.SmCmsArticleModal.edit(record);
    },

    // 详情
    view(record) {
      this.$refs.SmCmsArticleModal.view(record);
    },

    // 删除
    remove(multiple, selectedArticleIds) {
      if (selectedArticleIds && selectedArticleIds.length > 0) {
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
              let response = await apiArticle.delete(selectedArticleIds);
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
        this.$message.error('请选择要删除的文章！');
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
        categoryIds: this.queryParams.categories.map(item => item.value),
        author: this.queryParams.author,
        startTime: this.dateRange[0] ? this.dateRange[0].format('YYYY-MM-DD') : null,
        endTime: this.dateRange[1] ? this.dateRange[1].format('YYYY-MM-DD') : null,
        maxResultCount: this.queryParams.maxResultCount,
      };

      let response = await apiArticle.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        this.articles = response.data.items;
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

    // 缩略图浏览
    viewFile(file) {
      this.$refs.ThumbView.view(file);
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
    return (
      <div class="sm-cms-articles">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              title: null,
              categories: [],
              author: null,
            };
            this.dateRange = [moment(moment()).startOf('month'), moment(moment()).endOf('month')];
            this.refresh();
          }}
        >
          <a-form-item label="发布时间">
            <a-range-picker
              value={this.dateRange}
              onChange={value => {
                this.dateRange = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="栏目">
            <CategoryTreeSelect
              placeholder="请选择"
              axios={this.axios}
              treeCheckStrictly={true}
              value={this.queryParams.categories}
              maxTagCount={2}
              treeCheckable={true}
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

          <a-form-item label="作者">
            <a-input
              placeholder="请输入"
              value={this.queryParams.author}
              onInput={event => {
                this.queryParams.author = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons">
            {vIf(
              <a-button type="primary" onClick={this.add} icon="plus">
                新建
              </a-button>,
              vP(this.permissions, permissionsSmCms.Articles.Create),
            )}
            {vIf(
              <a-button onClick={() => this.remove(true, this.selectedArticleIds)}>批量删除</a-button>,
              vP(this.permissions, permissionsSmCms.Articles.Delete),
            )}

          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.articles}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          rowSelection={{
            columnWidth: 30,
            onChange: selectedRowKeys => {
              this.selectedArticleIds = selectedRowKeys;
            },
          }}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },

              categories: (text, record, index) => {
                let result = '';
                record.categories.map(
                  (item, index) => (result += `${index == 0 ? '' : '，'}${item}`),
                );
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },

              date: (text, record, index) => {
                return record.date ? moment(record.date).format('YYYY-MM-DD') : '';
              },

              thumb: (text, record, index) => {
                return record.thumb ? (
                  <div class="file-item-box">
                    <div class="file-item-content">
                      <div class="file-thumb simple">
                        <div
                          class="thumb-cover"
                          style={{ backgroundImage: `url(${getFileUrl(record.thumb.url)})` }}
                          onClick={() => {
                            this.viewFile(record.thumb);
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                );
              },

              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.view(record);
                        }}
                      >详情
                      </a>,
                      vP(this.permissions, permissionsSmCms.Articles.Detail),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmCms.Articles.Detail) &&
                      vP(this.permissions, [permissionsSmCms.Articles.Update, permissionsSmCms.Articles.Delete]),
                    )}

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a
                          class="ant-dropdown-link"
                          onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.edit(record);
                                }}
                              >编辑
                              </a>,
                              vP(this.permissions, permissionsSmCms.Articles.Update),
                            )}
                          </a-menu-item>
                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.remove(false, [record.id]);
                                }}
                              >删除
                              </a>,
                              vP(this.permissions, permissionsSmCms.Articles.Delete),
                            )}
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [permissionsSmCms.Articles.Update, permissionsSmCms.Articles.Delete]),
                    )}
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
        <SmCmsArticleModal
          ref="SmCmsArticleModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

        <ThumbView
          ref="ThumbView"
          value={this.viewState}
          onInput={value => (this.viewState = value)}
        />
      </div>
    );
  },
};
