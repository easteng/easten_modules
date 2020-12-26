import moment from 'moment';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import ApiMaintenanceWork from '../../sm-api/sm-cr-plan/MaintenanceWork';
import ApiUser from '../../sm-api/sm-system/User';
import ApiWorkflow from '../../sm-api/sm-bpm/Workflow';
import WorkflowModal from '../../sm-bpm/sm-bpm-workflows/src/WorkflowModal';
import { WorkflowState, UserWorkflowGroup } from '../../_utils/enum';
let apiMaintenanceWork = new ApiMaintenanceWork();
let apiWorkflow = new ApiWorkflow();
let apiUser = new ApiUser();
import {
  requestIsSuccess,
  getWorkflowState,
  getYearMonthPlanStateType,
  vIf,
  vP,
} from '../../_utils/utils';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';
import { YearMonthPlanState, SelectablePlanType } from '../../_utils/enum';

export default {
  name: 'SmCrPlanMaintenanceWork',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      creationTime: '',
      peopleName: '',
      loading: false,
      dataSource: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        group: UserWorkflowGroup.Initial,
        organizationId: null, //发起单位
        planTime: moment(), // 计划时间
        workflowState: undefined, //审批状态
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
    };
  },
  computed: {

    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          ellipsis: true,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '发起单位',
          dataIndex: 'organizationId',
          ellipsis: true,
          scopedSlots: { customRender: 'organizationId' },
        },
        {
          title: '计划时间',
          ellipsis: true,
          dataIndex: 'dateTime',
          width: 200,
          scopedSlots: { customRender: 'dateTime' },
        },
        {
          title: '审批状态',
          ellipsis: true,
          dataIndex: 'workState',
          scopedSlots: { customRender: 'workState' },
        },
        // {
        //   title: '发起人',
        //   ellipsis: true,
        //   dataIndex: 'peopleName',
        //   scopedSlots: { customRender: 'peopleName' },
        // },
        // {
        //   title: '发起时间',
        //   ellipsis: true,
        //   dataIndex: 'startTime',
        //   scopedSlots: { customRender: 'startTime' },
        // },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  watch: {

  },

  async created() {
    this.initAxios();
    this.refresh();
  },

  mounted() { },

  methods: {
    initAxios() {
      apiMaintenanceWork = new ApiMaintenanceWork(this.axios);
      apiWorkflow = new ApiWorkflow(this.axios);
      apiUser = new ApiUser(this.axios);
    },
    async creationTimes(record) {
      let response = await apiWorkflow.getWorkflow(record.arKey);
      if (requestIsSuccess(response) && response.data) {
        let res = response.data;
        if (res) {
          this.creationTime = moment(res.creationTime).format("YYYY-MM-DD");
        }
      }
    },
    async peopleNames(record) {
      let response = await apiWorkflow.getWorkflow(record.arKey);
      if (requestIsSuccess(response) && response.data) {
        let result = response.data;
        if (result) {
          let creatorId = result.creatorId;
          let user = await apiUser.get({ id: creatorId });
          console.log(user);
          if (requestIsSuccess(user) && user.data) {
            this.peopleName = user.data.userName;
          }
        }
      }
    },
    async view(record) {
      if (record) {
        this.$refs.WorkflowModal.isInitial = false;
        this.$refs.WorkflowModal.edit(record.arKey);
      }
    },
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiMaintenanceWork.delete({ id: record.id });
            if (requestIsSuccess(response)) {
              _this.$message.success('删除成功！');
              _this.refresh(false, _this.pageIndex);
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
      });
    },

    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let data = {
        ...this.queryParams,
        planTime: moment(this.queryParams.planTime).startOf('month').format('YYYY-MM'),
      };
      console.log(data);
      let response = await apiMaintenanceWork.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...data,
      }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.dataSource = response.data.items;
        this.totalCount = response.data.totalCount;
        if (page && this.totalCount && this.queryParams.maxResultCount) {
          let currentPage = parseInt(this.totalCount / this.queryParams.maxResultCount);
          if (this.totalCount % this.queryParams.maxResultCount !== 0) {
            currentPage = page + 1;
          }
          if (page > currentPage) {
            this.pageIndex = currentPage;
            this.refresh(false, this.pageIndex);
          }
        }
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
    //状态选择
    // let canSelectStatusOption = [];
    // for (let item in YearMonthPlanState) {
    //   if (YearMonthPlanState[item] != YearMonthPlanState.UnCheck)
    //     canSelectStatusOption.push(
    //       <a-select-option key={YearMonthPlanState[item]}>
    //         {getYearMonthPlanStateType(YearMonthPlanState[item])}
    //       </a-select-option>,
    //     );
    // }
    let Options = [];
    for (let item in WorkflowState) {
      if (WorkflowState[item] != WorkflowState.All) {
        Options.push(
          <a-select-option key={`${WorkflowState[item]}`}>
            {getWorkflowState(WorkflowState[item])}
          </a-select-option>,
        );
      }
    }
    return (
      <div class="sm-cr-plan-maintenance-work">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              organizationId: null,
              workTime: moment(),
              workflowState: null,
            };
            this.refresh();
          }}
        >
          <a-form-item label="发起单位">
            <OrganizationTreeSelect
              ref="OrganizationTreeSelect"
              axios={this.axios}
              value={this.queryParams.organizationId}
              autoInitial={true}
              onInput={value => {
                this.queryParams.organizationId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="计划时间">
            <a-month-picker
              style="width: 100%"
              allowClear={false}
              placeholder="请选择时间"
              value={this.queryParams.planTime}
              onChange={value => {
                this.queryParams.planTime = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="审批状态">
            <a-select
              allowClear
              axios={this.axios}
              placeholder="请选择状态"
              value={this.queryParams.workflowState}
              onChange={value => {
                this.queryParams.workflowState = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
            {/* <a-select
              allowClear
              placeholder="请选择状态"
              value={this.queryParams.workflowState}
              onChange={value => {
                this.queryParams.workflowState = value;
                this.refresh();
              }}
            >
              {canSelectStatusOption}
            </a-select> */}
          </a-form-item>
          {/* <template slot="buttons">

            <a-button type="primary" onClick={() => {
              this.view("record");
            }} >
              查看
            </a-button>

            <a-button type="primary" onClick={() => {
              this.remove("record");
            }} >
              删除
            </a-button>

          </template> */}
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.dataSource}
          rowKey={record => record.id}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                let result = index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                return <a-tooltip title={result}>{result}</a-tooltip>;
              },
              organizationId: (text, record, index) => {
                console.log(record);
                let result = record.organization ? record.organization.name : '';
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              dateTime: (text, record, index) => {
                let startTime = moment(record.startTime).format('YYYY-MM-DD');
                let endTime = moment(record.endTime).format('YYYY-MM-DD');
                let result = `${startTime}—${endTime}`;
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              workState: (text, record, index) => {
                let result = getWorkflowState(record.workflowState);
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              peopleName: async (text, record, index) => {
                let peopleName = '';
                if (record) {
                  let response = await apiWorkflow.getWorkflow(record.arKey);
                  if (requestIsSuccess(response) && response.data) {
                    let creatorId = response.data.creatorId;
                    let userResponse = await apiUser.get({ id: creatorId });
                    if (requestIsSuccess(userResponse) && userResponse.data) {
                      peopleName = userResponse.data.userName;
                    }
                  }
                }
                return (
                  <a-tooltip placement="topLeft" title={peopleName}>
                    <span>{peopleName}</span>
                  </a-tooltip>
                );
              },
              startTime: async (text, record, index) => {
                let creationTime = '123';
                // if (record) {
                //   //let response = await apiWorkflow.getWorkflow(record.arKey);
                //   //if (requestIsSuccess(response) && response.data) {
                //   //  creationTime = moment(response.data.creationTime).format("YYYY-MM-DD");
                //  // }
                // }

                return (
                  <a-tooltip placement="topLeft" title={creationTime}>
                    <span>{creationTime}</span>
                  </a-tooltip>
                );
              },
              operations: (text, record) => {
                return <span>
                  {/* {vIf( */}
                  <a
                    onClick={() => {
                      this.view(record);
                    }}
                  >
                    查看
                  </a>
                  {/* vP(this.permissions,
                      permissionsSmCrPlan.VerticalSkylightPlan.Detail ||
                      permissionsSmCrPlan.ComprehensiveSkylightPlan.Detail ||
                      permissionsSmCrPlan.SkylightOutsidePlan.Detail,
                    ),
                  )} */}
                  <a-divider type="vertical" />
                  {/* {vIf( */}
                  <a
                    onClick={() => {
                      this.remove(record);
                    }}
                  >
                    删除
                  </a>
                  {/* vP(this.permissions,
                      permissionsSmCrPlan.VerticalSkylightPlan.Detail ||
                      permissionsSmCrPlan.ComprehensiveSkylightPlan.Detail ||
                      permissionsSmCrPlan.SkylightOutsidePlan.Detail,
                    ),
                  )} */}
                </span>;
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
        {/* 维修作业审批单模态框 */}
        <WorkflowModal
          ref="WorkflowModal"
          axios={this.axios}
          isInitial={false}
          // onSuccess={this.onSuccess}

        />
        {/* <SmCrPlanMaintenanceWorkModal
          ref="SmCrPlanMaintenanceWorkModal"
          axios={this.axios}
        /> */}
      </div>
    );
  },
};
