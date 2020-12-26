/**
 * 说明：左侧文件传输菜单项组件
 * 作者：easten
 */
export default {
  name: 'SmFileTransfer',
  props: {
    state: { type: Object, default: null },// 文件状态    
  },
  data() {
    return {
      transState: {},
      active:1, // 激活的选项
    };
  },
  watch: {
     state: {
       handler(nVal, oVal) {
         this.transState = nVal;
       },
       immediate: true,
     },
  },
  methods: {
    itemClick(item) {
      this.active=item;
      this.$emit('click', item);
    },
  },
  render() {
    return (
      <ul class="f-trans-item">
        <li onClick={() => this.itemClick('download')} class={this.active=='download'?'active':''}>
          <a-icon type="vertical-align-bottom" />          
          <span>正在下载</span>
          <span>({this.transState.download})</span>
        </li>
        <li onClick={() => this.itemClick('upload')} class={this.active=='upload'?'active':''}>
          <a-icon type="vertical-align-top" />          
          <span>正在上传</span>
          <span>({this.transState.upload})</span>
        </li>
        <li onClick={() => this.itemClick('complete')} class={this.active=='complete'?'active':''}>
          <a-icon type="check" />          
          <span>已经完成</span>
          <span>({this.transState.complete})</span>
        </li>
      </ul>
    );
  },
};
