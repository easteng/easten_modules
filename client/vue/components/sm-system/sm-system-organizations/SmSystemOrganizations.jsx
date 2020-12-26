import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vPermission, vIf, vP } from '../../_utils/utils';
import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmExport from '../../sm-common/sm-export-module';

import SmSystemOrganizationModal from './SmSystemOrganizationModal';
import SmSystemOrganizationImportModal from './SmSystemOrganizationImportModal';
import SmSyatemOrganizationBatchUpdateTypeModal from './SmSyatemOrganizationBatchUpdateTypeModal';
import permissionsSmSystem from '../../_permissions/sm-system';
import ApiOrganization from '../../sm-api/sm-system/Organization';
let apiOrganization = new ApiOrganization();

export default {
  name: 'SmSystemOrganizations',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      date: null,
      organizations: [], // 列表数据源
      topOrganizations: [], // 顶级组织机构
      checkedOrgIds: [],//选中的组织机构id
      checkedOrgs: [],//选中的组织机构
      pageSize: paginationConfig.defaultPageSize,
      pageIndex: 1,
      queryParams: {
        name: '', // 搜索关键字 KeyWords
        parentId: null,
        isAll: false,
      },
      loading: false,
      fileList: [],
      record: null,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '全称',
          dataIndex: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '类型',
          dataIndex: 'type',
          ellipsis: true,
          scopedSlots: { customRender: 'type' },
        },
        {
          title: 'CSRG编码',
          dataIndex: 'csrgCode',
        },
        {
          title: '排序',
          dataIndex: 'order',
          width: 90,
          align: 'center',
        },
        {
          title: '简介',
          ellipsis: true,
          width: 150,
          dataIndex: 'description',
        },
        {
          title: '备注',
          ellipsis: true,
          width: 120,
          dataIndex: 'remark',
        },

        {
          title: '操作',
          width: 140,
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
      apiOrganization = new ApiOrganization(this.axios);
    },

    // 添加
    add(record) {
      this.record = record;
      this.$refs.SmSystemOrganizationModal.add(record);
    },

    // 编辑
    edit(record) {
      this.record = record;
      this.$refs.SmSystemOrganizationModal.edit(record);
    },

    view(record) {
      this.$refs.SmSystemOrganizationModal.view(record);
    },

    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'organizations',
      };
      // 执行文件上传    
      await this.$refs.SmImport.exect(importParamter);
    },

    async remove(record) {
      this.record = record;
      let _this = this;
      let removeContent = tipsConfig.remove.content;
      let hasUsersResponse = await apiOrganization.hasUsers(record.id);
      if (requestIsSuccess(hasUsersResponse)) {
        if (hasUsersResponse.data == true) {
          removeContent = '该组织机构下有用户，确定要删除？';
        }
      }
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{removeContent}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiOrganization.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.queryParams.parentId = null;
              _this.$message.success('操作成功');
              _this.refresh(false);
            }
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    // 刷新列表
    async refresh(reset = true, parent = null) {
      if (parent === null) {
        this.organizations = [];
      }
      this.loading = true;
      if (reset) {
        this.pageIndex = 1;
        this.pageSize = paginationConfig.defaultPageSize;
      }
      let response = await apiOrganization.getList(this.queryParams);
      if (requestIsSuccess(response) && response.data) {
        if (parent) {
          parent.children = response.data.items;
        } else {
          this.organizations = response.data.items;
        }
      }
      this.loading = false;
      this.record = null;
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
    },
    //印章选择
    fileOk(data) {
      this.sealUrl = data.url;
    },
    async export() {
      let config = {
        templateKey: 'organizations',
        rowIndex: 3,
      };
      let response = await apiOrganization.export(config);
      if (requestIsSuccess(response)) {
        debugger;
      }
    },

    //批量编辑组织机构类型
    batchUpdateOrgType() {
      if (this.checkedOrgs.length == 0) {
        this.$message.warning('请先勾选组织机构');
        return;
      }
      this.$refs.SmSyatemOrganizationBatchUpdateTypeModal.show(this.checkedOrgs);
    },
  },
  render() {
    return (
      <div>
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.queryParams.parentId = null;
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.keyWords = '';
            this.queryParams.parentId = undefined;
            this.refresh();
          }}
        >
          <a-form-item label="组织名称">
            <a-input
              allowClear
              placeholder="请输入组织名称"
              value={this.queryParams.keyWords}
              onInput={event => {
                if ([null, undefined, ''].indexOf(event.target.value) > -1) {
                  this.queryParams.parentId = null;
                }
                this.queryParams.keyWords = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <template slot="buttons">
            <div style={'display:flex'}>
              {vIf(
                <a-button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.add(null);
                  }}
                >
                  添加
                </a-button>,
                vP(this.permissions, permissionsSmSystem.Organization.Create),
              )}
              {vIf(
                <SmImport
                  ref="SmImport"
                  url='api/app/appOrganization/import'
                  axios={this.axios}
                  downloadErrorFile={true}
                  importKey="organizations"
                  onIsSuccess={() => {
                    this.queryParams.parentId = null;
                    this.refresh();
                  }}
                  onSelected={file => this.fileSelected(file)}
                />,
                vP(this.permissions, permissionsSmSystem.Organization.Import),
              )}
              {vIf(
                <a-button
                  type="primary"
                  icon="sync"
                  onClick={() => {
                    this.batchUpdateOrgType();
                  }}
                >
                  批量编辑组织类型
                </a-button>,
                vP(this.permissions, permissionsSmSystem.Organization.Update),
              )}
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  downloadKey="organizations"
                  downloadFileName="组织机构"
                >
                </SmTemplateDownload>,
                vP(this.permissions, permissionsSmSystem.Organization.Import),
              )}
              {vIf(
                <SmExport
                  axios={this.axios}
                  url='api/app/appOrganization/export'
                  templateName="organizations"
                  downloadFileName="组织机构"
                  rowIndex={5}
                >
                </SmExport>,
                vP(this.permissions, permissionsSmSystem.Organization.Export),
              )}
              {/* <a-button onClick={()=>this.export()}>导出</a-button> */}
            </div>
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          ref="dataTable"
          columns={this.columns}
          dataSource={this.organizations}
          rowKey={record => record.id}
          rowSelection={{
            type: 'checkbox',
            columnWidth: 30,
            selectedRowKeys: this.checkedOrgIds,
            onChange: (selectedRowKeys, selectedRows) => {
              this.checkedOrgIds = selectedRowKeys;
              this.checkedOrgs = selectedRows;
            },
          }}
          bordered={this.bordered}
          onExpand={(expanded, record) => {
            if (expanded && record.children.length == 0) {
              this.queryParams.name = '';
              this.queryParams.parentId = record.id;
              this.refresh(false, record);
            }
          }}
          pagination={{
            showTotal: paginationConfig.showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: this.pageSize,
            current: this.pageIndex,
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,
          }}
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={`${index + 1 + this.pageSize * (this.pageIndex - 1)}. ${text}`}
                  >
                    {`${index + 1 + this.pageSize * (this.pageIndex - 1)}. ${text}`}
                  </a-tooltip>
                );
              },
              type: (text, record, index) => {
                return (
                  record.type == null ? '' : record.type.name
                );
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
                    {vIf(
                      <div style="display: contents;">
                        <a-divider type="vertical" />
                        <a-dropdown trigger={['click']}>
                          <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            更多 <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">

                            {vIf(
                              <a-menu-item>
                                <a
                                  onClick={() => {
                                    this.add(record);
                                  }}
                                >
                                  添加子项
                                </a>
                              </a-menu-item>,
                              vP(this.permissions, permissionsSmSystem.Organization.Create),
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
                              vP(this.permissions, permissionsSmSystem.Organization.Update),
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
                              vP(this.permissions, permissionsSmSystem.Organization.Delete),
                            )}
                          </a-menu>
                        </a-dropdown>
                      </div>,
                      vP(this.permissions, [permissionsSmSystem.Organization.Create, permissionsSmSystem.Organization.Update, permissionsSmSystem.Organization.Delete]),

                    )}
                  </span>,
                ];
              },
            },
          }}
        />

        {/* 添加/编辑模板 */}
        <SmSystemOrganizationModal
          ref="SmSystemOrganizationModal"
          axios={this.axios}
          onSuccess={(action, data) => {
            this.queryParams.parentId = action === 'Add' ? this.record ? this.record.id : null : this.record.parentId;
            this.queryParams.parentId = null;
            this.refresh(false);
          }}
        />

        {/* 导入组织机构模态框 */}
        <SmSystemOrganizationImportModal
          ref="SmSystemOrganizationImportModal"
          axios={this.axios}
          organizations={this.topOrganizations}
          onSuccess={() => {
            this.queryParams = {
              name: '',
              parentId: null,
            };
            this.organizations = [];
            this.$nextTick(() => { this.refresh(); });
          }}
        />

        <SmSyatemOrganizationBatchUpdateTypeModal
          ref="SmSyatemOrganizationBatchUpdateTypeModal"
          axios={this.axios}
          onSuccess={(action, data) => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
