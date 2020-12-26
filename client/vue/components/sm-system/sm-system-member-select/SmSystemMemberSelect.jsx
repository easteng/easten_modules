import './style/index.less';
import { requestIsSuccess } from '../../_utils/utils';
import { MemberType } from '../../_utils/enum';
import SmSystemMemberModal from '../sm-system-member-modal';
import ApiMember from '../../sm-api/sm-system/Member';
let apiMember = new ApiMember();

export default {
  name: 'SmSystemMemberSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    placeholder: { type: String, default: '点击选择成员' },
    value: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    showDynamicTab: { type: Boolean, default: false },// 是否显示动态负责人选择框
    bordered: { type: Boolean, default: true }, // 边框模式
    height: { type: Number, default: 100 }, // 当前选择框的大小
    showUserTab: { type: Boolean, default: false }, // 是否只显示用户选择
  },
  data() {
    return {
      members: [],
      modalVisible: false,
      iValue: [],
    };
  },
  computed: {
    selectedUsers() {
      return this.iValue.filter(item => item.type === MemberType.User);
    },
    selectedRoles() {
      return this.iValue.filter(item => item.type === MemberType.Role);
    },
    selectedOrganizations() {
      return this.iValue.filter(item => item.type === MemberType.Organization);
    },
    selectedDyncmicOrgs() {
      return this.iValue.filter(item => item.dtype === MemberType.DynamicType);
    },
  },
  watch: {
    value: {
      handler: function (data) {
        data.forEach(a => {
          if (a.dtype == undefined && a.type > 20 && a.type < 29) {
            a.dtype = MemberType.DynamicType;
          }
        });
        this.iValue = data || [];
      },
      immediate: true,
    },
    iValue: function () {
      this.initMembers();
    },
  },
  async created() {
    this.initAxios();
    this.initMembers();
  },
  methods: {
    initAxios() {
      apiMember = new ApiMember(this.axios);
    },
    async initMembers() {
      let response = await apiMember.search({
        memberInfos: this.iValue,
      });
      if (requestIsSuccess(response)) {
        this.members = response.data;
      }
    },
    getSelectedName(selectedItem) {
      let target = this.members.find(item => item.id === selectedItem.id);
      return target ? target.name : '';
    },
  },
  render() {
    return (
      <div
        class={{
          'sm-system-member-select': true,
          disabled: this.disabled,
          bordered: this.bordered,
        }}
        style={{
          height: this.bordered ? this.height + 'px' : 'auto',
        }}
        onClick={() => {
          if (!this.disabled) {
            this.modalVisible = true;
          }
        }}
      >
        {this.iValue.length <= 0 ? (
          !this.disabled ? (
            <span class="empty">
              <a-icon type="plus" /> {this.placeholder}
            </span>
          ) : (
            <span class="empty">暂无数据</span>
          )
        ) : (
          <div>
            {this.selectedOrganizations.map(item => {
              return (
                <div class="selected-item">
                  <a-icon style={{ color: '#f4222d' }} type={'apartment'} />
                  <span> {this.getSelectedName(item)} </span>
                </div>
              );
            })}
            {this.selectedRoles.map(item => {
              return (
                <div class="selected-item">
                  <a-icon style={{ color: '#fa8b15' }} type={'usergroup-add'} />
                  <span> {this.getSelectedName(item)} </span>
                </div>
              );
            })}
            {this.selectedUsers.map(item => {
              return (
                <div class="selected-item">
                  <a-icon style={{ color: '#1890ff' }} type={'user'} />
                  <span> {this.getSelectedName(item)} </span>
                </div>
              );
            })}
            {this.selectedDyncmicOrgs.map(item => {
              return (
                <div class="selected-item">
                  <a-icon style={{ color: '#1890ff' }} type={'user'} />
                  <span> 动态组织{item.type - 20}级 </span>
                </div>
              );
            })}
          </div>
        )}
        <SmSystemMemberModal
          showDynamicTab={this.showDynamicTab}
          visible={this.modalVisible}
          onChange={iValue => {
            this.modalVisible = iValue;
          }}
          showUserTab={this.showUserTab}
          axios={this.axios}
          selected={this.iValue}
          onOk={iValue => {
            this.$emit('change', iValue);
            this.$emit('input', iValue);
            this.iValue = iValue;
          }}
        />
      </div>
    );
  },
};
