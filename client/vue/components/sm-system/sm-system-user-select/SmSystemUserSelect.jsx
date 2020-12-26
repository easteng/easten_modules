import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiUser from '../../sm-api/sm-system/User';
let apiUser = new ApiUser();

export default {
  name: 'SmSystemUserSelect',
  props: {
    axios: { type: Function, default: null },
    value: {},
    disabled: { type: Boolean, default: false },
    treeCheckable: { type: Boolean, default: false },
    organizationId: { type: String, default: null },
    placeholder: { type: String, default: '请选择' },
    mode: { type: String, default: 'default' },
  },
  data() {
    return {
      users: [], // 列表数据源
      iValue: null,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.iValue = val;
      },
      immediate: true,
    },
    organizationId: {
      handler: function (val, oldVal) {
        this.refresh();
      },
      // immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiUser = new ApiUser(this.axios);
    },
    async refresh() {
      let response = await apiUser.getList({ organizationId: this.organizationId, isAll: true });
      if (requestIsSuccess(response) && response.data) {
        let _users = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.users = _users;
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  render() {
    return (
      <a-select
        disabled={this.disabled}
        allowClear
        mode={this.mode}
        options={this.users}
        filterOption={this.filterOption}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
        value={this.iValue}
        onChange={value => {
          this.iValue = value;
          this.$emit('input', value);
          this.$emit('change', value);
        }}
      />
    );
  },
};
