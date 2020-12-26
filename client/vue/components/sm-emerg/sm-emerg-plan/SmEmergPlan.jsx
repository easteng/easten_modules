import ApiEmergPlan from '../../sm-api/sm-emerg/EmergPlan';
import SmBpmFlowDesign from '../../sm-bpm/sm-bpm-flow-design';
import { PageState } from '../../_utils/enum';
import ComponentCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import './style/index.less';
import * as utils from '../../_utils/utils';
import ApiFault from '../../sm-api/sm-emerg/Fault';
import * as moment from 'moment';
import { getDeltaTime } from '../../sm-bpm/sm-bpm-flow-design/src/util/time';
import SmEmergPlanModal from './SmEmergPlanModal';
import SmPeopleInformationModal from './SmPeopleInformationModal';
import { clickNodeCheck, basicCheck, emergPlanFlowCheck } from '../../sm-bpm/sm-bpm-flow-design/src/util/flowCheck';
import SmFileTextEditor from '../../sm-file/sm-file-text-editor';
import SmSparePartsInformationModal from './SmSparePartsInformationModal';
let apiEmergPlan = new ApiEmergPlan();
let apiFault = new ApiFault();
const formFields = ['name', 'summary', 'levelId', 'componentCategoryIds', 'remark', 'file'];

export default {
  name: 'SmEmergPlan',
  props: {
    axios: { type: Function, default: null },
    id: { type: String, default: null },
    pageState: { type: String, default: PageState.View }, // 页面状态
    isApply: { type: Boolean, default: false }, //是否为调用状态
    faultId: { type: String, defaut: null },//故障id
  },
  data() {
    return {
      moadlForm: {},
      form: {},
      loading: false,
      flowData: {
        //流程图数据
        nodes: [],
        edges: [],
      },
      content: '', //图文资料
      file: [], //主要附件
      nodeConfigs: [
        //节点类型
        { type: 'bpmStart', width: 80, height: 44, nodeProps: ['basic', 'member-select'] }, //开始
        {
          type: 'process',
          width: 80,
          height: 44,
          nodeProps: ['basic', 'member-select', 'message'],
        }, //预定义流程
        { type: 'determine', width: 80, height: 44, nodeProps: ['basic', 'condition'] }, //判定流程
        {
          type: 'subProcess',
          width: 80,
          height: 44,
          nodeProps: ['basic', 'member-select', 'message'],
        }, //子流程
        { type: 'bpmEnd', width: 80, height: 44, nodeProps: ['basic'] }, //结束
        { type: 'bpmCc', width: 80, height: 44, nodeProps: ['basic', 'member-select'] }, //抄送流程
      ],
      inStamp: 0, //故障开始时间（毫秒）
      deltaSum: 0, //故障处理时间
      initeval: null,
      processRecords: [], //故障处理记录
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      currentNodeIds: [],//用户可点击节点id
    };
  },
  computed: {
    setPageState() {
      return this.isApply ? PageState.View : PageState.Add;
    },
  },
  watch: {
    id: {
      handler: function (value, oldValue) {
        if (value) {
          this.flowData = {};
          this.refresh();
        }
      },
      // immediate: true,
    },
    faultId: {
      handler: function (value, oldValue) {
        if (value) {
          this.flowData = {};
          this.refresh();
        }
      },
    },
    isApply: {
      handler: function (value, oldValue) {
        if (value) {
          this.refresh();
        }
      },
      // immediate: true,
    },
    pageState: {
      handler: function (value, oldValue) {
        this.flowData = {};
        this.refresh();
      },
      // immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
    this.form = this.$form.createForm(this, {});
    this.fileServerEndPoint = localStorage.getItem('fileServerEndPoint');
  },
  destroyed() {
    clearInterval(this.initeval);
  },
  mounted() {
    this.initStep();
  },
  methods: {
    initAxios() {
      apiEmergPlan = new ApiEmergPlan(this.axios);
      apiFault = new ApiFault(this.axios);
    },
    getNodelLabel(nodeId) {
      if (this.flowData.nodes) {
        let node = this.flowData.nodes.find(x => x.id === nodeId);
        return node && node.label ? node.label : '';
      }
    },
    processTime(index) {
      let delTime = 0;
      if (index === 0) {
        delTime = new Date(this.processRecords[index].time).getTime() - this.inStamp;
      } else {
        delTime =
          new Date(this.processRecords[index].time).getTime() -
          new Date(this.processRecords[index - 1].time).getTime();
      }

      let sum = getDeltaTime(delTime);
      return `${sum.d ? sum.d + ' 天 ' : ''}${sum.h} 小时 ${sum.m} 分钟 ${sum.s} 秒`;
    },
    //故障时间计算
    initStep(outStamp) {
      clearInterval(this.initeval);
      if (outStamp) {
        let delta = outStamp - this.inStamp;
        let sum = getDeltaTime(delta);
        this.deltaSum = `${sum.d ? sum.d + ' 天 ' : ''}${sum.h} : ${sum.m} : ${sum.s}`;
      } else {
        this.loopNow();
        this.initeval = setInterval(() => {
          this.loopNow();
        }, 1000);
      }
    },
    loopNow() {
      let outStamp = new Date().getTime();
      let delta = outStamp - this.inStamp;
      let sum = getDeltaTime(delta);
      this.deltaSum = `${sum.d ? sum.d + ' 天 ' : ''}${sum.h} : ${sum.m} : ${sum.s}`;
    },
    async refresh() {
      if (!this.isApply) {
        if (this.pageState !== PageState.Add && this.id !== null) {
          let response = await apiEmergPlan.get(this.id);
          if (utils.requestIsSuccess(response) && response.data) {
            let emergPlan = response.data;
            // this.content = emergPlan.content.replace(
            //   new RegExp(`src="`, 'g'),
            //   `src="${this.fileServerEndPoint}`,
            // );
            this.content = emergPlan.content;
            let _emergPlan = {
              ...emergPlan,
              componentCategoryIds: emergPlan.emergPlanRltComponentCategories
                ? emergPlan.emergPlanRltComponentCategories.map(item => item.componentCategoryId)
                : '',
              file: emergPlan.emergPlanRltFiles
                ? emergPlan.emergPlanRltFiles.map(item => item.file)
                : '',
              levelId: emergPlan.level == null ? null : emergPlan.level.id,
            };
            let flowData = emergPlan.flow;
            this.$nextTick(() => {
              this.flowData = JSON.parse(flowData);
              let values = utils.objFilterProps(_emergPlan, formFields);
              this.form.setFieldsValue(values);
            });
          }
        }
      } else if (this.isApply && this.pageState == this.setPageState) {
        if (this.faultId) {
          let faultResponse = await apiFault.get(this.faultId);
          let fault = faultResponse.data;
          this.currentNodeIds = fault.currentNodeIds;
          let flowData = fault.emergPlanRecord.flow;
          this.inStamp = new Date(fault.checkInTime).getTime();
          this.processRecords = fault.emergPlanRecord.processRecords;
          this.flowData = JSON.parse(flowData);
          this.flowData.nodes.forEach(node => {
            if (node.type == "bpmEnd" && node.processed == true) {
              let endTime = new Date(node.processTime).getTime();
              this.initStep(endTime);
            }
          });
        }
      }

    },
    //数据提交
    ok() {
      let flowData = this.$refs.SmBpmFlowDesign.graph.save();
      this.form.validateFields(async (err, value) => {
        if (!err) {
          if (basicCheck(flowData)) {
            if (emergPlanFlowCheck(flowData)) {
              let _values = value;
              // let _content = this.$refs['sc-rich-text-editor'].content();
              // let reg = new RegExp(`${this.fileServerEndPoint}`, 'g');
              let data = {
                ..._values,
                flow: JSON.stringify(flowData),
                content: this.content, //'_content.replace(reg, '')',
                fileIds: _values.file.map(item => item.id),
              };
              this.loading = true;
              if (this.pageState === PageState.Add) {
                let response = await apiEmergPlan.create(data);
                if (utils.requestIsSuccess(response)) {
                  this.$message.info('操作成功');
                  this.refresh();
                  this.form.resetFields();
                  this.flowData = {};
                  this.$emit('ok', this.id);
                }
              }
              if (this.pageState === PageState.Edit) {
                let _data = { id: this.id, ...data };
                let response = await apiEmergPlan.update(_data);
                if (utils.requestIsSuccess(response)) {
                  this.$message.info('更新成功');
                  this.refresh();
                  this.form.resetFields();
                  this.flowData = {};
                  this.content = '';
                  this.$emit('ok', this.id);
                }
              }
              this.loading = false;
            }
          }
        }
      });
    },
    //关闭
    close() {
      this.flowData = {};
      this.form.resetFields();
      this.$emit('cancel');
    },

    //节点点击事件
    async nodeClick(data) {
      if (clickNodeCheck(this.flowData, data)) {
        if (this.currentNodeIds.length > 0) {
          this.currentNodeIds.forEach(element => {
            if (element === data.nodeId) {
              this.$refs.SmEmergPlanModal.nodeClick(
                data,
                this.flowData,
                this.processRecords,
                this.inStamp,
                this.faultId,
              );
            } else {
              this.$message.error("没有权限处理");
            }
          });
        } else {
          this.$message.error("没有权限处理");
        }
      }
    },

    openModal(){
      this.$refs.smPeopleInformationModal.clickOpen();
    },
    openSparePartsModal(){
      this.$refs.SmSparePartsInformationModal.clickOpen();
    },
  },

  render() {
    return (
      <div class="SmEmergPlan">
        {this.isApply && this.pageState == this.setPageState ? (
          <div class="flow-content">
            <div class="flow">
              <SmBpmFlowDesign
                class="sm-bpm-flow-design"
                ref="SmBpmFlowDesign"
                bordered={false}
                nodeConfig={this.nodeConfigs}
                axios={this.axios}
                data={this.flowData}
                fixPadding={15}
                mode='view'
                audit={true}
                onNodeClick={this.nodeClick}
              />
            </div>
            <div class="steps">
              <div class="time-title">故障时长：{this.deltaSum}</div>
              <br />
              <a-steps direction={'vertical'} current={this.processRecords.length} style="margin-right: 26px;" >
                {this.processRecords.map((item, index, arr) => {
                  return (
                    <a-step
                      class="flow-step-item"
                      title={this.getNodelLabel(item.nodeId)}
                      subTitle={item.handleUserName?' ( ' + item.handleUserName + ' ) ':''}
                    >
                      {item.handleUserName ? [
                        <div slot="description" class="description"><span class="descriptionFont">处理时间：</span>
                          {moment(item.time).format('YYYY-MM-DD HH:mm:ss')}
                        </div>,
                        <div slot="description" class="description"><span class="descriptionFont">历时：</span>{this.processTime(index)}</div>,
                        <div slot="description" class="description"><span class="descriptionFont">处理建议：</span>{item.comments}</div>,
                      ]:''}
                    </a-step>
                  );
                })}
              </a-steps>
            </div>
            <div class="options">
              <a-button type="primary" onClick={() => this.openModal()}>人员信息</a-button>
              <a-button type="primary" ghost onClick={() => this.openSparePartsModal()}>备品信息</a-button>
              <a-button  onClick={() => this.close()}>返回</a-button>
              <SmPeopleInformationModal
                axios={this.axios}
                ref="smPeopleInformationModal"
                //permissions={this.permissions}
              />
              <SmSparePartsInformationModal ref="SmSparePartsInformationModal" axios={this.axios} />
            </div>
          </div>
        ) : (
          <div>
            <a-form form={this.form} >
              <a-row >
                <a-col span="12">
                  <a-form-item
                    label="预案名称"
                    label-col={this.labelCol}
                    wrapper-col={this.wrapperCol}
                  >
                    <a-input
                      disabled={this.pageState == PageState.View}
                      v-decorator={[
                        'name',
                        {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入预案名称',
                            },
                            {
                              whitespace: true,
                              message: "请输入预案名称",
                            },
                          ],
                        },
                      ]}
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col span="12">
                  <a-form-item
                    label="预案摘要"
                    label-col={this.labelCol}
                    wrapper-col={this.wrapperCol}
                  >
                    <a-input
                      disabled={this.pageState == PageState.View}
                      v-decorator={[
                        'summary',
                        {
                          initalValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入预案摘要',
                            },
                            {
                              whitespace: true,
                              message: "请输入预案摘要",
                            },
                          ],
                        },
                      ]}
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="12">
                  {/* 构件分类 */}
                  <a-form-item
                    label="构件类型"
                    label-col={this.labelCol}
                    wrapper-col={this.wrapperCol}
                  >
                    <ComponentCategoryTreeSelect
                      axios={this.axios}
                      disabled={this.pageState == PageState.View}
                      placeholder="请选择"
                      treeCheckable={true}
                      treeCheckStrictly={true}
                      v-decorator={[
                        'componentCategoryIds',
                        {
                          initalValue: [],
                          rules: [
                            {
                              required: true,
                              message: '请选择构件类型',
                            },
                          ],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>
                <a-col span="12">
                  <a-form-item
                    label="预案等级"
                    label-col={this.labelCol}
                    wrapper-col={this.wrapperCol}
                  >
                    <DataDictionaryTreeSelect
                      axios={this.axios}
                      groupCode={'EmergPlanLevel'}
                      disabled={this.pageState == PageState.View}
                      v-decorator={[
                        'levelId',
                        {
                          initialValue: null,
                          rules: [
                            {
                              required: true,
                              message: '请选择预案等级',
                            },
                          ],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-form-item
                  label="预案流程"
                  label-col={{ span: 2 }}
                  wrapper-col={{ span: 22 }}
                >
                  <SmBpmFlowDesign
                    class="sm-bpm-flow-design"
                    ref="SmBpmFlowDesign"
                    fixPadding={15}
                    nodeConfig={this.nodeConfigs}
                    axios={this.axios}
                    data={this.flowData}
                    mode={this.pageState === PageState.View ? 'view' : 'edit'}
                  />
                </a-form-item>
              </a-row>
              <a-row>
                <a-col span={12}>
                  <a-form-item label="主要附件"
                    label-col={this.labelCol}
                    wrapper-col={this.wrapperCol}
                  >
                    <SmFileManageSelect
                      class="ant-input"
                      style="margin-top: 3px;"
                      axios={this.axios}
                      disabled={this.pageState == PageState.View}
                      height={10}
                      bordered={true}
                      v-decorator={[
                        'file',
                        {
                          initialValue: [],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-col>
                <a-col span={12}>
                  <a-form-item
                    label="备注"
                    label-col={this.labelCol}
                    wrapper-col={this.wrapperCol}
                  >
                    <a-input
                      disabled={this.pageState == PageState.View}
                      v-decorator={[
                        'remark',
                        {
                          initalValue: [],
                          rules: [],
                        },
                      ]}
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>

              {/* 图文资料 */}
              <a-form-item label="图文资料"
                label-col={{ span: 2 }}
                wrapper-col={{ span: 22 }}
              >
                <a-input
                  type="textArea"
                  value={this.content}
                  disabled={this.pageState == PageState.View}
                  onChange={event => this.content = event.target.value}
                >
                </a-input>
                {/* <SmFileTextEditor
                    ref="sc-rich-text-editor"
                    axios={this.axios}
                    value={this.content}
                    disabled={this.pageState == PageState.View}
                    height={400}
                    multiple={true}
                    onChange={value => (this.content = value)}
                  /> */}
              </a-form-item>
            </a-form>
          </div>
        )
        }
        {/* < div style="float: left;" >
          {
            this.pageState !== PageState.View ? (
              [
                <a-row>
                  <a-col sm={12} md={12}>
                    <a-col span={5}></a-col>
                    <a-button
                      type="primary"
                      loading={this.loading}
                      style="margin-right: 10px"
                      onClick={this.ok}
                    >
                      保存
                    </a-button>
                   <a-button onClick={this.close}>取消</a-button>
                  </a-col>
                  <a-col></a-col>
                </a-row>,
              ]
            ) : (
                <a-button onClick={this.close}>返回</a-button>
              )
          }
        </div > */}
        <a-col sm={12} md={12}>
          <a-col span={4}></a-col>
          <a-col span={8} style="padding-left: 0px; padding-right: 0px;">
            {this.pageState !== PageState.View
              ? [
                <a-button
                  type="primary"
                  loading={this.loading}
                  style="margin-right: 10px"
                  onClick={this.ok}
                >
                  确定
                </a-button>,
                <a-button
                  onClick={this.close}
                >
                  取消
                </a-button>,

              ]
              : this.isApply ? '' : [<a-button onClick={this.close}>返回</a-button>]
            }
          </a-col>
        </a-col>
        <a-col sm={12} md={12}></a-col>
        <SmEmergPlanModal ref="SmEmergPlanModal" axios={this.axios} onSuccess={this.refresh} />
      </div >
    );
  },
};
