import moment from 'moment';
import { PageState, SelectablePlanType, YearMonthPlanState } from '../../_utils/enum';
import ApiAlterRecord from '../../sm-api/sm-cr-plan/AlterRecord';
import * as utils from '../../_utils/utils';
import { requestIsSuccess, getSelectablePlanType } from '../../_utils/utils';
import SmCrPlanAddSelectablePlanModal from '../sm-cr-plan-add-selectable-plan-modal/SmCrPlanAddSelectablePlanModal';

let apiAlterRecord = new ApiAlterRecord();

const formFields = ['reason', 'foreDate', 'newDate'];

export default {
  name: 'SmCrPlanPlanChange',
  props: {
    axios: { type: Function, default: null },
    id: { type: String, default: null },
    organizationId: { type: String, default: null },
    bordered: { type: Boolean, default: false },
    pageState: { type: String, default: PageState.Add }, // 页面状态
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      iId: null,
      alterType: 1,
      form: this.$form.createForm(this),
      isShowAddChangePlans: false,
      selectedChangePlanIds: [], //待选计划选中项Id
      selectedChangePlans: [], //待选计划选中项
      number: '', //查看时显示的编号
      forePlanDate: new Date(), //原计划时间
      isLoading: false,
    };
  },

  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'number',
          scopedSlots: { customRender: 'number' },
          width: 80,
        },
        // {
        //   title: '变更类型',
        //   dataIndex: 'planTypeStr',
        //   width: 90,
        // },
        {
          title: '设备名称',
          width: 130,
          ellipsis: true,
          dataIndex: 'equipName',
        },
        {
          title: '工作内容',
          width: 180,
          ellipsis: true,
          dataIndex: 'content',
        },
        {
          title: '日期',
          dataIndex: 'planDate',
          scopedSlots: { customRender: 'planDate' },
        },
        {
          title: '计划数量',
          dataIndex: 'count',
        },
        {
          title: '当前未完成量',
          dataIndex: 'unFinishCount',
        },
        {
          title: '变更数量',
          dataIndex: 'alterCount',
          scopedSlots: { customRender: 'alterCount' },
        },
        {
          title: '剩余未完成量',
          dataIndex: 'remainUnFinishCount',
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 60,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
    columnsForView() {
      return [
        {
          title: '序号',
          dataIndex: 'number',
          width: 80,
        },
        // {
        //   title: '年/月表',
        //   dataIndex: 'planTypeStr',
        //   width: 80,
        // },
        {
          title: '设备名称',
          width: 130,
          ellipsis: true,
          dataIndex: 'equipName',
        },
        {
          title: '工作内容',
          width: 180,
          ellipsis: true,
          dataIndex: 'content',
        },
        {
          title: '日期',
          dataIndex: 'planDate',
          scopedSlots: { customRender: 'planDate' },
        },
        {
          title: '计划数量',
          dataIndex: 'count',
        },
        {
          title: '变更数量',
          dataIndex: 'alterCount',
        },
        {
          title: '未完成数量',
          dataIndex: 'unFinishCount',
        },
      ];
    },

    getChangeColsWidth() {
      if (this.pageState === PageState.View || this.pageState === PageState.Edit) return [7, 7, 17];
      return [8, 6, 18];
    },
  },
  watch: {
    id: {
      handler: function (value, oldValue) {
        this.plan = null;
        this.selectedChangePlans = [];
        this.form.resetFields();
        this.iId = this.id;
        if (value) {
          this.initAxios();
          this.initData();
        }
      },
      immediate: true,
    },
    pageState: {
      handler: function (value, oldValue) {
        this.iId = this.id;
        if (value != PageState.Add) {
          this.initAxios();
          this.initData();
        } else {
          this.selectedChangePlans = [];
          this.form.resetFields();
        }
      },
      immediate: true,
    },
  },

  async created() {
    this.initAxios();
    this.initData();
  },
  methods: {
    addChangePlan() {
      this.isShowAddChangePlans = true;
    },

    initAxios() {
      apiAlterRecord = new ApiAlterRecord(this.axios);
    },

    //编辑 查看 初始化数据
    async initData(id) {
      if (id) {
        this.iId = id;
      }
      if (!this.pageState || this.pageState === PageState.Add) {
        return;
      }
      // let emptyVal = utils.objFilterProps({}, formFields);
      // this.form.setFieldsValue(emptyVal);
      this.isLoading = true;
      let response = await apiAlterRecord.get({ id: this.iId }, this.repairTagKey);
      if (requestIsSuccess(response)) {
        let data = response.data;
        this.selectedChangePlanIds = [];
        data.dailyPlanAlters.map(s => {
          this.selectedChangePlanIds.push(s.id);
        });
        let dailyPlanResponse = await apiAlterRecord.getSelectablePlanByIds({
          ids: this.selectedChangePlanIds,
        }, this.repairTagKey);
        if (requestIsSuccess(dailyPlanResponse)) {
          this.$nextTick(() => {
            if (this.pageState === PageState.View || this.pageState === PageState.Edit) {
              this.number = data.fullNumber;
            }
            let values = utils.objFilterProps(data, formFields);
            values.foreDate = moment(data.planTime, 'YYYY-MM');
            this.forePlanDate = new Date(moment(data.planTime, 'YYYY-MM'));
            values.newDate = moment(data.alterTime, 'YYYY-MM');
            this.alterType = data.alterType;

            this.selectedChangePlans = [];
            for (let i = 0; i < data.dailyPlanAlters.length; i++) {
              let item = data.dailyPlanAlters[i];
              for (let j = 0; j < dailyPlanResponse.data.length; j++) {
                let tempItem = dailyPlanResponse.data[j];
                if (item.id == tempItem.id) {
                  item.count = item.planCount;
                  if (this.pageState === PageState.View) {
                    item.unFinishCount = tempItem.unFinishCount;
                  } else if (this.pageState === PageState.Edit) {
                    item.unFinishCount = utils.addNum(tempItem.unFinishCount, item.alterCount);
                    item.remainUnFinishCount = utils.subNum(item.unFinishCount, item.alterCount);
                  }
                  this.selectedChangePlans.push(item);
                }
              }
            }
            this.form.setFieldsValue(values);
          });
        }
        this.isLoading = false;
      }
    },

    //移除已选中的待选计划
    removeSelectedChangePlan(record) {
      let index = this.selectedChangePlans.indexOf(record);
      if (index > -1) this.selectedChangePlans.splice(index, 1);
      index = this.selectedChangePlanIds.indexOf(record.id);
      if (index > -1) this.selectedChangePlanIds.splice(index, 1);
    },
    close() {
      this.$emit('cancel', false);
      this.selectedChangePlans = [];
      this.form.resetFields();
    },

    //待选计划弹出层 确定事件
    selectCangedPlans(selectVal) {
      let _selectVal = JSON.parse(JSON.stringify(selectVal));
      let selectedPlans = [];
      let selectedPlanIds = [];

      for (let i = 0; i < _selectVal.length; i++) {
        let item = _selectVal[i];
        item.alterCount = item.unFinishCount;
        for (let oldItem of this.selectedChangePlans) {
          if (item.id == oldItem.id) {
            item.alterCount = oldItem.alterCount;
          }
        }
        if (item.planType == SelectablePlanType.Month) {
          item.planTypeStr = '月表';
        } else {
          item.planTypeStr = '年表';
        }
        item.remainUnFinishCount = utils.subNum(item.unFinishCount, item.alterCount);
        selectedPlans.push(item);
      }
      selectedPlanIds = selectedPlans.map(item => item.id);
      this.selectedChangePlans = selectedPlans;
      this.selectedChangePlanIds = selectedPlanIds;
    },

    //提交
    async commit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          values.alterType = this.alterType;
          values.planTime = moment(values.foreDate).format('YYYY-MM-DD');
          values.alterTime = moment(values.newDate).format('YYYY-MM-DD');
          values.dailyPlanAlters = [];
          values.organizationId = this.organizationId;
          for (let item of this.selectedChangePlans) {
            let temp = {
              dailyId: item.id,
              planCount: item.count,
              alterCount: item.alterCount,
            };
            values.dailyPlanAlters.push(temp);
          }
          if (this.pageState === PageState.Add) {
            let response = await apiAlterRecord.create(values, this.repairTagKey);
            if (requestIsSuccess(response)) {
              let ent = response.data;
              response = await apiAlterRecord.submitForExam({ id: ent.id, repairTagKey: this.repairTagKey });
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('ok', values);
                this.selectedChangePlans = [];
                this.form.resetFields();
              }
            }
          } else if (this.pageState === PageState.Edit) {
            values.id = this.id;
            let response = await apiAlterRecord.update(values, this.repairTagKey);
            if (requestIsSuccess(response)) {
              let ent = response.data;
              response = await apiAlterRecord.submitForExam({ id: ent.id, repairTagKey: this.repairTagKey });
              if (requestIsSuccess(response)) {
                this.$message.success('操作成功');
                this.$emit('ok', values);
                this.selectedChangePlans = [];
                this.form.resetFields();
              }
            }
          }
        }
      });
    },

    //保存
    save() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          values.alterType = this.alterType;
          values.planTime = moment(values.foreDate).format('YYYY-MM-DD');
          values.alterTime = moment(values.newDate).format('YYYY-MM-DD');
          values.dailyPlanAlters = [];
          values.organizationId = this.organizationId;
          for (let item of this.selectedChangePlans) {
            let temp = {
              dailyId: item.id,
              planCount: item.count,
              alterCount: item.alterCount,
            };
            values.dailyPlanAlters.push(temp);
          }
          if (this.pageState === PageState.Add) {
            let response = await apiAlterRecord.create(values, this.repairTagKey);
            if (requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.$emit('ok', values);
              this.selectedChangePlans = [];
              this.form.resetFields();
            }
          } else if (this.pageState === PageState.Edit) {
            values.id = this.id;
            let response = await apiAlterRecord.update(values, this.repairTagKey);
            if (requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.$emit('ok', values);
              this.selectedChangePlans = [];
              this.form.resetFields();
            }
          }
        }
      });
    },
  },

  render() {
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
      <div class="sm-cr-plan-vertica-skylight-plan">
        {/* 表单区 */}
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={24}>
              <a-form-item label="变更原因" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  rows="4"
                  disabled={this.pageState == PageState.View}
                  placeholder={this.pageState == PageState.View ? '' : '请输入'}
                  maxLength={500}
                  v-decorator={[
                    'reason',
                    {
                      initialValue: '',
                      rules: [{ required: true, message: '请输入变更原因！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row gutter={24}>
            <a-col sm={this.getChangeColsWidth[0]} md={this.getChangeColsWidth[0]}>
              <a-form-item label="原计划日期" label-col={{ span: this.getChangeColsWidth[1] }} wrapper-col={{ span: this.getChangeColsWidth[2] }}>
                <a-month-picker
                  allowClear={false}
                  style="width: 100%"
                  disabled={this.pageState == PageState.View}
                  format={'YYYY-MM'}
                  placeholder={this.pageState == PageState.View ? '' : '请输入'}
                  v-decorator={[
                    'foreDate',
                    {
                      initialValue: moment(this.forePlanDate.toLocaleDateString(), 'YYYY-MM'),
                      rules: [{ required: true, message: '请选择原计划时间！' }],
                    },
                  ]}
                  onChange={val => {
                    this.forePlanDate = new Date(val.format('YYYY-MM-DD'));
                  }}
                />
              </a-form-item>
            </a-col>
            <a-col sm={this.getChangeColsWidth[0]} md={this.getChangeColsWidth[0]}>
              <a-form-item label="申请变更时间" label-col={{ span: this.getChangeColsWidth[1] + 1 }} wrapper-col={{ span: this.getChangeColsWidth[2] - 1 }}>
                <a-month-picker
                  allowClear={false}
                  style="width: 100%"
                  disabled={this.pageState == PageState.View}
                  format={'YYYY-MM'}
                  placeholder={this.pageState == PageState.View ? '' : '请输入'}
                  v-decorator={[
                    'newDate',
                    {
                      initialValue: moment(new Date().toLocaleDateString(), 'YYYY-MM'),
                      rules: [{ required: true, message: '请选择申请变更时间！' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={this.getChangeColsWidth[0]} md={this.getChangeColsWidth[0]}>
              <a-form-item label="变更类型" label-col={{ span: this.getChangeColsWidth[1] }} wrapper-col={{ span: this.getChangeColsWidth[2] }}>
                <a-select
                  disabled={this.pageState == PageState.View || this.selectedChangePlans.length > 0}
                  value={this.alterType}
                  onChange={value => {
                    this.alterType = value;
                  }}
                >
                  {alterTypeOptions}
                </a-select>
              </a-form-item>
            </a-col>

            {this.pageState === PageState.View || this.pageState === PageState.Edit ? (
              <a-col sm={3} md={3}>
                <a-form-item label="编号" label-col={{ span: 7 }} wrapper-col={{ span: 17 }}>
                  <a-input disabled value={this.number} />
                </a-form-item>
              </a-col>
            ) : (
              undefined
            )}

          </a-row>
          {this.pageState === PageState.View ? (
            undefined
          ) : (
            <a-row gutter={24} type="flex" justify="end">
              <a-col sm={2} md={2} >
                <a-form-item style='margin-bottom:12px; float:right'>
                  <a-button type="primary" onClick={this.addChangePlan}>
                      添加
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          )}
          <a-row gutter={24}>
            <a-col sm={24} md={24}>
              <a-form-item label="变更计划内容" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                {/* 计划内容展示区 */}
                <a-table
                  columns={this.pageState === PageState.View ? this.columnsForView : this.columns}
                  dataSource={this.selectedChangePlans}
                  rowKey={record => record.id}
                  pagination={false}
                  scroll={{ y: 400 }}
                  {...{
                    scopedSlots: {
                      planDate: (text, record) => {
                        return record.planDate ? moment(record.planDate).format('YYYY-MM-DD') : '';
                      },
                      alterCount: (text, record) => {
                        return (
                          <a-input-number
                            min={0}
                            max={record.unFinishCount}
                            value={record.alterCount}
                            precision={3}
                            onChange={value => {
                              record.alterCount = value;
                              // record.unFinishCount = record.count - value;

                              record.remainUnFinishCount = utils.subNum(
                                record.unFinishCount,
                                value,
                              );
                            }}
                            onBlur={val => {
                              if (record.alterCount == null || record.alterCount == undefined)
                                record.alterCount = 0;
                            }}
                          />
                        );
                      },
                      operations: (text, record) => {
                        return [
                          <a
                            onClick={() => {
                              this.removeSelectedChangePlan(record);
                            }}
                          >
                            删除
                          </a>,
                        ];
                      },
                    },
                  }}
                ></a-table>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div style="float: right;">
          {this.pageState === PageState.View ? (
            <a-button onClick={this.close}>关闭</a-button>
          ) : (
            <span>
              <a-button type="primary" style="margin-right: 20px" onClick={this.commit}>
                  提交
              </a-button>
              <a-button type="primary" style="margin-right: 20px" onClick={this.save}>
                  保存
              </a-button>
              <a-button onClick={this.close}>取消</a-button>
            </span>
          )}
        </div>
        {this.pageState === PageState.Add || this.pageState === PageState.Edit ? (
          <SmCrPlanAddSelectablePlanModal
            visible={this.isShowAddChangePlans}
            selected={this.selectedChangePlanIds}
            axios={this.axios}
            changeType={this.alterType}
            organizationId={this.organizationId}
            date={this.forePlanDate}
            repairTagKey={this.repairTagKey}
            onOk={val => {
              this.isShowAddChangePlans = false;
              this.selectCangedPlans(val);
            }}
            onChange={() => {
              this.isShowAddChangePlans = false;
            }}
          />
        ) : (
          undefined
        )}
        {this.isLoading ? (
          <div style="position:fixed;left:0;right:0;top:0;bottom:0;z-index:9999;">
            <div style="position: relative; top: 0px; background-color: white; width: 100%; height: 100%; opacity: 0.6;"></div>
            <div style="position: fixed;;top:45%;left:50%">
              <a-spin tip="Loading..." size="large"></a-spin>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
};
