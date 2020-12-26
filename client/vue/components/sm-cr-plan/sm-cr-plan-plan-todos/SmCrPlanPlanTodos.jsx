import moment from 'moment';
import ApiPlanTodo from '../../sm-api/sm-cr-plan/PlanTodo';
import InstallationSelect from '../../sm-basic/sm-basic-installation-site-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getPlanTypeTitle, getRepairLevelTitle, vIf, vP } from '../../_utils/utils';
import { PlanType } from '../../_utils/enum';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';

import SmCrPlanPlanTodoModal from './SmCrPlanPlanTodoModal';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiPlanTodo = new ApiPlanTodo();

export default {
  name: 'SmCrPlanPlanTodos',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      planTodos: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
      queryParams: {
        startPlanTime: null,
        endPlanTime: null,
        workUnitId: null,
        installationSiteId: null, //机房位置
        planType: PlanType.All, //计划类型
        otherConditions: '', // 模糊搜索
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
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '计划日期',
          dataIndex: 'workTime',
          scopedSlots: { customRender: 'workTime' },
        },
        {
          title: '作业时长',
          dataIndex: 'timeLength',
        },
        {
          title: '作业机房',
          dataIndex: 'workSiteName',
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
    dispatch(record) {
      this.$refs.SmCrPlanPlanTodoModal.dispatch(record);
    },
    initAxios() {
      apiPlanTodo = new ApiPlanTodo(this.axios);
    },
    backout(record) {
      let _this = this;
      this.$confirm({
        title: '撤销提示',
        content: '是否确认撤销，该操作无法恢复！',
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiPlanTodo.backoutPlan(record.id, _this.repairTagKey);
            _this.refresh();
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    async refresh(resetPage = true) {
      this.loading = true;

      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = {
        ...this.queryParams,
        startPlanTime: this.dateRange[0] ? this.dateRange[0].format('YYYY-MM-DD') : null,
        endPlanTime: this.dateRange[1] ? this.dateRange[1].format('YYYY-MM-DD') : null,
        installationSiteId: this.queryParams.installationSiteId,
        planType: this.queryParams.planType,
        otherConditions: this.queryParams.otherConditions,
        workUnitId: this.queryParams.workUnitId,
      };
      let response = await apiPlanTodo.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.planTodos = response.data.items;
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
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              autoInitial={true}
              placeholder="请选择车间"
              value={this.queryParams.workUnitId}
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
              placeholder="请选择天窗类型"
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
          dataSource={this.planTodos}
          rowKey={record => record.id}
          //分页
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              workTime: (text, record) => {
                return moment(record.workTime).format('YYYY-MM-DD');
              },
              level: (text, record) => {
                return (
                  <a-tooltip placement="topLeft" title={getRepairLevelTitle(record.level)}>
                    <span>{getRepairLevelTitle(record.level)}</span>
                  </a-tooltip>
                );
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
                          this.dispatch(record);
                        }}
                      >
                        派工
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.PlanTodo.Dispatching),
                    )}
                    <a-divider type="vertical" />
                    {vIf(
                      <a
                        onClick={() => {
                          this.backout(record);
                        }}
                      >
                        撤销
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.PlanTodo.Revoke),
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

        <SmCrPlanPlanTodoModal
          ref="SmCrPlanPlanTodoModal"
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
