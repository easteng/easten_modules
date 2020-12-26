import { requestIsSuccess } from '../../_utils/utils';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
let apiOrganization = new ApiOrganization();

export default {
  name: 'SmSystemOrganizationTree',
  model: {
    prop: 'checkedKeys',
    event: ['select', 'check'],
  },
  props: {
    axios: { type: Function, default: null },
    selectedKeys: { default: () => [] },
    checkedKeys: { default: () => [] },
    treeData: { default: () => [] },
    defaultExpandAll: { type: Boolean, default: false },
    checkable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
  },
  data() {
    return {
      iCheckedKeys: [],
      iSelectedKeys: [],
      iTreeData: [], // 列表数据源
      organizationsFlat: [],

    };
  },
  computed: {},
  watch: {
    checkedKeys: {
      handler: function (value) {
        this.iCheckedKeys = value;
      },
      immediate: true,
    },
    selectedKeys: {
      handler: function (value) {
        this.iSelectedKeys = value;
      },
      immediate: true,
    },
    treeData: {
      handler: function (value) {
        this.iTreeData = [...value];
      },
      immediate: true,
    },
  },
  async created() {
    if (this.axios) {
      this.initAxios();
      //this.refresh();
    }
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
    },
    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiOrganization.getList({ parentId: treeNode.dataRef.id });
        if (requestIsSuccess(response) && response.data) {
          //this.iTreeData = this.iTreeData.concat(response.data.items);
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
  },
  render() {
    return (
      <a-tree
        checkStrictly
        blockNode
        disabled={this.disabled}
        placeholder={this.disabled ? '' : this.placeholder}
        checkable={this.checkable}
        checkedKeys={this.iCheckedKeys}
        selectedKeys={this.iSelectedKeys}
        // defaultExpandAll={this.defaultExpandAll}
        replaceFields={{ title: 'name', key: 'id' }}
        onCheck={value => {
          this.iCheckedKeys = value;
          this.$emit('check', value.checked);
        }}
        loadData={this.onLoadData}
        onSelect={(value, event) => {
          this.iSelectedKeys = value;
          this.$emit('select', value, event.node.dataRef.code);
        }}
        treeData={this.iTreeData}
      />
    );
  },
};
