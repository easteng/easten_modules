import ApiMaintenanceRecord from '../../sm-api/sm-cr-plan/MaintenanceRecord';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import { pagination as paginationConfig } from '../../_utils/config';
import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import SmStdBasicRepairGroupSelect from '../../sm-std-basic/sm-std-basic-repair-group-select';
import SmBasicInstallationSiteSelect from '../../sm-basic/sm-basic-installation-site-select';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiMaintenanceRecord = new ApiMaintenanceRecord();

export default {
  name: 'SmCrPlanMaintenanceRecords',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      equipments: [], // 列表数据源
      pageSize: paginationConfig.defaultPageSize,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
        organizationId: null, //维护组织单元
        equipTypeId: undefined, //设备类型
        equipNameId: undefined, //设备名称/类别
        installationSiteId: null, //安装地点
        keywords: null,
      },
      form: this.$form.createForm(this),
      isInit: false,
      currentOrganizationId: null,//当前用户所属组织机构
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
          title: '设备类型',
          dataIndex: 'equipType',
          width: 120,
          ellipsis: true,
        },
        {
          title: '设备名称/类别',
          dataIndex: 'equipName',
          width: 120,
          ellipsis: true,
        },
        {
          title: '设备型号',
          dataIndex: 'equipModelNumber',
          width: 120,
          ellipsis: true,
        },
        {
          title: '设备编码',
          dataIndex: 'equipModelCode',
          width: 120,
          ellipsis: true,
        },
        {
          title: '安装地点',
          dataIndex: 'installationSite',
          width: 160,
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 80,
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
      // console.log('orgId:' + this.queryParams.organizationId);
      // console.log(record);
      this.$emit(
        'view',
        this.queryParams.organizationId,
        record.resourceEquipId,
        record.equipNameId,
        record.equipType,
        record.equipName,
        record.equipModelNumber,
        record.equipModelCode,
        // record.maintenanceOrg,
        record.installationSite,
      );
    },
    initAxios() {
      apiMaintenanceRecord = new ApiMaintenanceRecord(this.axios);
    },

    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      let response = await apiMaintenanceRecord.getList(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response) && response.data.items) {
        this.equipments = response.data.items.map((item, index) => {
          return {
            ...item,
            order: index + 1,
          };
        });
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
    return (
      <div class="sm-cr-plan-maintenance-records">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
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
          <a-form-item label="维护单位">
            <SmSystemOrganizationTreeSelect
              placeholder="请选择维护单位"
              axios={this.axios}
              value={this.queryParams.organizationId}
              autoInitial={true}
              allowClear={false}
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

          <a-form-item label="设备类型">
            <SmStdBasicRepairGroupSelect
              placeholder="请选择设备类型"
              allowClear
              isTop={true}
              permissions={this.permissions}
              axios={this.axios}
              value={this.queryParams.equipTypeId}
              onChange={value => {
                this.queryParams.equipTypeId = value;
                this.queryParams.equipNameId = undefined;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="设备名称/类别">
            <SmStdBasicRepairGroupSelect
              placeholder="请选择设备名称、类别"
              allowClear
              permissions={this.permissions}
              parentId={this.queryParams.equipTypeId}
              axios={this.axios}
              value={this.queryParams.equipNameId}
              onChange={value => {
                this.queryParams.equipNameId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="安装地点">
            <SmBasicInstallationSiteSelect
              placeholder="请选择安装地点"
              axios={this.axios}
              height={32}
              value={this.queryParams.installationSiteId}
              onChange={value => {
                this.queryParams.installationSiteId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="关键字">
            <a-input
              placeholder="设备型号、设备编码"
              value={this.queryParams.keywords}
              onInput={event => {
                this.queryParams.keywords = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.order}
          dataSource={this.equipments}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
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
                        查看记录
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.MaintenanceRecord.Default),
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
