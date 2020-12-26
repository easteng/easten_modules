import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiProductCategory from '../../sm-api/sm-std-basic/ProductCategory';
import { dropdownStyle } from '../../_utils/config';

let apiProductCategory = new ApiProductCategory();

export default {
  name: 'SmStdBasicProductCategoryTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String] }, //返回值
    disabled: { type: Boolean, default: false }, //是否禁用
    parentDisabled: { type: Boolean, default: false }, //父级是否禁用
    placeholder: { type: String, default: '请选择' },
    treeCheckable: { type: Boolean, default: false }, //是否多选
    treeCheckStrictly: { type: Boolean, default: false }, //父子级是否严格
    maxTagCount: { type: Number, default: 3 }, //多选状态下最多显示tag数
    allowClear: { type: Boolean, default: true }, //是否清除
    showSearch: { type: Boolean, default: false }, //是否显示搜索
  },

  data() {
    return {
      productCategories: [], // 列表数据源
      productCategoriesFlat: [], //平状数据源
      iValue: null,
      isSearch: false,//树选择框是否处于搜索状态
    };
  },
  computed: {},
  watch: {
    value: {
      handler: async function (val, oldVal) {
        if (!this.isSearch) {
          this.initAxios();
          await this.refresh();
          this.setValue();
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
  },

  methods: {
    initAxios() {
      apiProductCategory = new ApiProductCategory(this.axios);
    },
    // 当选择框已经有值的时候，判断需不需要重新加载数据
    isValueLoading() {
      let refresh = false;
      // 当是多选的时候
      if (this.value instanceof Array) {
        if (this.value.length > 0) {
          // 保证数组里面的所有数据已经加载
          if (this.value.some(id => this.productCategoriesFlat.find(x => x.id == id) == null)) {
            refresh = true;
          }
        } else {
          if (this.value.length == 0 && this.productCategoriesFlat.length == 0) {
            refresh = true;
          }
        }
      }
      // 当是单选的时候
      else {
        if (this.value) {
          if (this.productCategoriesFlat.find(x => x.id === this.value) == null) {
            refresh = true;
          }
        } else {
          if (!this.value && this.productCategoriesFlat.length == 0) {
            refresh = true;
          }
        }
      }
      return refresh;
    },
    //初始化页面加载数据
    async refresh(keyWords, isReset) {
      if (keyWords) {
        this.iValue = null || [];
      }
      let isValueLoading = keyWords || isReset ? true : await this.isValueLoading();
      if (isValueLoading) {
        this.productCategories = [];
        this.productCategoriesFlat = [];
        let response = await apiProductCategory.getList({
          parentId: null,
          ids: !keyWords ? this.value instanceof Array ? this.value : this.value ? [this.value] : [] : [],
          isAll: true,
          keyWords: keyWords ? keyWords : '',
        });

        if (requestIsSuccess(response) && response.data.items) {
          let _productCategories = treeArrayItemAddProps(response.data.items, 'children', [
            { sourceProp: 'name', targetProp: 'title' },
            { sourceProp: 'id', targetProp: 'value' },
            { sourceProp: 'id', targetProp: 'key' },
            {
              targetProp: 'isLeaf', handler: item => {
                return item.children === null ? true : false;
              },
            },
          ]);
          this.productCategoriesFlat = treeArrayToFlatArray(_productCategories);

          this.productCategories = _productCategories;
        }

      }
    },

    //搜索功能
    onSearch(value) {
      if (!value) {
        this.isSearch = false;
      } else {
        this.refresh(value, true);
        this.isSearch = true;
      }
    },

    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiProductCategory.getList({ parentId: treeNode.dataRef.value, ids: [], isAll: true });
        if (requestIsSuccess(response) && response.data.items) {
          this.productCategoriesFlat = this.productCategoriesFlat.concat(response.data.items);

          treeNode.dataRef.children = treeArrayItemAddProps(response.data.items, 'children', [
            { sourceProp: 'name', targetProp: 'title' },
            { sourceProp: 'id', targetProp: 'value' },
            { sourceProp: 'id', targetProp: 'key' },
            {
              targetProp: 'isLeaf', handler: item => {
                return item.children === null ? true : false;
              },
            },

          ]);
        }
      }
    },

    setValue() {

      if (this.treeCheckable) {
        this.iValue = this.value
          ? this.productCategoriesFlat
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
        treeData={this.productCategories}
        value={this.iValue}
        maxTagCount={this.maxTagCount}
        treeCheckStrictly={this.treeCheckStrictly}
        showCheckedStrategy="SHOW_ALL"
        treeNodeFilterProp="title"
        treeCheckable={this.treeCheckable}
        showSearch={this.showSearch}
        loadData={this.onLoadData}
        onChange={value => {
          if (value === undefined || value.length === 0) {
            this.refresh('', true);
          }
          this.iValue = value;
          let ids = this.treeCheckable ? value.map(item => item.value) : value;
          this.$emit('input', ids);
          this.$emit('change', ids);
        }}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
        onSearch={value => {
          if (value) {
            this.onSearch(value);
          }
        }}
      ></a-tree-select>
    );
  },
};
