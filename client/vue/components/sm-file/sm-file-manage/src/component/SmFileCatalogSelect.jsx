// 文件目录选择组件 ，修改选择后的默认文字内容
import { TreeSelectNodeHandler } from '../common';
export default {
  name: 'SmFileCatalogSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: String, default: null },
    treeData: { type: Array, default: null },
  },
  data() {
    return {
      text: '', // 下拉框需要显示的内容
      iVaule: null, // 当前的值
    };
  },
  computed: {
    dataSource(){
      return TreeSelectNodeHandler(this.treeData);
    },
  },
  watch: {
    value: {
      handler: function(n, old) {
        this.iVaule = n;
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    // 初始化组件
    initial(){
      this.iVaule=null;
    },
  },
  render() {
    return (
      <div>
        <a-tree-select
          style="width: 100%"
          value={this.iVaule}
          dropdown-style={{ maxHeight: '400px', overflow: 'auto' }}
          treeData={this.dataSource}
          placeholder="请选择目录"
          treeNodeLabelProp="field"
          replaceFields={{title:'name',key:'id',value:'id'}}
          onSelect={(v, n, e) => {
            if(n.dataRef.type===1){
               this.iVaule=n.dataRef.field;
            }else{
              this.iVaule=n.dataRef.name;
            }
            // this.iVaule = v; // 获取到节点的key 值
            this.$emit('change', n.dataRef);
          }}
        >
        </a-tree-select>
      </div>
    );
  },
};
