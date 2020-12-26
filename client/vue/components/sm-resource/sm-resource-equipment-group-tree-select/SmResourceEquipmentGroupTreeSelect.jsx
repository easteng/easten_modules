import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiEquipmentGroup from '../../sm-api/sm-resource/EquipmentGroup';
import { dropdownStyle } from '../../_utils/config';

let apiEquipmentGroup = new ApiEquipmentGroup();

export default {
  name: 'SmResourceEquipmentGroupTreeSelect',
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
      equipmentGroups: [], // 列表数据源
      equipmentGroupsFlat: [], //平状数据源
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
    this.setValue();
    this.loadByParentId();
  },

  methods: {
    initAxios() {
      apiEquipmentGroup = new ApiEquipmentGroup(this.axios);
    },

    //初始化页面加载数据
    async loadByParentId() {
      let response = await apiEquipmentGroup.getList({
        parentId: null,
        ids: this.value instanceof Array ? this.value : this.value ? [this.value] : [],
        isAll: true,
      });
      if (requestIsSuccess(response) && response.data.items) {
        let _equipmentGroups = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
          {
            targetProp: 'isLeaf', handler: item => {
              return item.children === null ? true : false;
            },
          },
        ]);
        this.equipmentGroupsFlat = treeArrayToFlatArray(_equipmentGroups);

        this.equipmentGroups = _equipmentGroups;
        if (this.value) {
          this.setValue();
        }
      }
    },

    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiEquipmentGroup.getList({ parentId: treeNode.dataRef.value, ids: [], isAll: true });
        if (requestIsSuccess(response) && response.data.items) {
          this.equipmentGroupsFlat = this.equipmentGroupsFlat.concat(response.data.items);

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
          ? this.equipmentGroupsFlat
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
        // console.log(this.iValue);
      }
    },
  },
  render() {
    return (
      <a-tree-select
        dropdownStyle={dropdownStyle}
        disabled={this.disabled}
        allowClear={this.allowClear}
        treeData={this.equipmentGroups}
        value={this.iValue}
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
