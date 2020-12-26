// 文件共享和权限模态选择框
import SmSystemOrganizationTree from '../../../../sm-system/sm-system-organization-tree';
import SmSystemMemberModalRoles from '../../../../sm-system/sm-system-member-modal/src/SmSystemMemberModalRoles';
import SmSystemMemberModalUsers from '../../../../sm-system/sm-system-member-modal/src/SmSystemMemberModalUsers';
import { ModalStatus, MemberType } from '../../../../_utils/enum';
import { treeArrayToFlatArray } from '../../../../_utils/tree_array_tools';
import ApiOrganization from '../../../../sm-api/sm-system/Organization';
import ApiRole from '../../../../sm-api/sm-system/Role';
import ApiMember from '../../../../sm-api/sm-system/Member';
import ApiFileManage from '../../../../sm-api/sm-file/fileManage';
import SmFilePermissonCheck from './SmFilePermissonCheck';
import { requestIsSuccess } from '../../../../_utils/utils';
import { FileModalType } from '../common';
let apiOrganization = new ApiOrganization();
let apiRole = new ApiRole();
let apiMember = new ApiMember();
let apiFileManage = new ApiFileManage();
export default {
  name: 'SmFileSharePromissionModal',
  props: {
    axios: { type: Function, default: null },
    title: { type: String, default: '文件' },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 当前状态
      organizations: [],
      roles: [],
      members: [],
      iSelected: [],
      permission: null, // 权限对象数据
      record: null, // 当前的记录
      modalType: FileModalType.Share,
    };
  },
  computed: {
    visible() {
      return this.status != ModalStatus.Hide;
    },
    organizationsFlat() {
      return treeArrayToFlatArray([...this.organizations]);
    },
    selectedUsers() {
      return this.iSelected.filter(item => item.type === MemberType.User);
    },
    selectedRoles() {
      return this.iSelected.filter(item => item.type === MemberType.Role);
    },
    selectedOrganizations() {
      return this.iSelected.filter(item => item.type === MemberType.Organization);
    },
  },
  watch: {},
  created() {
    this.initAxios();
    this.initOrganizations();
  },
  methods: {
    async initOrganizations() {
      let response = await apiOrganization.getList();
      if (requestIsSuccess(response)) {
        this.organizations = response.data.items;
      }
    },
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
      apiRole = new ApiRole(this.axios);
      apiMember = new ApiMember(this.axios);
      apiFileManage = new ApiFileManage(this.axios);
    },
    // 激活组件
    active(record, modalType) {
      this.iSelected=[];
      this.modalType = modalType;
      this.record = record;
      this.status = ModalStatus.Add;
      if (modalType == FileModalType.Share) this.getPermission(record.resourceType==1?record.folderShares:record.fileShares);
      if (modalType == FileModalType.Permission) this.getPermission(record.resourceType==1?record.folderPermissions:record.filePermissions);
    },
    // 确认事件
    async ok() {
      console.log(this.iSelected);

      let organizations = [];
      let rolers = [];
      let users = [];
      this.iSelected.forEach(item => {
        if (item.type === MemberType.Organization) organizations.push(item.id);
        if (item.type === MemberType.Role) rolers.push(item.id);
        if (item.type === MemberType.User) users.push(item.id);
      });
      let data = {
        type: this.record.resourceType,
        id: this.record.id,
        organizations,
        rolers,
        users,
        ...this.permission,
      };
      console.log(data);

      switch (this.modalType) {
      case FileModalType.Share: {
        let response = await apiFileManage.SetResourceShare(data);
        if (requestIsSuccess(response)) {
          console.log(response);
          this.$emit('success'); // 提交成功事件
          this.close();
          this.$message.success('文件共享成功');
        }
        break;
      }
      case FileModalType.Permission: {
        let response = await apiFileManage.setResourcePermission(data);
        if (requestIsSuccess(response)) {
          console.log(response);
          this.$emit('success'); // 提交成功事件
          this.close();
          this.$message.success('权限添加成功');
        }
      }
        break;
      default:
        break;
      }
    },
    // 关闭
    close() {
      this.selectValue = null;
      this.status = ModalStatus.Hide;
    },
    // 获取标题
    getTitle() {
      switch (this.modalType) {
      case FileModalType.Share:
        return `共享(${this.title})`;
      case FileModalType.Permission:
        return `权限(${this.title})`;
      default:
        return '';
      }
    },
    // 成员选中
    onCheck(ids, type) {
      this.iSelected = [
        ...ids.map(id => {
          return { id, type };
        }),
        ...this.iSelected.filter(item => item.type != type),
      ];
    },
    getPermission(datas) {
      if (datas && datas.length > 0) {
        this.iSelected = datas.map(a => {
          return { id: a.memberId, type: a.type };
        });
        let state = {
          edit: [],
          view: [],
          delete: [],
          use: [],
        };
        datas.forEach(a => {
          state.edit.push(a.edit);
          state.view.push(a.view);
          state.delete.push(a.delete);
          state.use.push(a.use);
        });
        this.permission = {
          edit: !state.edit.includes(false),
          view: !state.view.includes(false),
          delete: !state.delete.includes(false),
          use: !state.use.includes(false),
        };
      } else {
        this.permission = null;
      }
      console.log(this.permission);
    },
  },
  render() {
    return (
      <a-modal
        title={this.getTitle()}
        onOk={this.ok}
        class="sm-file-member-modal"
        visible={this.visible}
        onCancel={this.close}
        width={600}
      >
        <div class="panel modal-list">
          <a-tabs>
            <a-tab-pane key="1" forceRender>
              <span slot="tab">
                <a-icon type="apartment" style="color:#f4222d;" />
                组织
                {this.selectedOrganizations.length > 0
                  ? ` (${this.selectedOrganizations.length})`
                  : ''}
              </span>
              <div class="panel-body">
                <SmSystemOrganizationTree
                  style="width: 100%"
                  defaultExpandAll
                  checkable
                  treeData={this.organizations}
                  checkedKeys={this.selectedOrganizations.map(item => item.id)}
                  onCheck={ids => {
                    this.onCheck(ids, MemberType.Organization);
                  }}
                />
              </div>
            </a-tab-pane>

            <a-tab-pane key="2" forceRender>
              <span slot="tab">
                <a-icon type="usergroup-add" style="color:#fa8b15;" />
                角色
                {this.selectedRoles.length > 0 ? ` (${this.selectedRoles.length})` : ''}
              </span>
              <div class="panel-body">
                <SmSystemMemberModalRoles
                  blockNode
                  checkable
                  axios={this.axios}
                  defaultExpandAll
                  organizations={this.organizations}
                  checkedKeys={this.selectedRoles.map(item => item.id)}
                  onCheck={ids => {
                    this.onCheck(ids, MemberType.Role);
                  }}
                />
              </div>
            </a-tab-pane>

            <a-tab-pane key="3" forceRender>
              <span slot="tab">
                <a-icon type="user" style="color:#1890ff;" />
                用户
                {this.selectedUsers.length > 0 ? ` (${this.selectedUsers.length})` : ''}
              </span>
              <div class="panel-body">
                <SmSystemMemberModalUsers
                  blockNode
                  checkable
                  axios={this.axios}
                  defaultExpandAll
                  organizations={this.organizations}
                  checkedKeys={this.selectedUsers.map(item => item.id)}
                  onCheck={ids => {
                    this.onCheck(ids, MemberType.User);
                  }}
                />
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div>
          <SmFilePermissonCheck
            type={this.modalType}
            value={this.permission}
            onChange={result => {
              this.permission = result;
            }}
          />
        </div>
      </a-modal>
    );
  },
};
