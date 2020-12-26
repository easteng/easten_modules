import { requestIsSuccess } from '../../../_utils/utils';
import YearMonthPlanStatistical from '../../../sm-api/sm-cr-plan/YearMonthPlanStatistical';
let yearMonthPlanStatistical = new YearMonthPlanStatistical();

export default {
  name: 'SmChronologyCompletionRateStatistics',
  props: {
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    selectedMonthValue: { type: String, default: null },
    repairType: { type: Number, default: 3 },
    serchKey: { type: String, default: null },
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
          title: '设备类型',
          dataIndex: 'repairGroup',
          width: 100,
          ellipsis: true,
        },
        {
          title: '类型',
          dataIndex: 'repairType',
          width: 100,
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
          width: 100,
        },
        {
          title: '每年次数',
          dataIndex: 'times',
          width: 100,
        },
        {
          title: '计划数量',
          dataIndex: 'planCount',
          width: 100,
          ellipsis: true,
        },
        {
          title: '累计完成数量',
          dataIndex: 'cumulativeFinishedCount',
          width: 120,
          ellipsis: true,
        },
        {
          title: '月完成数量',
          dataIndex: 'monthFinishedCount',
          width: 120,
          ellipsis: true,
        },
        {
          title: '月完成率',
          dataIndex: 'monthFinishedPercentage',
          width: 120,
          customRender: (text, row, index) => {
            return `${text}%`;
          },
        },
        {
          title: '累计完成率',
          dataIndex: 'cumulativeFinishedPercentage',
          width: 120,
          customRender: (text, row, index) => {
            return `${text}%`;
          },
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
        repairlType: this.repairType,
        planTime: this.selectedMonthValue,
        keyWord: this.serchKey,
      };
      console.time('getYearCompletionRates requestTime');
      let response = await yearMonthPlanStatistical.getYearCompletionRates(data, this.repairTagKey);
      console.timeEnd('getYearCompletionRates requestTime');

      if (requestIsSuccess(response) && response.data) {
        this.statisticRecords = response.data;
        console.time('statisticRecords logicTime');
        this.statisticRecords.some((item, index) => {
          item.id = index;
          item.repairType = item.repairType === 1 ? '集中检修' : '日常检修';
        });
        console.timeEnd('statisticRecords logicTime');

      }
      this.loading = false;
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
          scroll={{ x: 'calc(800px + 50%)', y: 600 }}
        />
      </div>
    );
  },
};
