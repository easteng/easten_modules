import { requestIsSuccess } from '../../../_utils/utils';
import ApiUser from '../../../sm-api/sm-system/User';
import SmSystemOrganizationTree from '../../sm-system-organization-tree';
import SmSystemUsers from '../../sm-system-users';

let apiUser = new ApiUser();

export default {
  name: 'SmSystemMemberModalUsers',
  model: {
    prop: 'checkedKeys',
    event: 'check',
  },
  props: {
    axios: { type: Function, default: null },
    checkedKeys: { default: () => [] },
    selectedKeys: { default: () => [] },
    organizations: { default: () => [] },
    users: { default: () => [] },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      iCheckedKeys: [],
      iSelectedKeys: [],
      iUsers: [], // 列表数据源
      organizationId: null,
    };
  },
  computed: {},
  watch: {
    checkedKeys: {
      handler: function (value) {
        this.iCheckedKeys = value;
      },
      immediate: true,
    },
    selectedKeys: {
      handler: function (value) {
        this.iSelectedKeys = value;
      },
      immediate: true,
    },
    organizations: {
      handler(nVal, oVal) {
        this.iOrganizations = nVal;
      },
      immediate: true,
    },
    users: {
      handler: function (value) {
        this.iUsers = [...value];
      },
      immediate: true,
    },
  },
  async created() {
    if (this.axios) {
      this.initAxios();
      this.refresh();
    }
  },
  methods: {
    initAxios() {
      apiUser = new ApiUser(this.axios);
    },
    async refresh() {
      let responseRole = await apiUser.getList(this.queryParams);
      if (requestIsSuccess(responseRole)) {
        this.iUsers = responseRole.data.items;
      }
    },
  },
  render() {
    return (
      <div class="sm-system-member-modal-users">
        <div class="left">
          <SmSystemOrganizationTree
            axios={this.axios}
            defaultExpandAll
            checkable={false}
            treeData={this.iOrganizations}
            onSelect={async ids => {
              {
                this.organizationId = ids.length === 1 ? ids[0] : null;
              }
              let response = await apiUser.getList({
                organizationId: this.organizationId,
              });
              if (requestIsSuccess(response)) {
                this.iUsers = response.data.items;
              }
            }}
          />
        </div>
        <div class="right">
          <SmSystemUsers
            axios={this.axios}
            organizationId={this.organizationId}
            isSimple={true}
            multiple={true}
            bordered={false}
            selected={this.iCheckedKeys}
            onChange={selected => {
              this.iCheckedKeys = selected;
              this.$emit('check', selected);
            }}
          />
          {/* <a-tree
            checkStrictly
            blockNode
            checkable={true}
            checkedKeys={this.iCheckedKeys}
            defaultExpandAll={this.defaultExpandAll}
            replaceFields={{ title: 'name', key: 'id' }}
            onCheck={value => {
              this.iCheckedKeys = value.checked;
              this.$emit('check', value.checked);
            }}
            treeData={this.iUsers}
          /> */}
        </div>
      </div>
    );
  },
};
