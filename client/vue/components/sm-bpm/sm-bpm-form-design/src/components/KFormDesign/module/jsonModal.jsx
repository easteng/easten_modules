/*
 * author kcz
 * date 2019-11-20
 * description 生成json Modal
 */
import previewCode from '../../PreviewCode/index';
export default {
  name: 'JsonModal',
  components: {
    previewCode,
  },
  data() {
    return {
      visible: false,
      editorJson: '',
      jsonData: {},
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.editorJson = JSON.stringify(this.jsonData, null, '\t');
      }
    },
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
  },
  render() {
    return (
      <a-modal
        title="JSON数据"
        footer={null}
        visible={this.visible}
        destroy-on-close={true}
        wrap-class-name="code-modal-9136076486841527"
        // style="top:20px;"
        width="850px"
        onCancel={this.handleCancel}
      >
        <previewCode editor-json={this.editorJson} />
      </a-modal>
    );
  },
};
