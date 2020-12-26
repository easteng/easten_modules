import moment from 'moment';
import {
  PageState,
  RepairLevel,
  SkylightType,
  PlanState,
  PlanType,
  SelectablePlanType,
  RelateRailwayType,
} from '../../_utils/enum';
import StationCascader from '../../sm-basic/sm-basic-station-cascader';
import SmBasicRailwayTreeSelect from '../../sm-basic/sm-basic-railway-tree-select';

import ApiSkyLightPlan from '../../sm-api/sm-cr-plan/SkyLightPlan';
import ApiInfluenceRange from '../../sm-api/sm-std-basic/InfluenceRange';
import SmCrPlanAddSelectablePlanModal from '../sm-cr-plan-add-selectable-plan-modal';
import RelateEquipmentModal from './RelateEquipmentModal';
import SmAddInfluenceModal from './SmAddInfluenceModal';
import SmBasicInstallationSiteSelect from '../../sm-basic/sm-basic-installation-site-select';
import { requestIsSuccess, getRepairLevelTitle } from '../../_utils/utils';
import * as utils from '../../_utils/utils';
import './style/index.less';

let apiSkyLightPlan = new ApiSkyLightPlan();
let apiInfluenceRange = new ApiInfluenceRange();

const formFields = ['workArea', 'timeLength', 'railwayId', 'incidence'];

export default {
  name: 'SmCrPlanSkylightPlan',
  props: {
    organizationId: { type: String, default: null },
    planType: { type: Number, default: SkylightType.Vertical },
    planDate: { type: String, default: null },
    axios: { type: Function, default: null },
    pageState: { type: String, default: PageState.Add }, // 页面状态
    id: { type: String, default: null },
    bordered: { type: Boolean, default: false },
    repairTagKey: { type: String, default: null }, //维修项标签
    // repairTagKey: { type: String, default: "RepairTag.RailwayWired" }, //维修项标签
  },
  data() {
    return {
      plan: null,
      iId: null,
      iOrganizationId: null,
      iPlanDate: null,
      railwayId: undefined,
      stationId: undefined,
      stationRelateRailwayType: RelateRailwayType.SINGLELINK,
      iPlanType: SkylightType.Vertical,
      iPageState: PageState.Add,
      iBordered: false,
      record: null,
      visible: false,
      form: this.$form.createForm(this, {}),
      installationSiteId: null,
      verticalSkylightPlan: null,
      planDetails: [], //待选计划选中项
      waitingPlanTime: null, //待选计划过滤时间
      planCount: 0,
      loading: false,
      defaultLevel: RepairLevel.LevelII, //默认维修级别
      influenceRanges: [], //可选的影响范围
      influenceRangesOptions: [],
    };
  },

  computed: {
    planDetailIds() {
      return this.planDetails.map(item => item.dailyPlanId);
    },
    columns() {
      return [
        {
          title: '年/月表',
          dataIndex: 'planTypeStr',
          scopedSlots: { customRender: 'planTypeStr' },
          width: 80,
        },
        {
          title: '序号',
          dataIndex: 'number',
          scopedSlots: { customRender: 'number' },
          width: 110,
        },
        {
          title: '设备名称',
          ellipsis: true,
          dataIndex: 'equipName',
        },
        {
          title: '工作内容',
          ellipsis: true,
          dataIndex: 'content',
        },
        {
          title: '日期',
          dataIndex: 'planDate',
          ellipsis: true,
          scopedSlots: { customRender: 'planDate' },
        },
        {
          title: '单位',
          ellipsis: true,
          dataIndex: 'unit',
          width: 60,
        },
        {
          title: '计划数量',
          dataIndex: 'count',
        },
        {
          title: '作业数量',
          dataIndex: 'workCount',
          scopedSlots: { customRender: 'workCount' },
        },
        {
          title: '关联设备',
          dataIndex: 'relateEquipments',
          width: 240,
          scopedSlots: { customRender: 'relateEquipments' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 110,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {
    organizationId: {
      handler: function (value, oldValue) {
        this.iOrganizationId = value;
      },
      immediate: true,
    },
    planDate: {
      handler: function (value, oldValue) {
        this.iPlanDate = value;
        this.waitingPlanTime = value;
      },
      immediate: true,
    },
    planType: {
      handler: function (value, oldValue) {
        this.iPlanType = value;
        if (this.iPlanType === PlanType.OutOf) {
          this.defaultLevel = RepairLevel.LevelIv;
        }
      },
      immediate: true,
    },
    id: {
      handler: function (value, oldValue) {
        this.iId = this.id;
        this.plan = null;
        this.planDetails = [];
        this.form.resetFields();
        if (value) {
          this.initAxios();
          this.refresh();
        }
      },
      immediate: true,
    },

    pageState: {
      handler: function (value, oldValue) {
        this.iId = this.id;
        this.iPageState = value;
        if (value != PageState.Add) {
          this.initAxios();
          this.refresh();
        } else {
          this.planDetails = [];
          this.form.resetFields();
        }
      },
      immediate: true,
    },

    bordered: {
      handler: function (value, oldValue) {
        this.iBordered = value;
      },
      // immediate: true,
    },
  },

  async created() {
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiSkyLightPlan = new ApiSkyLightPlan(this.axios);
      apiInfluenceRange = new ApiInfluenceRange(this.axios);
    },
    //初始化表单
    async refresh(id) {
      if (id) {
        this.iId = id;
      }
      if (!this.pageState || this.pageState === PageState.Add) {
        return;
      }
      this.getInfluenceRanges(this.defaultLevel);
      let response = await apiSkyLightPlan.get({ id: this.iId, repairTagKey: this.repairTagKey });
      if (requestIsSuccess(response)) {
        this.plan = response.data;
        this.installationSiteId = this.plan.workSiteId;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.plan, formFields);
          values = {
            ...values,
            level: this.plan.level,
            stationId: this.plan.stationId,
            workTime: moment(this.plan.workTime),
            workSiteId: this.plan.workSiteId,
          };
          this.railwayId = this.plan.railwayId;
          //选中站点类型 用于站点级联选择控件
          this.stationRelateRailwayType = this.plan.stationRelateRailwayType;
          this.planDetails = this.plan.planDetails
            ? this.plan.planDetails.map(item => {
              return {
                ...item,
                ifdCodes: item.dailyPlan ? item.dailyPlan.ifdCodes : [],
                dailyPlanId: item.dailyPlanId,
                planTypeStr: item.dailyPlan ? item.dailyPlan.planTypeStr : '',
                planType: item.dailyPlan ? item.dailyPlan.planType : null,
                number: item.dailyPlan ? item.dailyPlan.number : null,
                equipName: item.dailyPlan ? item.dailyPlan.equipName : null,
                content: item.dailyPlan ? item.dailyPlan.content : null,
                planDate: item.dailyPlan
                  ? moment(item.dailyPlan.planDate).format('YYYY-MM-DD')
                  : '',
                unit: item.dailyPlan ? item.dailyPlan.unit : '',
                count: item.dailyPlan ? item.dailyPlan.count : null,
                unFinishCount: item.dailyPlan ? item.dailyPlan.unFinishCount : null,
                workCount: item.planCount,
                workCountOld: item.planCount,
                relateEquipments: item.relateEquipments.map(item => {
                  return {
                    name: item.equipmentName,
                    id: item.equipmentId,
                    workCount: item.planCount,
                  };
                }),
              };
            })
            : [];
          this.form.setFieldsValue(values);
        });
      }
    },

    addPlans() {
      this.visible = true;
      //this.getInfluenceRanges(this.defaultLevel);
    },

    async relate(record = null) {
      this.record = record;
      let count = (record.unFinishCount + record.workCountOld).toFixed(3);
      this.$refs.RelateEquipmentModal.relate(record, record.ifdCodes, count);
    },

    //设置时间禁选项
    disabledDate(current) {
      return (
        current <=
        moment(this.iPlanDate)
          .subtract(1, 'month')
          .endOf('month') ||
        current >=
        moment(this.iPlanDate)
          .add(1, 'month')
          .startOf('month')
      );
    },

    //获取已选计划列表
    getSelectedPlans(selectVal) {
      let planDetails = JSON.parse(JSON.stringify(selectVal));
      let _planDetails = [];
      for (let item of planDetails) {
        let target = this.planDetails.find(_item => _item.dailyPlanId === item.id);
        if (!target) {
          item.dailyPlanId = item.id;
          item.workCount = item.unFinishCount;
          item.relateEquipments = [];
          item.dailyPlanId = item.planId;
          item.workCountOld = 0;
          item.influenceRangeId = null;
          _planDetails.push(item);
        }
      }
      this.planDetails = [..._planDetails, ...this.planDetails];
      this.planDetails.map(x => {
        let nums = x.number.split('-');
        let newNumber = '';
        for (let i = 0; i < nums.length; i++) {
          const ele = nums[i];
          newNumber += ele.padStart(3, '0');
        }
        x.sortNumber = newNumber;
      });
      this.planDetails.sort(function (x, y) {
        return x.sortNumber - y.sortNumber;
      });
    },

    save() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let data = JSON.parse(JSON.stringify(values));
          data.workTime = moment(values.workTime)
            .utc()
            .format();
          data.organizationId =
            this.iPageState != PageState.Add ? this.plan.organizationId : this.iOrganizationId;
          data.planType = this.iPlanType;
          data.planState = PlanState.NoPublish;
          data.stationRelateRailwayType = this.stationRelateRailwayType;
          data.planDetails = this.planDetails.map(item => {
            let result = {
              dailyPlanId: item.dailyPlanId,
              planCount: item.workCount != null ? item.workCount : 0,
              influenceRangeId: item.influenceRangeId,
              relateEquipments: item.relateEquipments.map(subItem => {
                return {
                  equipmentId: subItem.id,
                  planCount: subItem.workCount,
                };
              }),
            };
            if (this.iPageState == PageState.Edit) {
              result = {
                ...result,
                id: item.id,
              };
            }
            return result;
          });
          if (data.planDetails.find(item => item.planCount === 0)) {
            this.$message.error('计划内容作业数量不能为 0 !');
          } else {
            this.loading = true;
            if (this.iPageState === PageState.Add) {
              let response = await apiSkyLightPlan.create(false, data, this.repairTagKey);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('ok');
                this.form.resetFields();
                this.planDetails = [];
              }
            } else if (this.iPageState === PageState.Edit) {
              let response = await apiSkyLightPlan.update(
                false,
                { id: this.id, ...data },
                this.repairTagKey,
              );
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('ok', this.id);
                this.form.resetFields();
                this.planDetails = [];
              }
            }
          }
        }
      });
      this.loading = false;
    },
    remove(record) {
      let index = this.planDetails.indexOf(record);
      if (index > -1) this.planDetails.splice(index, 1);
    },

    getWorkCount(record) {
      let workCount = 0;
      for (let item of record.relateEquipments) {
        workCount += item.workCount;
      }
      record.workCount = workCount;
      return workCount;
    },

    //根据维修级别获取影响范围
    async getInfluenceRanges(val) {
      let param = {
        repairLevel: this.defaultLevel,
        isAll: true,
      };
      this.influenceRanges = [];
      this.influenceRangesOptions = [];
      let response = await apiInfluenceRange.getList(param, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.influenceRanges = response.data.items;
        this.influenceRanges.map(item => {
          this.influenceRangesOptions.push(
            <a-select-option key={item.id}>{item.content}</a-select-option>,
          );
        });
      }
    },

    //插入标准影响范围
    insertInfluence() {
      this.$refs.SmAddInfluenceModal.open(this.repairTagKey, this.defaultLevel);
    },
  },
  render() {
    let options = [];
    for (let item in RepairLevel) {
      options.push(
        <a-select-option key={RepairLevel[item]}>
          {getRepairLevelTitle(RepairLevel[item])}
        </a-select-option>,
      );
    }
    return (
      <div class="sm-cr-plan-skylight-plan">
        {/* 表单区 */}
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={12}>
              <a-form-item label="维修级别" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-select
                  disabled={this.iPageState == PageState.View}
                  placeholder={this.iPageState == PageState.View ? '' : '请选择'}
                  onChange={val => {
                    this.defaultLevel = val;
                    //this.getInfluenceRanges(val);
                  }}
                  v-decorator={[
                    'level',
                    {
                      initialValue: this.defaultLevel,
                    },
                  ]}
                >
                  {options}
                </a-select>
              </a-form-item>
            </a-col>
            <a-col sm={24} md={6}>
              <a-form-item label="计划日期" label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
                <a-date-picker
                  style="width: 100%"
                  showTime={true}
                  disabled={this.iPageState == PageState.View}
                  placeholder={this.iPageState == PageState.View ? '' : '请输入'}
                  disabledDate={this.disabledDate}
                  onChange={value => {
                    this.waitingPlanTime = moment(value)
                      .utc()
                      .format();
                  }}
                  v-decorator={[
                    'workTime',
                    {
                      initialValue:
                        this.iPlanDate && this.iPlanType === PlanType.Vertical
                          ? moment(this.iPlanDate).date(1)
                          : moment(this.iPlanDate),
                      rules: [{ required: true, message: '请输入计划日期！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={6}>
              <a-form-item label="计划时长" label-col={{ span: 8 }} wrapper-col={{ span: 16 }}>
                <a-input-number
                  disabled={this.iPageState == PageState.View}
                  style="width: 100%"
                  min={0}
                  precision={0}
                  placeholder={this.iPageState == PageState.View ? '' : '请输入计划时长（分钟）'}
                  v-decorator={[
                    'timeLength',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请输入计划时长！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="线路" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <SmBasicRailwayTreeSelect
                  organizationId={this.iOrganizationId}
                  axios={this.axios}
                  disabled={this.iPageState == PageState.View}
                  placeholder={this.iPageState == PageState.View ? '' : '请选择'}
                  onChange={item => {
                    this.railwayId = item;
                    this.stationId = undefined;
                  }}
                  v-decorator={[
                    'railwayId',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择线路' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="车站/区间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <StationCascader
                  axios={this.axios}
                  disabled={this.iPageState == PageState.View}
                  // organizationId={this.iOrganizationId}
                  placeholder={this.iPageState == PageState.View ? '' : '请选择'}
                  organizationId={this.iOrganizationId}
                  railwayId={this.railwayId}
                  isShowUpAndDown={true}
                  staRelateType={this.stationRelateRailwayType}
                  onChange={(value, relateId, relateType) => {
                    this.stationId = value;
                    this.stationRelateRailwayType = relateType;
                  }}
                  v-decorator={[
                    'stationId',
                    {
                      initialValue: undefined,
                      rules: [{ required: true, message: '请选择车站/区间' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="作业机房" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <SmBasicInstallationSiteSelect
                  // railwayRltStation={this.railwayRltStation}
                  axios={this.axios}
                  disabled={this.iPageState == PageState.View}
                  onChange={value => {
                    this.installationSiteId = value;
                  }}
                  height={32}
                  v-decorator={[
                    'workSiteId',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="位置(里程)" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled={this.iPageState == PageState.View}
                  placeholder={this.iPageState == PageState.View ? '' : '请输入'}
                  v-decorator={[
                    'workArea',
                    {
                      initialValue: '',
                      rules: [{ max: 120 }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="影响范围" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-row>
                  <a-textarea
                    rows="3"
                    span={20}
                    disabled={this.iPageState == PageState.View}
                    placeholder={this.iPageState == PageState.View ? '' : '请输入'}
                    v-decorator={[
                      'incidence',
                      {
                        initialValue: '',
                        rules: [{ max: 120 }],
                      },
                    ]}
                  />
                  {this.pageState !== PageState.View ? <a onClick={this.insertInfluence}>插入标准影响范围</a> : undefined}
                </a-row>
              </a-form-item>
            </a-col>
            {this.iPageState !== PageState.View ? (
              <a-col sm={24} md={24} offset={21}>
                <a-form-item label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                  <a-button style="margin-right:20px;" type="primary" onClick={this.addPlans}>
                    添加计划
                  </a-button>
                </a-form-item>
              </a-col>
            ) : (
              undefined
            )}

            <a-col sm={24} md={24}>
              <a-form-item label="计划内容" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                {/* 计划内容展示区 */}
                <a-table
                  columns={this.columns}
                  dataSource={this.planDetails}
                  rowKey={record => record.dailyPlanId}
                  pagination={false}
                  scroll={{ y: 400 }}
                  {...{
                    scopedSlots: {
                      planDate: (text, record) => {
                        return (
                          <a-tooltip
                            placement="topLeft"
                            title={
                              record.planDate ? moment(record.planDate).format('YYYY-MM-DD') : ''
                            }
                          >
                            <span>
                              {record.planDate ? moment(record.planDate).format('YYYY-MM-DD') : ''}
                            </span>
                          </a-tooltip>
                        );
                      },
                      planTypeStr: (text, record, index) => {
                        return record.planType === SelectablePlanType.Month ? '月表' : '年表';
                      },
                      // influenceRange: (text, record) => {
                      //   return (
                      //     <a-select
                      //       value={record.influenceRangeId}
                      //       onChange={val => {
                      //         record.influenceRangeId = val;
                      //       }}
                      //     >{this.influenceRangesOptions}
                      //     </a-select>);
                      // },
                      workCount: (text, record) => {
                        return record.relateEquipments.length > 0 ? (
                          this.getWorkCount(record)
                        ) : (
                          <a-input-number
                            disabled={this.iPageState == PageState.View}
                            style="margin: -10px 0"
                            min={0}
                            max={
                              record.workCountOld + record.unFinishCount
                              // (record.unFinishCount !== null ? record.unFinishCount : 0)
                            }
                            precision={3}
                            value={record.workCount}
                            onChange={value => {
                              record.workCount = value;
                            }}
                          />
                        );
                      },
                      relateEquipments: (text, record) => {
                        return (
                          <div class="relate-equipments-box">
                            {record.relateEquipments && record.relateEquipments.length > 0
                              ? record.relateEquipments.map((item, index) => {
                                return (
                                  <span class="relate-equipment">
                                    {`${item.name} (${item.workCount})`}
                                    {this.iPageState === PageState.View ? (
                                      undefined
                                    ) : (
                                      <span
                                        class="close-icon"
                                        onClick={() => {
                                          let index = record.relateEquipments.indexOf(item);
                                          record.relateEquipments.splice(index, 1);
                                        }}
                                      >
                                        <a-icon type="close"></a-icon>
                                      </span>
                                    )}
                                  </span>
                                );
                              })
                              : undefined}
                          </div>
                        );
                      },

                      operations: (text, record) => {
                        return this.iPageState !== PageState.View
                          ? [
                            <a
                              onClick={() => {
                                this.relate(record);
                              }}
                            >
                              关联
                            </a>,
                            <a-divider type="vertical" />,
                            <a
                              onClick={() => {
                                this.remove(record);
                              }}
                            >
                              删除
                            </a>,
                          ]
                          : undefined;
                      },
                    },
                  }}
                ></a-table>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div style="float: right;">
          {this.iPageState == PageState.View ? (
            <a-button
              onClick={() => {
                this.$emit('cancel');
                this.planDetails = [];
                this.form.resetFields();
              }}
            >
              关闭
            </a-button>
          ) : (
            [
              <a-button
                type="primary"
                disabled={this.iPageState == PageState.View}
                style="margin-right: 20px"
                onClick={this.save}
                loading={this.loading}
              >
                  保存
              </a-button>,
              <a-button
                onClick={() => {
                  this.$emit('cancel');
                  this.planDetails = [];
                  this.form.resetFields();
                }}
              >
                  取消
              </a-button>,
            ]
          )}
        </div>
        <SmCrPlanAddSelectablePlanModal
          axios={this.axios}
          selected={this.planDetailIds}
          visible={this.visible}
          repairTagKey={this.repairTagKey}
          date={
            this.iPlanType === PlanType.Vertical
              ? new Date(this.iPlanDate)
              : new Date(this.waitingPlanTime)
          }
          organizationId={this.iOrganizationId}
          skylightType={this.iPlanType}
          onOk={value => {
            this.getSelectedPlans(value);
            this.visible = false;
          }}
          onChange={() => {
            this.visible = false;
          }}
        />
        <RelateEquipmentModal
          ref="RelateEquipmentModal"
          axios={this.axios}
          installationSiteId={this.installationSiteId}
          bordered={this.iBordered}
          organizationId={this.iOrganizationId}
          onSuccess={values => {
            this.record.relateEquipments = values;
          }}
        />
        <SmAddInfluenceModal
          ref="SmAddInfluenceModal"
          axios={this.axios}
          onSuccess={val => {
            let incidence = this.form.getFieldValue("incidence");
            this.form.setFieldsValue({ 'incidence': incidence + val });
          }}
        />
      </div>
    );
  },
};
