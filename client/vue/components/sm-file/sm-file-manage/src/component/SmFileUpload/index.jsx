// 多文件上传组件封装
export default {
  name: 'SmFileUpload',
  props: {
    title: { type: String, default: '上传' }, // 按钮名称
    showIcon: { type: Boolean, default: false }, // 是否显示icon 图标
    icon: { type: String, default: '' }, // 按钮内图标
    multiple: { type: Boolean, default: false }, // 是否支持多选
    directory: { type: Boolean, default: false }, // 是否支持上传文件夹
    disabled: { type: Boolean, default: false }, // 是否禁用该组件
    accept:{type:String, default:'*'},// 文件类型，默认时全部
  },
  data() {
    return {
      fileValue:null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
  render() {
    return (
      <a-button
        type="link"
        onClick={() => {
          this.$refs.fileInput.click();
        }}
      >
        <a-icon type={this.icon} />
        {this.title}
        <input
          style="display:none;"
          type="file"
          ref="fileInput"
          onChange={e => {
            this.$emit('beforeUpload', event, event.target.files);
            this.$refs.fileInput.value="";
          }}
          onInput={(a, b, c) => {}}
          name="file"
          multiple={this.multiple}
          webkitdirectory={this.directory}
          accept={this.accept}
          // value={this.fileValue}
        ></input>
      </a-button>
    );
  },
};
