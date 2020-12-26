import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getCategoryEnable, vP, vIf } from '../../_utils/utils';
import { CategoryEnable } from '../../_utils/enum';
import { deleteEmptyProps } from '../../_utils/tree_array_tools';
import SmCmsCategoryModal from './SmCmsCategoryModal';
import ThumbView from './src/ThumbView';
import { getFileUrl } from '../../_utils/utils';
import permissionsSmCms from '../../_permissions/sm-cms';

import ApiCategory from '../../sm-api/sm-cms/Category';
import './style/index.less';

let apiCategory = new ApiCategory();

export default {
  name: 'SmCmsCategories',
  props: {
    permissions: { type: Array, default: () => [] },
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      categories: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        title: '', // 标题搜索
        enable: CategoryEnable.All, //栏目状态
        maxResultCount: paginationConfig.defaultPageSize,
      },
      viewState: 'disable',
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' },
          ellipsis: true,
        },
        {
          title: '标识',
          dataIndex: 'code',
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
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'enable' },
        },
        {
          title: '排序',
          dataIndex: 'order',
          width: '65px',
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
      apiCategory = new ApiCategory(this.axios);
    },

    // 添加栏目
    add(parentId) {
      this.$refs.SmCmsCategoryModal.add(parentId);
    },

    //编辑
    edit(record) {
      this.$refs.SmCmsCategoryModal.edit(record);
    },

    // 查看
    view(record) {
      this.$refs.SmCmsCategoryModal.view(record);
    },

    // 删除
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{record.children && record.children.length > 0 ? '确定要删除该栏目，此操作会删除该栏目下子栏目？' : tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiCategory.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.refresh(false);
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },

    // 刷新列表
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
        let _categories = deleteEmptyProps(response.data.items, 'children', ['children']);
        _categories = this.sortByOrder(_categories);
        this.categories = _categories;
        this.totalCount = response.data.totalCount;
       
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

    // 缩略图浏览
    viewFile(file) {
      this.$refs.ThumbView.view(file);
    },

    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    // 编辑栏目启用状态
    async onChange(checked, record) {
      let response = await apiCategory.updateEnable({ id: record.id, enable: checked });
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
      <div class="sm-cms-categories">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.title = '';
            this.queryParams.enable = CategoryEnable.All;
            this.refresh();
          }}
        >
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
              vP(this.permissions, permissionsSmCms.Categories.Create),
            )}
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.categories}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                let result = `${index +
                  1 +
                  this.queryParams.maxResultCount * (this.pageIndex - 1)}. ${text}`;
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
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
                  vP(this.permissions, permissionsSmCms.Categories.UpdateEnable),
                );
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
                          this.add(record.id);
                        }}
                      >
                        增加子项
                      </a>,
                      vP(this.permissions, permissionsSmCms.Categories.Create),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmCms.Categories.Create) &&
                      vP(this.permissions, [permissionsSmCms.Categories.Update, permissionsSmCms.Categories.Detail, permissionsSmCms.Categories.Delete]),
                    )}
                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.view(record);
                                }}
                              >
                                详情
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmCms.Categories.Detail),
                          )}
                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.edit(record);
                                }}
                              >
                                编辑
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmCms.Categories.Update),
                          )}
                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.remove(record);
                                }}
                              >
                                删除
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmCms.Categories.Delete),
                          )}
                        </a-menu>
                      </a-dropdown>,

                      vP(this.permissions, [permissionsSmCms.Categories.Update, permissionsSmCms.Categories.Detail, permissionsSmCms.Categories.Delete]),

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
        <SmCmsCategoryModal
          ref="SmCmsCategoryModal"
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
