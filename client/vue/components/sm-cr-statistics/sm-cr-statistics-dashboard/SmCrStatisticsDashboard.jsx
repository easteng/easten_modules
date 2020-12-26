import './style';
import moment from 'moment';
import { requestIsSuccess, addNum, subNum } from '../../_utils/utils';
import { DateReportType } from '../../_utils/enum';

import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import YearMonthPlanStatistics from '../../sm-api/sm-cr-plan/YearMonthPlanStatistics';
let yearMonthPlanStatistics = new YearMonthPlanStatistics();

const stateColor = {
  finished: '#19CCD2',
  unFinished: '#DCDCDC',
  changed: '#E9C090',//#e1a182、e9c090、f6efa6
  plan: '#8085e8',
};
const barWidth = 25;
const echarts = require('echarts');

export default {
  name: 'SmCrStatisticsDashboard',
  components: {},
  props: {
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null}, //维修项标签
  },
  data() {
    return {
      yearMonthPlanOrgName: [], // 年月表完成进度 组织机构名称
      yearMonthPlanFinishPercentData: [], // 年月表完成进度 数据
      yearMonthPlanAlterPercentData: [],  // 年月表变更进度 数据
      yearMonthPlanUnFinshPercentData: [],  // 年月表未完成进度 数据

      totalFinishData: [], //  总体为完成情况统计图

      repairGroupNames: [],  //各设备完成统计 设备名称
      allRepairGroupFinishPercentData: [],  //所有组织机构 各设备完成统计情况 数据

      queryParams: {
        time: null,
        type: DateReportType.Year,
      },
      isLoading: false,
      isLoadingEquip: false,
      isShowSingleEquipData: false,

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
  mounted() { },
  async created() {
    this.initAxios();
    this.getCurrentMonth();
    this.refresh();
  },
  methods: {
    initAxios() {
      yearMonthPlanStatistics = new YearMonthPlanStatistics(this.axios);
    },

    // 获取年月计划相关统计数据
    async getYearMonthPlanStatisticsData() {
      this.yearMonthPlanFinishPercentData = [];
      this.yearMonthPlanAlterPercentData = [];
      this.yearMonthPlanUnFinshPercentData = [];
      this.yearMonthPlanOrgName = [];
      this.repairGroupNames = [];
      this.allRepairGroupFinishPercentData = [];
      let response = await yearMonthPlanStatistics.getYearPlanProgress(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        //构造年月表完成情况柱状图数据
        let totalCount = 0;
        let finishCount = 0;
        let alterCount = 0;
        response.data.map((i, index) => {
          let totalFinishInfo = i.totalFinishInfo;
          this.yearMonthPlanOrgName.push(i.orgName);
          let finsihP = this.percentFilter(totalFinishInfo.finishPercent);
          let alterP = this.percentFilter(totalFinishInfo.alterPercent);
          this.yearMonthPlanFinishPercentData.push(finsihP);
          this.yearMonthPlanAlterPercentData.push(alterP);
          this.yearMonthPlanUnFinshPercentData.push(this.percentFilter(subNum(100, addNum(finsihP, alterP))));

          //构造总体完成情况饼状图数据
          totalCount += totalFinishInfo.totalCount;
          finishCount += totalFinishInfo.finishCount;
          alterCount += totalFinishInfo.alterCount;

          //所有组织机构 各设备完成情况
          this.allRepairGroupFinishPercentData.push({
            orgId: i.orgId,
            orgName: i.orgName,
            repairGroupFinishData: i.repairGroupFinishInfos,
          });
        });
        //构造总体完成情况饼状图数据
        this.totalFinishData = [
          {
            value: finishCount, name: "已完成",
            itemStyle: {
              color: stateColor.finished,
            },
          },
          {
            value: alterCount, name: "已变更",
            itemStyle: {
              color: stateColor.changed,
            },
          },
          {
            value: totalCount - finishCount, name: "未完成",
            itemStyle: {
              color: stateColor.unFinished,
            },
          },
        ];
      }

      // 渲染左侧柱状图
      this.renderYearMonthPlanChart();
      //渲染右侧左上饼图
      this.renderTotalFinishChart();
      //渲染右侧 底部 各个设备完成情况统计图
      this.renderEveryEquipFinishChart();
    },

    // 渲染 左侧 年月表完成情况统计图
    renderYearMonthPlanChart() {
      let temp = this.queryParams.time.split('/');
      let year = temp[0];
      let month = temp[1];
      let preTitle = year + "年" + month + "月 ";
      let title = this.queryParams.type == DateReportType.Year ? preTitle + "年表完成进度" : (this.queryParams.type == DateReportType.Month ? preTitle + " 月表完成进度" : "");
      // 年月表完成统计图
      echarts.dispose(this.$refs.yearMonthPlanFinishPercent);
      let yearMonthPlanFinishPercent = echarts.init(this.$refs.yearMonthPlanFinishPercent);
      let option = {};
      if (this.yearMonthPlanOrgName.length == 0) {
        option = this.getEmptyChartOption(title);
      }
      else {
        option = {
          title: {
            text: title,
            top: 5,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            formatter:
              '{b} <br /> {a0}: {c0}' + '%' + '<br />{a1}: {c1}' + '%' + ' <br /> {a2}: {c2}' + '%',
          },
          legend: {
            data: ['完成', '变更'],
            top: 30,
          },
          grid: {
            left: '25%',
          },
          xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
              formatter: '{value} %',
            },
          },
          yAxis: {
            type: 'category',
            axisLabel: { rotate: 30 },
            data: this.yearMonthPlanOrgName,
            splitLine: {
              show: true,
            },
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              yAxisIndex: [0],
              start: 10,
              end: 0,
              maxValueSpan: 9,
              minValueSpan: 9,
            },
            {
              type: 'inside',
              yAxisIndex: [0],
              start: 10,
              end: 0,
            },
          ],
          series: [
            {
              name: '完成',
              type: 'bar',
              stack: '总量',
              data: this.yearMonthPlanFinishPercentData,
              itemStyle: {
                normal: { color: stateColor.finished },
              },
              barWidth: barWidth, //柱图宽度
            },
            {
              name: '变更',
              type: 'bar',
              stack: '总量',
              data: this.yearMonthPlanAlterPercentData,
              itemStyle: {
                normal: { color: stateColor.changed },
              },
              barWidth: barWidth, //柱图宽度
            },
            {
              name: '未完成',
              type: 'bar',
              stack: '总量',
              data: this.yearMonthPlanUnFinshPercentData,
              label: {
                show: true,
                position: 'insideLeft',
                color: 'black',
                formatter: function (params) {
                  let value = (100 - params.value).toFixed(2);
                  return `${value}%`;
                },
              },
              itemStyle: {
                normal: { color: stateColor.unFinished, barBorderRadius: [0, 5, 5, 0] },
              },
              barWidth: barWidth, //柱图宽度
            },
          ],
        };
      }
      yearMonthPlanFinishPercent.setOption(option);
    },

    //渲染右侧 左上 总体完成统计图
    renderTotalFinishChart() {
      // 总体完成情况统计图
      let ensembleChart = echarts.init(this.$refs.ensembleChart);
      let option = {
        title: {
          text: '总体完成统计图',
          // left: 'center',
          top: 5,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>占比 : {d}% ({c})',
        },
        legend: {
          orient: 'horizontal',
          data: ['已完成', '已变更', '未完成'],
          top: 30,
        },
        series: [
          {
            name: '总体完成统计图',
            type: 'pie',
            radius: '60%',
            center: ['50%', '60%'],
            data: this.totalFinishData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      ensembleChart.setOption(option);
    },


    //渲染右侧 底部 各项设备完成情况统计图
    renderEveryEquipFinishChart() {
      this.isShowSingleEquipData = false;
      this.repairGroupNames = [];
      let data = this.allRepairGroupFinishPercentData.find(s => s.orgId == this.equipmentOrganizationId);
      let finishData = [];
      let alterData = [];
      let unFinishData = [];
      echarts.dispose(this.$refs.equipmentChart);
      if (data == null || data == undefined || data.repairGroupFinishData.length == 0) {
        let equipmentChart = echarts.init(this.$refs.equipmentChart);
        equipmentChart.setOption(this.getEmptyChartOption("各项设备完成统计图"));
      }
      else {
        data.repairGroupFinishData.map((i, index) => {
          this.repairGroupNames.push(i.name);
          let item = i.finishInfo;
          let finsihP = this.percentFilter(item.finishPercent);
          let alterP = this.percentFilter(item.alterPercent);
          finishData.push(finsihP);
          alterData.push(alterP);
          unFinishData.push(this.percentFilter(100 - finsihP - alterP));
        });

        let equipmentChart = echarts.init(this.$refs.equipmentChart);
        equipmentChart.setOption({
          title: {
            text: "各项设备完成统计图",
            top: 5,
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
            bottom: '25%',
          },
          legend: {
            data: ['完成', '变更'],
            top: 5,
          },
          xAxis: [
            {
              type: 'category',
              data: this.repairGroupNames,
              axisLabel: { rotate: 70 },
            },
          ],
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
              formatter: '{value} %',
            },
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              start: 10,
              end: 0,
              maxValueSpan: 9,
              minValueSpan: 9,
            },
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 10,
              end: 0,
            },
          ],
          series: [
            {
              name: '完成',
              type: 'bar',
              stack: '总量',
              data: finishData,
              itemStyle: {
                normal: { color: stateColor.finished },
              },
              barWidth: barWidth, //柱图宽度
            },
            {
              name: '变更',
              type: 'bar',
              stack: '总量',
              data: alterData,
              itemStyle: {
                normal: { color: stateColor.changed },
              },
              barWidth: barWidth, //柱图宽度
            },
            {
              name: '未完成',
              type: 'bar',
              stack: '总量',
              data: unFinishData,
              label: {
                show: true,
                position: 'insideBottom',
                color: 'black',
                formatter: function (params) {
                  let value = (100 - params.value).toFixed(2);
                  return `${value}%`;
                },
              },
              itemStyle: {
                normal: { color: stateColor.unFinished },
              },
              barWidth: barWidth, //柱图宽度
            },
          ],
        });

        let page = this;
        equipmentChart.on('click', async function (params) {
          let param = {
            groupName: params.name,
            OrgId: page.equipmentOrganizationId,
            ...page.queryParams,
          };
          page.isLoadingEquip = true;
          let response = await yearMonthPlanStatistics.getRepairGroupFinishData(param, this.repairTagKey);
          if (requestIsSuccess(response)) {
            page.renderSingleEquipFinishInfo(params.name, response.data);
          }
          page.isLoadingEquip = false;
        });
      }
    },

    //渲染右侧 底部 单项设备完成情况
    renderSingleEquipFinishInfo(name, data) {
      this.isShowSingleEquipData = true;
      let repairGroupNames = [];
      let finishData = [];
      let alterData = [];
      let unFinishData = [];
      data.map((item, index) => {
        repairGroupNames.push(item.name);
        let finsihP = this.percentFilter(item.finishInfo.finishPercent);
        let alterP = this.percentFilter(item.finishInfo.alterPercent);
        finishData.push(finsihP);
        alterData.push(alterP);
        unFinishData.push(this.percentFilter(100 - finsihP - alterP));
      });
      echarts.dispose(this.$refs.equipmentChart);

      let equipmentChart = echarts.init(this.$refs.equipmentChart);
      equipmentChart.setOption({
        title: {
          text: name + "设备完成统计图",
          top: 5,
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
          bottom: '25%',
        },
        legend: {
          data: ['完成', '变更'],
          top: 5,
        },
        xAxis: [
          {
            type: 'category',
            data: repairGroupNames,
            axisLabel: { rotate: 70 },
          },
        ],
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value} %',
          },
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 10,
            end: 0,
            maxValueSpan: 9,
            minValueSpan: 9,
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 10,
            end: 0,
          },
        ],
        series: [
          {
            name: '完成',
            type: 'bar',
            stack: '总量',
            data: finishData,
            itemStyle: {
              normal: { color: stateColor.finished },
            },
            barWidth: barWidth, //柱图宽度
          },
          {
            name: '变更',
            type: 'bar',
            stack: '总量',
            data: alterData,
            itemStyle: {
              normal: { color: stateColor.changed },
            },
            barWidth: barWidth, //柱图宽度
          },
          {
            name: '未完成',
            type: 'bar',
            stack: '总量',
            data: unFinishData,
            label: {
              show: true,
              position: 'insideBottom',
              color: 'black',
              formatter: function (params) {
                let value = (100 - params.value).toFixed(2);
                return `${value}%`;
              },
            },
            itemStyle: {
              normal: { color: stateColor.unFinished },
            },
            barWidth: barWidth, //柱图宽度
          },
        ],
      });

    },

    //获取当前登录者的组织机构集合
    async getLoginUserOrg() {
      //获取登录用户的所属的组织 判断能够操作
      // let response = await apiOrganization.getLoginUserOrg();
      // if (requestIsSuccess(response)) {
      //   if (response.data.length > 0) {
      //     this.equipmentOrganizationId = response.data[0];
      //     this.singleOrganizationId = response.data[0];

      //     await this.refresh();
      //   } else {
      //     this.$message.error('登录者未分配组织机构，没有数据查看权限');
      //   }
      // }

      let logedOrgId = localStorage.getItem('organizationId');
      if (logedOrgId == null || logedOrgId == undefined) {
        this.$message.error('用户组织机构未选择');
        return;
      }
      this.equipmentOrganizationId = logedOrgId;
    },

    // 更新各图表数据
    async refresh() {
      this.isLoading = true;
      await this.getYearMonthPlanStatisticsData();
      this.isLoading = false;
    },

    percentFilter(number) {
      if (isNaN(number)) return 0;
      return number;
    },

    reset() {
      this.queryParams = {
        time: null,
        type: DateReportType.Year,
      };
      this.getCurrentMonth();
      this.refresh();
    },
    getCurrentMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.queryParams.time = `${year}/${month}`;
    },

    getEmptyChartOption(titleParam) {
      return {
        title: {
          text: titleParam,
          subtext: "无数据",
        },
        top: 5,
        subtextStyle: {
          fontSize: 17,
        },
        legend: [],
        series: [],
      };
    },
  },
  render() {
    return (
      <div class="sm-cr-statistics-dashboard">
        {/* 操作区 */}
        {/* <sc-table-operator onSearch={this.refresh} onReset={this.reset} class="table-operator"> */}
        <a-row gutter={24}>
          <a-col sm={8} md={8}>
            <a-form-item label="时间" style="margin-bottom:0" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
              <a-month-picker
                placeholder="请选择月份"
                allowClear={false}
                style="width: 100%;"
                value={moment(this.queryParams.time)}
                format="YYYY/MM"
                onChange={(date, dateString) => {
                  this.queryParams.time = dateString;
                }}
              />
            </a-form-item>
          </a-col>
          <a-col sm={8} md={8}>
            <a-form-item label="计划类型" style="margin-bottom:0" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
              <a-select
                value={this.queryParams.type}
                placeholder="请选择计划类型"
                style="width: 100%;"
                onChange={value => {
                  this.queryParams.type = value;
                }}
              >
                <a-select-option value={DateReportType.Year}>年表</a-select-option>
                <a-select-option value={DateReportType.Month}>月表</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col sm={8} md={8}>
            <a-form-item style="margin-bottom:0" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
              <a-button type="primary" onClick={this.refresh}>查询</a-button>
              <a-button onClick={this.reset} style="margin-left:10px">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>

        {/* 图表展示区 */}
        <div class="report-content">

          {/* 年度完成进度 */}
          <div class="content-top">
            <div class="chart" ref="yearMonthPlanFinishPercent" />
          </div>
          <div class="content-bottom">
            <div class="complete-statistics-top">
              {/* 总体完成统计图 */}
              <div class="ensemble">
                <div class="chart" ref="ensembleChart" />
              </div>
            </div>
            {/* 各项设备完成统计图 */}
            <div class="complete-statistics-bottom">
              <div class="chart-select">
                {this.isShowSingleEquipData ?
                  (
                    <a-button
                      style="margin-right: 10px;"
                      onClick={() => {
                        this.renderEveryEquipFinishChart();
                      }}
                    >
                      <a-icon type="rollback" />
                    </a-button>) : undefined}
                <SmSystemOrganizationTreeSelect
                  style="width:200px;"
                  axios={this.axios}
                  value={this.equipmentOrganizationId}
                  autoInitial={true}
                  allowClear={false}
                  onInput={value => {
                    this.equipmentOrganizationId = value;
                    this.renderEveryEquipFinishChart();
                  }}
                  disabled={this.isShowSingleEquipData}
                />
              </div>

              <div class="chart" ref="equipmentChart" style="position: relative;" >
                {this.isLoadingEquip ? (
                  <div style="z-index:9999;">
                    <div style="position: absolute;;top:50%;left:50%; margin-top: -10px; margin-left: -10px; z-index: 9999;">
                      <a-spin></a-spin>
                    </div>
                    <div style="width:100%; height:100%; background-color: white;opacity: 0.5;position: absolute; top: 0; z-index: 999;"></div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {this.isLoading ? (
          <div style="position:fixed;left:0;right:0;top:0;bottom:0;z-index:9999;">
            <div style="position: relative;;top:45%;left:50%; z-index: 9999;">
              <a-spin tip="Loading..." size="large"></a-spin>
            </div>
            <div style="width:100%; height:100%; background-color: white;opacity: 0.5;"></div>
          </div>
        ) : null}
      </div>
    );
  },
};
