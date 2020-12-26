import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import { dropdownStyle } from '../../_utils/config';
import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import ApiRepairGroup from '../../sm-api/sm-std-basic/RepairGroup';
import permissionsSmStdBasic from '../../_permissions/sm-std-basic';
import './style/index.less';
let apiRepairGroup = new ApiRepairGroup();

export default {
  name: 'SmStdBasicRepairGroupTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    enabled: { type: Boolean, default: true }, //设备是否禁用
    axios: { type: Function, default: null },
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
      repairGroup: [], // 列表数据源
      repairGroupFlat: [], //平状数据源
      checkedKeys: [],
      iValue: null,
      treeSelect:true,
    };
  },
  computed: {},
  async created() {
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiRepairGroup = new ApiRepairGroup(this.axios);
    },

    //初始化页面加载数据
    async refresh() {
      let response = await apiRepairGroup.getTreeList({treeSelect:this.treeSelect});
      if (requestIsSuccess(response) && response.data && response.data.items) {
        let _repairGroup = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
        ]);
        this.repairGroupFlat = treeArrayToFlatArray(_repairGroup);
        this.repairGroup = _repairGroup;
      }
    },
  },
  render() {
    return (
      <a-tree
        checkedKeys={this.checkedKeys}
        treeData={this.repairGroup}
        checkable
        onCheck={(checkedKeys,event)=>{
          this.checkedKeys = checkedKeys;
          this.$emit("repairGroup",this.checkedKeys);
        }}
      />
    );
  },
};
