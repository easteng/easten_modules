import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiStoreHouse from '../../sm-api/sm-resource/StoreHouse';
import { dropdownStyle } from '../../_utils/config';

let apiStoreHouse = new ApiStoreHouse();

export default {
  name: 'SmResourceStoreHouseTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    enabled: { type: Boolean, default: true }, //仓库是否禁用
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
      componentCategories: [], // 列表数据源
      componentCategoriesFlat: [], //平状数据源
      iValue: null,
      isChange: false,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.setValue();
        if (!this.isChange) {
          this.loadByParentId();
        }
      },
      // immediate: true,
    },
  },

  async created() {
    this.initAxios();
    this.loadByParentId();
  },

  methods: {
    initAxios() {
      apiStoreHouse = new ApiStoreHouse(this.axios);
    },

    //初始化页面加载数据
    async loadByParentId() {
      let response = await apiStoreHouse.getList({
        parentId: null,
        ids: this.value instanceof Array ? this.value : this.value ? [this.value] : [],
        isAll: true,
        status: this.enabled,
      });

      if (requestIsSuccess(response) && response.data && response.data.items) {

        let _componentCategories = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
          {
            targetProp: 'isLeaf', handler: item => {
              return item.children === null ? true : false;
            },
          },
        ]);
        this.componentCategoriesFlat = treeArrayToFlatArray(_componentCategories);

        this.componentCategories = _componentCategories;

        if (this.value) {
          let result= await this.processData(this.componentCategoriesFlat,this.value);
          if(result){
            this.setValue();
          }else{
            this.iValue=null;
          }
        }
      }
    },

    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiStoreHouse.getList({ parentId: treeNode.dataRef.value, ids: [], isAll: true, status: this.enabled });
        if (requestIsSuccess(response) && response.data.items) {
          this.componentCategoriesFlat = this.componentCategoriesFlat.concat(response.data.items);

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
    // 判断传过来的id是否在数据中
    processData(array,value) {
      let data=false;
      try {
        array.forEach((item, index, arr) => {
          if (item.id == value) {
            data=true;
            throw new Error("error");
          }
          if (item.children != null) {
            this.processData(item.children,value);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      };
      return data;
    },
    setValue() {
      if (this.treeCheckable) {
        this.iValue = this.value
          ? this.componentCategoriesFlat
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
        treeData={this.componentCategories}
        value={this.iValue}
        dropdownMatchSelectWidth={true}
        showCheckedStrategy="SHOW_ALL"
        maxTagCount={this.maxTagCount}
        treeCheckStrictly={this.treeCheckStrictly}
        treeNodeFilterProp="title"
        treeCheckable={this.treeCheckable}
        showSearch={this.showSearch}
        loadData={this.onLoadData}
        onChange={value => {
          this.isChange = true;
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
