import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiRailway from '../../sm-api/sm-basic/Railway';
import { dropdownStyle } from '../../_utils/config';

let apiRailway = new ApiRailway();

export default {
  name: 'SmBasicRailwayTreeSelect',
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String], default: undefined },
    disabled: { type: Boolean, default: false },
    mode: { type: String, default: 'default' },
    placeholder: { type: String, default: '请选择' },
    organizationId: { type: String, default: null },
    showSearch: { type: Boolean, default: false },
  },
  data() {
    return {
      dataRailways: [], // 列表数据源
      iValue: [],
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
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiRailway = new ApiRailway(this.axios);
    },
    async refresh() {
      let response = await apiRailway.getList({ isAll: true, belongOrgId: this.organizationId });
      if (requestIsSuccess(response)) {
        let _dics = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.dataRailways = _dics;
      }
    },
  },
  render() {
    return (
      <a-select
        dropdownStyle={dropdownStyle}
        disabled={this.disabled}
        allowClear
        showSearch={this.showSearch}
        options={this.dataRailways}
        value={this.iValue}
        mode={this.mode}
        onChange={(value, data) => {
          this.iValue = value;
          this.$emit('input', value);
          this.$emit('change', value);
        }}
        optionFilterProp='title'
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
      ></a-select>
    );
  },
};
