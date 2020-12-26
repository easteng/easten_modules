import './style/index.less';
import { requestIsSuccess, CreateGuid } from '../../_utils/utils';
import { MemberType } from '../../_utils/enum';
import { treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import SmSystemOrganizationTree from '../sm-system-organization-tree';
import SmSystemMemberModalRoles from './src/SmSystemMemberModalRoles';
import SmSystemMemberModalUsers from './src/SmSystemMemberModalUsers';
import SmSystemMemberModalDynamic from './src/SmSystemMemberModalDynamic';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import ApiRole from '../../sm-api/sm-system/Role';
import ApiMember from '../../sm-api/sm-system/Member';
let apiOrganization = new ApiOrganization();
let apiRole = new ApiRole();
let apiMember = new ApiMember();

export default {
  name: 'SmSystemMemberModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false },
    placeholder: { type: String, default: '点击选择成员' },
    selected: {
      type: Array,
      default: () => [],
    },
    showDynamicTab: { type: Boolean, default: false }, // 是否显示动态成员或组织
    showUserTab: { type: Boolean, default: false }, // 是否只显示用户选择
  },
  data() {
    return {
      organizations: [],
      roles: [],
      members: [],
      dynamicOrg: [],
      iSelected: [],
    };
  },
  computed: {
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
    // 动态成员
    selectedDynamic() {
      return this.iSelected.filter(item => item.dtype === MemberType.DynamicType);
    },
  },
  watch: {
    selected: {
      handler: function (data) {
        this.iSelected = data || [];
      },
      immediate: true,
    },
    iSelected: function () {
      this.initMembers();
    },
    visible: {
      handler: function () {
        if (this.visible) {
          this.iSelected = this.selected;
        }
      },
    },
  },
  async created() {
    this.initAxios();
    this.initOrganizations();
    this.initRoles();
    this.initMembers();
    this.initDynamicOrg();
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
      apiRole = new ApiRole(this.axios);
      apiMember = new ApiMember(this.axios);
    },
    async initOrganizations() {
      let response = await apiOrganization.getList();
      if (requestIsSuccess(response)) {
        this.organizations = response.data.items;
      }
    },
    async initRoles() {
      let response = await apiRole.getList();
      if (requestIsSuccess(response)) {
        this.roles = response.data.items;
      }
    },
    // 获取动态的数据
    initDynamicOrg() {
      let result = Array.from(Object.keys(MemberType)).filter(
        a => a.indexOf('DynamicOrgLevel') != -1,
      );
      let level = result.map(a => {
        return { name: `动态组织${MemberType[a] - 20}级`, id: CreateGuid(), type: MemberType[a] };
      });
      this.dynamicOrg = level;
    },
    getDynamicType(id) {
      return this.dynamicOrg.find(a => a.id == id).type;
    },
    remove(item) {
      let iSelected = [...this.iSelected];
      iSelected.splice(this.iSelected.indexOf(item), 1);
      this.iSelected = [...iSelected];
    },
    async initMembers() {
      let response = await apiMember.search({
        memberInfos: this.iSelected,
      });
      if (requestIsSuccess(response)) {
        this.members = response.data;
      }
    },
    getSelectedName(selectedItem) {
      let target = this.members.find(item => item.id === selectedItem.id);
      return target ? target.name : '';
    },
    onCheck(ids, type) {
      if (type === MemberType.DynamicType) {
        this.iSelected = [
          ...ids.map(id => {
            let _type = this.getDynamicType(id);
            return { id, type: _type, dtype: MemberType.DynamicType };
          }),
          ...this.iSelected.filter(item => item.dtype != type),
        ];
      } else {
        this.iSelected = [
          ...ids.map(id => {
            return { id, type };
          }),
          ...this.iSelected.filter(item => item.type != type),
        ];
      }
    },
    onOk() {
      this.$emit('ok', this.iSelected);
      this.onClose();
    },
    onClose() {
      this.$emit('change', false);
    },
  },
  render() {
    return (
      <a-modal
        width={600}
        title="成员选择"
        class="sm-system-member-modal"
        visible={this.visible}
        onChange={value => {
          this.$emit('change', value);
        }}
        onOk={this.onOk}
      >
        <div class="selected">
          {this.iSelected.length <= 0 ? (
            <span class="empty">{this.placeholder}</span>
          ) : (
            <div>
              {this.selectedOrganizations.map(item => {
                return (
                  <div class="selected-item">
                    <a-icon style={{ color: '#f4222d' }} type={'apartment'} />
                    <span> {this.getSelectedName(item)} </span>
                    <span
                      class="btn-close"
                      onClick={() => {
                        this.remove(item);
                      }}
                    >
                      <a-icon type="close" />
                    </span>
                  </div>
                );
              })}
              {this.selectedRoles.map(item => {
                return (
                  <div class="selected-item">
                    <a-icon style={{ color: '#fa8b15' }} type={'usergroup-add'} />
                    <span> {this.getSelectedName(item)} </span>
                    <span
                      class="btn-close"
                      onClick={() => {
                        this.remove(item);
                      }}
                    >
                      <a-icon type="close" />
                    </span>
                  </div>
                );
              })}
              {this.selectedUsers.map(item => {
                return (
                  <div class="selected-item">
                    <a-icon style={{ color: '#1890ff' }} type={'user'} />
                    <span> {this.getSelectedName(item)} </span>
                    <span
                      class="btn-close"
                      onClick={() => {
                        this.remove(item);
                      }}
                    >
                      <a-icon type="close" />
                    </span>
                  </div>
                );
              })}
              {this.selectedDynamic.map(item => {
                return (
                  <div class="selected-item">
                    <a-icon style={{ color: '#1890ff' }} type={'user'} />
                    <span> {`动态组织${item.type - 20}级`} </span>
                    <span
                      class="btn-close"
                      onClick={() => {
                        this.remove(item);
                      }}
                    >
                      <a-icon type="close" />
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div class="panel modal-list">
          <a-tabs>
            {this.showUserTab ? <a-tab-pane key="3" forceRender>
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
            </a-tab-pane> : [<a-tab-pane key="1" forceRender>
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
            </a-tab-pane>,

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
            </a-tab-pane>,

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
            </a-tab-pane>,
            this.showDynamicTab ? (
              <a-tab-pane key="4" forceRender>
                <span slot="tab">
                  <a-icon type="user" style="color:#1890ff;" />
                  动态选择
                  {this.selectedDynamic.length > 0 ? ` (${this.selectedDynamic.length})` : ''}
                </span>
                <div class="panel-body">
                  <SmSystemMemberModalDynamic
                    checkedKeys={this.selectedDynamic.map(item => item.id)}
                    dynamicOrg={this.dynamicOrg}
                    onCheck={ids => {
                      this.onCheck(ids, MemberType.DynamicType);
                    }}
                  />
                </div>
              </a-tab-pane>
            ) : null,
            ]}

          </a-tabs>
        </div>
      </a-modal>
    );
  },
};
