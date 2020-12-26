/*
 * author kcz
 * date 2019-11-20
 * description 导入json Modal
 */
import { codemirror } from 'vue-codemirror-lite';
import jsonFormat from '../../../../config/jsonFormat';
export default {
  name: 'ImportJsonModal',
  components: {
    codemirror,
  },
  data() {
    return {
      visible: false,
      jsonFormat,
      jsonData: {},
    };
  },
  computed: {
    editor() {
      // get current editor object
      return this.$refs.myEditor.editor;
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.jsonFormat = jsonFormat;
      }
    },
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    beforeUpload(e) {
      // 通过json文件导入
      let _this = this;
      let reader = new FileReader();
      reader.readAsText(e);
      reader.onload = function() {
        _this.jsonFormat = this.result;
        _this.handleImportJson();
      };
      return false;
    },
    handleImportJson() {
      // 导入JSON
      try {
        const editorJsonData = JSON.parse(this.jsonFormat);
        this.jsonData.list = editorJsonData.list;
        this.jsonData.config = editorJsonData.config;
        this.jsonData.config.layout = editorJsonData.config.layout;
        this.handleClose();
        this.$message.success('导入成功');
      } catch (e) {
        this.$message.error('导入失败，数据格式不对');
      }
    },
  },
  render() {
    return (
      <a-modal
        title="JSON数据"
        visible={this.visible}
        // style="top:20px;"
        cancel-text="关闭"
        destroy-on-close={true}
        wrap-class-name="code-modal-9136076486841527"
        width="850px"
        onOk={this.handleImportJson}
        onCancel={this.handleClose}
      >
        <div class="json-box-9136076486841527">
          <codemirror
            ref="myEditor"
            value={this.jsonFormat}
            onInput={value => {
              this.jsonFormat = value;
            }}
            style="height:100%;"
          />
        </div>
        <br></br>
        <a-upload
          action="/abc"
          before-upload={this.beforeUpload}
          show-upload-list={false}
          accept="application/json"
        >
          <a-button type="primary">导入json文件</a-button>
        </a-upload>
      </a-modal>
    );
  },
};
