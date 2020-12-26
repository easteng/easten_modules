import ApiSkyLightPlan from '../../sm-api/sm-cr-plan/SkyLightPlan';
import * as utils from '../../_utils/utils';
import { requestIsSuccess } from '../../_utils/utils';
import moment from 'moment';
import { SelectablePlanType, SkylightType, PlanState, PageState } from '../../_utils/enum';
import SmCrPlanAddSelectablePlanModal from '../sm-cr-plan-add-selectable-plan-modal';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';

let apiSkyLightPlan = new ApiSkyLightPlan();
const formFields = ['workAreaId'];
export default {
  name: 'SmCrPlanOtherPlan',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    planDate: { type: String, default: '' },
    pageState: { type: String, default: PageState.Add }, // 页面状态
    id: { type: String, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      iId: null,
      iPlanDate: '',
      form: this.$form.createForm(this, {}),
      otherPlan: null,
      planDetails: [],
      iVisible: false,
      iOrganizationId: null,
      iWorkAreaId: null,
      loading: false,
      workCountOld: null,
    };
  },

  computed: {
    planDetailIds() {
      return this.planDetails.map(item => item.dailyPlanId);
    },
    columns() {
      return [
        {
          title: '年/月表',
          dataIndex: 'planTypeStr',
          scopedSlots: { customRender: 'planTypeStr' },
          width: 80,
        },
        {
          title: '序号',
          dataIndex: 'number',
          width: 90,
          ellipsis: true,
        },
        {
          title: '设备名称',
          ellipsis: true,
          dataIndex: 'equipName',
        },
        {
          title: '工作内容',
          ellipsis: true,
          dataIndex: 'content',
        },
        {
          title: '日期',
          dataIndex: 'planDate',
          scopedSlots: { customRender: 'planDate' },
        },
        {
          title: '单位',
          ellipsis: true,
          dataIndex: 'unit',
        },
        {
          title: '计划数量',
          dataIndex: 'count',
        },
        // {
        //   title: '未完成数量',
        //   dataIndex: 'unFinishCount',
        // },
        {
          title: '作业数量',
          dataIndex: 'workCount',
          scopedSlots: { customRender: 'workCount' },
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
  watch: {
    organizationId: {
      handler: function (value, oldValue) {
        this.iOrganizationId = value;
      },
      immediate: true,
    },
    planDate: {
      handler: function (value, oldValue) {
        this.iPlanDate = value;
      },
      immediate: true,
    },

    id: {
      handler: function (value, oldValue) {
        this.iId = this.id;
        if (value) {
          this.initAxios();
          this.refresh();
        } else {
          this.planDetails = [];
          this.form.resetFields();
        }
      },
      immediate: true,
    },
    pageState: {
      handler: function (value, oldValue) {
        this.iId = this.id;
        if (value !== PageState.Add) {
          this.initAxios();
          this.refresh();
        } else {
          this.planDetails = [];
          this.form.resetFields();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiSkyLightPlan = new ApiSkyLightPlan(this.axios);
    },

    //初始化计划列表
    async refresh(id) {
      if (id) {
        this.iId = id;
      }
      if (!this.pageState || this.pageState === PageState.Add) {
        return;
      }
      let response = await apiSkyLightPlan.get({ id: this.iId, repairTagKey: this.repairTagKey });
      let _otherPlan;
      if (requestIsSuccess(response)) {
        _otherPlan = response.data;
        this.otherPlan = _otherPlan;
        let planDetails = _otherPlan.planDetails ? _otherPlan.planDetails : [];
        planDetails = planDetails.map(item => {
          return {
            ...item,
            dailyPlanId: item.dailyPlanId,
            planTypeStr: item.dailyPlan ? item.dailyPlan.planTypeStr : '',
            planType: item.dailyPlan ? item.dailyPlan.planType : null,
            equipName: item.dailyPlan.equipName,
            content: item.dailyPlan.content,
            number: item.dailyPlan ? item.dailyPlan.number : null,
            planDate: item.dailyPlan
              ? moment(item.dailyPlan.planDate).format('YYYY-MM-DD')
              : null,
            // unFinishCount: null,
            unit: item.dailyPlan ? item.dailyPlan.unit : '',
            count: item.dailyPlan ? item.dailyPlan.count : '',
            workCount: item.planCount,
            unFinishCount: item.dailyPlan ? item.dailyPlan.unFinishCount : null,
            workCountOld: item.planCount,
          };
        });

        this.planDetails = planDetails;

        this.$nextTick(() => {
          let values = utils.objFilterProps(_otherPlan, formFields);
          values.workTime = moment(_otherPlan.workTime);
          this.form.setFieldsValue(values);
        });
      }
    },

    addPlans() {
      this.iVisible = true;
    },

    //设置时间禁选项
    disabledDate(current) {
      return (
        current <=
        moment(this.iPlanDate)
          .subtract(1, 'month')
          .endOf('month') ||
        current >=
        moment(this.iPlanDate)
          .add(1, 'month')
          .startOf('month')
      );
    },

    //获取已选计划列表
    getSelectedPlans(selectVal) {
      let planDetails = JSON.parse(JSON.stringify(selectVal));
      let _planDetails = [];
      for (let item of planDetails) {
        let target = this.planDetails.find(_item => _item.dailyPlanId === item.id);
        if (!target) {
          item = {
            ...item,
            dailyPlanId: item.id,
            workCount: item.unFinishCount,
            workCountOld: 0,
            relateEquipments: [],
            dailyPlanId: item.planId,
          };
          _planDetails.push(item);
        }
      }
      this.planDetails = [..._planDetails, ...this.planDetails];
    },
    remove(record) {
      let index = this.planDetails.indexOf(record);
      if (index > -1) this.planDetails.splice(index, 1);
    },

    save() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let data = JSON.parse(JSON.stringify(values));
          data.workAreaId = values.workAreaId;
          data.workTime = data.workTime = moment(values.workTime)
            .utc()
            .format();
          data.organizationId =
            this.pageState != PageState.Add ? this.otherPlan.organizationId : this.iOrganizationId;
          data.planType = SkylightType.Other;
          data.planState = PlanState.NotIssued;
          data.planDetails = this.planDetails.map(item => {
            let result = {
              dailyPlanId: item.dailyPlanId,
              planCount: item.workCount != null ? item.workCount : 0,
            };
            if (this.pageState == PageState.Edit) {
              result = {
                ...result,
                id: item.id,
              };
            }
            return result;
          });

          if (data.planDetails.find(item => item.planCount === 0)) {
            this.$message.error('计划内容作业数量不能为 0 !');
          } else {
            this.loading = true;
            if (this.pageState === PageState.Add) {
              let response = await apiSkyLightPlan.create(true, data, this.repairTagKey);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('ok');
                this.form.resetFields();
                this.planDetails = [];
              }
            } else if (this.pageState === PageState.Edit) {
              let _data = { id: this.id, ...data };
              let response = await apiSkyLightPlan.update(true, _data, this.repairTagKey);
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('ok', this.id);
                this.form.resetFields();
                this.planDetails = [];
              }
            }
            this.loading = false;
          }
        }
      });
    },
  },
  render() {
    return (
      <div class="sm-cr-plan-other-plan-modal">
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={12}>
              <a-form-item label="作业工区" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <SmSystemOrganizationTreeSelect
                  axios={this.axios}
                  disabled={this.pageState == PageState.View}
                  isAutoDisableOrg={true}
                  v-decorator={[
                    'workAreaId',
                    {
                      initialValue: null,
                      rules: [{ required: true, message: '请输入作业工区' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="计划时间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-date-picker
                  style="width: 100%"
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入'}
                  disabledDate={this.disabledDate}
                  v-decorator={[
                    'workTime',
                    {
                      initialValue: this.iPlanDate ? moment(this.iPlanDate) : null,
                      rules: [{ required: true, message: '请输入计划日期！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            {this.pageState !== PageState.View ? (
              <a-col sm={24} md={24}>
                <a-form-item label-col={{ span: 4 }} wrapper-col={{ span: 20, offset: 22 }}>
                  <a-button style="margin-right:20px;" type="primary" onClick={this.addPlans}>
                    添加计划
                  </a-button>
                </a-form-item>
              </a-col>
            ) : (
              undefined
            )}
            <a-col sm={24} md={24}>
              <a-form-item label="计划内容" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-table
                  columns={this.columns}
                  dataSource={this.planDetails}
                  rowKey={record => record.id}
                  pagination={false}
                  {...{
                    scopedSlots: {
                      planDate: (text, record, index) => {
                        return moment(record.planDate).format('YYYY-MM-DD');
                      },
                      planTypeStr: (text, record, index) => {
                        return record.planType === SelectablePlanType.Month ? '月表' : '年表';
                      },
                      workCount: (text, record, index) => {
                        return (
                          <a-input-number
                            disabled={this.pageState == PageState.View}
                            style="margin: -10px 0"
                            min={0}
                            precision={3}
                            max={record.workCountOld + record.unFinishCount}
                            value={record.workCount}
                            onChange={value => {
                              // if (record.unFinishCount == null) {
                              //   let response = await apiSkyLightPlan.getSelectablePlan({
                              //     id: record.dailyPlanId,
                              //     repairTagKey: this.repairTagKey,
                              //   });
                              //   if (requestIsSuccess(response)) {
                              //     let data = response.data;
                              //     record.unFinishCount = data.unFinishCount;
                              //   }
                              // }
                              record.workCount = value;
                            }}
                          />
                        );
                      },

                      operations: (text, record) => {
                        return (
                          <span v-show={this.pageState != PageState.View}>
                            <a
                              onClick={() => {
                                this.remove(record);
                              }}
                            >
                              删除
                            </a>
                          </span>
                        );
                      },
                    },
                  }}
                ></a-table>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <div style="float: right;">
          {this.pageState == PageState.View ? (
            <a-button
              onClick={() => {
                this.$emit('cancel');
                this.planDetails = [];
                this.form.resetFields();
              }}
            >
              关闭
            </a-button>
          ) : (
            [
              <a-button
                type="primary"
                disabled={this.pageState == PageState.View}
                style="margin-right: 20px"
                onClick={this.save}
                loading={this.loading}
              >
                  保存
              </a-button>,
              <a-button
                onClick={() => {
                  this.$emit('cancel');
                  this.planDetails = [];
                  this.form.resetFields();
                }}
              >
                  取消
              </a-button>,
            ]
          )}
        </div>

        <SmCrPlanAddSelectablePlanModal
          axios={this.axios}
          selected={this.planDetailIds}
          visible={this.iVisible}
          skylightType={SkylightType.Other}
          date={new Date(this.iPlanDate)}
          organizationId={this.iOrganizationId}
          repairTagKey={this.repairTagKey}
          onOk={value => {
            this.getSelectedPlans(value);
            this.iVisible = false;
          }}
          onChange={() => {
            this.iVisible = false;
          }}
        />
      </div>
    );
  },
};
