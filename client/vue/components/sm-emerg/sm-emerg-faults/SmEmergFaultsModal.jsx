// 文件选择对话框
import SmEmergPlans from '../sm-emerg-plans';
import { ModalStatus } from '../../_utils/enum';

export default {
  name: 'SmEmergFaultsModal',
  props: {
    permissions: { type: Array, default: () => [] },
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false }, // 选择框可见性
    width: { type: Number, default: 1100 }, // 选择框宽度
    height: { type: Number, default: 630 }, // 文件选择组件的高度
    value: { type: Object, default: null },    //数据
  },
  data() {
    return {
      iValue: null,
      iVisible: this.visible,
    };
  },
  computed: {
  },
  watch: {
    visible: {
      handler(nVal, oVal) {
        this.iVisible = nVal;
        this.iValue = this.value;
      },
      immediate: true,
    },
  },
  // async created() {
  //   this.initAxios();
  // },
  methods: {
    // initAxios(){
    //   if(this.$route.query.isVisible != undefined){
    //     this.iVisible = true;
    //     console.log(this.iVisible);
    //   }
    // },
    onClose() {
      this.$emit('change', false);
      this.$emit('success');
    },
    isClose(v) {
      this.iVisible = v;
      this.onClose();
    },
  },
  render() {
    return (
      <a-modal
        width={this.width}
        title="应急预案选择"
        visible={this.iVisible}
        onCancel={this.onClose}
      >
        <div class="e-faults-modal" style={'margin-bottom:28px'}>
          <SmEmergPlans
            permissions={this.permissions}
            axios={this.axios}
            value={this.iValue}
            isApply={true}
            onInput={v => this.isClose(v)}
            onView={id => {
              this.$emit('view', id);
              this.$emit('change', false);
            }}
          />
        </div>
        <template slot="footer">
          <a-button onClick={() => this.onClose()}>
            关闭
          </a-button>
        </template>
      </a-modal>
    );
  },
};
