import './style/index';
import moment from 'moment';
import { requestIsSuccess } from '../../_utils/utils';
import { DateReportType, RepairType, CompleteState, PlanFinishState } from '../../_utils/enum';

import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmMonthlyCompletionStatistics from './src/SmMonthlyCompletionStatistics';
import SmMonthlyCompletionRateStatistics from './src/SmMonthlyCompletionRateStatistics';
import SmChronologyCompletionRateStatistics from './src/SmChronologyCompletionRateStatistics';
import ApiOrganization from '../../sm-api/sm-system/Organization';
let apiOrganization = new ApiOrganization();


export default {
  name: 'SmCrStatisticsPlanState',
  props: {
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      activeTabKey: "0",
      queryParams: {
        organizationId: null,
        selectedMonthValue: null,
        repairType: undefined,//RepairType.Muster,
        planType: DateReportType.Year,
        state: undefined,
        serchKey: null,
      },
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.initAxios();
    this.getCurrentMonth();
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
    },

    refresh() {
      switch (this.activeTabKey) {
      case '0':
        this.$refs.SmMonthlyCompletionStatistics.refresh();
        break;
      case '1':
        this.$refs.SmMonthlyCompletionRateStatistics.refresh();
        break;
      case '2':
        this.$refs.SmChronologyCompletionRateStatistics.refresh();
        break;
      default:
        break;
      }
    },
    reset() {
      this.queryParams = {
        organizationId: null,
        selectedMonthValue: null,
        repairType: undefined,
        planType: DateReportType.Year,
        state: undefined,
        serchKey: null,
      };

      this.getCurrentMonth();
    },
    getCurrentMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.queryParams.selectedMonthValue = `${year}/${month}`;
    },
  },

  render() {
    let button = (
      <div style="float:right;padding-right: 40px;">
        <a-button type="primary" onClick={this.refresh}>
          查询
        </a-button>
        <a-button onClick={this.reset} style="margin-left: 10px;">
          重置
        </a-button>
      </div>
    );

    let colItems = [];
    colItems.push(
      <a-col span={6}>
        <label>组织机构：</label>
        <SmSystemOrganizationTreeSelect
          style="width: 60%;"
          axios={this.axios}
          value={this.queryParams.organizationId}
          autoInitial={true}
          allowClear={false}
          onInput={value => {
            this.queryParams.organizationId = value;
          }}
        />
      </a-col>,
    );

    colItems.push(
      <a-col span={6}>
        <label>时间：</label>
        <a-month-picker
          placeholder="请选择月份"
          allowClear={false}
          style="width: 60%"
          value={moment(this.queryParams.selectedMonthValue)}
          format="YYYY/MM"
          onChange={(date, dateString) => {
            this.queryParams.selectedMonthValue = dateString;
          }}
        />
      </a-col>,
    );

    if (this.activeTabKey === '0') {
      colItems.push(
        <a-col span={6}>
          <label>状态：</label>
          <a-select
            style="width: 60%"
            value={this.queryParams.state}
            placeholder="请选择完成状态"
            allowClear
            onChange={value => {
              this.queryParams.state = value;
            }}
          >
            <a-select-option value={PlanFinishState.Complete}>已完成</a-select-option>
            <a-select-option value={PlanFinishState.UnFinish}>未完成</a-select-option>
          </a-select>
        </a-col>,
      );
    }
    if (this.activeTabKey === '2') {
      colItems.push(
        <a-col span={6}>
          <label>检修类别：</label>
          <a-select
            value={this.queryParams.repairType}
            placeholder="请选择检修类别"
            style="width: 60%"
            allowClear
            onChange={value => {
              this.queryParams.repairType = value;
            }}
          >
            <a-select-option value={RepairType.Muster}>集中检修</a-select-option>
            <a-select-option value={RepairType.Daily}>日常检修</a-select-option>
          </a-select>
        </a-col>,
      );
      colItems.push(
        <a-col span={6}>
          <label>关键字：</label>
          <a-input
            placeholder="设备类型、设备名称、工作内容"
            style="width: 60%"
            value={this.queryParams.serchKey}
            allowClear
            onInput={event => {
              this.queryParams.serchKey = event.target.value;
            }}
          />
        </a-col>,
      );
    } else {
      colItems.push(
        <a-col span={6}>
          <label>计划类型：</label>
          <a-select
            value={this.queryParams.planType}
            placeholder="请选择计划类型"
            style="width: 60%"
            onChange={value => {
              this.queryParams.planType = value;
            }}
          >
            <a-select-option value={DateReportType.Year}>年表</a-select-option>
            <a-select-option value={DateReportType.Month}>月表</a-select-option>
          </a-select>
        </a-col>,
      );
    }
    if (this.activeTabKey === '1') {
      colItems.push(<a-col span={6}>{button}</a-col>);
    }
    let operators = (
      <div style="border-bottom: 1px solid #aaa;padding-bottom: 15px;">
        <a-row gutter={48}>
          {colItems.map(item => {
            return item;
          })}
        </a-row>
        <a-row v-show={this.activeTabKey !== '1'} style="padding-top: 15px;" >
          {/* <a-col span={18}></a-col> */}
          <a-col span={24}>{button}</a-col>
        </a-row>
      </div>
    );

    return (
      <div class="sm-cr-statistics-plan-state">
        <a-tabs
          default-active-key={this.activeTabKey}
          onChange={value => {
            this.activeTabKey = value;
          }}
        >
          <a-tab-pane key="0" tab="月完成情况统计">
            {operators}
            <SmMonthlyCompletionStatistics
              ref="SmMonthlyCompletionStatistics"
              axios={this.axios}
              repairTagKey={this.repairTagKey}
              organizationId={this.queryParams.organizationId}
              selectedMonthValue={this.queryParams.selectedMonthValue}
              repairType={this.queryParams.repairType}
              planType={this.queryParams.planType}
              state={this.queryParams.state}
            />
          </a-tab-pane>
          <a-tab-pane key="1" tab="月完成率统计">
            {operators}
            <SmMonthlyCompletionRateStatistics
              ref="SmMonthlyCompletionRateStatistics"
              axios={this.axios}
              repairTagKey={this.repairTagKey}
              organizationId={this.queryParams.organizationId}
              selectedMonthValue={this.queryParams.selectedMonthValue}
              repairType={this.queryParams.repairType}
              planType={this.queryParams.planType}
              state={this.queryParams.state}
              onTrack={(
                organizationId,
                planTime,
                planType,
                number,
              ) => {
                this.$emit(
                  'track',
                  organizationId,
                  planTime,
                  planType,
                  number,
                );
              }}
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="年表完成率统计">
            {operators}
            <SmChronologyCompletionRateStatistics
              ref="SmChronologyCompletionRateStatistics"
              axios={this.axios}
              repairTagKey={this.repairTagKey}
              organizationId={this.queryParams.organizationId}
              selectedMonthValue={this.queryParams.selectedMonthValue}
              repairType={this.queryParams.repairType}
              serchKey={this.queryParams.serchKey}
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    );
  },
};
