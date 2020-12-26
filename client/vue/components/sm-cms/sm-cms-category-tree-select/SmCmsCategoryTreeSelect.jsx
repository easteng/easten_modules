import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiCategory from '../../sm-api/sm-cms/Category';
import { dropdownStyle } from '../../_utils/config';

let apiCategory = new ApiCategory();

export default {
  name: 'SmCmsCategoryTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String], default: null }, //返回值
    disabled: { type: Boolean, default: false }, //是否禁用
    placeholder: { type: String, default: '请选择' },
    treeCheckable: { type: Boolean, default: false }, //是否多选
    treeCheckStrictly: { type: Boolean, default: false }, //父子级是否严格
    maxTagCount: { type: Number, default: 3 }, //多选状态下最多显示tag数
    enable: { default: '' }, //是否启用
    allowClear: { type: Boolean, default: true }, //是否清除
    showSearch: { type: Boolean, default: false }, //是否显示搜索
    disabledIds: { type: Array, default: () => [] }, //禁用层级id
    childrenIsDisabled: { type: Boolean, default: false }, //设置子元素禁用状态
  },
  data() {
    return {
      categories: [], // 列表数据源
      iValue: null,
      iDisabledIds: [],
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
    disabledIds: {
      handler: function(val, oldVal) {
        this.iDisabledIds = val;
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
      apiCategory = new ApiCategory(this.axios);
    },
    async refresh() {
      let response = await apiCategory.getList({ isAll: true, enable: this.enable });
      if (requestIsSuccess(response)) {
        let _categories = treeArrayItemAddProps(response.data.items, 'children', [
          {
            targetProp: 'title',
            handler: item => {
              return item.title;
            },
          },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
          {
            targetProp: 'disabled',
            handler: item => {
              return this.iDisabledIds.indexOf(item.id) > -1;
            },
          },
        ]);
        if (this.childrenIsDisabled) {
          this.setChildrenDisabled(_categories, false);
        }
        this.categories = _categories;
      }
    },

    //设置子元素禁用状态
    setChildrenDisabled(categories, disabled) {
      categories.map(item => {
        item.disabled = disabled ? disabled : item.disabled;
        if (item.disabled && item.children.length > 0) {
          this.setChildrenDisabled(item.children, item.disabled);
        } else {
          this.setChildrenDisabled(item.children, false);
        }
      });
    },
  },
  render() {
    return (
      <a-tree-select
        dropdownStyle={dropdownStyle}
        disabled={this.disabled}
        allowClear={this.allowClear}
        treeData={this.categories}
        value={this.iValue}
        maxTagCount={this.maxTagCount}
        treeCheckStrictly={this.treeCheckStrictly}
        treeNodeFilterProp="title"
        treeCheckable={this.treeCheckable}
        showSearch={this.showSearch}
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
