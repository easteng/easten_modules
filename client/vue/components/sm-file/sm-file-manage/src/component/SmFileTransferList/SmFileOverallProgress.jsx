/**
 * 说明：文件总体进度组件
 * 作者：easten
 */

export default {
  name: 'SmFileOverallProgress',
  props: {
    percent: { type: Number, default: 0 }, // 百分比
  },
  data() {
    return {};
  },
  computed: {
    number(){
      return parseInt(this.percent.toFixed(0));
    },
  },
  watch: {
    percent: {
      handler(nVal, oVal) {
        this.percent = nVal;
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    cancle() {
      let _this = this;
      this.$confirm({
        title: '温馨提示',
        content: '确定要全部取消吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          // 执行api 操作
          _this.$message.success('文件下载已取消！');
        },
      });
    },
  },
  render() {
    return (
      <div class="f-progress">
        <span>总体进度</span>
        <a-progress percent={this.number} status="active" class="f-progress-all" />
        {/* {this.percent == 0 ? null : (
          <a-button type="link" onClick={this.cancle}>
            <a-icon type="close" />
            全部取消
          </a-button>
        )} */}
      </div>
    );
  },
};
