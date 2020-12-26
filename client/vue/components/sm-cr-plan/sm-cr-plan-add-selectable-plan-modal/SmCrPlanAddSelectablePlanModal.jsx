import ApiAlterRecord from '../../sm-api/sm-cr-plan/AlterRecord';
import { requestIsSuccess, getSelectablePlanType } from '../../_utils/utils';
import { SelectablePlanType, SkylightType } from '../../_utils/enum';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';

import moment from 'moment';

let apiAlterRecord = new ApiAlterRecord();

export default {
  name: 'SmCrPlanAddSelectablePlanModal',
  model: {
    prop: 'visible',
    event: ['change'],
  },
  props: {
    value: { type: Boolean, default: null },
    visible: { type: Boolean, default: false },
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null },
    selected: {
      type: Array,
      default: () => [],
    },
    changeType: { type: Number, default: -1 }, //变更类型 若不传值 则表示能够下拉选择，传值则表示此值固定，界面无法改变
    organizationId: { type: String, default: null },
    date: { type: Date, default: new Date() },
    skylightType: { type: Number, default: SkylightType.None }, //是否用于垂直天窗
  },
  data() {
    return {
      loading: false,
      selectedPlans: [],
      selectedPlanEnts: [],
      plans: [],
      allPlans: [],
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        startTime: null, //开始时间
        endTime: null, //结束时间
        type: null, //年月表类型
        keyword: null, //设备名称工作内容
        skylightType: null, //天窗类型
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
      },
      dateInterval: [], //界面时间段控件值
      typeSelectShow: true, //类型选择框是否显示,
      dateFormat: 'YYYY-MM-DD',
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '类型',
          dataIndex: 'changeType',
          scopedSlots: { customRender: 'changeType' },
          width: 95,
        },
        {
          title: '序号',
          dataIndex: 'number',
          width: 90,
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'equipName',
          width: 130,
          ellipsis: true,
        },
        {
          title: '工作内容',
          dataIndex: 'content',
          width: 160,
          ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 60,
          ellipsis: true,
        },
        {
          title: '计划日期',
          dataIndex: 'planDate',
          scopedSlots: { customRender: 'planDate' },
          width: 110,
        },
        {
          title: '计划数量',
          dataIndex: 'planCount',
          scopedSlots: { customRender: 'planCount' },
        },
        {
          title: '未完成数量',
          dataIndex: 'unFinishCount',
          scopedSlots: { customRender: 'unFinishCount' },
        },
      ];
    },
  },
  watch: {
    selected: {
      handler: function () {
        this.selectedPlans = this.selected;
      },
      immediate: true,
    },
    visible: {
      handler: function () {
        if (this.visible) {
          this.refresh();
          this.selectedPlans = this.selected;
        }
      },
    },
    date: {
      handler: function () {
        //this.dateInterval = this.getDefaultDateRange();
        this.initDateRange();
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
    this.initDateRange();
    this.refresh();
    this.judgeChangeType();
  },
  methods: {
    initAxios() {
      apiAlterRecord = new ApiAlterRecord(this.axios);
    },

    //初始化时间段 以及接口时间段参数
    initDateRange() {
      this.dateInterval = this.getDefaultDateRange();
      let dateRange = this.getRangeDate4API();
      this.queryParams.startTime = dateRange[0];
      this.queryParams.endTime = dateRange[1];
    },
    async refresh(resetPage = true) {
      this.isrelateAll = false;
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      if (this.changeType != -1) this.queryParams.type = this.changeType;
      this.queryParams.orgId = this.organizationId;

      if (this.skylightType == SkylightType.None) this.queryParams.skylightType = null;
      else this.queryParams.skylightType = this.skylightType;

      let response = await apiAlterRecord.getSelectablePlans(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.plans = response.data.items;
        this.plans.map(item => {
          let target = this.allPlans.find(_item => _item.id === item.id);
          if (!target) {
            this.allPlans.push(item);
          } else {
            target = item;
          }
        });
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },
    //根据传入属性 判断类型能否改变
    judgeChangeType() {
      if (this.changeType != -1) {
        for (let item in SelectablePlanType) {
          if (this.changeType == SelectablePlanType[item]) {
            this.queryParams.type = this.changeType;
            this.typeSelectShow = false;
            break;
          }
        }
      }
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    // 数据提交
    ok() {
      let res = new Array();
      this.allPlans.map(item => {
        if (this.selectedPlans.indexOf(item.id) != -1) {
          res.push(item);
        }
      });
      this.$emit('ok', res);
      this.close();
    },

    close() {
      this.$emit('change', false);
      this.allPlans = [];
    },

    //获取默认时间段
    getDefaultDateRange() {
      let year = this.date.getFullYear();
      let month = this.date.getMonth() + 1;
      let range = [
        moment(year + '/' + month + '/01', this.dateFormat),
        moment(year + '/' + month + '/' + this.getLastDay(year, month), this.dateFormat),
      ];
      return range;
    },

    //获取默认时间段 为接口
    getRangeDate4API() {
      let year = this.date.getFullYear();
      let month = this.date.getMonth() + 1;
      let range = [
        year + '-' + month + '-01',
        year + '-' + month + '-' + this.getLastDay(year, month),
      ];
      return range;
    },

    //计算时间禁用范围
    disabledDate(current) {
      if (
        current.year() != this.date.getFullYear() ||
        (current.year() == this.date.getFullYear() && current.month() != this.date.getMonth())
      ) {
        return true;
      }
    },

    getLastDay(year, month) {
      let new_year = year; //取当前的年份
      let new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        new_month -= 12; //月份减
        new_year++; //年份增
      }
      let new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
      return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
    },
  },
  render() {
    //变更类型选择
    let yearMonthPlanTypeOption = [];
    for (let item in SelectablePlanType) {
      if (SelectablePlanType[item] == 1 || SelectablePlanType[item] == 4)
        yearMonthPlanTypeOption.push(
          <a-select-option key={SelectablePlanType[item]}>
            {getSelectablePlanType(SelectablePlanType[item])}表
          </a-select-option>,
        );
    }

    return (
      <a-modal
        class="sm-cr-plan-vertical-skylight-plan-modal"
        title="添加待选计划"
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
        // onChange={value => {
        //   this.$emit('change', value);
        // }}
        width={990}
      >
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.initDateRange();
            if (this.changeType == -1) this.queryParams.type = null;
            this.queryParams.keyword = null;

            this.refresh();
          }}
        >
          <a-form-item label="选择日期" style="margin-bottom: 12px;">
            <a-range-picker
              allowClear={false}
              value={this.dateInterval}
              disabled-date={this.disabledDate}
              onChange={(value, dateString) => {
                if (dateString.length == 2) {
                  this.dateInterval = [
                    moment(dateString[0], this.dateFormat),
                    moment(dateString[1], this.dateFormat),
                  ];
                  this.queryParams.startTime = dateString[0];
                  this.queryParams.endTime = dateString[1];
                  this.refresh();
                }
                if (value.length == 0) this.dateInterval = this.getDefaultDateRange();
              }}
            />
          </a-form-item>

          {this.typeSelectShow ? (
            <a-form-item label="类型">
              <a-select
                allowClear
                value={this.queryParams.type}
                onChange={value => {
                  this.queryParams.type = value;
                  this.refresh();
                }}
              >
                {yearMonthPlanTypeOption}
              </a-select>
            </a-form-item>
          ) : (
            undefined
          )}

          <a-form-item label="关键字" style="margin-bottom: 12px;">
            <a-input
              placeholder="设备名称/工作内容"
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
        </sc-table-operator>

        <a-table
          columns={this.columns}
          dataSource={this.plans}
          rowKey={record => record.id}
          loading={this.loading}
          pagination={false}
          rowSelection={{
            columnWidth: 30,
            selectedRowKeys: this.selectedPlans,
            onChange: selectedRows => {
              this.selectedPlans = selectedRows;
            },
          }}
          scroll={{ y: 400 }}
          {...{
            scopedSlots: {
              changeType: (text, record) => {
                return record.planTypeStr ? record.planTypeStr : '';
              },
              // number: (text, record) => {
              //   return record.number ? record.number : '';
              // },
              // equipName: (text, record) => {
              //   return record.equipName ? record.equipName : '';
              // },
              // content: (text, record) => {
              //   return record.content ? record.content : '';
              // },
              // unit: (text, record) => {
              //   return record.unit ? record.unit : '';
              // },
              planDate: (text, record) => {
                return record.planDate ? moment(record.planDate).format(this.dateFormat) : '';
              },
              planCount: (text, record) => {
                return record.count ? record.count : '';
              },
              unFinishCount: (text, record) => {
                return record.unFinishCount ? record.unFinishCount : 0;
              },
            },
          }}
        ></a-table>
        {/* 分页器 */}

        <a-pagination
          style="margin-top:10px; text-align: right;"
          total={this.totalCount}
          pageSize={this.queryParams.maxResultCount}
          current={this.pageIndex}
          onChange={this.onPageChange}
          onShowSizeChange={this.onPageChange}
          showSizeChanger
          showQuickJumper
          showTotal={paginationConfig.showTotal}
        />

      </a-modal>
    );
  },
};
