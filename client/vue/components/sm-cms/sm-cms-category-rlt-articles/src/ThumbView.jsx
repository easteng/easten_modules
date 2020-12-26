export default {
  name: 'ThumbView',
  props: {
    value: { default: 'disable', type: String },
  },
  data() {
    return {
      viewerFile: {
        name: '',
        url: '',
      },
    };
  },
  computed: {
    visible() {
      return this.value !== 'disable';
    },
  },
  methods: {
    close() {
      this.$emit('input', 'disable');
    },
    view(file) {
      this.$emit('input', 'view');
      this.viewerFile = file;
    },
  },

  render() {
    return (
      <a-modal
        visible={this.visible}
        title={`预览:${this.viewerFile.name}`}
        footer={false}
        onCancel={this.close}
      >
        <div class="pic-preview" style="display:flex; justify-content:center;">
          <img src={this.viewerFile.url} width="100%" alt={this.viewerFile.name} />
        </div>
      </a-modal>
    );
  },
};
