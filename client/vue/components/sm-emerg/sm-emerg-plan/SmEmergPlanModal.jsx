import { ModalStatus } from '../../_utils/enum';
import * as moment from 'moment';
import { form as formConfig, tips } from '../../_utils/config';
import ApiFault from '../../sm-api/sm-emerg/Fault';
import * as utils from '../../_utils/utils';
let apiFault = new ApiFault();
export default {
  name: 'SmEmergPlanModal',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      loading: false, //确定按钮是否处于加载状态
      form: {}, // 表单
      isDetermine: false, //判断是否存在判断节点
      title: '', //标题
      nodeData: null,
      edges: null, //判断节点连接的线
      processRecords: [], //流程记录
      inStamp: null, //故障开始时间
      falutId: null,//故障id
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    previousTime() {
      return new Date(
        this.processRecords.length === 0
          ? this.inStamp
          : this.processRecords[this.processRecords.length - 1].time,
      );
    },
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiFault = new ApiFault(this.axios);

    },
    nodeClick(data, flowData, processRecords, inStamp, falutId) {
      this.falutId = falutId;
      this.processRecords = processRecords;
      this.inStamp = inStamp;
      this.status = ModalStatus.View;
      let determineNode; //一个节点只存在一个判定节点
      let nextNodeIds = data ? data.steps.map(item => item.targetId) : [];
      for (let id of nextNodeIds) {
        let item = flowData.nodes.find(x => x.id === id && x.type === 'determine');
        if (item) {
          determineNode = item;
        }
      }
      if (determineNode) {
        this.edges = flowData.edges.filter(edge => edge.source === determineNode.id);
        for (let edge of this.edges) {
          if (edge.condition.value === 'true') {
            this.trueLabel = edge.label;
          } else if (edge.condition.value === 'false') {
            this.falseLabel = edge.label;
          }
        }
        this.isDetermine = true;
      }

      this.title = data.label;
      this.formDate = moment(new Date());
      this.nodeData = data; //当前点击节点信息
    },

    async nodeClickOk() {
      this.form.validateFields(async (err, values) => {
        let _values = values;
        let determineEdge = null;
        if (this.isDetermine) {
          determineEdge = this.edges.filter(edge => edge.condition.value === values.determineValue);
        }
        if (!err) {
          let data = {
            ..._values,
            id: this.falutId,
            nodeId: this.nodeData.nodeId,
            determineTargetId: determineEdge ? determineEdge[0].target : null,
          };
          let response = await apiFault.Process(data);
          if (utils.requestIsSuccess(response)) {
            this.$message.success('处理成功');
            this.$emit('success');
            this.status = ModalStatus.Hide;
            window.location.reload();
            // reload;
          //  this.$router.go(0);
          }
        }
      });
    },
    nodeClickClose() {
      this.status = ModalStatus.Hide;
    },
  },
  render() {
    return (
      <a-modal
        closable={true}
        visible={this.visible}
        onOk={this.nodeClickOk}
        title={'处理确定'}
        confirmLoading={this.loading}
        onCancel={this.nodeClickClose}
        destroyOnClose={true}
      >
        <a-form form={this.form}>
          <a-form-item
            label="处理时间"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-date-picker
              format={'YYYY-MM-DD HH:mm:ss'}
              showTime={true}
              v-decorator={[
                'processTime',
                {
                  initialValue: moment(new Date()),
                  rules: [
                    {
                      required: true,
                      message: '请选择时间',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (
                          new Date(value).getTime() > new Date().getTime() ||
                          new Date(value).getTime() <= this.previousTime.getTime()
                        ) {
                          callback(
                            `时间范围：${moment(this.previousTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                            )} - ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
                          );
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                },
              ]}
            ></a-date-picker>
          </a-form-item>
          <a-form-item
            label="处理意见"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
            placeholder="请输入处理建议"
          >
            <a-input
              v-decorator={[
                'comments',
                {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请说明处理意见',
                    },
                  ],
                },
              ]}
            ></a-input>
          </a-form-item>
          {this.isDetermine ? (
            <a-form-item
              label="判断节点执行"
              label-col={formConfig.labelCol}
              wrapper-col={formConfig.wrapperCol}
            >
              <a-radio-group
                v-decorator={[
                  'determineValue',
                  {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '请选择执行方式',
                      },
                    ],
                  },
                ]}
              >
                <a-radio value="true">{this.trueLabel}</a-radio>
                <a-radio value="false">{this.falseLabel}</a-radio>
              </a-radio-group>
            </a-form-item>
          ) : null}
        </a-form>
      </a-modal>
    );
  },
};
