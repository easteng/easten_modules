import './style';
import moment from 'moment';
import { requestIsSuccess } from '../../_utils/utils';
import { DateReportType, CompleteState } from '../../_utils/enum';

import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import YearMonthPlanStatistical from '../../sm-api/sm-cr-plan/YearMonthPlanStatistical';
let yearMonthPlanStatistical = new YearMonthPlanStatistical();
let apiOrganization = new ApiOrganization();

const stateColor = {
  finished: '#19ccd2',
  unFinished: '#dcdcdc',
  changed: '#e9c090',//#e1a182、e9c090、f6efa6
  plan:'#8085e8',
};
const barWidth=25;
const echarts = require('echarts');
export default {
  name: 'SmCrStatisticsDashboardOld',
  components: {},
  props: {
    axios: { type: Function, default: null },
    // organizationId: { type: String, default: null },
  },
  data() {
    return {
      ensembleData: [], // 总体完成统计图数据
      workOriginalShopData: {}, // 各车间完成统计图原始数据
      workShopData: {
        xAxis: [],
        finishedData: [],
        unFinishedData: [],
        changedData: [],
      }, // 各车间完成统计图数据
      singleData: {
        xAxis: [],
        planData: [],
        finishedData: [],
        maxValue:100,
      }, // 单项完成情况
      equipmentSouceData: [], // 各项设备完成统计数据源
      equipmentData: {
        xAxis: [],
        finishedData: [],
        unFinishedData: [],
        changedData: [],
      }, // 各项设备完成统计图数据
      queryParams: {
        planTime: null,
        monthPlanType: DateReportType.Month,
      },
      equipmentTypeStack: [], // 设备类型Id栈数组
      equipmentOrganizationId: null,
      equipmentTypeId: null,
      singleOrganizationId: null,
      number: 1,
    };
  },
  computed: {},
  watch: {
    // organizationId: {
    //   handler: function() {
    //     this.organizationId = this.organizationId;
    //     this.refresh();
    //   },
    // },
  },
  mounted() {},
  async created() {
    this.initAxios();
    this.getCurrentMonth();
    await this.getLoginUserOrg();
  },
  methods: {
    initAxios() {
      yearMonthPlanStatistical = new YearMonthPlanStatistical(this.axios);
      apiOrganization = new ApiOrganization(this.axios);
    },

    // 渲染车间完成情况统计图表
    renderWorkShopChart() {
      // 总体完成统计图
      let ensembleChart = echarts.init(this.$refs.ensembleChart);
      ensembleChart.setOption({
        title: {
          text: '总体完成统计图',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{a} : {d}%',
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: this.ensembleData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });

      // 各车间完成统计图
      let workShopChart = echarts.init(this.$refs.workShopChart);
      let option={
        title: {
          text: '月完成进度',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter:
            '{b} <br /> {a0}: {c0}' + '%' + '<br />{a1}: {c1}' + '%' + ' <br /> {a2}: {c2}' + '%',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
            },
            show: true,
          },
        ],
        yAxis: {
          type: 'category',
          data: this.workShopData.xAxis,
          // axisLabel: { rotate: 60 },
        },
        series: [
          {
            name: '完成量',
            type: 'bar',
            stack: '总量',
            data: this.workShopData.finishedData,
            itemStyle: {
              normal: { color: stateColor.finished },
            },
            barWidth: barWidth, //柱图宽度
          },
          {
            name: '变更量',
            type: 'bar',
            stack: '总量',
            data: this.workShopData.changedData,
            itemStyle: {
              normal: { color: stateColor.changed },
            },
            barWidth: barWidth, //柱图宽度
          },
          {
            name: '未完成量',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'insideRight',
              formatter: '{c}%',
            },
            data: this.workShopData.unFinishedData,
            itemStyle: {
              normal: { color: stateColor.unFinished, barBorderRadius: [0,5,5,0] },
            },
            barWidth: barWidth, //柱图宽度
            label: {
              show: true,
              position: 'center',
              color: 'black',
              formatter: function(params) {
                let value= (100 - params.value).toFixed(2);
                return `${value}%`;
              },
            },
          },
        ],
      };
      if(this.workShopData.finishedData.length>15){
        option.dataZoom= [
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            left: '1%',
            start: 0, //数据窗口范围的起始百分比
            end: 36,
          },
          {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 36,
          },
        ];};
      workShopChart.setOption(option);
    },

    // 渲染单项完成情况
    renderSingleChart() {
      let singleChart = echarts.init(this.$refs.singleChart);
      singleChart.setOption({
        title: {
          text: '单项完成情况',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['计划', '完成'],
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 36,
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 36,
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.singleData.xAxis,
        },
        yAxis: {
          type: 'value',
          max : this.singleData.maxValue,
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: '计划数',
            type: 'line',
            data: this.singleData.planData,
            itemStyle: {
              normal: { color: stateColor.plan },
            },
          },
          {
            name: '完成数',
            type: 'line',
            data: this.singleData.finishedData,
            itemStyle: {
              normal: { color: stateColor.finished },
            },
          },
        ],
      });
    },

    // 渲染各项设备完成统计图表
    renderEquipmentChart() {
      let equipmentChart = echarts.init(this.$refs.equipmentChart);
      let option={
        title: {
          text: '各项设备完成统计图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter:
            '{b} <br /> {a0}: {c0}' + '%' + '<br />{a1}: {c1}' + '%' + ' <br /> {a2}: {c2}' + '%',
        },
        xAxis: {
          data: this.equipmentData.xAxis,
          axisLabel: { rotate: 60 },
          splitLine: {
            show: false,
          },
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value} %',
            },
            show: true,
          },
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            stack: '完成情况',
            data: this.equipmentData.finishedData,
            itemStyle: {
              normal: { color: stateColor.finished },
            },
            barWidth: barWidth, //柱图宽度
            // barMaxWidth: 30, //最大宽度
          },
          {
            name: '已变更',
            type: 'bar',
            stack: '完成情况',
            data: this.equipmentData.changedData,
            itemStyle: {
              normal: { color: stateColor.changed },
            },
            barWidth: barWidth, //柱图宽度
          },
          {
            name: '未完成',
            type: 'bar',
            stack: '完成情况',
            data: this.equipmentData.unFinishedData,
            itemStyle: {
              normal: { color: stateColor.unFinished,barBorderRadius: [5,5,0,0]},
            },
            barWidth: barWidth, //柱图宽度
          },
        ],
      };
      if (this.equipmentData.finishedData.length > 15) {
        option.dataZoom = [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 36,
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 36,
          },
        ];
      }
      equipmentChart.setOption(option);
      let _this = this;
      equipmentChart.on('click', function(params) {
        // debugger;
        // this.equipmentSouceData.filter(item=>item.Name===params.value);
        let equipmentTypeId = ''; // 获取当前选中的设备类型Id
        _this.equipmentTypeStack.push(equipmentTypeId);
        _this.getEquipmentStatistical();
      });
    },

    // 获取当前登录者的组织机构集合
    async getLoginUserOrg() {
      //获取登录用户的所属的组织 判断能够操作
      let response = await apiOrganization.getLoginUserOrg();
      if (requestIsSuccess(response)) {
        if (response.data.length > 0) {
          this.equipmentOrganizationId = response.data[0];
          this.singleOrganizationId = response.data[0];

          await this.refresh();
        } else {
          this.$message.error('登录者未分配组织机构，没有数据查看权限');
        }
      }
    },

    // 更新各图表数据
    async refresh() {
      await this.getSingleStatistical();
      await this.getMonthStatistical();
      await this.getEquipmentStatistical();
    },

    // 单项完成情况
    async getSingleStatistical() {
      this.singleData = {
        xAxis: [],
        planData: [],
        finishedData: [],
        maxValue:100,
      };

      let response = await yearMonthPlanStatistical.getSingleStatistical({
        number: this.number,
        organizationId: this.singleOrganizationId,
        ...this.queryParams,
      });

      if (requestIsSuccess(response)) {
        response.data.some(item => {
          this.singleData.xAxis.push(item.days);
          this.singleData.planData.push(item.planCount);
          this.singleData.finishedData.push(item.finishCount);

          if (item.planCount > this.singleData.maxValue) this.singleData.maxValue = item.planCount;
        });
        // this.singleData.xAxis=['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        // this.singleData.planData=[120, 132, 101, 134, 90, 230, 210];
        // this.singleData.finishedData=[0, 182, 0, 0, 0, 0, 0];
      }

      // 渲染图表
      this.renderSingleChart();
    },

    // 各车间完成统计图
    async getMonthStatistical() {
      this.ensembleData = [];

      this.workShopData = {
        xAxis: [],
        finishedData: [],
        unFinishedData: [],
        changedData: [],
      };

      let response = await yearMonthPlanStatistical.getMonthStatistical({
        equipmentTypeId: this.equipmentTypeId,
        organizationId: this.equipmentOrganizationId,
        ...this.queryParams,
      });

      if (requestIsSuccess(response) && response.data.length > 0) {
        let finishedTotal = 0;
        let unFinishedTotal = 0;
        let changeTotal = 0;

        // 各车间完成统计图数据
        this.workOriginalShopData = response.data;
        response.data.some(item => {
          let totalNum = item.finishCount + item.unFinishedCount + item.changeCount;
          if (totalNum > 0) {
            this.workShopData.xAxis.push(item.organizationName);
            this.workShopData.finishedData.push(
              this.mathRoundNumber(item.finishCount / totalNum),
            );
            finishedTotal += item.finishCount;

            this.workShopData.changedData.push(
              this.mathRoundNumber(item.changeCount / totalNum),
            );
            changeTotal += item.changeCount;

            this.workShopData.unFinishedData.push(
              this.mathRoundNumber(item.unFinishedCount / totalNum),
            );
            unFinishedTotal += item.unFinishedCount;
          }
        });

        console.log(this.workShopData);

        // 总体完成统计图
        let totalNum = finishedTotal + unFinishedTotal + changeTotal;
        if (totalNum > 0) {
          this.ensembleData.push({
            value: this.mathRoundNumber(finishedTotal / totalNum),
            name: '已完成',
            itemStyle: { color: stateColor.finished },
          });
          this.ensembleData.push({
            value: this.mathRoundNumber(changeTotal / totalNum),
            name: '已变更',
            itemStyle: { color: stateColor.changed },
          });
          this.ensembleData.push({
            value: this.mathRoundNumber(unFinishedTotal / totalNum),
            name: '未完成',
            itemStyle: { color: stateColor.unFinished },
          });
        }
      }

      // for (let index = 1; index < 17; index++) {
      //   this.workShopData.xAxis.push(`车间${index}`);
      //   this.workShopData.finishedData.push(20+index*5);
      //   this.workShopData.changedData.push(10);
      //   this.workShopData.unFinishedData.push(70-index*5);
      // }

      // this.ensembleData = [
      //   { value: 335, name: '已完成', itemStyle: { color: stateColor.finished } },
      //   { value: 274, name: '已变更', itemStyle: { color: stateColor.changed } },
      //   { value: 310, name: '未完成', itemStyle: { color: stateColor.unFinished } },
      // ];

      // 渲染报表
      this.renderWorkShopChart();
    },

    // 各设备完成统计图
    async getEquipmentStatistical() {
      this.equipmentData = {
        xAxis: [],
        finishedData: [],
        unFinishedData: [],
        changedData: [],
      };

      let response = await yearMonthPlanStatistical.getEquipmentStatistical({
        equipmentTypeId:this.equipmentTypeId,
        organizationId: this.equipmentOrganizationId,
        ...this.queryParams,
      });
      if (requestIsSuccess(response) && response.data.length > 0) {
        this.equipmentSouceData = response.data;

        response.data.some(item => {
          let totalNum = item.finishCount + item.unFinishedCount + item.changeCount;
          if (totalNum > 0) {
            this.equipmentData.xAxis.push(item.name);
            this.equipmentData.finishedData.push(
              this.mathRoundNumber(item.finishCount / totalNum),
            );
            this.equipmentData.unFinishedData.push(
              this.mathRoundNumber(item.unFinishedCount / totalNum),
            );
            this.equipmentData.changedData.push(
              this.mathRoundNumber(item.changeCount / totalNum),
            );
          }
        });
      }

      // for (let index = 1; index < 17; index++) {
      //   this.equipmentData.xAxis.push(`设备${index}`);
      //   this.equipmentData.finishedData.push(20+index*5);
      //   this.equipmentData.changedData.push(10);
      //   this.equipmentData.unFinishedData.push(70-index*5);
      // }

      // 渲染图表
      this.renderEquipmentChart();
    },

    mathRoundNumber(number) {
      let num = Math.round(number * Math.pow(10, 4)) / Math.pow(10, 2); //四舍五入
      return Number(num).toFixed(2); //补足位数
    },

    reset() {
      this.queryParams = {
        planTime: null,
        monthPlanType: DateReportType.Month,
      };
      this.getCurrentMonth();
    },
    getCurrentMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.queryParams.planTime = `${year}/${month}`;
    },
  },
  render() {
    return (
      <div class="sm-cr-statistics-dashboard">
        {/* 操作区 */}
        <sc-table-operator onSearch={this.refresh} onReset={this.reset} class="table-operator">
          <a-form-item label="时间">
            <a-month-picker
              placeholder="请选择月份"
              allowClear={false}
              style="width: 100%"
              value={moment(this.queryParams.planTime)}
              format="YYYY/MM"
              onChange={(date, dateString) => {
                this.queryParams.planTime = dateString;
              }}
            />
          </a-form-item>
          <a-form-item label="计划类型">
            <a-select
              value={this.queryParams.monthPlanType}
              placeholder="请选择计划类型"
              onChange={value => {
                this.queryParams.monthPlanType = value;
              }}
            >
              <a-select-option value={DateReportType.Year}>年表</a-select-option>
              <a-select-option value={DateReportType.Month}>月表</a-select-option>
            </a-select>
          </a-form-item>
        </sc-table-operator>
        {/* 图表展示区 */}
        <div class="report-content">
          {/* 年度完成进度 */}
          <div class="content-top">
            <div class="chart" ref="workShopChart" />
          </div>
          <div class="content-bottom">
            <div class="complete-statistics-top">
              {/* 总体完成统计图 */}
              <div class="ensemble">
                <div class="chart" ref="ensembleChart" />
              </div>
              {/* 单项完成情况 */}
              <div class="workshop">
                <div class="chart-select">
                  <a-input-number
                    placeholder="序号"
                    style="width:60px;margin-right: 5px;"
                    value={this.number}
                    onChange={value => {
                      console.log(value);
                      const reg =/^\d{1,3}$/;// 只能输入1~3位非负整数
                      if ((!isNaN(value) && reg.test(value))) {
                        this.number = value;
                        this.getSingleStatistical();
                      }
                    }}
                  />
                  <SmSystemOrganizationTreeSelect
                    style="width:200px;"
                    axios={this.axios}
                    value={this.singleOrganizationId}
                    isAutoDisableOrg={true}
                    allowClear={false}
                    onInput={value => {
                      this.singleOrganizationId = value;
                      this.getSingleStatistical();
                    }}
                  />
                </div>

                <div class="chart" ref="singleChart" />
              </div>
            </div>
            {/* 各项设备完成统计图 */}
            <div class="complete-statistics-bottom">
              <div class="chart-select">
                <a-button
                  style="margin-right: 10px;"
                  onClick={() => {
                    if (this.equipmentTypeStack.length > 0) {
                      this.equipmentTypeId = this.equipmentTypeStack[
                        this.equipmentTypeStack.length - 1
                      ];
                      this.equipmentTypeStack.pop(); // 移除最后一位
                    }
                    this.getEquipmentStatistical();
                  }}
                >
                  <a-icon type="undo" />
                </a-button>
                <SmSystemOrganizationTreeSelect
                  style="width:200px;"
                  axios={this.axios}
                  value={this.equipmentOrganizationId}
                  isAutoDisableOrg={true}
                  allowClear={false}
                  onInput={value => {
                    this.equipmentOrganizationId = value;
                    this.getEquipmentStatistical();
                  }}
                />
              </div>

              <div class="chart" ref="equipmentChart" />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
