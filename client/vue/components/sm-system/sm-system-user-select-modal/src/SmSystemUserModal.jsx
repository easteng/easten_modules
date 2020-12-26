import { requestIsSuccess } from '../../../_utils/utils';
import ApiUser from '../../../sm-api/sm-system/User';

let apiUser = new ApiUser();

export default {
  name: 'SmSystemUserModal',
  model: {
    prop: 'checkedKeys',
    event: 'check',
  },
  props: {
    axios: { type: Function, default: null },
    checkedKeys: { default: () => [] },
    organizations: { default: () => [] },
  },
  data() {
    return {
      iCheckedKeys: [],
      iUsers: [], // 列表数据源
      organizationId: null,
      defaultExpandedKeys:[],
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
  },
  async created() {
    if (this.axios) {
      this.initAxios();
      await this.refresh();
    }
  },
  methods: {
    initAxios() {
      apiUser = new ApiUser(this.axios);
      this.defaultExpandedKeys = this.organizations.map(item => item.id);
    },
    async refresh() {
      this.queryParams ={maxResultCount:1000,skipCount:0};
      if (this.organizationId !== null) this.queryParams.organizationId=this.organizationId;
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
          <a-tree
            checkStrictly
            blockNode
            expandedKeys={this.defaultExpandedKeys}
            defaultExpandAll
            selectedKeys={this.iSelectedKeys}
            replaceFields={{ title: 'name', key: 'id' }}
            treeData={this.organizations}
            onExpand={expandedKeys => {
              this.defaultExpandedKeys = expandedKeys;
            }}
            onSelect={values => {
              this.iSelectedKeys = values;
              this.organizationId = values.length === 1 ? values[0] : null;
              this.refresh();
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
            treeData={this.iUsers}
          />
        </div>
      </div>
    );
  },
};
