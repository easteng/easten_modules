import { ModalStatus, RepairType, YearMonthPlanType } from '../../_utils/enum';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';

import * as utils from '../../_utils/utils';
import ApiYearMonthPlan from '../../sm-api/sm-cr-plan/YearMonthPlan';
import { requestIsSuccess, getRepairTypeTitle } from '../../_utils/utils';

let apiYearMonthPlan = new ApiYearMonthPlan();

const formFields = ['name'];

export default {
  name: 'SmCrPlanYearMonthChangeModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    orgId: { type: String, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      selectedPlans: [], //选中table项
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        orgId: this.orgId,
        planType: 1,
        repairlType: undefined,
        keyword: null,
      },
      dataSource: [],
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    planCol() {
      let arr = [];
      if (this.queryParams.planType == YearMonthPlanType.Year) {
        arr = [
          {
            title: '年计划数量',
            width: 150,
            dataIndex: 'planCount',
            scopedSlots: { customRender: 'planCount' },
          },
          {
            title: '每年次数',
            width: 120,
            dataIndex: 'times',
            scopedSlots: { customRender: 'times' },
          },
        ];
      } else {
        arr = [
          {
            title: '每月次数',
            width: 120,
            dataIndex: 'times',
            scopedSlots: { customRender: 'times' },
          },
        ];
      }
      return arr;
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'number',
          width: 120,
          scopedSlots: { customRender: 'number' },
        },
        {
          title: '维修类别',
          width: 100,
          dataIndex: 'repairTypeStr',
          scopedSlots: { customRender: 'repairTypeStr' },
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 100,
          scopedSlots: { customRender: 'deviceName' },
          ellipsis: true,
        },
        {
          title: '设备处所',
          width: 100,
          dataIndex: 'equipmentLocation',
          scopedSlots: { customRender: 'equipmentLocation' },
          ellipsis: true,
        },
        {
          title: '工作内容',
          width: 150,
          dataIndex: 'repairContent',
          scopedSlots: { customRender: 'repairContent' },
          ellipsis: true,
        },
        {
          title: '天窗类型',
          width: 100,
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
          title: '总数量',
          width: 100,
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' },
        },
        ...this.planCol,
      ];
    },
  },
  created() {
    this.initAxios();
    this.refresh();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    add(type) {
      this.queryParams.planType = type;
      this.selectedPlans = [];
      this.refresh();
      this.status = ModalStatus.Add;
    },
    initAxios() {
      apiYearMonthPlan = new ApiYearMonthPlan(this.axios);
    },
    close(type) {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },
    async refresh(resetPage = true) {
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      let response = await apiYearMonthPlan.getCanChangePlanList(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.dataSource = response.data;
        this.totalCount = this.dataSource.length;
      }
    },
    async ok() {
      // 数据提交
      console.log(this.repairTagKey);
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        let data = {
          ids: this.selectedPlans,
          repairTagKey: this.repairTagKey,
        };
        let response = null;
        if (this.status === ModalStatus.Add) {
          response = await apiYearMonthPlan.createChangePlan(data);
          if (requestIsSuccess(response)) {
            this.selectedPlans = [];
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }
        }
      }
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
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
      <a-modal
        width={800}
        Hide={500}
        title={`${this.title}项目`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      >
        <div>
          {/* 操作区 */}
          <sc-table-operator
            onSearch={() => {
              this.refresh();
            }}
            onReset={() => {
              this.queryParams.repairlType = undefined;
              this.queryParams.keyword = null;
              this.refresh();
            }}
          >
            <a-form-item label="维修类别">
              <a-select
                placeholder="请选择维修类别！"
                style="width:150px"
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
            <a-form-item label="">
              <a-input
                style="width:250px"
                placeholder="设备名称/设备处所/工作内容"
                value={this.queryParams.keyword}
                onInput={event => {
                  this.queryParams.keyword = event.target.value;
                  this.refresh();
                }}
              />
            </a-form-item>
          </sc-table-operator>

          {/* 展示区 */}
          <a-table
            scroll={{ x: 650, y: 500 }}
            columns={this.columns}
            dataSource={this.dataSource}
            rowKey={record => record.id}
            bordered={this.bordered}
            loading={this.loading}
            pagination={false}
            rowSelection={{
              columnWidth: 30,
              selectedRowKeys: this.selectedPlans,
              onChange: selectedRows => {
                this.selectedPlans = selectedRows;
              },
            }}
            {...{
              scopedSlots: {
                repairTypeStr: (text, record) => {
                  return getRepairTypeTitle(record.repairType);
                },
              },
            }
            }
            pagination={{
              showTotal: paginationConfig.showTotal,
              showSizeChanger: true,
              showQuickJumper: true,
              defaultPageSize: paginationConfig.defaultPageSize,
              current: this.pageIndex,
              onChange: this.onPageChange,
              onShowSizeChange: this.onPageChange,
            }}
          ></a-table>
        </div>
      </a-modal>
    );
  },
};
