import moment from 'moment';
import ApiYearMonthPlan from '../../sm-api/sm-cr-plan/YearMonthPlan';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getRepairTypeTitle, vP, vIf } from '../../_utils/utils';
import SmImport from '../../sm-import/sm-import-basic';
import FileSaver from 'file-saver';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select/index';
import { RepairType, YearMonthPlanState } from '../../_utils/enum';
import permissionsSmCrPlan from '../../_permissions/sm-cr-plan';

let apiYearMonthPlan = new ApiYearMonthPlan();

export default {
  name: 'SmCrPlanMonthOfYearPlan',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      isLoading: false,
      monthItems: [],
      totalCount: 0,
      fileList: [],
      isCanCreate: false, //是否可以生成
      isCanImport: false, //是否可以导入
      isCanExport: true, //是否可以导出
      queryParams: {
        keyword: null,
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        orgId: null,
        repairlType: undefined,
        planType: 3, //年月表类型
      },
      form: this.$form.createForm(this),
      isInit: false,
      currentOrganizationId: null,
      orgName: null,
    };
  },
  computed: {
    monthsDay() {
      return new Date(this.queryParams.year, this.queryParams.month, 0).getDate();
    },
    columns() {
      let arr = [];
      for (let i = 1; i <= this.monthsDay; i++) {
        let mon = new Date(`${this.queryParams.year}-${this.queryParams.month}-${i}`).getDay();
        arr.push({
          title:
            mon == 0 || mon == 6 ? (
              <a-tag style="" color="lightgreen">
                {i}
              </a-tag>
            ) : (
              i
            ),
          width: 100,
          dataIndex: `col_${i}`,
        });
      }

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
          title: '数量',
          width: 100,
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' },
          ellipsis: true,
        },
        ...arr,
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
    async add() {
      let _this = this;
      if (!this.queryParams.orgId) {
        this.$message.info('请选择生成车间');
        return;
      }
      _this.isLoading = true;
      let response = await apiYearMonthPlan.create(_this.queryParams, _this.repairTagKey);
      _this.isLoading = false;
      this.$message.info('生成完成');
      _this.refresh();
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
        'importKey': 'yearPlanMonth',
        'PlanType': this.queryParams.planType,
        'OrgId': this.queryParams.orgId,
        'Year': this.queryParams.year,
        'Month': this.queryParams.month,
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
          `${this.queryParams.year}年${this.queryParams.month}月${this.orgName}年表月度计划.xlsx`,
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
            if (requestIsSuccess(response)) {
              _this.$message.info('操作成功');
              _this.refresh();
            }
            _this.isLoading = false;
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
    initAxios() {
      apiYearMonthPlan = new ApiYearMonthPlan(this.axios);
    },
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }

      let response = await apiYearMonthPlan.getListMonth(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.monthItems = response.data.items;

        this.totalCount = response.data.totalCount;

        //显示审核状态
        if (this.totalCount > 0) {
          let item = this.monthItems[0];
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

        this.isCanCreate = false;
        this.isCanImport = false;
        this.isCanExport = true;
        if (this.totalCount > 0) {
          this.isCanExport = false;
          let firstModel = this.monthItems[0];
          if (
            !(
              firstModel.state == YearMonthPlanState.UnCommit ||
              firstModel.state == YearMonthPlanState.UnPassed
            )
          ) {
            this.isCanCreate = true;
            this.isCanImport = true;
          }
        } else {
          this.isCanImport = true;
        }
      }
      if (response.data.isCanCreate == false) {
        this.isCanCreate = true;
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
    //维修类别
    let repairTypeOption = [];
    for (let item in RepairType) {
      repairTypeOption.push(
        <a-select-option key={RepairType[item]}>
          {getRepairTypeTitle(RepairType[item])}
        </a-select-option>,
      );
    }

    return (
      <div>
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            let date = new Date();
            this.queryParams.year = date.getFullYear();
            this.queryParams.month = date.getMonth() + 1;
            this.queryParams.keyword = null;
            this.queryParams.orgId = this.currentOrganizationId;
            this.queryParams.repairlType = undefined;

            this.refresh();
          }}
        >
          <a-form-item label="车间">
            <OrganizationTreeSelect
              axios={this.axios}
              autoInitial={true}
              value={this.queryParams.orgId}
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
          <a-form-item label="年月份">
            <a-month-picker
              style="width:100%;"
              default-value={moment(
                this.queryParams.year + '/' + this.queryParams.month,
                'YYYY/MM',
              )}
              allowClear={false}
              value={moment(this.queryParams.year + '/' + this.queryParams.month, 'YYYY/MM')}
              onChange={value => {
                let date = new Date(value);
                this.queryParams.year = date.getFullYear();
                this.queryParams.month = date.getMonth() + 1;
                this.refresh();
              }}
            />
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
            <div style="display:flex;">
              <a-button type="primary" icon="plus" onClick={this.add} disabled={this.isCanCreate}>
                生成
              </a-button>
              {vIf(
                <a-button type="primary" onClick={this.export} disabled={this.isCanExport}>
                  <a-icon type="download" />
                  导出
                </a-button>,
                vP(this.permissions, permissionsSmCrPlan.MonthOfYearPlan.Export),
              )}
              {vIf(
                <SmImport
                  isImport={this.isCanImport}
                  ref="smImport"
                  url='api/app/crPlanYearMonthPlan/upload'
                  axios={this.axios}
                  importKey="yearPlanMonth"
                  repairTagKey={this.repairTagKey}
                  downloadErrorFile={true}
                  onSelected={file => this.fileSelected(file)}
                  onIsSuccess={() => this.refresh()}
                />,
                vP(this.permissions, permissionsSmCrPlan.MonthOfYearPlan.Import),
              )}

              {vIf(
                <a-button type="primary" onClick={this.subimtExam} disabled={this.isCanImport}>
                  <a-icon type="import" />提交审批
                </a-button>,
                vP(this.permissions, permissionsSmCrPlan.MonthOfYearPlan.SubmitApproval),
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
          dataSource={this.monthItems}
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
