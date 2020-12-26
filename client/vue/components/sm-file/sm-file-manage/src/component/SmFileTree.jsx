// 树结构定义

export default {
  name: 'SmFileTree',
  model:{
    prop:'selectedKeys',
    event:'change',
  },
  props: {
    treeData: { type: Array, default: null },
    //selectedKeys:{type:Array,default:null},
  },
  data() {
    return {
      nodeData: [], // 树结构数据，由上一级组装完成后才传入
      iSelected:[],
      selectedKeys:[],
      selectedNode:null,// 当前树点击选中的树节点，为了不同树结构之间进行树节点的选中状态处理。
      selectedEvent:null,
    };
  },
  computed:{
    selectedKeyArray(){
      return this.iSelected;
    },
  },
  watch: {
    treeData: {
      handler: function(n,o) {
        this.nodeData = n;
      },
    },
    selectedKeys: {
      handler(nVal, oVal) {
        this.iSelected= nVal||[];
      },
      immediate: true,
    },
  },
  created(){
    this.nodeData=this.treeData;
  },
  methods: {
    treeSelect(key,event){
      this.$emit('select',event.node.dataRef); // 提交当前的节点类型和对应的key
      this.iSelected=key;
      this.$emit('change',key);
      this.selectedKeys=key;
    },
    cancleSlectedState(){
      this.iSelected=[];
    },
  },
  render() {
    return (
      <div>
        <a-tree
          onSelect={this.treeSelect}
          treeData={this.nodeData}
          showIcon
          defaultExpandAll
          autoExpandParent
          selectedKeys={this.selectedKeyArray}
          defaultSelectedKeys={['0']}
          replaceFields={{ title: 'name', key: 'id' }}
        >
          <a-icon type="cluster" />
          <si-tree slot="organ"/>
          <si-tree-share slot="organ-share"/>
          <si-folder-open-share slot='shared'/>
          <a-icon slot="folderOpen" type="folder-open" theme="filled" />
          <a-icon slot="mine" type="user" />
          <a-icon slot="folder" type="folder" theme="filled" />
          <a-icon slot="shareCenter" type="codepen-circle" />
        </a-tree>
      </div>
    );
  },
};
