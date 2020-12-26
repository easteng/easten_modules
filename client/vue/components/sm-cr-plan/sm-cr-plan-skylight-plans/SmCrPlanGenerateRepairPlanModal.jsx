import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiSkyLightPlan from '../../sm-api/sm-cr-plan/SkyLightPlan';
import ApiMaintenanceWork from '../../sm-api/sm-cr-plan/MaintenanceWork';
import moment from 'moment';
import { PlanType} from '../../_utils/enum';
import './style';
import { requestIsSuccess } from '../../_utils/utils';
let apiSkyLightPlan = new ApiSkyLightPlan();
let apiMaintenanceWork = new ApiMaintenanceWork();
export default {
  name: 'SmCrPlanGenerateRepairPlanModal',
  props: {
    axios: { type: Function, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
    organizationId: { type: String,default:null},
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
    };
  },
  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiSkyLightPlan = new ApiSkyLightPlan(this.axios);
      apiMaintenanceWork = new ApiMaintenanceWork(this.axios);
    },
    generatePlan() {
      this.status = ModalStatus.Add;
    },
    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
    },

    async ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response = null;
          let data = {
            ...values,
            startTime: this.dateRange[0].format("YYYY-MM-DD"),
            endTime: this.dateRange[1].format("YYYY-MM-DD"),
            repairTagKey: this.repairTagKey,
            organizationId: this.organizationId,
            maintenanceProject: '通信维修',
            MaintenanceType: PlanType.Vertical,
          };
          response = await apiMaintenanceWork.create(data);
          if (requestIsSuccess(response)) {
            this.$message.success('已生成维修计划并提交审批');
            this.$emit('success');
            this.close();
          }
      
          //   response = await apiSkyLightPlan(data);
          //   if (utils.requestIsSuccess(response)) {
          //     this.$message.success('操作成功');
          //     this.$emit('success');
          //     this.close();
          //   }
        }
      });
    },

  },
  render() {
    return (
      <a-modal
        class="sm-crPlan-generate-repair-plan-modal-a"
        title={`生成维修计划`}
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        onOk={this.ok}
        width={750}
      >
        <a-form form={this.form}>
          <a-form-item
            label="计划时间"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-range-picker
              allowClear={false}
              class="data-range-picker"
              value={this.dateRange}
              onChange={value => {
                this.dateRange = value;
              }}
            />
          </a-form-item>
          <a-form-item
            label="作业单位及负责人"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              placeholder="请输入作业单位及负责人"
              v-decorator={[
                'workOrgAndDutyPerson',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '作业单位及负责人不能为空',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="签收单位"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              placeholder="请输入签收单位"
              v-decorator={[
                'signOrganization',
                {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '签收单位不能为空',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="初审部门"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="1"
              placeholder="请输入初审部门"
              v-decorator={[
                'firstTrial',
                {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '初审部门不能为空',
                      whitespace: true,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item
            label="备注"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              placeholder="请输入备注"
              v-decorator={[
                'remark',
                {
                  initialValue: '',
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>

    );
  },
};