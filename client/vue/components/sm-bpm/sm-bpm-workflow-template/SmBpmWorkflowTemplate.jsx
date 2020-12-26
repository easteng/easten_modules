import './style';
import { requestIsSuccess, vPermission, vP, vIf } from '../../_utils/utils';
import { tips as tipsConfig } from '../../_utils/config';
import { PageState, CompleteState } from '../../_utils/enum';
import SmBpmFormDesign from '../sm-bpm-form-design';
import SmBpmFlowDesign from '../sm-bpm-flow-design';
import KFormBuild from '../sm-bpm-form-design/src/components/KFormBuild';
import MemberSelect from '../../sm-system/sm-system-member-select';
import { v4 as uuidv4 } from 'uuid';
import { basicCheck, bpmCheck} from '../sm-bpm-flow-design/src/util/flowCheck';

import ApiWorkflowTemplate from '../../sm-api/sm-bpm/WorkflowTemplate';
import itemAlign from '../sm-bpm-flow-design/src/behavior/itemAlign';

import permissionsSmBpm from '../../_permissions/sm-bpm';

let apiWorkflowTemplate = new ApiWorkflowTemplate();

const initialFormData = {
  list: [
    {
      type: 'input',
      label: '单行文本',
      options: {
        width: '100%',
        defaultValue: '',
        placeholder: '请输入',
        disabled: false,
      },
      model: 'input_1577777106711',
      key: 'input_1577777106711',
      rules: [
        {
          required: true,
          message: '必填项',
        },
      ],
    },
  ],
  config: {
    layout: 'horizontal',
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
    hideRequiredMark: false,
    customStyle: '',
  },
};

const id1 = uuidv4();
const id2 = uuidv4();
const id3 = uuidv4();
const id4 = uuidv4();

const edgeid1 = uuidv4();
const edgeid2 = uuidv4();
const edgeid3 = uuidv4();

const initialFlowData = {
  nodes: [
    { id: id1, x: 300, y: 50, label: '开始节点', type: 'bpmStart' },
    { id: id2, x: 300, y: 250, label: '审批节点', type: 'bpmApprove' },
    { id: id3, x: 500, y: 250, label: '抄送节点', type: 'bpmCc' },
    { id: id4, x: 300, y: 450, label: '结束节点', type: 'bpmEnd' },
  ],
  edges: [
    { id: edgeid1, source: id1, target: id2, sourceAnchor: 2, targetAnchor: 4, type: 'flow' },
    { id: edgeid2, source: id2, target: id3, sourceAnchor: 1, targetAnchor: 3, type: 'flow' },
    { id: edgeid3, source: id2, target: id4, sourceAnchor: 2, targetAnchor: 4, type: 'flow' },
  ],
};

export default {
  name: 'SmBpmWorkflowTemplate',
  components: {
    KFormBuild,
  },
  props: {
    axios: { type: Function, default: null },
    pageState: { type: String, default: PageState.Add }, // 页面状态
    id: { type: String, default: null }, // 页面状态
    border: { type: Boolean, default: true },
    size: { type: String, default: null },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      activeKey: 1,
      workflow: {
        members: [],
      },
      formData: {},
      flowData: {
        nodes: [],
        edges: [],
      },
      formDataChanged: false,
      flowDataChanged: false,
      memberChanged: false,
      saveLoading: false,
      loading: false,
      iPageState: PageState.Add,
      nodeConfig: [
        { type: 'bpmStart', width: 80, height: 44, nodeProps: ["basic", "field-permission"] },
        { type: 'bpmApprove', width: 80, height: 44, nodeProps: ["basic", "member-select", "field-permission"] },
        { type: 'bpmCc', width: 80, height: 44, nodeProps: ["basic", "member-select", "field-permission"] },
        { type: 'bpmEnd', width: 80, height: 44, nodeProps: ["basic", "field-permission"] },
      ],
    };
  },
  computed: {
    isChanged() {
      return this.formDataChanged || this.flowDataChanged || this.memberChanged;
    },
    formItems() {
      return this.formData && this.formData.list ? this.formData.list : [];
    },
  },
  watch: {
    id: {
      handler: function (value, oldValue) {
        this.workflow.id = value;
        this.refresh();
      },
      immediate: true,
    },
    pageState: {
      handler: function (value, oldValue) {
        if (value) {
          this.iPageState = value;
          this.flowData = {};
          this.formData = {};
        }
      },
      immediate: true,
    },
    formData: {
      handler: function (value, oldValue) {
        this.formDataChanged = true;
        this.flowDataChanged = true;
      },
      deep: true,
    },
  },
  async created() {
    this.initAxios();
  },
  async mounted() {
    if (this.iPageState === PageState.Add) {
      this.workflow = {
        name: '新建工作流',
        members: [],
      };
      this.formData = initialFormData;
      this.flowData = initialFlowData;
      this.formDataChanged = true;
      this.flowDataChanged = true;
      this.$refs.smBpmFormDesign.data = this.formData;
    } else {
      this.refresh();
    }
  },
  methods: {
    initAxios() {
      apiWorkflowTemplate = new ApiWorkflowTemplate(this.axios);
    },
    async refresh() {
      if (!this.iPageState || this.iPageState === PageState.Add || !this.workflow.id) {
        return;
      }
      this.loading = true;
      let response = await apiWorkflowTemplate.get(this.workflow.id);

      if (requestIsSuccess(response) && response.data) {
        this.workflow = response.data;
        // 校验数据合法
        let formTemplate =
          this.workflow && this.workflow.formTemplate ? this.workflow.formTemplate : null;

        let flowTemplate =
          formTemplate &&
            formTemplate.flowTemplate &&
            formTemplate.flowTemplate.nodes &&
            formTemplate.flowTemplate.nodes.length
            ? formTemplate.flowTemplate
            : null;

        if (this.iPageState === PageState.Edit) {
          // 编辑模式
          this.formData = formTemplate
            ? {
              list: JSON.parse(formTemplate.formItems),
              config: JSON.parse(formTemplate.config),
            }
            : initialFormData;

          this.flowData = flowTemplate
            ? {
              nodes: flowTemplate.nodes,
              edges: flowTemplate.steps,
            }
            : initialFlowData;
          this.$nextTick(() => {
            this.$refs.smBpmFormDesign.data = this.formData;
          });
          // 查看模式
        } else {
          this.formData = formTemplate
            ? {
              list: JSON.parse(formTemplate.formItems),
              config: JSON.parse(formTemplate.config),
            }
            : {
              list: [],
              config: {
                layout: 'horizontal',
                labelCol: {
                  span: 4,
                },
                wrapperCol: {
                  span: 18,
                },
                hideRequiredMark: false,
                customStyle: '',
              },
            };

          this.flowData = {
            nodes: flowTemplate.nodes,
            edges: flowTemplate.steps,
          };
        }

        this.$nextTick(() => {
          this.formDataChanged = this.formData === initialFormData;
          this.flowDataChanged = this.flowData === initialFlowData;
          this.memberChanged = false;
        });
      }

      this.loading = false;
    },
    async onOk() {
      if (this.iPageState === PageState.View) {
        this.$emit('ok');
        return;
      }
      let response = null;
      // 获取流程最新数据
      let flowData = this.$refs.SmBpmFlowDesign.graph.save();
      //校验流程图
      if (basicCheck(flowData) && bpmCheck(flowData)) {
        if (this.iPageState === PageState.Add) {
          // 添加新数据，然后刷新
          response = await apiWorkflowTemplate.create({ name: this.workflow.name });
          if (requestIsSuccess(response)) {
            this.workflow.id = response.data.id;
            response = await apiWorkflowTemplate.updateFormTemplateAndFlowTemplate({
              id: this.workflow.id,
              ...{
                formItems: JSON.stringify(this.$refs.smBpmFormDesign.data.list),
                formConfig: JSON.stringify(this.$refs.smBpmFormDesign.data.config),
                flowNodes: flowData.nodes,
                flowSteps: flowData.edges,
              },
            });
            if (requestIsSuccess(response)) {
              this.formDataChanged = false;
              this.flowDataChanged = false;
              this.$message.info('保存成功');
              this.iPageState = PageState.Edit;
            }
          }
        } else if (this.iPageState === PageState.Edit) {
          if (this.formDataChanged && this.flowDataChanged) {
            this.saveLoading = true;
            response = await apiWorkflowTemplate.updateFormTemplateAndFlowTemplate({
              id: this.workflow.id,
              ...{
                formItems: JSON.stringify(this.$refs.smBpmFormDesign.data.list),
                formConfig: JSON.stringify(this.$refs.smBpmFormDesign.data.config),
                flowNodes: flowData.nodes,
                flowSteps: flowData.edges,
              },
            });
            if (requestIsSuccess(response)) {
              this.formDataChanged = false;
              this.flowDataChanged = false;
              this.$message.info('保存成功');
            }
          } else if (!this.formDataChanged && this.flowDataChanged) {
            response = await apiWorkflowTemplate.updateFlowTemplate({
              id: this.workflow.id,
              formTemplateId: this.workflow.formTemplate.id,
              flowNodes: flowData.nodes,
              flowSteps: flowData.edges,
            });

            if (requestIsSuccess(response)) {
              this.flowDataChanged = false;
              this.$message.info('保存成功');
            }
          } else if (this.memberChanged) {
            response = await apiWorkflowTemplate.updateMembers({
              id: this.workflow.id,
              members: this.workflow.members,
            });
            if (requestIsSuccess(response)) {
              this.memberChanged = false;
              this.$message.info('保存成功');
            }
            return;
          }
        }
        this.refresh();
        this.saveLoading = false;
        this.$emit('ok');
      }
    },
    onTabChange(value) {
      let _this = this;

      // 编辑发布权限之前必须保存并且处于发布状态
      if (value === 3 && !this.workflow.published) {
        // 检查是否发布
        this.$confirm({
          title: '提示',
          content: h => <div style="color:red;">工作流还未启用，是否启用并发布</div>,
          okType: 'danger',
          cancelText: '返回设计',
          okText: '启用并发布',
          onOk() {
            return new Promise(async (resolve, reject) => {
              let response = await apiWorkflowTemplate.updatePublishState(_this.workflow.id, true);

              if (requestIsSuccess(response)) {
                await _this.refresh();
                _this.activeKey = value;
              }

              setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
            });
          },
          onCancel() { },
        });
        return;
      } else {
        this.activeKey = value;
      }
    },
  },
  render() {
    return (
      <div class={`sm-bpm-workflow-template panel ${this.border ? 'border' : ''}`}>
        <a-tabs animated={true} activeKey={this.activeKey} onChange={this.onTabChange}>
          <a-tab-pane key={1} force-render>
            <span slot="tab">
              <span class="step-order">1</span>
              表单 {this.formDataChanged ? <span style="margin-left: 4px">*</span> : undefined}
            </span>

            {this.iPageState === PageState.View || this.workflow.isStatic ? (
              <a-card bordered={false}>
                <KFormBuild value={this.formData} ref="KFormBuild" axios={this.axios} />
              </a-card>
            ) : (
              <SmBpmFormDesign ref="smBpmFormDesign" bordered={false} axios={this.axios} />
            )}
          </a-tab-pane>

          <a-tab-pane key={2} force-render>
            <span slot="tab">
              <span class="step-order">2</span>
              流程 {this.flowDataChanged ? <span style="margin-left: 4px">*</span> : undefined}
            </span>
            <SmBpmFlowDesign
              ref="SmBpmFlowDesign"
              bordered={false}
              nodeConfig={this.nodeConfig}
              axios={this.axios}
              data={this.flowData}
              formItems={this.formItems}
              mode={
                this.iPageState === PageState.Add || this.iPageState === PageState.Edit
                  ? 'edit'
                  : 'view'
              }
              onChange={() => {
                this.flowDataChanged = true;//优化 流程不符合规范 不能点击保存按钮
              }}
            />
          </a-tab-pane>

          <a-tab-pane key={3} force-render disabled={this.formDataChanged || this.flowDataChanged}>
            <span slot="tab">
              <span class="step-order">3</span>
              权限{this.memberChanged ? <span style="margin-left: 4px">*</span> : undefined}
            </span>
            <a-card bordered={false}>
              <a-form-item label="发布权限">
                <MemberSelect
                  disabled={this.iPageState === PageState.View}
                  value={this.workflow.members}
                  onChange={value => {
                    this.memberChanged = true;
                    this.workflow.members = value;
                  }}
                  axios={this.axios}
                />
              </a-form-item>
            </a-card>
          </a-tab-pane>

          {/* <a-tab-pane key={4} force-render>
            <span slot="tab">
              <span class="step-order">4</span>
              数据
            </span>
            <a-table></a-table>
          </a-tab-pane> */}

          <div class="nav-buttons" slot="tabBarExtraContent">
            {this.iPageState === PageState.Add ? (
              <a-input
                size="small"
                value={this.workflow && this.workflow.name ? this.workflow.name : ''}
                onChange={$event => {
                  this.workflow.name = $event.target.value;
                }}
              ></a-input>
            ) : (
              <span> {this.workflow && this.workflow.name ? this.workflow.name : ''}</span>
            )}
            <span>{this.isChanged ? <span style="margin-left: 4px">*</span> : undefined}</span>

            <a-button
              size={this.size}
              type="link"
              disabled={this.iPageState === PageState.Add}
              onClick={this.refresh}
            >
              <a-icon type={this.loading ? 'loading' : 'reload'} />
            </a-button>

            <a-button
              size={this.size}
              type="link"
              disabled={this.activeKey === 1}
              onClick={() => {
                // this.activeKey--;
                this.onTabChange(this.activeKey - 1);
              }}
            >
              <a-icon type="left" />
              上一步
            </a-button>
            <a-button
              size={this.size}
              type="link"
              disabled={this.activeKey === 3 || (this.isChanged && this.activeKey === 2)}
              onClick={() => {
                // this.activeKey++;
                this.onTabChange(this.activeKey + 1);
              }}
            >
              下一步
              <a-icon type="right" />
            </a-button>

            <a-button
              size={this.size}
              onClick={() => {
                this.$emit('cancel');
              }}
              type="link"
            >
              返回
            </a-button>


            {this.iPageState !== PageState.View ? (
              <a-button
                loading={this.saveLoading}
                size={this.size}
                onClick={this.onOk}
                type="link"
                disabled={!this.isChanged}
              >
                保存
              </a-button>
            ) : (
              undefined
            )}
          </div>
        </a-tabs>
      </div>
    );
  },
};
