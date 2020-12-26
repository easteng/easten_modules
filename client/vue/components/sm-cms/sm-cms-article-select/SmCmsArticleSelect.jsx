import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiArticle from '../../sm-api/sm-cms/Article';
import { dropdownStyle } from '../../_utils/config';

let apiArticle = new ApiArticle();

export default {
  name: 'SmCmsArticleSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    categoryId: { type: String, default: null },
    axios: { type: Function, default: null },
    value: { default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
    treeCheckable: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    mode: { type: String, default: 'default' },
  },
  data() {
    return {
      articles: [], // 列表数据源
      iValue: null,
      iCategoryId: null,
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

    categoryId: {
      handler: function(val, oldVal) {
        this.iCategoryId = val;
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
      apiArticle = new ApiArticle(this.axios);
    },
    async refresh() {
      let response = await apiArticle.getOutofCategoryList({
        categoryId: this.iCategoryId,
        isAll: true,
      });
      if (requestIsSuccess(response)) {
        let _articles = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'title', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.articles = _articles;
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
        options={this.articles}
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
