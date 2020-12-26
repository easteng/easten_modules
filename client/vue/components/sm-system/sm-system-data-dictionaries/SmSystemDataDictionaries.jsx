import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vPermission, vIf, vP } from '../../_utils/utils';
import { deleteEmptyProps } from '../../_utils/tree_array_tools';

import SmSystemDataDictionaryModal from './SmSystemDataDictionaryModal';
import permissionsSmSystem from '../../_permissions/sm-system';
import ApiDataDictionary from '../../sm-api/sm-system/DataDictionary';
let apiDataDictionary = new ApiDataDictionary();

export default {
  name: 'SmSystemDataDictionaries',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      dataDictionaries: [], // 列表数据源
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        name: '', // 搜索关键字
      },
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '字典值',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '标识',
          dataIndex: 'key',
          ellipsis: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'order',
          width: '65px',
          ellipsis: true,
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
      apiDataDictionary = new ApiDataDictionary(this.axios);
    },

    // 添加子集数据字典
    add(record) {
      this.$refs.SmSystemDataDictionaryModal.add(record.id, record.key);
    },

    edit(record) {
      this.$refs.SmSystemDataDictionaryModal.edit(record);
    },

    view(record) {
      this.$refs.SmSystemDataDictionaryModal.view(record);
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiDataDictionary.delete(record.id);
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
        this.pageSize = paginationConfig.defaultPageSize;
      }

      let response = await apiDataDictionary.getTreeList(this.queryParams);
      if (requestIsSuccess(response) && response.data) {
        this.dataDictionaries = deleteEmptyProps(response.data, 'children', ['children']);
      }

      this.loading = false;
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
    },
  },
  render() {
    return (
      <div>
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
          <a-form-item label="字典名称">
            <a-input
              placeholder="请输入字典名称"
              value={this.queryParams.name}
              onInput={event => {
                this.queryParams.name = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.dataDictionaries}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={{
            showTotal: paginationConfig.showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            defaultPageSize: paginationConfig.defaultPageSize,
            current: this.pageIndex,
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,
          }}
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                return `${index + 1 + this.pageSize * (this.pageIndex - 1)}. ${text}`;
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.add(record);
                        }}
                      >
                        添加子项
                      </a>,
                      vP(this.permissions, permissionsSmSystem.DataDictionary.Create)
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmSystem.DataDictionary.Create) &&
                      vP(this.permissions, [permissionsSmSystem.DataDictionary.Update, permissionsSmSystem.DataDictionary.Delete])
                    )}

                    {record.isStatic ? (
                      <a
                        onClick={() => {
                          this.view(record);
                        }}
                      >
                        详情
                      </a>
                    ) : (
                        vIf(
                          <a-dropdown trigger={['click']}>
                            <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                              更多 <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                              <a-menu-item>
                                <a
                                  onClick={() => {
                                    this.view(record);
                                  }}
                                >
                                  详情
                                </a>
                              </a-menu-item>
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
                                vP(this.permissions, permissionsSmSystem.DataDictionary.Update,)
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
                                vP(this.permissions, permissionsSmSystem.DataDictionary.Delete)
                              )}
                            </a-menu>
                          </a-dropdown>,
                          vP(this.permissions, [permissionsSmSystem.DataDictionary.Update, permissionsSmSystem.DataDictionary.Delete])
                        )
                      )}
                  </span>,
                ];
              },
            },
          }}
        ></a-table>

        {/* 添加/编辑模板 */}
        <SmSystemDataDictionaryModal
          ref="SmSystemDataDictionaryModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
