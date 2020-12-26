import moment from 'moment';
import ApiWorkOrder from '../../sm-api/sm-cr-plan/WorkOrder';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import { pagination as paginationConfig, tips as tipsConfig, tips } from '../../_utils/config';
import { requestIsSuccess, getOrderStateTitle, vIf, vP } from '../../_utils/utils';
import { OrderState } from '../../_utils/enum';
import SmCrPlanOtherWorkModal from './SmCrPlanOtherWorkModal';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiWorkOrder = new ApiWorkOrder();

export default {
  name: 'SmCrPlanOtherWorks',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      loading: false,
      visible: false,
      belongOrgs: [], //所属机构
      otherWoders: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        startTime: null, //开始时间
        endTime: null, //结束时间
        workUnitId: null, //作业单位
        workAreaId: null, //工区选择（本车间下）
        workContent: '', //按照【作业内容】模糊查找
        maxResultCount: paginationConfig.defaultPageSize,
      },
      dateRange: [],
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
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '计划时间',
          width: 200,
          dataIndex: 'planTime',
          scopedSlots: { customRender: 'planTime' },
        },
        {
          title: '作业内容',
          ellipsis: true,
          dataIndex: 'workContent',
        },
        {
          title: '作业工区',
          width: 140,
          ellipsis: true,
          dataIndex: 'workUnit',
        },
        {
          title: '状态',
          dataIndex: 'orderState',
          width: 80,
          scopedSlots: { customRender: 'orderState' },
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
    this.dateRange = [moment(moment()).startOf('month'), moment(moment()).endOf('month')];
    this.initAxios();
    this.refresh();
    this.isInit = true;
  },
  methods: {
    initAxios() {
      apiWorkOrder = new ApiWorkOrder(this.axios);
    },

    edit(record) {
      this.$refs.SmCrPlanOtherWorkModal.edit(record);
    },

    view(record) {
      this.$refs.SmCrPlanOtherWorkModal.view(record);
    },

    delete(record) {
      let _this = this;
      this.$confirm({
        title: '撤销提示',
        content: h => <div style="color:red;">确定要撤销该作业到其他计划！</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiWorkOrder.remove(record.id, true, _this.repairTagKey);
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
        startTime: this.dateRange[0] ? this.dateRange[0].format('YYYY-MM-DD') : null,
        endTime: this.dateRange[1] ? this.dateRange[1].format('YYYY-MM-DD') : null,
        workUnitId: this.queryParams.workUnitId,
        workAreaId: this.queryParams.workAreaId,
        workContent: this.queryParams.workContent,
        maxResultCount: this.queryParams.maxResultCount,
      };
      let response = await apiWorkOrder.getOtherHomeworkList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.otherWoders = response.data.items;
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },

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
              startTime: null,
              endTime: null,
              workAreaId: null,
              workContent: '',
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
              placeholder="车间选择"
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

          <a-form-item label="作业工区">
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              placeholder="工区选择（本车间下）"
              value={this.queryParams.workAreaId}
              allowClear={false}
              onInput={value => {
                this.queryParams.workAreaId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="时间选择">
            <a-range-picker
              style="width: 100%"
              value={this.dateRange}
              onChange={value => {
                this.dateRange = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="模糊查找">
            <a-input
              placeholder="请输入作业内容"
              value={this.queryParams.workContent}
              onInput={event => {
                this.queryParams.workContent = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.otherWoders}
          rowKey={record => record.id}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return (this.pageIndex - 1) * this.queryParams.maxResultCount + (index + 1);
              },
              planTime: (text, record, index) => {
                return moment(record.planTime).format('YYYY-MM-DD');
              },
              orderState: (text, record, index) => {
                return <a-tag color={this.getTagColor(record.orderState)}>
                  {getOrderStateTitle(record.orderState)}
                </a-tag>;
              },
              operations: (text, record) => {
                return (
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.view(record);
                        }}
                      >
                        详情
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.OtherWorks.Detail),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmCrPlan.OtherWorks.Detail) &&
                      vP(this.permissions, [permissionsSmCrPlan.OtherWorks.Finish, permissionsSmCrPlan.OtherWorks.Revoke]),
                    )}

                    {vIf(
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
                                完成
                              </a>,
                              vP(this.permissions, permissionsSmCrPlan.OtherWorks.Finish),
                            )}
                          </a-menu-item>
                          {record.orderState === OrderState.UnFinished ? (
                            <a-menu-item>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.delete(record);
                                  }}
                                >
                                  撤销
                                </a>,
                                vP(this.permissions, permissionsSmCrPlan.OtherWorks.Revoke),
                              )}
                            </a-menu-item>
                          ) : (
                            undefined
                          )}
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [permissionsSmCrPlan.OtherWorks.Finish, permissionsSmCrPlan.OtherWorks.Revoke]),
                    )}
                  </span>
                );
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

        <SmCrPlanOtherWorkModal
          ref="SmCrPlanOtherWorkModal"
          organizationId={this.queryParams.workUnitId}
          repairTagKey={this.repairTagKey}
          axios={this.axios}
          planDate={this.queryParams.startTime}
          onSuccess={() => {
            this.refresh();
          }}
        />
      </div>
    );
  },
};
