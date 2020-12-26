import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiCategory from '../../sm-api/sm-exam/Category';
import { dropdownStyle } from '../../_utils/config';


let apiCategory = new ApiCategory();


export default {
  name: 'SmExamCategoriesTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String] }, //返回值
    disabled: { type: Boolean, default: false }, //是否禁用
    placeholder: { type: String, default: '请选择' },
    treeCheckable: { type: Boolean, default: false }, //是否多选
    treeCheckStrictly: { type: Boolean, default: false }, //父子级是否严格
    maxTagCount: { type: Number, default: 3 }, //多选状态下最多显示tag数
    allowClear: { type: Boolean, default: true }, //是否清除
    showSearch: { type: Boolean, default: false }, //是否显示搜索
  },

  data() {
    return {
      categories: [],//列表数据源
      categoriesFlat: [],
      iValue: null,

    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.setValue();
        this.loadByParentId();
      },
    },
  },

  async created() {
    this.initAxios();
    this.setValue();
    this.loadByParentId();
  },


  methods: {
    initAxios() {
      apiCategory = new ApiCategory(this.axios);
    },

    //初始化页面加载数据
    async loadByParentId(parentId) {
      let response;
      if (this.value || (this.value && this.value.length > 0)) {
        response = await apiCategory.getParentsByIds(this.value && this.value.length > 0 ? this.value : [this.value]);

      } else {
        response = await apiCategory.getByParentId(parentId);
      }

      if (requestIsSuccess(response) && response.data) {
        let _categories = treeArrayItemAddProps(response.data, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'code', targetProp: 'key' },
        ]);
        this.categoriesFlat = treeArrayToFlatArray(_categories);
        this.categories = _categories;
        if (this.value) {
          this.setValue();
        }

      }
    },


    //异步加载数据
    async onLoadData(treeNode) {

      if (treeNode.dataRef.children.length == 0) {
        let response = await apiCategory.getByParentId(treeNode.dataRef.value);
        if (requestIsSuccess(response) && response.data) {
          this.categoriesFlat = this.categoriesFlat.concat(response.data);
          treeNode.dataRef.children = treeArrayItemAddProps(response.data, 'children', [
            { sourceProp: 'name', targetProp: 'title' },
            { sourceProp: 'id', targetProp: 'value' },
            { sourceProp: 'id', targetProp: 'key' },
          ]);
        }
      }
    },

    setValue() {
      if (this.treeCheckable) {
        this.iValue = this.value
          ? this.categoriesFlat
            .filter(item => {
              if (this.value.indexOf(item.id) > -1) {
                return true;
              }
            })
            .map(item => {
              return {
                value: item.id,
                label: item.name,
              };
            })
          : [];
      } else {
        this.iValue = this.value;
      }

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
        loadData={this.onLoadData}

        onChange={value => {

          if (this.value == undefined) {
            this.iValue = value;
          }
          this.iValue = value;
          let ids = this.treeCheckable ? value.map(item => item.value) : value;
          this.$emit('input', ids);
          this.$emit('change', ids);
        }}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
      ></a-tree-select>
    );
  },
};