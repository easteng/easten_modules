import ApiSendedWorkOrder from '../../sm-api/sm-cr-plan/SendedWorkOrder';
import * as utils from '../../_utils/utils';
import { requestIsSuccess } from '../../_utils/utils';
import moment from 'moment';
import { ModalStatus, SelectablePlanType } from '../../_utils/enum';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import OrganizationUserSelect from '../../sm-system/sm-system-organization-user-select';

let apiSendedWorkOrder = new ApiSendedWorkOrder();
const formFields = ['influenceScope', 'announcements', 'toolSituation'];
export default {
  name: 'SmCrPlanSentedWorkOrderModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      form: this.$form.createForm(this, {}),
      sentedWork: null,
      status: ModalStatus.Hide,
      iOrganizationId: null,
      plans: [],
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    title() {
      return utils.getModalTitle(this.status);
    },
    columns() {
      return [
        {
          title: '年/月表',
          dataIndex: 'planTypeStr',
          scopedSlots: { customRender: 'planTypeStr' },
        },
        {
          title: '序号',
          dataIndex: 'number',
          scopedSlots: { customRender: 'number' },
        },
        {
          title: '作业机房',
          dataIndex: 'workSiteName',
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'equipName',
          ellipsis: true,
          scopedSlots: { customRender: 'equipName' },
        },

        {
          title: '工作内容',
          ellipsis: true,
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
        },
        {
          title: '单位',
          ellipsis: true,
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
        },
        {
          title: '作业数量',
          dataIndex: 'planCount',
        },
        {
          title: '关联设备',
          dataIndex: 'relateEquipments',
          scopedSlots: { customRender: 'relateEquipments' },
          ellipsis: true,
        },
      ];
    },
  },

  watch: {
    organizationId: {
      handler: function (val, oldVal) {
        this.iOrganizationId = val;
      },
      immediate: true,
    },
  },

  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiSendedWorkOrder = new ApiSendedWorkOrder(this.axios);
    },
    view(record) {
      this.sentedWork = record;
      this.status = ModalStatus.View;
      this.refresh();
    },

    //初始化派工单
    async refresh() {
      let response = await apiSendedWorkOrder.get(this.sentedWork.id, this.repairTagKey);
      let _sentedWork;
      if (requestIsSuccess(response)) {
        this.sentedWork = response.data;
        _sentedWork = this.sentedWork;
        this.plans = _sentedWork.planDetailList;

        this.$nextTick(() => {
          let values = utils.objFilterProps(_sentedWork, formFields);
          values.maintenanceUnitId = _sentedWork.maintenanceUnit.organizationId;
          values.communicationUnitId = _sentedWork.communicationUnit.organizationId;
          values.influenceScope = _sentedWork.influenceScope;
          values.toolSituation = _sentedWork.toolSituation;
          values.announcements = _sentedWork.announcements;
          values.sendWorkersId = _sentedWork.sendWorkersId;
          values.startPlanTime = moment(_sentedWork.startPlanTime);
          values.endPlanTime = moment(_sentedWork.endPlanTime);
          values.dispatchingTime = moment(_sentedWork.dispatchingTime);

          this.form.setFieldsValue(values);
        });
      }
    },

    close() {
      this.status = ModalStatus.Hide;
      this.form.resetFields();
    },
  },
  render() {
    return (
      <a-modal
        class="sm-cr-plan-plan-sentde-works-modal"
        title="派工"
        visible={this.visible}
        onCancel={this.close}
        onOk={this.close}
        width={800}
      >
        <a-form form={this.form} layout="vertical">
          <a-row gutter={24}>
            <a-col sm={24} md={12}>
              <a-form-item label="检修工区">
                <OrganizationTreeSelect
                  axios={this.axios}
                  placeholder={this.status == ModalStatus.View ? '' : '车间/工区'}
                  disabled={this.status === ModalStatus.View}
                  isAutoDisableOrg={true}
                  v-decorator={[
                    'maintenanceUnitId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请输入车间/工区！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="通信工区">
                <OrganizationTreeSelect
                  axios={this.axios}
                  placeholder={this.status == ModalStatus.View ? '' : '车间/工区'}
                  disabled={this.status === ModalStatus.View}
                  isAutoDisableOrg={true}
                  v-decorator={[
                    'communicationUnitId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请输入车间/工区！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="作业开始时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                  disabled={this.status === ModalStatus.View}
                  show-time
                  v-decorator={[
                    'startPlanTime',
                    {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请选择作业时间！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="作业结束时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                  disabled={this.status === ModalStatus.View}
                  show-time
                  v-decorator={[
                    'endPlanTime',
                    {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请选择作业时间！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="影响范围">
                <a-textarea
                  disabled={this.status != ModalStatus.Hide}
                  v-decorator={[
                    'influenceScope',
                    {
                      initialValue: '',
                      rules: [{ max: 120 }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="作业注意事项">
                <a-textarea
                  placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'announcements',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '请输入作业注意事项！', max: 120 }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="通信工具检查试验情况">
                <a-textarea
                  placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'toolSituation',
                    {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入通信工具检查试验情况！', max: 120 },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item>
                <a-table
                  columns={this.columns}
                  dataSource={this.plans}
                  rowKey={record => record.id}
                  pagination={false}
                  scroll={{ y: 300 }}
                  {...{
                    scopedSlots: {
                      planTypeStr: (text, record, index) => {
                        return record.dailyPlan.planType === SelectablePlanType.Month
                          ? '月表'
                          : '年表';
                      },
                      number: (text, record, index) => {
                        return record.dailyPlan.number;
                      },
                      equipName: (text, record, index) => {
                        return (
                          <a-tooltip placement="topLeft" title={record.dailyPlan.equipName}>
                            <span>{record.dailyPlan.equipName}</span>
                          </a-tooltip>
                        );
                      },
                      content: (text, record, index) => {
                        return (
                          <a-tooltip placement="topLeft" title={record.dailyPlan.content}>
                            <span>{record.dailyPlan.content}</span>
                          </a-tooltip>
                        );
                      },
                      unit: (text, record, index) => {
                        return (
                          <a-tooltip placement="topLeft" title={record.dailyPlan.unit}>
                            <span>{record.dailyPlan.unit}</span>
                          </a-tooltip>
                        );
                      },
                      relateEquipments: (text, record, index) => {
                        let equipmentNames = '';
                        record.relateEquipments.map(item => {
                          equipmentNames += item.equipmentName ? `${item.equipmentName} ` : '';
                        });
                        return (
                          <a-tooltip placement="topLeft" title={equipmentNames}>
                            <span>{equipmentNames}</span>
                          </a-tooltip>
                        );
                      },
                    },
                  }}
                ></a-table>
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="派工时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder={this.status == ModalStatus.View ? '' : '请输入'}
                  show-time
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'dispatchingTime',
                    {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请选择派工时间！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={12}>
              <a-form-item label="派工人员">
                <OrganizationUserSelect
                  axios={this.axios}
                  placeholder={this.status == ModalStatus.View ? '' : '请选择'}
                  organizationId={this.iOrganizationId}
                  disabled={this.status === ModalStatus.View}
                  v-decorator={[
                    'sendWorkersId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择派工人员！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    );
  },
};
