import moment from 'moment';
import ApiUser from '../../sm-api/sm-system/User';
import SmSystemUserModal from './SmSystemUserModal';
import SmSystemUserRolesModal from './SmSystemUserRolesModal';
import SmSystemUserPasswordModal from './SmSystemUserPasswordModal';

import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vPermission, vIf, vP } from '../../_utils/utils';
import OrganizationTreeSelect from '../sm-system-organization-tree-select';
import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmExport from '../../sm-common/sm-export-module';
import permissionsSmSystem from '../../_permissions/sm-system';
let apiUser = new ApiUser();
import './style/index.less';

export default {
  name: 'SmSystemUsers',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: false },
    isSimple: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    organizationId: { type: String, default: null },
    selected: { type: Array, default: () => [] },//所选数据ids
  },
  data() {
    return {
      users: [],
      iSelected: [],
      targetIds: [],//当前页所选中的Ids
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        organizationId: null,
        filter: '',
        sorting: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      isLoading: false,
      fileList: [],
    };
  },
  computed: {
    columns() {
      return this.isSimple ?
        [
          {
            title: '序号',
            dataIndex: 'index',
            width: 90,
            scopedSlots: { customRender: 'index' },
          },
          {
            title: '姓名',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
          },
        ] :
        [
          {
            title: '序号',
            dataIndex: 'index',
            width: 90,
            scopedSlots: { customRender: 'index' },
          },
          {
            title: '用户名',
            dataIndex: 'userName',
            scopedSlots: { customRender: 'userName' },
          },
          {
            title: '姓名',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            scopedSlots: { customRender: 'email' },
          },
          {
            title: '手机号',
            dataIndex: 'phoneNumber',
            scopedSlots: { customRender: 'phoneNumber' },
          },
          {
            title: '加入时间',
            dataIndex: 'creationTime',
            scopedSlots: { customRender: 'creationTime' },
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
  watch: {
    organizationId: {
      handler: function (val, oldVal) {
        if (this.isSimple) {
          this.queryParams.organizationId = val;
          this.initAxios();
          this.refresh();
        }
      },
      immediate: true,
    },
    selected: {
      handler: function (value, oldVal) {
        this.iSelected = value;
        this.targetIds = value;
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    add() {
      this.$refs.SmSystemUserModal.add();
    },
    edit(record) {
      this.$refs.SmSystemUserModal.edit(record);
    },
    editRoles(record) {
      this.$refs.SmSystemUserRolesModal.edit(record);
    },
    //修改密码
    editPassword(record) {
      this.$refs.SmSystemUserPasswordModal.edit(record);
    },
    view(record) {
      this.$refs.SmSystemUserModal.view(record);
    },
    initAxios() {
      apiUser = new ApiUser(this.axios);
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiUser.remove(record.id);
            _this.refresh(false, _this.pageIndex);

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
    removeFromOrganization(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.moveOut.title,
        content: h => <div style="color:red;">{tipsConfig.moveOut.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = null;
            response = await apiUser.removeFromOrganization({
              id: record.id,
              organizationId: _this.queryParams.organizationId,
            });
            _this.refresh();

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiUser.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        this.users = response.data.items;
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

    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'users',
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
    },

    //更新所选数据
    updateSelected() {
      // 过滤出其他页面已经选中的
      let _selected = [];
      for (let item of this.iSelected) {
        let target = this.users.find(subItem => subItem.id === item);
        if (!target) {
          _selected.push(item);
        }
      }

      // 把当前页面选中的加入
      for (let id of this.targetIds) {
        let user = this.users.find(item => item.id === id);
        if (!!user) {
          _selected.push(JSON.parse(JSON.stringify(user.id)));
        }
      }

      this.iSelected = _selected;
      this.$emit('change', this.iSelected);
    },
  },
  render() {
    return (
      <div class="sm-system-users" style="height:100%; display: flex; flex-direction: column; justify-content: space-between;">
        {/* 操作区 */}
        <div>
          {!this.isSimple ? <sc-table-operator
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
            <a-form-item label="关键词">
              <a-input
                placeholder="请输入用户名、姓名、邮箱"
                value={this.queryParams.filter}
                onInput={event => {
                  this.queryParams.filter = event.target.value;
                  this.refresh();
                }}
              />
            </a-form-item>
            {!this.queryParams.organizationId && this.users.length == 0 ? '' :
              <template slot="buttons">
                <div style={'display:flex'}>
                  {vIf(
                    <a-button type="primary" icon="plus" onClick={this.add}>
                      添加
                    </a-button>,
                    vP(this.permissions, permissionsSmSystem.Users.Create),
                  )}

                  {vIf(
                    <SmImport
                      ref="smImport"
                      url='api/app/appUser/upload'
                      axios={this.axios}
                      downloadErrorFile={true}
                      importKey="users"
                      onIsSuccess={() => this.refresh()}
                      onSelected={file => this.fileSelected(file)}
                    />,
                    vP(this.permissions, permissionsSmSystem.Users.Import),
                  )}
                  {vIf(
                    <SmTemplateDownload
                      axios={this.axios}
                      downloadKey="users"
                      downloadFileName="用户"
                    >
                    </SmTemplateDownload>,
                    vP(this.permissions, permissionsSmSystem.Users.Import),
                  )}
                  {vIf(
                    <SmExport
                      axios={this.axios}
                      url='api/app/appUser/export'
                      templateName="users"
                      downloadFileName="用户"
                      rowIndex={2}
                    >
                    </SmExport>,
                    vP(this.permissions, permissionsSmSystem.Users.Export),
                  )}
                </div>
              </template>}
          </sc-table-operator> : undefined}


          {/* 展示区 */}
          <a-table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.users}
            bordered={this.bordered}
            pagination={false}
            size={this.isSimple ? 'small' : 'default'}
            rowSelection={this.isSimple ? {
              type: this.multiple ? 'checkbox' : 'radio',
              columnWidth: 30,
              selectedRowKeys: this.iSelected,
              onChange: selectedRowKeys => {
                this.targetIds = selectedRowKeys;
                this.updateSelected();
              },
            } : undefined}
            loading={this.loading}
            scroll={this.isSimple ? { y: 140 } : undefined}
            {...{
              scopedSlots: {
                index: (text, record, index) => {
                  return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                },
                userName: (text, record) => {
                  return record.userName;
                },
                name: (text, record) => {
                  return record.name;
                },
                email: (text, record) => {
                  let arr = [record.email];
                  if (!record.emailConfirmed) {
                    arr.push(
                      <a-tag style="margin-left:10px; float:right" color="volcano">
                        未验证
                      </a-tag>,
                    );
                  }
                  return arr;
                },
                phoneNumber: (text, record) => {
                  let arr = [record.phoneNumber];
                  if (record && !record.phoneNumberConfirmed) {
                    arr.push(
                      <a-tag style="margin-left:10px; float:right" color="volcano">
                        未验证
                      </a-tag>,
                    );
                  }
                  return arr;
                },
                creationTime: (text, record) => {
                  return moment(text).format('YYYY-MM-DD HH:mm:ss');
                },
                operations: (text, record) => {
                  return [
                    <span>
                      {vIf(
                        <a
                          onClick={() => {
                            this.view(record);
                          }}
                        >
                          详情
                        </a>,
                        vP(this.permissions, permissionsSmSystem.Users.Detail),
                      )}

                      {vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions, permissionsSmSystem.Users.Detail) &&
                        vP(this.permissions, [permissionsSmSystem.Users.AssignRoles, permissionsSmSystem.Users.Update, permissionsSmSystem.Users.Delete]),
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
                                    this.editRoles(record);
                                  }}
                                >
                                  分配角色
                                </a>
                              </a-menu-item>,
                              vP(this.permissions, permissionsSmSystem.Users.AssignRoles),
                            )}
                            {vIf(
                              <a-menu-item>
                                <a
                                  onClick={() => {
                                    this.editPassword(record);
                                  }}
                                >
                                  重置密码
                                </a>
                              </a-menu-item>,
                              vP(this.permissions, permissionsSmSystem.Users.Reset),
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
                              vP(this.permissions, permissionsSmSystem.Users.Update),
                            )}

                            {vIf(
                              <a-menu-item>
                                {this.queryParams.organizationId ?
                                  <a
                                    onClick={() => {
                                      this.removeFromOrganization(record);
                                    }}
                                  >
                                    移出
                                  </a>
                                  :
                                  <a
                                    onClick={() => {
                                      this.remove(record);
                                    }}
                                  >
                                    删除
                                  </a>
                                }
                              </a-menu-item>,
                              vP(this.permissions, permissionsSmSystem.Users.Delete),
                            )}

                          </a-menu>
                        </a-dropdown>,
                        vP(this.permissions, [permissionsSmSystem.Users.AssignRoles, permissionsSmSystem.Users.Update, permissionsSmSystem.Users.Delete, permissionsSmSystem.Users.Reset]),
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
            showSizeChanger={!this.isSimple}
            showQuickJumper={!this.isSimple}
            size={this.isSimple ? 'small' : ''}
            showTotal={paginationConfig.showTotal}
          />

        </div>

        {this.isSimple && this.users.length > 0 ? <a-input-search
          style="margin:8px; width:95%;"
          size="small"
          enter-button
          placeholder="请输入关键字"
          value={this.queryParams.filter}
          onChange={event => {
            this.queryParams.filter = event.target.value;
            console.log(event);
            this.refresh();
          }}
          onSearch={this.refresh}
        /> : undefined}


        <SmSystemUserModal
          ref="SmSystemUserModal"
          axios={this.axios}
          bordered={this.bordered}
          organizationId={this.queryParams.organizationId}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        <SmSystemUserPasswordModal
          ref="SmSystemUserPasswordModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        <SmSystemUserRolesModal
          ref="SmSystemUserRolesModal"
          axios={this.axios}
          organizationId={this.queryParams.organizationId}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        {this.isLoading ? (
          <div style="position:fixed;left:0;right:0;top:0;bottom:0;z-index:9999;">
            <div style="position: relative;;top:45%;left:50%">
              <a-spin tip="Loading..." size="large"></a-spin>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
};
