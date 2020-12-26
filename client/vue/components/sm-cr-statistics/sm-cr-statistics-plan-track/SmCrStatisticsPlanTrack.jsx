import './style';
import moment from 'moment';
import { requestIsSuccess, getPlanState } from '../../_utils/utils';
import { DateReportType, PlanState } from '../../_utils/enum';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmPlanInfo from './src/SmPlanInfo';
import YearMonthPlanStatistical from '../../sm-api/sm-cr-plan/YearMonthPlanStatistical';
import ApiOrganization from '../../sm-api/sm-system/Organization';
let yearMonthPlanStatistical = new YearMonthPlanStatistical();
let apiOrganization = new ApiOrganization();

export default {
  name: 'SmCrStatisticsPlanTrack',
  props: {
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    planTime: { type: String, default: null },
    planType: { type: Number, default: DateReportType.Year },
    number: { type: String, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      autoInitial: true,
      record: {
        deviceName: null,
        repairContent: null,
        skyligetType: null,
        total: 0,
        planCompletionList: [],
      },
      queryParams: {
        organizationId: null,
        planTime: null,
        monthPlanType: DateReportType.Year,
        sequenceNumber: null,
      },
    };
  },
  computed: {},
  watch: {
    organizationId: {
      handler: function (value) {
        if (value) {
          this.queryParams.organizationId = this.organizationId;
          this.initAxios();
        }
      },
      immediate: true,
    },
    planTime: {
      handler: function (value) {
        if (value) {
          this.queryParams.planTime = this.planTime;
          this.initAxios();
        }
      },
      immediate: true,
    },
    planType: {
      handler: function (value) {
        if (value) {
          this.queryParams.monthPlanType = this.planType;
          this.initAxios();
        }
      },
      immediate: true,
    },
    number: {
      handler: function (value) {
        if (value) {
          this.queryParams.sequenceNumber = this.number;
          this.initAxios();
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
  },
  methods: {
    async initAxios() {
      yearMonthPlanStatistical = new YearMonthPlanStatistical(this.axios);
      apiOrganization = new ApiOrganization(this.axios);

      if (this.queryParams.planTime === null) this.getCurrentMonth();

      if (this.queryParams.organizationId) {
        await this.refresh();
      }
    },

    // 获取当前登录者的组织机构集合
    async getLoginUserOrg() {
      //获取登录用户的所属的组织 判断能够操作
      let response = await apiOrganization.getLoginUserOrganizationIds();
      if (requestIsSuccess(response)) {
        if (response.data && response.data.length > 0) {
          this.queryParams.organizationId = response.data[0];
        } else {
          this.$message.error('登录者未分配组织机构，没有数据查看权限');
        }
      }
    },

    async refresh() {
      this.record = {
        deviceName: null,
        repairContent: null,
        skyligetType: null,
        total: 0,
        planCompletionList: [],
      };

      // if (this.queryParams.organizationId === null || this.queryParams.organizationId === '') {
      //   await this.getLoginUserOrg();
      // }

      let response = await yearMonthPlanStatistical.getPlanStateTracking(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.record = response.data;
        if (this.record.planCompletionList === null) this.record.planCompletionList = [];
        else {
          this.record.planCompletionList.some(planCompletion => {
            if (planCompletion.planChangeList != null && planCompletion.planChangeList.length > 0) {
              planCompletion.planChangeList.some((item, index) => {
                item.id = index;
              });
            }

            let length = 0;
            if (
              planCompletion.skylightPlanDailyCompletionList != null &&
              planCompletion.skylightPlanDailyCompletionList.length > 0
            ) {
              length = planCompletion.skylightPlanDailyCompletionList.length;
              let changeCount = 0;
              planCompletion.skylightPlanDailyCompletionList.some((item, index) => {
                item.id = index;
                item.descreption = '明细';
                if (item.planState === PlanState.Complete) {
                  changeCount += item.unFinishedCount;
                }
                item.planState = item.planState;
              });

              // 构建合计行数据
              let record = this.biuldLastTotalRecord(
                planCompletion.planDailyTotal,
                length,
                planCompletion.planCount,
                changeCount,
              );
              planCompletion.skylightPlanDailyCompletionList.push(record);
            } else {
              // 构建合计行数据
              let record = this.biuldLastTotalRecord(
                planCompletion.planDailyTotal,
                length,
                planCompletion.planCount,
              );
              planCompletion.skylightPlanDailyCompletionList = [record];
            }
          });
        }
      }
    },

    // 构建明细最后一行合计记录
    biuldLastTotalRecord(planDailyTotal, length, planCount, changeCount) {
      let record = {
        id: length + 1,
        descreption: '未制定计划数量',
      };
      if (planDailyTotal != null) {
        record.finishCount = planCount - planDailyTotal.planCount + changeCount;
      } else {
        record.finishCount = planCount;
      }
      return record;
    },

    reset() {
      this.queryParams = {
        organizationId: null,
        planTime: null,
        monthPlanType: DateReportType.Month,
        sequenceNumber: null,
      };

      this.getCurrentMonth();
      this.refresh();
    },
    getCurrentMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.queryParams.planTime = `${year}/${month}`;
    },
  },

  render() {
    let planDetail = (
      <a-collapse accordion bordered={false} style="background-color: white;">
        {this.record.planCompletionList.map((item, index) => {
          let header = `月计划日期：${item.planTime}； 数量：${item.planCount}； 是否上月变更：${item.isLastMonthChange ? '是' : '否'
          }`;
          return (
            <a-collapse-panel key={index} header={header}>
              <SmPlanInfo
                planDetails={item.skylightPlanDailyCompletionList}
                planChanges={item.planChangeList}
              />
            </a-collapse-panel>
          );
        })}
      </a-collapse>
    );
    return (
      <div class="sm-cr-statistics-plan-track">
        {/* 操作区 */}
        <div class="operator">
          <a-row gutter={48}>
            <a-col span={6}>
              <label>组织机构：</label>
              <SmSystemOrganizationTreeSelect
                style="width: 60%;"
                axios={this.axios}
                value={this.queryParams.organizationId}
                autoInitial={this.autoInitial}
                allowClear={false}
                onInput={value => {
                  this.queryParams.organizationId = value;
                }}
              />
            </a-col>
            <a-col span={6}>
              <label>时间：</label>
              <a-month-picker
                placeholder="请选择月份"
                style="width: 60%"
                allowClear={false}
                value={moment(this.queryParams.planTime)}
                format="YYYY/MM"
                onChange={(date, dateString) => {
                  this.queryParams.planTime = dateString;
                }}
              />
            </a-col>
            <a-col span={6}>
              <label>计划类型：</label>
              <a-select
                value={this.queryParams.monthPlanType}
                placeholder="请选择计划类型"
                style="width: 60%;"
                allowClear={false}
                onChange={value => {
                  this.queryParams.monthPlanType = value;
                }}
              >
                <a-select-option value={DateReportType.Year}>年表</a-select-option>
                <a-select-option value={DateReportType.Month}>月表</a-select-option>
              </a-select>
            </a-col>
            <a-col span={6}>
              <label>年月表序号：</label>
              <a-input
                placeholder="请输入年月表序号"
                style="width: 60%;"
                value={this.queryParams.sequenceNumber}
                onChange={event => {
                  this.queryParams.sequenceNumber = event.target.value;
                }}
              />
            </a-col>
          </a-row>
          <a-row style="border-bottom: 1px solid #aaa;">
            <a-col span={24}>
              <div style="float:right;padding: 20px;">
                <a-button type="primary" onClick={this.refresh}>
                  查询
                </a-button>
                <a-button onClick={this.reset} style="margin-left: 10px;">
                  重置
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>

        {/* 查询结果展示区 */}
        <div v-show={this.record.deviceName !== null}>
          {/* 基础信息展示 */}
          <div style="padding: 5px;border-bottom: 1px solid #aaa;">
            <a-row gutter={48}>
              <a-col span={12}>
                <label>设备名称：</label>
                <a-input type="text" disabled class="input" value={this.record.deviceName} />
              </a-col>
              <a-col span={12}>
                <label>工作内容：</label>
                <a-input type="text" disabled class="input" value={this.record.repairContent} />
              </a-col>
            </a-row>
            <a-row gutter={48} style="padding-top: 10px;">
              <a-col span={12}>
                <label>总 数 量 ：</label>
                <a-input type="text" disabled class="input" value={this.record.total} />
              </a-col>
              <a-col span={12}>
                <label>天窗类型：</label>
                <a-input type="text" disabled class="input" value={this.record.skyligetType} />
              </a-col>
            </a-row>
          </div>

          {/* 计划明细展示 */}
          <div
            style="padding: 5px;"
            v-show={
              this.record.planCompletionList != null && this.record.planCompletionList.length > 0
            }
          >
            {planDetail}
          </div>
        </div>
      </div>
    );
  },
};
