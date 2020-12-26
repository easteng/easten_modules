import Workflow from './Workflow';
import { ModalStatus, UserWorkflowGroup } from '../../../_utils/enum';
import ApiWorkflow from '../../../sm-api/sm-bpm/Workflow';
let apiWorkflow = new ApiWorkflow();

export default {
  name: 'WorkflowModal',
  props: {
    axios: { type: Function, default: null },
    isInitial: { type: Boolean, default: false }, // 首次发起
    title: { type: String, default: null }, // 首次发起
    group: { type: Number, default: null },//工作流页面状态
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: this.$form.createForm(this),
      id: null,
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  watch: {
    
  },
  async created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiWorkflow = new ApiWorkflow(this.axios);
    },

    edit(id, redit) {
      this.id = id;
      this.status = ModalStatus.Edit;
      if (redit) {
        // 判断是否重新发起的流程，如果是，则要根据重新发起的流程删除已被拒绝的
      }
    },
    close() {
      this.status = ModalStatus.Hide;
    },
    onSuccess(isInitial) {
      this.$emit('success', isInitial);
      this.close();
    },
  },
  render() {
    return (
      <a-modal width="50%" visible={this.visible} onCancel={this.close} footer={null}>
        {this.visible ? (
          <Workflow
            ref="Workflow"
            onSuccess={this.onSuccess}
            id={this.id}
            isInitial={this.isInitial}
            axios={this.axios}
            group={this.group}
          />
        ) : null}
      </a-modal>
    );
  },
};
