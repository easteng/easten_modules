import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vPermission, vIf, vP } from '../../_utils/utils';

import SmSystemRoleModal from './SmSystemRoleModal';
import SmSystemRoleAuthoriseModal from './SmSystemRoleAuthoriseModal';
import permissionsSmSystem from '../../_permissions/sm-system';
import ApiRole from '../../sm-api/sm-system/Role';

import OrganizationTreeSelect from '../sm-system-organization-tree-select';

let apiRole = new ApiRole();

export default {
  name: 'SmSystemRoles',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: false },
    permissionBlackList: { type: Array, default: () => [] },   //权限黑名单
  },
  data() {
    return {
      roles: [], // 列表数据源
      totalCount: 0, // 数据源总数
      pageIndex: 1, // 当前页面
      queryParams: {
        organizationId: null,
        // skipCount: 0, // 一页跳过查询的记录数
        maxResultCount: paginationConfig.defaultPageSize, // 每页显示的记录数
      },
      form: this.$form.createForm(this),
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
          title: '名称', //列头显示文字
          dataIndex: 'name', //列数据在数据项中对应的 key
        },
        {
          title: '公开',
          dataIndex: 'isPublic',
          scopedSlots: { customRender: 'isPublic' },
        },
        {
          title: '默认',
          dataIndex: 'isDefault',
          scopedSlots: { customRender: 'isDefault' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
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
      apiRole = new ApiRole(this.axios);
    },

    // 刷新列表
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiRole.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      console.log(this.pageIndex);
      if (requestIsSuccess(response) && response.data) {
        this.roles = response.data.items;
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
    },

    // 分页变更
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    // 添加
    add() {
      this.$refs.SmSystemRoleModal.add();
    },

    // 编辑
    edit(record) {
      this.$refs.SmSystemRoleModal.edit(record);
    },

    // 编辑角色授权
    editAuthorizations(record) {
      this.$refs.SmSystemRoleAuthoriseModal.authorized(record);
    },

    // 详情
    view(record) {
      this.$refs.SmSystemRoleModal.view(record);
    },

    // 删除
    remove(record) {
      const _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          // 删除角色业务逻辑
          return new Promise(async (resolve, reject) => {
            let response = await apiRole.remove(record.id);
            _this.refresh(false, _this.pageIndex);

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
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
            this.queryParams.organizationId = null;
            this.queryParams.filter = '';
            this.refresh();
          }}
        >
          <a-form-item label="组织机构">
            <OrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.organizationId}
              onInput={value => {
                this.queryParams.organizationId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          {!this.queryParams.organizationId && this.roles.length == 0 ? '' :
            <template slot="buttons">
              {vIf(
                <a-button type="primary" icon="plus" onClick={this.add}>
                  添加
                </a-button>,
                vP(this.permissions, permissionsSmSystem.Roles.Create),
              )}
            </template>}
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.roles}
          bordered={this.bordered}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              isPublic: (text, record) => {
                let arr = [text];
                let displayText = text === true ? '是' : '否';
                arr.push(displayText);
                return arr;
              },
              isDefault: (text, record) => {
                let arr = [text];
                let displayText = text === true ? '是' : '否';
                arr.push(displayText);
                return arr;
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
                                    this.editAuthorizations(record);
                                  }}
                                >
                                  分配权限
                                </a>
                              </a-menu-item>,
                              vP(this.permissions, permissionsSmSystem.Roles.ManagePermissions),
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
                              vP(this.permissions, permissionsSmSystem.Roles.Update),
                            )}

                            {vIf(
                              !(record && record.isStatic) ?
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.remove(record);
                                    }}
                                  >
                                    删除
                                  </a>
                                </a-menu-item> : undefined,
                              vP(this.permissions, permissionsSmSystem.Roles.Delete),

                            )}
                          </a-menu>
                        </a-dropdown>
                      </div>,
                      vP(this.permissions, [permissionsSmSystem.Roles.ManagePermissions, permissionsSmSystem.Roles.Update, permissionsSmSystem.Roles.Delete]),

                    )}
                  </span>,
                ];
              },
            },
          }}
        />

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
        <SmSystemRoleModal
          ref="SmSystemRoleModal"
          organizationId={this.queryParams.organizationId}
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

        {/* 角色授权模板 */}
        <SmSystemRoleAuthoriseModal ref="SmSystemRoleAuthoriseModal" axios={this.axios} permissionBlackList={this.permissionBlackList} />
      </div>
    );
  },
};
