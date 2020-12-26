import moment from 'moment';
import ApiSkyLightPlan from '../../sm-api/sm-cr-plan/SkyLightPlan';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getPlanState, getRepairLevelTitle, vIf, vP } from '../../_utils/utils';
import SmCrPlanGenerateRepairPlanModal from './SmCrPlanGenerateRepairPlanModal';
import SmCrPlanPlanTodoModal from './SmCrPlanPlanTodoModal';
import { PlanType, PlanState, RepairTagKeys } from '../../_utils/enum';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';
import SmBasicRailwayTreeSelect from '../../sm-basic/sm-basic-railway-tree-select';
import StationSelect from '../../sm-basic/sm-basic-station-select';
import SmBasicInstallationSiteSelect from '../../sm-basic/sm-basic-installation-site-select';
import SmBasicStationSelectByRailway from '../../sm-basic/sm-basic-station-select-by-railway';
import StationCascader from '../../sm-basic/sm-basic-station-cascader';
import { get } from 'js-cookie';
import './style';
let apiSkyLightPlan = new ApiSkyLightPlan();

export default {
  name: 'SmCrPlanSkylightPlans',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    planType: { type: Number, default: PlanType.Vertical },
    permissions: { type: Array, default: () => [] },
    // repairTagKey: { type: String, default: RepairTagKeys.RailwayHighSpeed }, //维修项标签
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      loading: false,
      skyLightPlans: [], // 列表数据源
      belongOrgs: [], //所属机构
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        workUnit: null, // 作业单位
        workTime: moment(), // 时间选择
        workSite: null, //机房
        railwayId: undefined,//线路
        planType: null, //天窗类型
        station: undefined, //车站选择
        contentMileage: '', //模糊查询
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      currentOrganizationId: null,//当前用户所属组织机构
      isInit: false,
    };
  },
  computed: {
    // railwayRltStation() {
    //   let railwayRltStation = {
    //     railwayId: this.queryParams.railwayId,
    //     stationId: this.queryParams.station,
    //     organizationId: this.queryParams.workUnit,
    //   };
    //   return railwayRltStation;
    // },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '级别',
          ellipsis: true,
          dataIndex: 'level',
          scopedSlots: { customRender: 'level' },
        },
        {
          title: '线路',
          ellipsis: true,
          dataIndex: 'railway',
          scopedSlots: { customRender: 'railway' },
        },
        {
          title: '车站(区间)',
          ellipsis: true,
          dataIndex: 'stationName',
        },
        {
          title: '作业机房',
          ellipsis: true,
          dataIndex: 'workSiteName',
        },
        {
          title: '位置(里程)',
          ellipsis: true,
          dataIndex: 'workArea',
        },
        {
          title: '计划日期',
          dataIndex: 'workTime',
          width: 160,
          scopedSlots: { customRender: 'workTime' },
        },
        {
          title: '计划时长',
          dataIndex: 'timeLength',
        },
        {
          title: '作业内容',
          ellipsis: true,
          dataIndex: 'workContent',
        },
        {
          title: '影响范围',
          ellipsis: true,
          dataIndex: 'incidence',
        },
        {
          title: '状态',
          dataIndex: 'planState',
          width: 90,
          scopedSlots: { customRender: 'planState' },
        },
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
    planType: {
      handler: function (value, oldValue) {
        this.queryParams.planType = value;
      },
      immediate: true,
    },
  },

  async created() {
    this.initAxios();
    this.queryParams.workTime =
      this.queryParams.planType === PlanType.Vertical
        ? moment().add(1, 'month')
        : moment().add(1, 'week');
    this.refresh();
    this.isInit = true;
  },

  mounted() { },

  methods: {
    initAxios() {
      apiSkyLightPlan = new ApiSkyLightPlan(this.axios);
    },

    add() {
      this.$emit(
        'add',
        moment(this.queryParams.workTime)
          .utc()
          .format('YYYY-MM-DD'),
        this.queryParams.workUnit,
      );
    },
    edit(record) {
      this.$emit(
        'edit',
        record.id,
        this.queryParams.workUnit,
        moment(this.queryParams.workTime)
          .utc()
          .format('YYYY-MM-DD'),
      );
    },
    view(record) {
      this.$emit(
        'view',
        record.id,
        this.queryParams.workUnit,
        moment(this.queryParams.workTime)
          .utc()
          .format('YYYY-MM-DD'),
      );
    },

    dispatch(record) {
      this.$refs.SmCrPlanPlanTodoModal.dispatch(record);
    },

    backout(record) {
      let _this = this;
      this.$confirm({
        title: '撤销提示',
        content: '确认要撤销已派工天窗计划！',
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiSkyLightPlan.backoutPlan({ id: record.id, repairTagKey: _this.repairTagKey });
            _this.refresh();
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    publish() {
      let workTime = moment(this.queryParams.workTime);
      let _this = this;
      let data = {
        workUnit: this.queryParams.workUnit,
        startTime:
          this.queryParams.planType === PlanType.Vertical
            ? moment(workTime)
              .date(1)
              .format('YYYY-MM-DD')
            : moment(workTime)
              .weekday(0)
              .format('YYYY-MM-DD'),
        endTime:
          this.queryParams.planType === PlanType.Vertical
            ? moment(workTime)
              .endOf('month')
              .format('YYYY-MM-DD')
            : moment(workTime)
              .endOf('week')
              .format('YYYY-MM-DD'),
        station: this.queryParams.station,
        workSite: this.queryParams.workSite,
        planType: this.queryParams.planType,
        contentMileage: this.queryParams.contentMileage,
      };
      this.$confirm({
        title: '发布提示',
        content: '请确认发布会将列表中的所有计划发布？',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiSkyLightPlan.publishPlan(data);
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
            _this.refresh();
          });
        },
      });
    },

    //生成维修计划
    generatePlan() {
      this.$refs.SmCrPlanGenerateRepairPlanModal.generatePlan();
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiSkyLightPlan.remove({ id: record.id, repairTagKey: _this.repairTagKey });
            _this.refresh(false, _this.pageIndex);
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
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
      let workTime = moment(this.queryParams.workTime);
      let queryParams = {
        workUnit: this.queryParams.workUnit,
        startTime:
          this.queryParams.planType === PlanType.Vertical
            ? moment(workTime)
              .date(1)
              .format('YYYY-MM-DD')
            : moment(workTime)
              .weekday(0)
              .format('YYYY-MM-DD'),
        endTime:
          this.queryParams.planType === PlanType.Vertical
            ? moment(workTime)
              .endOf('month')
              .format('YYYY-MM-DD')
            : moment(workTime)
              .endOf('week')
              .format('YYYY-MM-DD'),
        Station: this.queryParams.station,
        WorkSite: this.queryParams.workSite,
        contentMileage: this.queryParams.contentMileage,
        planType: this.queryParams.planType,
        railwayId: this.queryParams.railwayId,
        maxResultCount: this.queryParams.maxResultCount,
      };
      let response = await apiSkyLightPlan.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.skyLightPlans = response.data.items;
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

    getTagColor(planState) {
      let tagColor = '';
      switch (planState) {
      case PlanState.UnDispatching: {
        //未派工
        tagColor = 'red';
        break;
      }
      case PlanState.Dispatching: {
        //已派工
        tagColor = 'blue';
        break;
      }
      case PlanState.NotIssued: {
        //未下发
        tagColor = 'red';
        break;
      }
      case PlanState.Issued: {
        //已下发
        tagColor = 'blue';
        break;
      }
      case PlanState.Complete: {
        //已完成
        tagColor = 'green';
        break;
      }
      }
      return tagColor;
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
    return (
      <div class="sm-cr-plan-vertical-skylight-plans">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              workUnit: this.currentOrganizationId,
              workTime:
                this.queryParams.planType === PlanType.Vertical
                  ? moment().add(1, 'months')
                  : moment().add(1, 'week'),
              workSite: null,
              railwayId: undefined,
              station: undefined,
              contentMileage: '',
              planType: this.queryParams.planType,
            };
            this.refresh();
          }}
        >
          <a-form-item label="作业单位">
            <OrganizationTreeSelect
              ref="OrganizationTreeSelect"
              axios={this.axios}
              value={this.queryParams.workUnit}
              autoInitial={true}
              onInput={value => {
                if (this.isInit) {
                  this.currentOrganizationId = value;
                }
                this.isInit = false;
                this.queryParams.workUnit = value;
                this.queryParams.station = undefined;
                this.queryParams.railwayId = undefined;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="时间选择">
            {this.queryParams.planType == PlanType.Vertical ? (
              <a-month-picker
                style="width: 100%"
                allowClear={false}
                placeholder="请选择月份"
                value={this.queryParams.workTime}
                onChange={value => {
                  this.queryParams.workTime = value;
                  this.refresh();
                }}
              />
            ) : (
              <a-week-picker
                style="width: 100%"
                placeholder="请选择周"
                allowClear={false}
                value={this.queryParams.workTime}
                onChange={value => {
                  this.queryParams.workTime = value;
                  this.refresh();
                }}
              />
            )}
          </a-form-item>
          <a-form-item label="线路">
            <SmBasicRailwayTreeSelect
              organizationId={this.queryParams.workUnit}
              axios={this.axios}
              value={this.queryParams.railwayId}
              onChange={value => {
                this.queryParams.railwayId = value;
                this.queryParams.station = undefined;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="车站(区间)">
            <StationCascader
              axios={this.axios}
              organizationId={this.queryParams.workUnit}
              railwayId={this.queryParams.railwayId}
              placeholder="请选择车站(区间)"
              value={this.queryParams.station}
              onChange={value => {
                this.queryParams.station = value;
                this.refresh();
              }}
            />
          </a-form-item>
          {/* <a-form-item label="车站(区间)">
            <SmBasicStationSelectByRailway
              axios={this.axios}
              railwayId={this.queryParams.railwayId}
              placeholder="请选择车站(区间)"
              value={this.queryParams.station}
              onChange={value => {
                this.queryParams.station = value;
                this.refresh();
              }}
            />
          </a-form-item> */}

          <a-form-item label="站区(机房)">
            <SmBasicInstallationSiteSelect
              // railwayRltStation={this.railwayRltStation}
              axios={this.axios}
              placeholder="请选择站区(机房)"
              height={32}
              value={this.queryParams.workSite}
              onChange={value => {
                this.queryParams.workSite = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="模糊查找">
            <a-input
              placeholder="请输入作业内容、位置里程"
              value={this.queryParams.contentMileage}
              onInput={event => {
                this.queryParams.contentMileage = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons">
            {vIf(
              <a-button type="primary" onClick={this.add}>
                添加
              </a-button>,
              vP(this.permissions, permissionsSmCrPlan.SkylightOutsidePlan.Create),
            )}
            {/* {vIf(
              <a-button type="primary" onClick={this.publish}>
                发布
              </a-button>,
              vP(this.permissions, permissionsSmCrPlan.SkylightOutsidePlan.Release),
            )} */}
            {(this.repairTagKey == RepairTagKeys.RailwayHighSpeed && this.planType == PlanType.Vertical) ?
              <a-button type="primary" onClick={this.generatePlan}>
                生成维修计划
              </a-button>
              : ''
            }
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.skyLightPlans}
          rowKey={record => record.id}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return (this.pageIndex - 1) * this.queryParams.maxResultCount + (index + 1);
              },
              level: (text, record, index) => {
                return (
                  <a-tooltip placement="topLeft" title={getRepairLevelTitle(record.level)}>
                    <span>{getRepairLevelTitle(record.level)}</span>
                  </a-tooltip>
                );
              },
              railway: (text, record, index) => {
                let railway = record.railway ? record.railway.name : '';
                return (
                  <a-tooltip placement="topLeft" title={railway}>
                    <span>{railway}</span>
                  </a-tooltip>
                );
              },
              workTime: (text, record, index) => {
                return moment(text).format('YYYY-MM-DD hh:mm');
              },
              planState: (text, record, index) => {
                return <a-tag color={this.getTagColor(record.planState)}>
                  {getPlanState(record.planState)}
                </a-tag>;
              },
              operations: (text, record) => {
                return <span>
                  {vIf(
                    <a
                      onClick={() => {
                        this.view(record);
                      }}
                    >
                      详情
                    </a>,
                    vP(this.permissions,
                      permissionsSmCrPlan.VerticalSkylightPlan.Detail ||
                      permissionsSmCrPlan.ComprehensiveSkylightPlan.Detail ||
                      permissionsSmCrPlan.SkylightOutsidePlan.Detail,
                    ),
                  )}
                  {record.planState == PlanState.UnDispatching
                    ? [
                      vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions,
                          permissionsSmCrPlan.SkylightOutsidePlan.Detail ||
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Detail ||
                          permissionsSmCrPlan.SkylightOutsidePlan.Detail,
                        ) &&
                        vP(this.permissions,
                          permissionsSmCrPlan.VerticalSkylightPlan.Update,
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Update,
                          permissionsSmCrPlan.SkylightOutsidePlan.Update,
                          permissionsSmCrPlan.VerticalSkylightPlan.Dispatching,
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Dispatching,
                          permissionsSmCrPlan.SkylightOutsidePlan.Dispatching,
                          permissionsSmCrPlan.VerticalSkylightPlan.Delete,
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Delete,
                          permissionsSmCrPlan.SkylightOutsidePlan.Delete,
                        ),
                      ),
                      vIf(
                        <a-dropdown trigger={['click']}>
                          <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            更多 <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.edit(record);
                                  }}
                                >
                                  编辑
                                </a>,
                                vP(this.permissions,
                                  permissionsSmCrPlan.VerticalSkylightPlan.Update ||
                                  permissionsSmCrPlan.ComprehensiveSkylightPlan.Detail ||
                                  permissionsSmCrPlan.SkylightOutsidePlan.Detail,
                                ),
                              )}
                            </a-menu-item>
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.dispatch(record);
                                  }}
                                >
                                  派工
                                </a>,
                                vP(this.permissions,
                                  permissionsSmCrPlan.VerticalSkylightPlan.Dispatching ||
                                  permissionsSmCrPlan.ComprehensiveSkylightPlan.Dispatching ||
                                  permissionsSmCrPlan.SkylightOutsidePlan.Dispatching,
                                ),
                              )}
                            </a-menu-item>
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.remove(record);
                                  }}
                                >
                                  删除
                                </a>,
                                vP(this.permissions,
                                  permissionsSmCrPlan.VerticalSkylightPlan.Delete ||
                                  permissionsSmCrPlan.ComprehensiveSkylightPlan.Delete ||
                                  permissionsSmCrPlan.SkylightOutsidePlan.Delete,
                                ),
                              )}
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>,
                        vP(this.permissions,
                          permissionsSmCrPlan.VerticalSkylightPlan.Update,
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Update,
                          permissionsSmCrPlan.SkylightOutsidePlan.Update,
                          permissionsSmCrPlan.VerticalSkylightPlan.Dispatching,
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Dispatching,
                          permissionsSmCrPlan.SkylightOutsidePlan.Dispatching,
                          permissionsSmCrPlan.VerticalSkylightPlan.Delete,
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Delete,
                          permissionsSmCrPlan.SkylightOutsidePlan.Delete,
                        ),
                      ),
                    ]
                    : undefined}
                  {record.planState == PlanState.Dispatching
                    ? [
                      vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions,
                          permissionsSmCrPlan.VerticalSkylightPlan.Detail ||
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Detail ||
                          permissionsSmCrPlan.SkylightOutsidePlan.Detail,
                        ) &&
                        vP(this.permissions,
                          permissionsSmCrPlan.VerticalSkylightPlan.Revoke ||
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Revoke ||
                          permissionsSmCrPlan.SkylightOutsidePlan.Revoke,
                        ),
                      ),
                      vIf(
                        <a
                          onClick={() => {
                            this.backout(record);
                          }}
                        >
                          撤销
                        </a>,
                        vP(this.permissions,
                          permissionsSmCrPlan.VerticalSkylightPlan.Revoke ||
                          permissionsSmCrPlan.ComprehensiveSkylightPlan.Revoke ||
                          permissionsSmCrPlan.SkylightOutsidePlan.Revoke,
                        ),
                      ),
                    ]
                    : undefined}
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
        <SmCrPlanGenerateRepairPlanModal
          ref="SmCrPlanGenerateRepairPlanModal"
          axios={this.axios}
          repairTagKey={this.repairTagKey}
          organizationId={this.queryParams.workUnit}
          bordered={this.bordered}
          repairTagKey={this.repairTagKey}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

        {/* 派工模态框 */}
        <SmCrPlanPlanTodoModal
          ref="SmCrPlanPlanTodoModal"
          axios={this.axios}
          repairTagKey={this.repairTagKey}
          organizationId={this.queryParams.workUnit}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
