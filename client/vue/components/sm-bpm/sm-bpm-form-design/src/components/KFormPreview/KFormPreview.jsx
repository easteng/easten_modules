import jsonModel from '../KFormDesign/module/jsonModal';
import KFormBuild from '../KFormBuild/';
export default {
  name: 'KFormPreview',
  components: {
    jsonModel,
    KFormBuild,
  },
  props:{
    axios:{type:Function,default:null},
  },
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
    };
  },
  methods: {
    handleSubmit(p) {
      p.then(res => {
        console.log(res, '获取数据成功');
        this.$refs.jsonModel.jsonData = res;
        this.$refs.jsonModel.visible = true;
      }).catch(err => {
        console.log(err, '获取数据失败');
      });
    },
    handleGetData() {
      this.$refs.KFormBuild.getData()
        .then(res => {
          console.log(res, '获取数据成功');
          this.$refs.jsonModel.jsonData = res;
          this.$refs.jsonModel.visible = true;
        })
        .catch(err => {
          console.log(err, '获取数据失败');
        });
    },
    handleCancel() {
      this.visible = false;
    },
  },

  render() {
    return (
      <a-modal
        title="预览"
        visible={this.visible}
        ok-text="获取数据"
        cancel-text="关闭"
        destroy-on-close={true}
        width={`${this.previewWidth}px`}
        onOk={this.handleGetData}
        onCancel={this.handleCancel}
      >
        <KFormBuild ref="KFormBuild" value={this.jsonData} axios={this.axios} onSubmit={this.handleSubmit} />
        <jsonModel ref="jsonModel" />
      </a-modal>
    );
  },
};
