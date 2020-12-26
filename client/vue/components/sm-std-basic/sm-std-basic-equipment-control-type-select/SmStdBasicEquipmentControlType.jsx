import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiManufacturer from '../../sm-api/sm-std-basic/Manufacturer';
import { dropdownStyle } from '../../_utils/config';

let apiManufacturer = new ApiManufacturer();

export default {
  name: 'SmStdBasicEquipmentControlType',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String], default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
    allowClear: { type: Boolean, default: true },
    mode: { type: String, default: 'default' },
  },
  data() {
    return {
      equipmentTypes: [], // 列表数据源
      iValue: null,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function(val, oldVal) {
        this.iValue = val;
      },
      immediate: true,
    },

  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiManufacturer = new ApiManufacturer(this.axios);
    },
    async refresh() {
      let response = await apiManufacturer.getTypeList();
      if (requestIsSuccess(response)) {
        let _equipmentTypes = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.equipmentTypes = _equipmentTypes;
      }
    },

    // 搜索过滤
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  render() {
    return (
      <a-select
        dropdownStyle={dropdownStyle}
        showSearch
        filterOption={this.filterOption}
        disabled={this.disabled}
        allowClear={this.allowClear}
        options={this.equipmentTypes}
        value={this.iValue}
        mode={this.mode}
        onChange={value => {
          this.iValue = value;
          this.$emit('input', value);
          this.$emit('change', value);
        }}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
      ></a-select>
    );
  },
};
