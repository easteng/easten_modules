import ApiYearMonthPlan from '../../sm-api/sm-cr-plan/YearMonthPlan';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getRepairTypeTitle, vIf, vP } from '../../_utils/utils';
import SmImport from '../../sm-import/sm-import-basic';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select/index';
import SmCrPlanYearPlanModal from './SmCrPlanYearPlanModal';
import { RepairType, YearMonthPlanState, YearMonthPlanType } from '../../_utils/enum';
import FileSaver from 'file-saver';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiYearMonthPlan = new ApiYearMonthPlan();

export default {
  name: 'SmCrPlanYearPlan',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      isLoading: false,
      yearItems: [],
      totalCount: 0,
      fileList: [],
      examColor: null, //审核标记颜色
      examStr: null, //审核标记文字
      isCanCreate: false, //是否可以生成
      isCanImport: false, //是否可以导入
      isCanExport: true, //是否可以导出
      isCanChange: true, //是否可以变更
      queryParams: {
        keyword: null,
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
        year: new Date().getFullYear(),
        orgId: null,
        repairlType: undefined,
        planType: 1, //年表类型
      },
      form: this.$form.createForm(this),
      isInit: false,
      currentOrganizationId: null,
      orgName: null,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'number',
          width: 120,
          scopedSlots: { customRender: 'number' },
          ellipsis: true,
        },
        {
          title: '维修类别',
          width: 120,
          dataIndex: 'repairTypeStr',
          scopedSlots: { customRender: 'repairTypeStr' },
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 200,
          scopedSlots: { customRender: 'deviceName' },
          ellipsis: true,
        },
        {
          title: '设备处所',
          width: 150,
          dataIndex: 'equipmentLocation',
          scopedSlots: { customRender: 'equipmentLocation' },
          ellipsis: true,
        },
        {
          title: '工作内容',
          width: 250,
          dataIndex: 'repairContent',
          scopedSlots: { customRender: 'repairContent' },
          ellipsis: true,
        },
        {
          title: '天窗类型',
          width: 150,
          dataIndex: 'skyligetType',
          scopedSlots: { customRender: 'skyligetType' },
          ellipsis: true,
        },
        {
          title: '单位',
          width: 100,
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          ellipsis: true,
        },
        {
          title: '总设备数量',
          width: 120,
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' },
          ellipsis: true,
        },
        {
          title: '年计划总数量',
          width: 120,
          dataIndex: 'planCount',
          scopedSlots: { customRender: 'planCount' },
          ellipsis: true,
        },
        {
          title: '每年次数',
          width: 100,
          dataIndex: 'times',
          scopedSlots: { customRender: 'times' },
          ellipsis: true,
        },
        {
          title: '一月',
          width: 100,
          dataIndex: 'col_1',
          scopedSlots: { customRender: 'col_1' },
        },
        {
          title: '二月',
          width: 100,
          dataIndex: 'col_2',
          scopedSlots: { customRender: 'col_2' },
        },
        {
          title: '三月',
          width: 100,
          dataIndex: 'col_3',
          scopedSlots: { customRender: 'col_3' },
        },
        {
          title: '四月',
          width: 100,
          dataIndex: 'col_4',
          scopedSlots: { customRender: 'col_4' },
        },
        {
          title: '五月',
          width: 100,
          dataIndex: 'col_5',
          scopedSlots: { customRender: 'col_5' },
        },
        {
          title: '六月',
          width: 100,
          dataIndex: 'col_6',
          scopedSlots: { customRender: 'col_6' },
        },
        {
          title: '七月',
          width: 100,
          dataIndex: 'col_7',
          scopedSlots: { customRender: 'col_7' },
        },
        {
          title: '八月',
          width: 100,
          dataIndex: 'col_8',
          scopedSlots: { customRender: 'col_8' },
        },
        {
          title: '九月',
          width: 100,
          dataIndex: 'col_9',
          scopedSlots: { customRender: 'col_9' },
        },
        {
          title: '十月',
          width: 100,
          dataIndex: 'col_10',
          scopedSlots: { customRender: 'col_10' },
        },
        {
          title: '十一月',
          width: 100,
          dataIndex: 'col_11',
          scopedSlots: { customRender: 'col_11' },
        },
        {
          title: '十二月',
          width: 100,
          dataIndex: 'col_12',
          scopedSlots: { customRender: 'col_12' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 100,
          scopedSlots: { customRender: 'operations' },
          fixed: 'right',
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
      let _this = this;
      if (!this.queryParams.orgId) {
        this.$message.info('请选择生成车间');
        return;
      }
      this.$confirm({
        title: '重要提示',
        content: h => <div style="color:red;">请先核对设备数据，确认设备台账无误再制定计划！</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            _this.isLoading = true;

            let response = await apiYearMonthPlan.create(_this.queryParams, _this.repairTagKey);
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
            _this.refresh();
            _this.isLoading = false;
          });
        },
      });
    },
    edit(record) {
      //编辑天窗类型
      this.$refs.SmCrPlanYearPlanModal.edit(record);
    },

    async fileSelected(file) {
      let hasExist = this.fileList.some(item => item.name === file.name);
      if (!hasExist) {
        this.fileList = [...this.fileList, file];
      }

      if (!this.queryParams.orgId) {
        this.$message.info('请选择生成车间');
        return;
      }
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': this.fileList[0],
        'importKey': 'yearPlan',
        'PlanType': this.queryParams.planType,
        'OrgId': this.queryParams.orgId,
        'Year': this.queryParams.year,
        'RepairTagKey': this.repairTagKey,
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
      this.fileList = [];
    },
    async export(record) {
      //导出按钮
      if (!this.queryParams.orgId) {
        this.$message.info('请选择车间');
        return;
      }
      this.isLoading = true;
      let response = await apiYearMonthPlan.downLoad(this.queryParams, this.repairTagKey);
      this.isLoading = false;
      if (requestIsSuccess(response)) {
        FileSaver.saveAs(
          new Blob([response.data], { type: 'application/vnd.ms-excel' }),
          `${this.queryParams.year}年${this.orgName}年表.xlsx`,
        );
      }
    },
    async subimtExam() {
      //提交审核
      if (!this.queryParams.orgId) {
        this.$message.info('请选择车间');
        return;
      }
      let _this = this;
      this.$confirm({
        title: '重要提示',
        content: h => <div style="color:red;">确认要提交审核！</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            _this.isLoading = true;
            let response = await apiYearMonthPlan.submitForExam(_this.queryParams, _this.repairTagKey);
            _this.isLoading = false;
            if (requestIsSuccess(response)) {
              _this.$message.info('操作成功');
              _this.refresh();
            }
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
    initAxios() {
      apiYearMonthPlan = new ApiYearMonthPlan(this.axios);
    },
    async refresh(resetPage = true) {
      this.isLoading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      let response = await apiYearMonthPlan.getListYear(this.queryParams, this.repairTagKey);
      this.isLoading = false;
      if (requestIsSuccess(response)) {
        this.yearItems = response.data.items;
        this.totalCount = response.data.totalCount;
        //显示审核状态
        if (this.totalCount > 0) {
          let item = this.yearItems[0];
          this.examStr = item.stateStr;
          switch (item.state) {
          case YearMonthPlanState.UnCommit: {
            //未提交
            this.examColor = 'volcano';
            break;
          }
          case YearMonthPlanState.UnCheck: {
            //待审核
            this.examColor = 'LightSkyBlue';
            break;
          }
          case YearMonthPlanState.Checking: {
            //审核中
            this.examColor = 'DeepSkyBlue';
            break;
          }
          case YearMonthPlanState.Passed: {
            //审核完成
            this.examColor = 'green';
            break;
          }
          case YearMonthPlanState.UnPassed: {
            //审核驳回
            this.examColor = 'red';
            break;
          }
          }
        }

        //计划按钮是否启用
        this.isCanCreate = false;
        this.isCanChange = true;
        this.isCanImport = false;
        this.isCanExport = true;
        let nowYear = new Date().getFullYear();
        if (this.totalCount > 0) {
          this.isCanExport = false;
          let firstModel = this.yearItems[0];
          if (
            !(
              firstModel.state == YearMonthPlanState.UnCommit ||
              firstModel.state == YearMonthPlanState.UnPassed
            )
          ) {
            //生成按钮
            this.isCanCreate = true;
            this.isCanImport = true;
          }
          if (firstModel.state == YearMonthPlanState.Passed && nowYear == this.queryParams.year) {
            //变更按钮
            this.isCanChange = false;
          }
        } else {
          this.isCanImport = true;
        }

        if (response.data.isCanCreate == false) {
          this.isCanCreate = true;
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

    //更新测试项
    upgradeTestItems() {
      let _this = this;
      this.$confirm({
        title: '确定要更新测试项至' + _this.queryParams.year + '年？',
        content: h => <div style="color:red;">此操作无法撤销！</div>,
        onOk() {
          return new Promise(async (resolve, reject) => {
            _this.isLoading = true;
            let response = await apiYearMonthPlan.upgradeTestItems({ Year: _this.queryParams.year }, _this.repairTagKey);
            _this.isLoading = false;
            if (requestIsSuccess(response)) {
              _this.$message.info('操作成功');
              _this.refresh();
            }
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
  },
  render() {
    //维修类别
    let repairTypeOption = [];
    for (let item in RepairType) {
      repairTypeOption.push(
        <a-select-option key={RepairType[item]}>
          {getRepairTypeTitle(RepairType[item])}
        </a-select-option>,
      );
    }

    //年度
    let yearOption = [];
    let maxYear = new Date().getFullYear() - 5;
    for (let i = maxYear; i < maxYear + 10; i++) {
      yearOption.push(<a-select-option key={i}>{i}年</a-select-option>);
    }

    return (
      <div>
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.year = new Date().getFullYear();
            this.queryParams.keyword = null;
            this.queryParams.orgId = this.currentOrganizationId;
            this.queryParams.repairlType = undefined;
            this.refresh();
          }}
        >
          <a-form-item label="车间">
            <OrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.orgId}
              autoInitial={true}
              onInput={(value, obj) => {
                this.orgName = obj;
                if (this.isInit) {
                  this.currentOrganizationId = value;
                }
                this.isInit = false;
                this.queryParams.orgId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="年度">
            <a-select
              placeholder="请选择年度！"
              axios={this.axios}
              value={this.queryParams.year}
              onChange={value => {
                this.queryParams.year = value;
                this.refresh();
              }}
            >
              {yearOption}
            </a-select>
          </a-form-item>
          <a-form-item label="维修类别">
            <a-select
              placeholder="请选择维修类别！"
              allowClear
              axios={this.axios}
              value={this.queryParams.repairlType}
              onChange={value => {
                this.queryParams.repairlType = value;
                this.refresh();
              }}
            >
              {repairTypeOption}
            </a-select>
          </a-form-item>
          <a-form-item label="关键字">
            <a-input
              placeholder="设备名称/设备处所/工作内容"
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <template slot="buttons">
            <div style={'display:flex'}>
              <a-button type="primary" icon="sync" onClick={this.upgradeTestItems} disabled={this.isCanCreate}>
                更新测试项
              </a-button>
              <a-button type="primary" icon="plus" onClick={this.add} disabled={this.isCanCreate}>
                生成
              </a-button>
              {vIf(
                <a-button type="primary" onClick={this.export} disabled={this.isCanExport}>
                  <a-icon type="download" />
              导出
                </a-button>,
                vP(this.permissions, permissionsSmCrPlan.YearPlan.Export),
              )}
              {vIf(
                <SmImport
                  isImport={this.isCanImport}
                  ref="smImport"
                  url='api/app/crPlanYearMonthPlan/upload'
                  axios={this.axios}
                  importKey="yearPlan"
                  repairTagKey={this.repairTagKey}
                  downloadErrorFile={true}
                  onSelected={file => this.fileSelected(file)}
                  onIsSuccess={() => this.refresh()}
                />,
                vP(this.permissions, permissionsSmCrPlan.YearPlan.Import),
              )}
              {vIf(
                <a-button type="primary" onClick={this.subimtExam} disabled={this.isCanImport}>
                  <a-icon type="import" />
              提交审批
                </a-button>,
                vP(this.permissions, permissionsSmCrPlan.YearPlan.SubmitApproval),
              )}
              {vIf(
                <a-button
                  type="primary"
                  disabled={this.isCanChange}
                  onClick={() => {
                    this.$emit('change', YearMonthPlanType.Year, this.queryParams.orgId, this.orgName);
                  }}
                >
                  <a-icon type="diff" />
              变更
                </a-button>,
                vP(this.permissions, permissionsSmCrPlan.YearPlan.Alter),
              )}
              {this.totalCount > 0 ? (
                <a-tag style="margin-left:40px;height:32px;line-height:30px" color={this.examColor}>
                  {this.examStr}
                </a-tag>
              ) : null}
            </div>

          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          scroll={{ x: 1300, y: 500 }}
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.yearItems}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              repairTypeStr: (text, record) => {
                return getRepairTypeTitle(record.repairType);
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.edit(record);
                        }}
                      >
                        天窗编辑
                      </a>,
                      vP(this.permissions, permissionsSmCrPlan.SkylightOutsidePlan.Update),
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


        <SmCrPlanYearPlanModal
          ref="SmCrPlanYearPlanModal"
          axios={this.axios}
          bordered={this.bordered}
          repairTagKey={this.repairTagKey}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        {this.isLoading ? (
          <div style="position:fixed;left:0;right:0;top:0;bottom:0;z-index:9999;">
            <div style="position: relative;;top:45%;left:50%">
              <a-spin tip="Loading..." size="large"></a-spin>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
};
