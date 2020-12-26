import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiDataDictionary from '../../sm-api/sm-system/DataDictionary';
import { dropdownStyle } from '../../_utils/config';
let apiDataDictionary = new ApiDataDictionary();

export default {
  name: 'SmSystemDataDictionaryTreeSelect',
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String] },
    groupCode: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false }, //是否多选，默认单选
    allowClear: { type: Boolean, default: true }, 
    placeholder: { type: String, default: '请选择' },
    treeCheckStrictly: { type: Boolean, default: false}, //父子级是否严格
  },
  data() {
    return {
      dataDictonaries: [], // 列表数据源
      iValue: null,
    };
  },
  computed: {},
  watch: {
    value: {
      handler(nVal, oVal) {
        if (this.multiple) {
          this.iValue = nVal;
        } else {
          this.iValue = [nVal];
        }
        //this.refresh();
      },
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiDataDictionary = new ApiDataDictionary(this.axios);
    },

    async refresh() {
      this.dataDictonaries = [];
      let response = await apiDataDictionary.getValues({ groupCode: this.groupCode });
      this.$emit('res', response.data.length);//返回值
      if (requestIsSuccess(response)) {
        let _dics = treeArrayItemAddProps(response.data, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.dataDictonaries = _dics;
      }
    },
  },
  render() {
    return (
      <a-tree-select
        dropdownStyle={dropdownStyle}
        disabled={this.disabled}
        tree-checkable={this.multiple}
        allowClear={this.allowClear}
        treeCheckStrictly={this.treeCheckStrictly}
        treeData={this.dataDictonaries}
        value={this.iValue}
        onChange={value => {
          this.iValue = value;
          this.$emit('input', value);
          this.$emit('change', value);
        }}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
      ></a-tree-select>
    );
  },
};
