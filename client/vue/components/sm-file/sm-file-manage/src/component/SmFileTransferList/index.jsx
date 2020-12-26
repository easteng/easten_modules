/**
 * 说明：文件传输列表组件
 * 作者：easten
 */
import SmFileOverallProgress from './SmFileOverallProgress';
import SmFileTransTable from './SmFileTransTable';
import { TransType } from '../../common';

export default {
  name: 'SmFileTransferList',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    type: { type: Number, default: 0 }, // 子组件表格的类型，类型分别为：我的组织，我的，共享中心，及回收站，不同的组织对应的列表的显示内容时不同的
    NodeKey: { type: String, default: '' }, //资源父节点id
    NodeType: { type: String, default: '' }, //资源父节点类型，标识组织结构或者文件夹
    axios: { type: Function, default: null },
    value: { type: Object, default: null }, //父组件传递的文件传输对象
    percent:{type:Number,default:0},// 总进度条。
  },
  data() {
    return {
      dataSource: [],
      tableType: 0,
      iValue: null,
      iPercent:0,
    };
  },
  computed: {
    tableData(){
      return this.dataSource;
    },
  },
  watch: {
    type: {
      handler(nVal, oVal) {
        this.tableType = nVal;
        this.getTableData();
      },
      immediate: true,
    },
    value: {
      handler(nVal, oVal) {
        this.iValue = nVal;
        this.getTableData();
      },
      immediate: true,
    },
    percent: {
      handler(nVal, oVal) {
        this.iPercent = nVal;
      },
      immediate: true,
    },
  },
  created() {
  },
  methods: {    
    // 根据传输列表中数据进行组装表格中需要的数据格式
    getTableData() {
      if(this.iValue!=null){
        switch (this.tableType) {
          case TransType.DownLoad:
            this.dataSource = this.iValue.downloadList;
            break;
          case TransType.Upload:
            this.dataSource = this.iValue.uploadList;
            break;
          case TransType.Complete:
            this.dataSource = this.iValue.completeList;
            break;
        }
      }
    },
    

  },
  render() {
    return (
      <div style="height:100%">
        <div class="f-resource-bar">
          <div class="f-menus-progress">
            <SmFileOverallProgress percent={this.iPercent} />
          </div>
        </div>
        <div class="f-resource-list">
          <SmFileTransTable dataSource={this.tableData} type={this.type} />
        </div>
      </div>
    );
  },
};
