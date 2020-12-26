import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiYearMonthPlan from '../../sm-api/sm-cr-plan/YearMonthPlan';
import { requestIsSuccess, getRepairTypeTitle } from '../../_utils/utils';

let apiYearMonthPlan = new ApiYearMonthPlan();

const formFields = ['name'];

export default {
  name: 'SmCrPlanYearPlanModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      skyligetTypes: [],
      skyligetTypeSel: [],
      queryParams: {
        treeCheckable: true,
        skyligetType: null,//选中的天窗类型字符串
      },
      tabColumns: [],
      tabData: [],
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    indeterminate() {
      return this.skyligetTypes.length > this.skyligetTypeSel.length && this.skyligetTypeSel.length > 0;
    },
    isAllCheck() {
      return this.skyligetTypes.length == this.skyligetTypeSel.length;
    },
  },
  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
    this.inintData();
  },
  methods: {
    initAxios() {
      apiYearMonthPlan = new ApiYearMonthPlan(this.axios);
    },
    async inintData() {
      //加载天窗计划数据源
      let response = await apiYearMonthPlan.getSkylightTypeList(null, this.repairTagKey);
      if (requestIsSuccess(response)) {
        this.skyligetTypes = response.data;
      }
    },
    //编辑按钮
    async edit(record) {
      this.status = ModalStatus.Edit;
      this.record = record;

      this.tabColumns = [
        {
          title: '序号',
          width: 80,
          dataIndex: 'sn',
          scopedSlots: { customRender: 'sn' },
        },
        {
          title: '维修类别',
          width: 150,
          dataIndex: 'repairTypeStr',
          scopedSlots: { customRender: 'repairTypeStr' },
          ellipsis: true,
        },
        {
          width: 150,
          title: '设备名称',
          dataIndex: 'deviceName',
          scopedSlots: { customRender: 'deviceName' },
          ellipsis: true,
        },
        {
          width: 150,
          title: '设备处所',
          dataIndex: 'equipmentLocation',
          scopedSlots: { customRender: 'equipmentLocation' },
          ellipsis: true,
        },
        {
          width: 200,
          title: '工作内容',
          dataIndex: 'repairContent',
          scopedSlots: { customRender: 'repairContent' },
          ellipsis: true,
        },
        {
          width: 150,
          title: '单位',
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          ellipsis: true,
        },
      ];
      record.sn = 1;
      record.repairTypeStr = getRepairTypeTitle(record.repairType);
      this.tabData = [record];
      this.skyligetTypeSel = record.skyligetType ? record.skyligetType.split(',') : [];
      this.queryParams.skyligetType = record.skyligetType;
    },
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },
    async ok() {
      // 数据提交
      if (this.status == ModalStatus.View) {
        this.close();
      } else {
        let response = null;
        if (this.status === ModalStatus.Edit) {
          let params = {
            id: this.record.id,
            skyligetType: this.queryParams.skyligetType,
          };
          response = await apiYearMonthPlan.updateSkyligetType(params, this.repairTagKey);
          if (requestIsSuccess(response)) {
            this.isAllCheck = false;
            this.skyligetTypeSel = [];
            this.queryParams.skyligetType = '';
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }
        }
      }
    },
  },
  render() {
    let userForm = (
      <a-form form={this.form}>
        <a-table
          scroll={{ x: 1000 }}
          bordered
          columns={this.tabColumns}
          dataSource={this.tabData}
          pagination={false}
        ></a-table>
        <a-divider />
        <div style="margin-left:21%;">
          <a-checkbox
            checked={this.isAllCheck}
            indeterminate={this.indeterminate}
            onChange={value => {
              this.skyligetTypeSel = value.target.checked ? this.skyligetTypes : [];
              this.queryParams.skyligetType = this.skyligetTypeSel.join(',');
            }}
          >
            全选
          </a-checkbox>
        </div>

        <a-form-item
          label="天窗类型"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-checkbox-group
            options={this.skyligetTypes}
            value={this.skyligetTypeSel}
            onChange={value => {
              this.skyligetTypeSel = value;
              this.queryParams.skyligetType = value.join(',');
            }}
          />
        </a-form-item>
      </a-form>
    );
    return (
      <a-modal
        width={700}
        title={`${this.title}天窗`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
      >
        {userForm}
      </a-modal>
    );
  },
};
