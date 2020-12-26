import moment from 'moment';
import { PlanType, RepairLevel, SendWorkOperatorType } from '../../_utils/enum';
import InstallationSelect from '../../sm-basic/sm-basic-installation-site-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import ApiWorkOrder from '../../sm-api/sm-cr-plan/WorkOrder';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiWorkOrder = new ApiWorkOrder();
let apiOrganization = new ApiOrganization();

// const SendingWorkRouterPath = '/components/sm-cr-plan-sending-work-cn';
const SendingWorkRouterPath = '/crPlan/sending-work';
export default {
  name: 'SmCrPlanSendingWorksFinished',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      loading: false,
      workDatas: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        startPlanTime: null, // 计划开始日期(默认本月1号)
        endPlanTime: null, //计划结束日期（默认本月最后一天）
        installationSiteId: null, // 作业机房
        workUnitId: null, //作业单位
        otherConditions: null, //搜索关键字
        isDispatching: true, //是否为已完成模块
        maxResultCount: paginationConfig.defaultPageSize,
      },
      rangePicker: {
        format: 'YYYY-MM-DD',
        Value: [],
      }, // 时间选择控件
      form: this.$form.createForm(this),
      currentOrganizationId: null,//当前用户所属组织机构
      isInit: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          ellipsis: true,
          fixed: 'left',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '实际作业时间',
          dataIndex: 'WorkTime',
          width: 245,
          scopedSlots: { customRender: 'WorkTime' },
        },
        {
          title: '作业机房',
          dataIndex: 'workSite',
          width: 100,
          ellipsis: true,
        },
        {
          title: '作业位置/里程',
          dataIndex: 'workArea',
          width: 130,
          ellipsis: true,
        },
        {
          title: '工作内容',
          dataIndex: 'workContent',
          width: 100,
          ellipsis: true,
        },
        {
          title: '作业单位',
          dataIndex: 'workUintString',
          width: 100,
          ellipsis: true,
        },
        {
          title: '维修等级',
          dataIndex: 'level',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'level' },
        },
        {
          title: '作业组长',
          dataIndex: 'workLeader',
          width: 100,
          ellipsis: true,
        },
        {
          title: '作业人员',
          dataIndex: 'workMemberString',
          width: 100,
          ellipsis: true,
        },
        {
          title: '天窗类型',
          dataIndex: 'planType',
          width: 100,
          scopedSlots: { customRender: 'planType' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          fixed: 'right',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {},
  async created() {
    this.initAxios();
    this.getCurrentDay();
    this.isInit = true;
    this.refresh();
  },
  methods: {
    initAxios() {
      apiWorkOrder = new ApiWorkOrder(this.axios);
      apiOrganization = new ApiOrganization(this.axios);
    },

    async refresh(resetPage = true, page) {
      this.loading = true;

      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let response = await apiWorkOrder.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.workDatas = response.data.items;
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },

    getCurrentDay() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let lastDay = new Date(year, month, 0).getDate();

      this.queryParams.startPlanTime = `${year}-${month}-01`;
      this.queryParams.endPlanTime = `${year}-${month}-${lastDay}`;
      this.rangePicker.value = [
        moment(this.queryParams.startPlanTime, this.rangePicker.format),
        moment(this.queryParams.endPlanTime, this.rangePicker.format),
      ];
    },
    reset() {
      this.queryParams = {
        startPlanTime: null, // 计划开始日期(默认本月1号)
        endPlanTime: null, //计划结束日期（默认本月最后一天）
        installationSiteId: null, // 作业机房
        workUnitId: this.currentOrganizationId,//作业单位
        otherConditions: null, //搜索关键字
        isDispatching: true, //是否为已完成模块
      };
      this.getCurrentDay();
      this.refresh();
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
    // 详细
    view(record) {
      this.$emit(
        "view",
        SendWorkOperatorType.View,
        record.id,
        true,
      );
    },
    // 编辑
    edit(record) {
      this.$emit(
        "edit",
        SendWorkOperatorType.Edit,
        record.id,
      );
    },
  },
  render() {
    return (
      <div class="sm-cr-plan-vertical-skylight-plans">
        {/* 操作区 */}
        <sc-table-operator onSearch={this.refresh} onReset={this.reset}>
          <a-form-item label="作业单位">
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.workUnitId}
              autoInitial={true}
              allowClear={false}
              onInput={value => {
                if (this.isInit) {
                  this.currentOrganizationId = value;
                }
                this.isInit = false;
                this.queryParams.workUnitId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="日期">
            <a-range-picker
              allowClear={false}
              default-value={this.rangePicker.value}
              onChange={(date, dateString) => {
                this.rangePicker.value = date;
                this.queryParams.startPlanTime = dateString[0];
                this.queryParams.endPlanTime = dateString[1];
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="作业机房">
            <InstallationSelect
              axios={this.axios}
              placeholder="请选择"
              height={32}
              value={this.queryParams.installationSiteId}
              onChange={value => {
                this.queryParams.installationSiteId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="模糊查找">
            <a-input
              placeholder="请输入工作内容、作业位置/里程"
              value={this.queryParams.otherConditions}
              onInput={event => {
                this.queryParams.otherConditions = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.workDatas}
          rowKey={record => record.id}
          scroll={{ x: 'calc(700px + 50%)' }}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1;
                // return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              WorkTime: (text, record) => {
                return record.workTime;
                return moment(text).format('YYYY-MM-DD');
              },
              level: (text, record) => {
                let strText = '';
                switch (text) {
                case RepairLevel.LevelI:
                  strText = '天窗点内I级维修';
                  break;
                case RepairLevel.LevelII:
                  strText = '天窗点内II级维修';
                  break;
                case RepairLevel.LevelIII:
                  strText = '天窗外I级维修';
                  break;
                case RepairLevel.LevelIv:
                  strText = '天窗点外II级维修';
                  break;
                default:
                  break;
                }
                return strText;
              },
              planType: (text, record) => {
                let strText = '';
                switch (text) {
                case PlanType.Vertical:
                  strText = '垂直天窗';
                  break;
                case PlanType.General:
                  strText = '综合天窗';
                  break;
                case PlanType.OutOf:
                  strText = '天窗点外';
                  break;
                case PlanType.All:
                  strText = '全部';
                  break;
                default:
                  break;
                }
                return strText;
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.view(record);
                        }}
                      >
                        详情
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.SendingWorksFinished.Detail),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, [permissionsSmCrPlan.SendingWorksFinished.Detail, permissionsSmCrPlan.SendingWorksFinished.Update]),
                    )}

                    {vIf(
                      <a
                        onClick={() => {
                          this.edit(record);
                        }}
                      >
                        编辑
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.SendingWorksFinished.Update),
                    )}
                  </span>,
                ];
              },
            },
          }}
        />

        {/* 分页器 */}

        <a-pagination
          style="float:right; margin-top:10px"
          total={this.totalCount}
          pageSize={this.queryParams.maxResultCount}
          current={this.pageIndex}
          onChange={this.onPageChange}
          onShowSizeChange={this.onPageChange}
          showSizeChanger
          showQuickJumper
          showTotal={paginationConfig.showTotal}
        />

      </div>
    );
  },
};
