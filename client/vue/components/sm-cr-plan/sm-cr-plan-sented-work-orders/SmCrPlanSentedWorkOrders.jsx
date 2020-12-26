import moment from 'moment';
import ApiSendedWorkOrder from '../../sm-api/sm-cr-plan/SendedWorkOrder';
import InstallationSelect from '../../sm-basic/sm-basic-installation-site-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getPlanTypeTitle, getRepairLevelTitle, vIf, vP } from '../../_utils/utils';
import { PlanType, OrderState } from '../../_utils/enum';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

import SmCrPlanSentedWorkOrderModal from './SmCrPlanSentedWorkOrderModal';
import OrganizationSelect from '../../sm-system/sm-system-organization-tree-select';

let apiSendedWorkOrder = new ApiSendedWorkOrder();

export default {
  name: 'SmCrPlanSentedWorkOrders',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      loading: false,
      sentedWorkOrders: [], //已派工作业数据源
      pageSize: paginationConfig.defaultPageSize,
      totalCount: 0,
      pageIndex: 1,
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
      queryParams: {
        startPlanTime: null, // 开始时间
        endPlanTime: null, // 结束时间
        installationSiteId: null, //机房搜索
        planType: PlanType.All, //天窗类型
        otherConditions: '', // 模糊搜索
        workUnitId: null, //作业单位
        maxResultCount: paginationConfig.defaultPageSize,
      },
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
          scopedSlots: { customRender: 'index' },
          width: 90,
        },
        {
          title: '计划作业时间',
          ellipsis: true,
          dataIndex: 'workTime',
          scopedSlots: { customRender: 'workTime' },
        },
        {
          title: '作业机房',
          dataIndex: 'workSite',
          ellipsis: true,
        },
        {
          title: '作业位置/里程',
          dataIndex: 'workArea',
          ellipsis: true,
        },
        {
          title: '工作内容',
          dataIndex: 'workContent',
          ellipsis: true,
        },
        {
          title: '作业单位',
          dataIndex: 'workUintString',
          ellipsis: true,
        },
        {
          title: '维修等级',
          dataIndex: 'level',
          ellipsis: true,
          scopedSlots: { customRender: 'level' },
        },
        {
          title: '天窗类型',
          dataIndex: 'planType',
          scopedSlots: { customRender: 'planType' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 120,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {},
  async created() {
    this.initAxios();
    this.refresh();
    this.isInit = true;
  },
  methods: {
    view(record) {
      this.$refs.SmCrPlanSentedWorkOrderModal.view(record);
    },

    initAxios() {
      apiSendedWorkOrder = new ApiSendedWorkOrder(this.axios);
    },
    backout(record) {
      let _this = this;
      if (record.orderState === OrderState.UnFinished) {
        this.$confirm({
          title: '撤销提示',
          content: '确定要撤销该计划？',
          okType: 'primary',
          onOk() {
            return new Promise(async (resolve, reject) => {
              let response = await apiSendedWorkOrder.delete(record.id, _this.repairTagKey);
              _this.refresh();
              setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
            });
          },
        });
      } else {
        this.$confirm({
          title: '撤销提示',
          content: '该计划已录入完成情况，无法撤销！',
          okType: 'primary',
          okButtonProps: {
            props: { disabled: true },
          },
        });
      }
    },

    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = {
        startPlanTime: this.dateRange[0] ? this.dateRange[0].format('YYYY-MM-DD') : null,
        endPlanTime: this.dateRange[1] ? this.dateRange[1].format('YYYY-MM-DD') : null,
        installationSiteId: this.queryParams.installationSiteId,
        planType: this.queryParams.planType,
        otherConditions: this.queryParams.otherConditions,
        workUnitId: this.queryParams.workUnitId,
        maxResultCount: this.queryParams.maxResultCount,
      };
      let response = await apiSendedWorkOrder.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.sentedWorkOrders = response.data.items;
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
  },

  render() {
    let options = [];
    for (let item in PlanType) {
      options.push(
        <a-select-option key={PlanType[item]}>{getPlanTypeTitle(PlanType[item])}</a-select-option>,
      );
    }
    return (
      <div class="sm-cr-plan-vertical-skylight-plans">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              startPlanTime: null,
              endPlanTime: null,
              installationSiteId: null,
              planType: PlanType.All,
              otherConditions: '',
              workUnitId: this.currentOrganizationId,
            };
            this.dateRange = [moment(moment()).startOf('month'), moment(moment()).endOf('month')];
            this.refresh();
          }}
        >
          <a-form-item label="作业单位">
            <OrganizationSelect
              axios={this.axios}
              placeholder="请选择"
              value={this.queryParams.workUnitId}
              autoInitial={true}
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

          <a-form-item label="计划日期">
            <a-range-picker
              style="width: 100%"
              value={this.dateRange}
              onChange={value => {
                this.dateRange = value;
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
          <a-form-item label="天窗类型">
            <a-select
              axios={this.axios}
              placeholder="请选择"
              value={this.queryParams.planType}
              onChange={value => {
                this.queryParams.planType = value;
                this.refresh();
              }}
            >
              {options}
            </a-select>
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
          dataSource={this.sentedWorkOrders}
          rowKey={record => record.id}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              // planTime: (text, record) => {
              //   return moment(record.planTime).format('YYYY-MM-DD');
              // },
              level: (text, record) => {
                return getRepairLevelTitle(record.level);
              },
              planType: (text, record) => {
                return getPlanTypeTitle(record.planType);
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
                      vP(this.permissions, permissionsSmCrPlan.SentedWorkOrders.Detail),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmCrPlan.SentedWorkOrders.Detail, permissionsSmCrPlan.SentedWorkOrders.Revoke),
                    )}

                    {vIf(
                      <a
                        onClick={() => {
                          this.backout(record);
                        }}
                      >
                        撤销
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.SentedWorkOrders.Revoke),
                    )}
                  </span>,
                ];
              },
            },
          }}
        ></a-table>
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

        <SmCrPlanSentedWorkOrderModal
          ref="SmCrPlanSentedWorkOrderModal"
          axios={this.axios}
          repairTagKey={this.repairTagKey}
          organizationId={this.currentOrganizationId}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
