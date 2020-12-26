import { requestIsSuccess } from '../../../_utils/utils';
import ApiRole from '../../../sm-api/sm-system/Role';
import SmSystemOrganizationTree from '../../../sm-system/sm-system-organization-tree';

let apiRole = new ApiRole();

export default {
  name: 'SmSystemMemberModalRoles',
  model: {
    prop: 'checkedKeys',
    event: 'check',
  },
  props: {
    axios: { type: Function, default: null },
    checkedKeys: { default: () => [] },
    organizations: { default: () => [] },
    roles: { default: () => [] },
  },
  data() {
    return {
      iCheckedKeys: [],
      iRoles: [], // 列表数据源
      organizationId: null,
      iOrganizations:[],
    };
  },
  computed: {},
  watch: {
    checkedKeys: {
      handler: function(value) {
        this.iCheckedKeys = value;
      },
      immediate: true,
    },

    organizations: {
      handler(nVal, oVal) {
        this.iOrganizations = nVal;
      },
      immediate: true,
    },
    roles: {
      handler: function(value) {
        this.iRoles = [...value];
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
      apiRole = new ApiRole(this.axios);
    },
    async refresh() {
      let responseRole = await apiRole.getList(this.queryParams);
      if (requestIsSuccess(responseRole)) {
        this.iRoles = responseRole.data.items;
      }
    },
  },
  render() {
    return (
      <div class="sm-system-member-modal-roles">
        <div class="left">
          <SmSystemOrganizationTree
            axios={this.axios}
            defaultExpandAll
            checkable={false}
            treeData={this.iOrganizations}
            onSelect={async ids => {
              this.organizationId = ids.length === 1 ? ids[0] : null;
              let response = await apiRole.getList({
                organizationId: this.organizationId,
              });
              if (requestIsSuccess(response)) {
                this.iRoles = response.data.items;
              }
            }}
          />
        </div>
        <div class="right">
          <a-tree
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
            treeData={this.iRoles}
          />
        </div>
      </div>
    );
  },
};
