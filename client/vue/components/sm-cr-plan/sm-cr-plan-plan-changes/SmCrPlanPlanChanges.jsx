import moment, { isMoment } from 'moment';
import ApiAlterRecord from '../../sm-api/sm-cr-plan/AlterRecord';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import {
  requestIsSuccess,
  getYearMonthPlanStateType,
  getSelectablePlanType,
  vIf,
  vP,
} from '../../_utils/utils';
import { YearMonthPlanState, SelectablePlanType } from '../../_utils/enum';

import FileSaver from 'file-saver';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiAlterRecord = new ApiAlterRecord();

export default {
  name: 'SmCrPlanPlanChanges',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      changes: [], // 列表数据源
      pageSize: paginationConfig.defaultPageSize,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
        organizationId: null,
        state: undefined,
        alterType: undefined,
        keyword: null,
      },
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
          scopedSlots: { customRender: 'index' },
          width: 90,
        },
        {
          title: '计划时间',
          dataIndex: 'plannedTime',
          scopedSlots: { customRender: 'plannedTime' },
        },
        {
          title: '变更时间',
          dataIndex: 'changeTime',
          scopedSlots: { customRender: 'changeTime' },
        },
        {
          title: '变更原因',
          dataIndex: 'reason',
          width: 300,
          ellipsis: true,
        },
        {
          title: '变更类型',
          dataIndex: 'changeType',
          scopedSlots: { customRender: 'changeType' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
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
  watch: {},

  async created() {
    this.initAxios();
    this.refresh();
    this.isInit = true;
  },
  methods: {
    add() {
      this.$emit('add', this.queryParams.organizationId);
    },
    edit(record) {
      this.$emit('edit', record.id, this.queryParams.organizationId);
    },
    view(record) {
      this.$emit('view', record.id);
    },
    async export(record) {
      let foreResp = await apiAlterRecord.get({ id: record.id }, this.repairTagKey);
      if (requestIsSuccess(foreResp)) {
        let fileName =
          moment(foreResp.data.planTime).format('YYYY年MM月') +
          foreResp.data.organization.name +
          foreResp.data.alterTypeStr +
          '变更单.xls';
        let response = await apiAlterRecord.export(record.id);
        if (requestIsSuccess(response)) {
          FileSaver.saveAs(
            new Blob([response.data], { type: 'application/vnd.ms-excel' }),
            fileName,
          );
        }
      }
    },
    initAxios() {
      apiAlterRecord = new ApiAlterRecord(this.axios);
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiAlterRecord.delete(record.id, this.repairTagKey);
            _this.refresh();

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    //设置组织机构可选项
    setTreeSelectable(data, activeIds, parent) {
      for (let i = 0; i < data.length; i++) {
        data[i].disabled = parent != null ? parent.disabled : true;
        if (activeIds.indexOf(data[i].id) > -1) {
          data[i].disabled = false;
        }
        this.setTreeSelectable(data[i].children, activeIds, data[i]);
      }
    },

    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      let response = await apiAlterRecord.getList(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.changes = response.data.items;
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      if (page !== 0) {
        this.refresh(false);
      }
    },
  },
  render() {
    //状态选择
    let canSelectStatusOption = [];
    for (let item in YearMonthPlanState) {
      if (YearMonthPlanState[item] != YearMonthPlanState.UnCheck)
        canSelectStatusOption.push(
          <a-select-option key={YearMonthPlanState[item]}>
            {getYearMonthPlanStateType(YearMonthPlanState[item])}
          </a-select-option>,
        );
    }

    //变更类型选择
    let alterTypeOptions = [];
    for (let item in SelectablePlanType) {
      if (SelectablePlanType[item] != 4) {
        alterTypeOptions.push(
          <a-select-option key={SelectablePlanType[item]}>
            {getSelectablePlanType(SelectablePlanType[item])}表
          </a-select-option>,
        );
      }
    }

    return (
      <div class="sm-cr-plan-plan-changes">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            // console.log(this.queryParams);
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              organizationId: this.currentOrganizationId,
              state: undefined,
              alterType: undefined,
              keyword: null,
            };
            this.refresh();
          }}
        >
          <a-form-item label="组织机构">
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              autoInitial={true}
              allowClear={false}
              value={this.queryParams.organizationId}
              onInput={value => {
                if (this.isInit) {
                  this.currentOrganizationId = value;
                }
                this.isInit = false;
                this.queryParams.organizationId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="状态">
            <a-select
              allowClear
              placeholder="请选择状态"
              value={this.queryParams.state}
              onChange={value => {
                this.queryParams.state = value;
                this.refresh();
              }}
            >
              {canSelectStatusOption}
            </a-select>
          </a-form-item>

          <a-form-item label="变更类型">
            <a-select
              allowClear={true}
              placeholder="请选择变更类型"
              value={this.queryParams.alterType}
              onChange={value => {
                this.queryParams.alterType = value;
                this.refresh();
              }}
            >
              {alterTypeOptions}
            </a-select>
          </a-form-item>

          <a-form-item label="关键字">
            <a-input
              placeholder="变更原因"
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <template slot="buttons">
            {vIf(
              <a-button type="primary" onClick={this.add}>
                添加
              </a-button>,
              vP(this.permissions, permissionsSmCrPlan.PlanChange.Create),
            )}
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.changes}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              plannedTime: (text, record) => {
                return record.planTime ? moment(record.planTime).format('YYYY-MM') : '';
              },
              changeTime: (text, record) => {
                return record.alterTime ? moment(record.alterTime).format('YYYY-MM') : '';
              },
              // changeReason: (text, record) => {
              //   return record.reason ? record.reason : '';
              // },
              changeType: (text, record) => {
                return record.alterTypeStr ? record.alterTypeStr : '';
              },
              status: (text, record) => {
                return record.stateStr ? record.stateStr : '';
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
                      vP(this.permissions, permissionsSmCrPlan.PlanChange.Detail),
                    )}
                    <a-divider type="vertical" />

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          {record.state === YearMonthPlanState.UnCommit || record.state === YearMonthPlanState.UnPassed ? (
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.edit(record);
                                  }}
                                >
                                  编辑
                                </a>,
                                vP(this.permissions, permissionsSmCrPlan.PlanChange.Update),
                              )}
                            </a-menu-item>
                          ) : (
                            undefined
                          )}

                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.export(record);
                                }}
                              >
                                导出
                              </a>,
                              vP(this.permissions, permissionsSmCrPlan.PlanChange.Export),
                            )}
                          </a-menu-item>
                          {record.state === YearMonthPlanState.UnCommit ? (
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.remove(record);
                                  }}
                                >
                                  删除
                                </a>,
                                vP(this.permissions, permissionsSmCrPlan.PlanChange.Delete),
                              )}
                            </a-menu-item>
                          ) : (
                            undefined
                          )}
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [
                        permissionsSmCrPlan.PlanChange.Update,
                        permissionsSmCrPlan.PlanChange.Export,
                        permissionsSmCrPlan.PlanChange.Delete,
                      ]),
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

      </div>
    );
  },
};
