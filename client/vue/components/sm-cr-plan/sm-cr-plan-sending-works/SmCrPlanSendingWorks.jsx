import moment from 'moment';
import { PlanType, RepairLevel, OrderState, SendWorkOperatorType } from '../../_utils/enum';
import InstallationSelect from '../../sm-basic/sm-basic-installation-site-select';
import { pagination as paginationConfig } from '../../_utils/config';
import { requestIsSuccess, vIf, vP, getOrderStateTitle, getRepairLevelTitle, getPlanTypeTitle } from '../../_utils/utils';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmCrPlanSendingWorkModal from './src/SmCrPlanSendingWorkModal';
import ApiWorkOrder from '../../sm-api/sm-cr-plan/WorkOrder';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiWorkOrder = new ApiWorkOrder();

export default {
  name: 'SmCrPlanSendingWorks',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      workDatas: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        startPlanTime: null, // 计划开始日期(默认本月1号)
        endPlanTime: null, //计划结束日期（默认本月最后一天）
        installationSiteId: null, // 作业机房
        workUnitId: null, //作业单位
        otherConditions: null, //搜索关键字
        isDispatching: false, //是否为已完成模块
        maxResultCount: paginationConfig.defaultPageSize,
      },
      rangePicker: {
        format: 'YYYY-MM-DD',
        Value: [],
      }, // 时间选择控件
      form: this.$form.createForm(this),
      loading: false,
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
          title: '计划作业时间',
          dataIndex: 'planTime',
          width: 245,
          scopedSlots: { customRender: 'planTime' },
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
          width: 140,
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
          title: '状态',
          dataIndex: 'orderState',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'orderState' },
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
    this.refresh();
    this.isInit = true;
  },
  methods: {
    initAxios() {
      apiWorkOrder = new ApiWorkOrder(this.axios);
    },

    async refresh(resetPage = true) {
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
        this.loading = false;
      }
    },

    //获取派工作业状态标签的颜色显示
    getTagColor(orderState) {
      let tagColor = '';
      switch (orderState) {
      case OrderState.UnFinished: {
        //未完成
        tagColor = 'red';
        break;
      }
      case OrderState.Complete: {
        //已完成
        tagColor = 'blue';
        break;
      }
      case OrderState.Acceptance: {
        //已验收
        tagColor = 'green';
        break;
      }
      }
      return tagColor;
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
        workUnitId: this.currentOrganizationId, //作业单位
        otherConditions: null, //搜索关键字
        isDispatching: false, //是否为已完成模块
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
      );
    },
    // 派工单
    dispatch(record) {
      this.$refs.SmCrPlanSendingWorkModal.dispatch(record.id);
    },
    // 完成
    finish(record) {
      if (record.workLeader === null) {
        this.$message.error('请先进行派工作业操作');
        return;
      }

      if (record.orderState === OrderState.Acceptance) {
        this.$message.error('该派工单已验收');
        return;
      }

      this.$emit(
        "finish",
        SendWorkOperatorType.Finish,
        record.id,
      );
    },
    // 验收
    acceptance(record) {
      if (record.workLeader === null) {
        this.$message.error('请先进行派工作业操作');
        return;
      }

      if (record.orderState === OrderState.UnFinished) {
        this.$message.error('请先进行派工作业完成操作');
        return;
      }

      this.$emit(
        "acceptance",
        SendWorkOperatorType.Acceptance,
        record.id,
      );
    },
    // 撤销
    remove(record) {
      if (
        record.orderState === OrderState.Complete ||
        record.orderState === OrderState.Acceptance
      ) {
        this.$message.error('该计划已录入完成情况，无法撤销！');
        return;
      }

      let _this = this;
      this.$confirm({
        title: '撤销提示',
        content: '确认要撤销该派工作业到天窗计划！',
        okType: 'primary',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiWorkOrder.remove(record.id, false, _this.repairTagKey);
            _this.refresh();
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
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
              style="width:100%"
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

              planTime: (text, record) => {
                return record.workTime;
              },

              level: (text, record) => {
                return getRepairLevelTitle(text);
              },

              planType: (text, record) => {
                return getPlanTypeTitle(text);
              },

              orderState: (text, record) => {
                return <a-tag color={this.getTagColor(record.orderState)}>
                  {getOrderStateTitle(record.orderState)}
                </a-tag>;
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
                      vP(this.permissions, permissionsSmCrPlan.SendingWork.Detail),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmCrPlan.SendingWork.Detail) &&
                      vP(this.permissions, [permissionsSmCrPlan.SendingWork.DispatchList, permissionsSmCrPlan.SendingWork.Finish, permissionsSmCrPlan.SendingWork.Acceptance, permissionsSmCrPlan.SendingWork.Revoke]),
                    )}

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          {record.orderState == OrderState.UnFinished ? (
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.dispatch(record);
                                  }}
                                >
                                  派工单
                                </a>,
                                vP(this.permissions, permissionsSmCrPlan.SendingWork.DispatchList),
                              )}
                            </a-menu-item>
                          ) : (
                            undefined
                          )}

                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.finish(record);
                                }}
                              >
                                完成
                              </a>,
                              vP(this.permissions, permissionsSmCrPlan.SendingWork.Finish),
                            )}
                          </a-menu-item>
                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.acceptance(record);
                                }}
                              >
                                验收
                              </a>,
                              vP(this.permissions, permissionsSmCrPlan.SendingWork.Acceptance),
                            )}
                          </a-menu-item>
                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.remove(record);
                                }}
                              >
                                撤销
                              </a>,
                              vP(this.permissions, permissionsSmCrPlan.SendingWork.Revoke),
                            )}
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [permissionsSmCrPlan.SendingWork.DispatchList, permissionsSmCrPlan.SendingWork.Finish, permissionsSmCrPlan.SendingWork.Acceptance, permissionsSmCrPlan.SendingWork.Revoke]),
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


        <SmCrPlanSendingWorkModal
          ref="SmCrPlanSendingWorkModal"
          axios={this.axios}
          repairTagKey={this.repairTagKey}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
