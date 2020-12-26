// 成员动态快速选择
// 根据所以的组织结构目录的深度树作为动态组织级别的标记
export default {
  name: 'SmSystemMemberModalDynamic',
  components: {},
  props: {
    checkedKeys: { type: Array, default: null }, // 选中的值
    dynamicOrg: { ype: Array, default: [] },
  },
  data() {
    return {
      treeData: [
        {
          title: '动态组织',
          key: '1',
          children: [],
        },
        // {
        //   title: '动态领导',
        //   key: '2',
        //   children: [],
        // },
      ],

      selected: [], // 选择的内容
      iCheckedKeys: [],
      org: [],
    };
  },
  computed: {
    selectedKeys() {
      return this.selected;
    },
  },
  watch: {
    checkedKeys: {
      handler(nVal, oVal) {
        this.iCheckedKeys = nVal;
      },
      immediate: true,
    },
    dynamicOrg: {
      handler(nVal, oVal) {
        this.org = nVal;
      },
      immediate: true,
    },
  },
  created() {},
  methods: {},
  render() {
    return (
      <div class="sm-system-member-modal-dynamic">
        <div class="left">
          <a-tree treeData={this.treeData}/>
        </div>
        <div class="right">
          <a-tree
            checkStrictly
            blockNode
            checkable={true}
            checkedKeys={this.iCheckedKeys}
            defaultExpandAll={true}
            replaceFields={{ title: 'name', key: 'id' }}
            onCheck={value => {
              this.iCheckedKeys = value.checked;
              this.$emit('check', value.checked);
            }}
            treeData={this.org}
          />
        </div>
      </div>
    );
  },
};
