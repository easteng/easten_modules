import { requestIsSuccess } from '../../../_utils/utils';
import YearMonthPlanStatistical from '../../../sm-api/sm-cr-plan/YearMonthPlanStatistical';
import ApiOrganization from '../../../sm-api/sm-system/Organization';
let apiOrganization = new ApiOrganization();
let yearMonthPlanStatistical = new YearMonthPlanStatistical();

export default {
  name: 'SmMonthlyCompletionStatistics',
  props: {
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    selectedMonthValue: { type: String, default: null },
    repairType: { type: Number, default: 1 },
    planType: { type: Number, default: 1 },
    state: { type: Number, default: 2 },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      loading: false,
      iOrganizationId: null,
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
          customRender: this.renderContent,
        },
        {
          title: '设备处所',
          dataIndex: 'equipmentLocation',
          width: 100,
          ellipsis: true,
          // fixed: 'left',
          customRender: this.renderContent,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 100,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '工作内容',
          dataIndex: 'repairContent',
          width: 120,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 80,
          customRender: this.renderContent,
        },
        {
          title: '计划数量',
          dataIndex: 'planCount',
          width: 100,
          customRender: this.renderContent,
        },
        {
          title: '计划',
          children: [
            {
              title: '完成',
              dataIndex: 'dataType',
              width: 65,
            },
          ],
          dataIndex: 'dataType',
        },
        {
          title: '合计',
          dataIndex: 'total',
          width: 100,
          ellipsis: true,
        },
      ];

      // 获取当月最后一天
      let date = new Date(this.selectedMonthValue);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      for (let index = 1; index < lastDay + 1; index++) {
        arry.push({
          title: index,
          dataIndex: 'col_' + index,
          width: 100,
          ellipsis: true,
        });
      }

      return arry;
    },
  },
  watch: {
    organizationId: {
      handler: function (value, oldValue) {
        this.iOrganizationId = value;
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      yearMonthPlanStatistical = new YearMonthPlanStatistical(this.axios);
      apiOrganization = new ApiOrganization(this.axios);
    },
    // 获取当前登录者的组织机构集合
    // async getLoginUserOrg() {
    //   //获取登录用户的所属的组织 判断能够操作
    //   let response = await apiOrganization.getLoginUserOrganizationIds();
    //   if (requestIsSuccess(response)) {
    //     if (response.data && response.data.length > 0) {
    //       this.iOrganizationId = response.data[0];
    //     } else {
    //       this.$message.error('登录者未分配组织机构，没有数据查看权限');
    //     }
    //   }
    // },

    async refresh() {
      this.statisticRecords = [];
      this.loading = true;

      // if (this.iOrganizationId === null || this.iOrganizationId == '') {
      //   await this.getLoginUserOrg();
      // }

      let data = {
        organizationId: this.iOrganizationId,
        monthPlanType: this.planType,
        planTime: this.selectedMonthValue,
        state: this.state,
      };
      console.time('getMonthCompletion requestTime');
      let response = await yearMonthPlanStatistical.getMonthCompletion(data, this.repairTagKey);
      console.timeEnd('getMonthCompletion requestTime');

      if (requestIsSuccess(response) && response.data) {
        this.statisticRecords = response.data;
        console.time('statisticRecords logicTime');
        this.statisticRecords.some((item, index) => {
          item.id = index;
          item.dataType = item.dataType === 0 ? '计划' : '完成';
        });
        console.timeEnd('statisticRecords logicTime');

      }
      this.loading = false;
    },
    renderContent(text, row, index) {
      const obj = {
        children: text,
        attrs: {
          rowSpan: index % 2 === 0 ? 2 : 0,
        },
      };

      return obj;
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
          bordered
          pagination={false}
          scroll={{ x: 'calc(1200px + 50%)', y: 600 }}
        />
      </div>
    );
  },
};
