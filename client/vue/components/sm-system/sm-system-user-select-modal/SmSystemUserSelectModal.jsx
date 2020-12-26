import './style';
import { requestIsSuccess } from '../../_utils/utils';
import { MemberType } from '../../_utils/enum';
import SmSystemUserModal from './src/SmSystemUserModal';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import ApiMember from '../../sm-api/sm-system/Member';
let apiOrganization = new ApiOrganization();
let apiMember = new ApiMember();

export default {
  name: 'SmSystemUserSelectModal',
  props: {
    axios: { type: Function, default: null },
    showButton: { type: Boolean, default: true }, // 显示添加用户按钮
    selectedKey: { type: Array, default: () => [] },
  },
  data() {
    return {
      visible: false,
      organizations: [],
      roles: [],
      members: [],
      iSelected: [],
    };
  },
  computed: {
    selectedUsers() {
      return this.iSelected;
    },
  },
  watch: {
    selectedKey: {
      handler: function(values) {
        this.iSelected = [];
        if (values.length > 0) {
          values.map(value => {
            if (value) this.iSelected.push({ id: value, type: MemberType.User });
          });
        }
      },
      immediate: true,
    },
    iSelected: function() {
      this.initMembers();
    },
  },
  async created() {
    this.initAxios();
    await this.initOrganizations();
    await this.initMembers();
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
      apiMember = new ApiMember(this.axios);
    },
    async initOrganizations() {
      let response = await apiOrganization.getTreeList(this.queryParams);
      if (requestIsSuccess(response)) {
        this.organizations = response.data;
      }
    },
    async initMembers() {
      let response = await apiMember.search({
        memberInfos: this.iSelected,
      });
      if (requestIsSuccess(response)) {
        this.members = response.data;
      }
    },
    remove(item) {
      let iSelected = [...this.iSelected];
      iSelected.splice(this.iSelected.indexOf(item), 1);
      this.iSelected = [...iSelected];
    },
    getSelectedName(selectedItem) {
      let target = this.members.find(item => item.id === selectedItem.id);
      return target ? target.name : '';
    },
    onOk() {
      this.$emit('checked', this.iSelected.map(item=>item.id));
      this.visible = false;
    },
  },
  render() {
    return (
      <div class="sm-system-user-select-modal">
        <div
          class="div-input"
          onClick={() => {
            this.visible = this.showButton;
          }}
        >
          {this.selectedUsers && this.selectedUsers.length > 0 ? (
            this.selectedUsers.map(item => {
              let tag = this.getSelectedName(item);
              return (
                <a-tag size="small" style="margin-bottom:1px;">
                  {tag}{' '}
                </a-tag>
              );
            })
          ) : (
            <span style="margin-left:5px;">请选择人员</span>
          )}
          {/* <a-tag
            size="small"
            color="blue"
            v-show={this.showButton}
            onClick={() => {
              this.visible = true;
            }}
          >
            <a-icon type="user-add" />
          </a-tag> */}
        </div>

        <a-modal
          width={600}
          title="成员选择"
          class="sm-system-member-modal"
          visible={this.visible}
          onChange={() => {
            this.visible = false;
          }}
          onOk={this.onOk}
        >
          <div class="selected">
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
          </div>
          <div class="panel modal-list">
            <div class="panel-body">
              <SmSystemUserModal
                blockNode
                checkable
                axios={this.axios}
                defaultExpandAll
                organizations={this.organizations}
                checkedKeys={this.selectedUsers.map(item => item.id)}
                onCheck={ids => {
                  let type = MemberType.User;
                  this.iSelected = [
                    ...ids.map(id => {
                      return { id, type };
                    }),
                  ];

                  this.$emit('checked', ids);
                }}
              />
            </div>
          </div>
        </a-modal>
      </div>
    );
  },
};
