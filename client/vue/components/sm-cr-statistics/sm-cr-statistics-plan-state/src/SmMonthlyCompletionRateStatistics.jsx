import SmMonthlyCompletionRateStatisticsModel from './SmMonthlyCompletionRateStatisticsModel';
import { requestIsSuccess } from '../../../_utils/utils';
import YearMonthPlanStatistical from '../../../sm-api/sm-cr-plan/YearMonthPlanStatistical';
let yearMonthPlanStatistical = new YearMonthPlanStatistical();

// 计划追踪页面路由
// const PlanTrackRouterPath = '/components/sm-cr-statistics-plan-track';
const PlanTrackRouterPath = '/crStatistics/planTrack';
export default {
  name: 'SmMonthlyCompletionRateStatistics',
  props: {
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    selectedMonthValue: { type: String, default: null },
    repairType: { type: Number, default: 1 },
    planType: { type: Number, default: 1 },
    state: { type: Number, default: 1 },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      loading: false,
      statisticRecords: [], // 统计记录
    };
  },
  computed: {
    columns() {
      let arry = [
        {
          title: '序号',
          dataIndex: 'number',
          width: 65,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: '设备处所',
          dataIndex: 'equipmentLocation',
          width: 100,
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 100,
          ellipsis: true,
        },
        {
          title: '工作内容',
          dataIndex: 'repairContent',
          width: 100,
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 65,
        },
        {
          title: '计划数量',
          dataIndex: 'planCount',
          width: 100,
        },
        {
          title: '完成数量',
          dataIndex: 'finishCount',
          width: 100,
        },
        {
          title: '完成率',
          dataIndex: 'percentage',
          width: 80,
          scopedSlots: { customRender: 'percentage' },
        },
        {
          title: '差额',
          dataIndex: 'gap',
          width: 65,
        },
        {
          title: '变更',
          dataIndex: 'changeCount',
          width: 65,
        },
        {
          title: '未完成',
          dataIndex: 'unFinishedCount',
          width: 80,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 110,
          fixed: 'right',
          scopedSlots: { customRender: 'operations' },
        },
      ];
      return arry;
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      yearMonthPlanStatistical = new YearMonthPlanStatistical(this.axios);
    },
    async refresh() {
      this.statisticRecords = [];
      this.loading = true;

      let data = {
        organizationId: this.organizationId,
        yearMonthPlanType: null,
        monthPlanType: this.planType,
        planTime: this.selectedMonthValue,
        state: null,
      };
      console.time('getMonthCompletionRates requestTime');
      let response = await yearMonthPlanStatistical.getMonthCompletionRates(data, this.repairTagKey);
      console.timeEnd('getMonthCompletionRates requestTime');

      if (requestIsSuccess(response) && response.data) {
        this.statisticRecords = response.data;
        console.time('statisticRecords logicTime');
        this.statisticRecords.some((item, index) => {
          item.id = index;
        });
        console.timeEnd('statisticRecords logicTime');

      }
      this.loading = false;
    },
    // 详细
    view(record) {
      this.$refs.SmMonthlyCompletionRateStatisticsModel.view(record.detailList);
    },
    // 追踪
    track(record) {
      this.$emit(
        'track',
        this.organizationId,
        this.selectedMonthValue,
        this.planType,
        record.number,
      );
      // this.$router.push({
      //   path: PlanTrackRouterPath,
      //   query: {
      //     organizationId: this.organizationId,
      //     selectedMonthValue: this.selectedMonthValue,
      //     planType: this.planType,
      //     sequenceNumber: record.number,
      //   },
      // });
    },
  },
  render() {
    return (
      <div>
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.statisticRecords}
          loading={this.loading}
          pagination={false}
          scroll={{ x: 'calc(750px + 50%)', y: 600 }}
          {...{
            scopedSlots: {
              percentage: (text, record) => {
                return `${text}%`;
              },
              operations: (text, record) => {
                return [
                  <span>
                    <a
                      onClick={() => {
                        this.view(record);
                      }}
                    >
                      详情
                    </a>
                    <a-divider type="vertical" />
                    <a
                      onClick={() => {
                        this.track(record);
                      }}
                    >
                      追踪
                    </a>
                  </span>,
                ];
              },
            },
          }}
        />

        <SmMonthlyCompletionRateStatisticsModel
          ref="SmMonthlyCompletionRateStatisticsModel"
          axios={this.axios}
        />
      </div>
    );
  },
};
