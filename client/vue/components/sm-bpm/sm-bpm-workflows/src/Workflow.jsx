import ApiWorkflowTemplate from '../../../sm-api/sm-bpm/WorkflowTemplate';
import ApiWorkflow from '../../../sm-api/sm-bpm/Workflow';
import { requestIsSuccess, getWorkflowState } from '../../../_utils/utils';
import { WorkflowStepState, WorkflowState, UserWorkflowGroup} from '../../../_utils/enum';
import { tips as tipsConfig } from '../../../_utils/config';
import KFormBuild from '../../sm-bpm-form-design/src/components/KFormBuild';
import SmBpmFlowDesign from '../../sm-bpm-flow-design';
import WorkInfos from './WorkInfos';
import './style/Workflow.less';
import itemAlign from '../../sm-bpm-flow-design/src/behavior/itemAlign';

let apiWorkflowTemplate = new ApiWorkflowTemplate();
let apiWorkflow = new ApiWorkflow();

export default {
  name: 'Workflow',
  props: {
    axios: { type: Function, default: null },
    id: { type: String, default: null },
    isInitial: { type: Boolean, default: false }, // 首次发起
    okButtonVisible: { type: Boolean, default: false }, // 首次发起
    title: { type: String, default: null }, // 标题
    group: { type: Number, default: null },//工作流页面状态
  },
  data() {
    return {
      workflow: {
        state: WorkflowState.Finished,
        name: '',
      },
      formData: {},
      formValue: null,
      flowData: {
        nodes: [],
        edges: [],
      },
      comments: '',
      loading: false,
      // canNodeClick: false,
      top: 0,
      left: 0,
    };
  },
  computed: {
    state: function () {
      let text = null;
      if (this.isInitial) {
        text = '等待发起';
      } else {
        text = getWorkflowState(this.workflow.state);
      }
      return text;
    },
  },
  watch: {
    id: {
      handler: function () {
        this.refresh();
      },
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  destroyed() {
    window.removeEventListener('onmouseover', onmouseover);
  },
  methods: {
    initAxios() {
      apiWorkflowTemplate = new ApiWorkflowTemplate(this.axios);
      apiWorkflow = new ApiWorkflow(this.axios);
    },

    async refresh() {
      this.loading = true;

      // 首次发起
      if (this.isInitial) {
        let response = null;
        response = await apiWorkflowTemplate.GetWorkflowForInitial(this.id);
        if (requestIsSuccess(response)) {
          this.workflow = response.data;
          this.formData = {
            list: JSON.parse(this.workflow.formItems),
            config: JSON.parse(this.workflow.formConfig),
          };
          this.flowData = {
            nodes: this.workflow.flowNodes,
            edges: this.workflow.flowSteps,
          };
        }
      } else {
        let response = null;
        response = await apiWorkflow.get(this.id);
        if (requestIsSuccess(response)) {
          this.workflow = response.data;
          this.formData = {
            list: JSON.parse(this.workflow.formItems),
            config: JSON.parse(this.workflow.formConfig),
          };
          this.formValue = JSON.parse(this.workflow.formValue);
          this.flowData = {
            nodes: response.data.flowNodes,
            edges: response.data.flowSteps,
          };
          this.$nextTick(() => {
            this.$refs.KFormBuild.setData(this.formValue);
          });
        }
      }

      this.loading = false;
    },
    async ok(stepState = null) {
      // 发起工作流
      if (stepState === null) {
        return new Promise((resolve, reject) => {
          this.$refs.KFormBuild.getData()
            .then(async res => {
              let response = await apiWorkflow.create({
                workflowTemplateId: this.id,
                formValues: JSON.stringify(res),
              });
              if (requestIsSuccess(response)) {
                this.$message.success('发起成功');
                this.$emit('success', true);
                resolve(res);
              } else {
                reject();
              }
            })
            .catch(err => {
              reject();
            });
          return true;
        });
      } else if (stepState == WorkflowStepState.Rejected) {
        // 判断当前节点的在工作流中所处的位置
        let params = {
          targetNodeId: this.workflow.currentUserActivedStep.target,
          id: this.workflow.id,
        };
        let response = await apiWorkflow.canReturnStep(params);
        if (requestIsSuccess(response)) {
          if (response.data) {
            // 执行操作
            this.process(stepState);
          } else {
            return new Promise((resolve, reject) => {
              this.$message.warning('第一级审批人无法退回审批');
              resolve();
            });
          }
        }
      } else {
        this.process(stepState);
      }
    },
    // 处理流程
    process(stepState) {
      return new Promise((resolve, reject) => {
        this.$refs.KFormBuild.getData()
          .then(async res => {
            let response = await apiWorkflow.process({
              formValues: JSON.stringify(res),
              sourceNodeId: this.workflow.currentUserActivedStep.source,
              targetNodeId: this.workflow.currentUserActivedStep.target,
              stepState,
              comments: this.comments,
              id: this.workflow.id,
            });

            if (requestIsSuccess(response)) {
              if (stepState === WorkflowStepState.Rejected) {
                this.$message.success('流程已退回');
              } else if (stepState === WorkflowStepState.Approved) {
                this.$message.success('审批成功');
              } else if (stepState === WorkflowStepState.Stopped) {
                this.$message.success('审批已拒绝');
              }
              this.$emit('success');
              resolve(res);
            } else {
              reject();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  },
  render() {
    return (
      <div class="workflow">
        <a-divider style="font-size: 14px">
          {this.workflow.name}（{this.state}）
        </a-divider>
        <a-tabs animated={true}>
          <a-tab-pane key={1} force-render>
            <span slot="tab">表单</span>
            <KFormBuild
              axios={this.axios}
              value={this.formData}
              defaultValue={this.formValue}
              ref="KFormBuild"
            />
          </a-tab-pane>

          <a-tab-pane key={2} force-render>
            <span slot="tab">流程</span>
            {this.isInitial ? [
              <SmBpmFlowDesign
                fixPadding={10}
                bordered={false}
                style="width: 100%; min-width: 300px; height: 100%; min-height:200px"
                data={this.flowData}
                mode="view"
              />,
            ] :
              <div class="workflow-info">
                <div class="flow">
                  <SmBpmFlowDesign
                    fixPadding={10}
                    bordered={false}
                    style="width: 100%; min-width: 300px; height: 100%; min-height:200px"
                    data={this.flowData}
                    mode="view"
                    audit={true}
                    onNodeMouseenter={data => this.nodeClick(data)}
                    onNodeMouseleave={eve => this.closePopconfirm()}
                  />
                </div>
                <div class="info">
                  <WorkInfos
                    axios={this.axios}
                    workflowId={this.id}
                  />
                </div>
              </div>
            }
          </a-tab-pane>
        </a-tabs>

        <div class="operator">
          {this.isInitial ? (
            <a-button
              style="margin: 0 20px;"
              type="primary"
              shape="round"
              loading={this.loading}
              onClick={() => {
                this.ok();
              }}
            >
              发起
            </a-button>
          ) : this.workflow.state == WorkflowState.Waiting &&
            this.workflow.currentUserActivedStep &&
            [UserWorkflowGroup.Waiting].indexOf(
              this.group,
            ) >= 0 ? (
              <div>
                <a-divider class="title">审批</a-divider>
                <a-textarea
                  value={this.comments}
                  onChange={event => {
                    this.comments = event.target.value;
                  }}
                  placeholder="请输入审批意见"
                  rows={4}
                ></a-textarea>

                <div class="btns">
                  <a-button
                    loading={this.loading}
                    onClick={() => {
                      let _this = this;
                      this.$confirm({
                        title: tipsConfig.remove.title,
                        content: h => <div style="color:red;">"你确定要退回此流程吗"</div>,
                        okType: 'danger',
                        onOk() {
                          // 退回之前先判断当前的用户的属于工作流的哪一个节点，如果时发起后的第一个节点，则无法使用退回的功能
                          _this.ok(WorkflowStepState.Rejected);
                        },
                      });
                    }}
                  >
                      退回
                  </a-button>
                  <a-button
                    type="danger"
                    loading={this.loading}
                    onClick={() => {
                      let _this = this;
                      this.$confirm({
                        title: tipsConfig.remove.title,
                        content: h => <div style="color:red;">"你确定要拒绝此流程吗"</div>,
                        okType: 'danger',
                        onOk() {
                          _this.ok(WorkflowStepState.Stopped);
                        },
                      });
                    }}
                  >
                      拒绝
                  </a-button>
                  <a-button
                    type="primary"
                    loading={this.loading}
                    onClick={() => {
                      this.ok(WorkflowStepState.Approved);
                    }}
                  >
                      通过
                  </a-button>
                </div>
              </div>
            ) : (
              undefined
          // <a-result
          //   style="padding: 0 32px; padding-bottom: 20px;"
          //   status="success"
          //   title="审批完成"
          //   sub-title=""
          // ></a-result>
            )}
        </div>
      </div>
    );
  },
};
