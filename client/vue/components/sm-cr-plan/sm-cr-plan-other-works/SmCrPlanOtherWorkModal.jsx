import ApiWorkOrder from '../../sm-api/sm-cr-plan/WorkOrder';
import * as utils from '../../_utils/utils';
import { requestIsSuccess, getDateReportTypeTitle } from '../../_utils/utils';
import moment from 'moment';
import { ModalStatus, YearMonthPlanType, StandTestType, MemberType } from '../../_utils/enum';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import SmSystemUserSelect from '../../sm-system/sm-system-member-select';

let apiWorkOrder = new ApiWorkOrder();
const formFields = ['startRealityTime', 'endRealityTime'];
export default {
  name: 'SmCrPlanOtherWorkModal',
  props: {
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    planDate: { type: String, default: '' },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      form: this.$form.createForm(this, {}),
      otherWork: null,
      status: ModalStatus.Hide,
      startTime: null,
      endTime: null,
      iOrganizationId: null,
      flatPlanDetails: [],
      planDetailList: [],
      record: null, //当前选中的维修项
      workUsers: [],
    };
  },

  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },

    title() {
      return this.status == ModalStatus.Edit ? '完成录入' : '详情';
    },

    columns() {
      return [
        {
          title: '设备名称/类别',
          dataIndex: 'deviceName',
          ellipsis: true,
          width: 140,
          customRender: (text, record, index) => {
            return {
              children: text,
              attrs: {
                rowSpan: record.typeRowSpan,
              },
            };
          },
        },
        {
          title: '年/月表',
          dataIndex: 'yearMonthPlanType',
          ellipsis: true,
          width: 90,
          customRender: (text, record, index) => {
            return {
              children: `${getDateReportTypeTitle(record.yearMonthPlanType)}`,
              attrs: {
                rowSpan: record.monthYearRowSpan,
              },
            };
          },
        },
        {
          title: '序号',
          dataIndex: 'number',
          scopedSlots: { customRender: 'number' },
          width: 70,
          customRender: (text, record, index) => {
            return {
              children: text,
            };
          },
        },
        {
          title: '工作内容',
          width: 500,
          ellipsis: true,
          dataIndex: 'workContent',
          customRender: (text, record, index) => {
            return {
              children: (
                <div>
                  <span style="display: flex; align-items: center;">
                    <a-icon
                      style="margin-right: 10px;"
                      type={record.isShow ? 'up' : 'down'}
                      onClick={() => {
                        record.isShow = !record.isShow;
                      }}
                    />
                    <a-tooltip placement="topLeft" title={record.workContent}>
                      <div style="width:265px; overflow: hidden; text-overflow: ellipsis;">
                        {record.workContent}
                      </div>
                    </a-tooltip>
                  </span>
                  <a-table
                    v-show={record.isShow}
                    pagination={false}
                    data-source={record.equipmentTestResultList}
                    rowKey={record => record.id}
                    columns={[
                      {
                        title: '测试项目',
                        dataIndex: 'testName',
                        ellipsis: true,
                        width: 140,
                      },
                      {
                        title: '检修记录',
                        dataIndex: 'testResult',
                        customRender: (text, record, index) => {
                          let item;
                          if (record.testType === StandTestType.Excel) {
                            item = (
                              <SmFileManageSelect
                                ref="SmFileManageSelect"
                                axios={this.axios}
                                multiple={false}
                                height={40}
                                disabled={this.status == ModalStatus.View}
                                enableDownload={true}
                                value={record.file ? record.file : {}}
                                onChange={value => {
                                  console.log(value);
                                  record.file = value;
                                  console.log(record.file);
                                  // record.uploadFile = {
                                  //   ...record.uploadFile,
                                  //   name: value.name,
                                  //   id: value.id,
                                  // };
                                }}
                              />
                            );
                          } else if (record.predictedValue && record.predictedValue.length > 0) {
                            item = (
                              <a-select
                                disabled={this.status == ModalStatus.View}
                                value={record.testResult}
                                onChange={value => {
                                  record.testResult = value;
                                }}
                              >
                                {record.predictedValue.map(item => {
                                  return (
                                    <a-select-option key={item} value={item}>
                                      {item}
                                    </a-select-option>
                                  );
                                })}
                              </a-select>
                            );
                          } else {
                            item = (
                              <a-input
                                value={record.testResult}
                                disabled={this.status == ModalStatus.View}
                                onChange={event => {
                                  record.testResult = event.target.value;
                                }}
                              ></a-input>
                            );
                          }
                          return {
                            children: item,
                          };
                        },
                      },
                    ]}
                  ></a-table>
                </div>
              ),
            };
          },
        },
        {
          title: '作业数量',
          dataIndex: 'planCount',
          scopedSlots: { customRender: 'planCount' },
          width: 90,
        },
        {
          title: '完成数量',
          dataIndex: 'workCount',
          scopedSlots: { customRender: 'workCount' },
          width: 120,
        },
        {
          title: '作业人员',
          dataIndex: 'maintenanceUserList',
          scopedSlots: { customRender: 'maintenanceUserList' },
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
  },

  created() {
    this.initAxios();
  },

  methods: {
    initAxios() {
      apiWorkOrder = new ApiWorkOrder(this.axios);
    },

    edit(record) {
      this.otherWork = record;
      this.status = ModalStatus.Edit;
      this.refresh();
    },
    view(record) {
      this.otherWork = record;
      this.status = ModalStatus.View;
      this.refresh();
    },

    //初始化作业表单
    async refresh() {
      let response = await apiWorkOrder.getDetail({ id: this.otherWork.id, repairTagKey: this.repairTagKey });
      let _otherWork;
      if (requestIsSuccess(response)) {
        _otherWork = response.data;
        this.planDetailList = _otherWork.planDetailList;
        this.otherWork = _otherWork;
        // 计划详情数据数组扁平化处理
        let planDetailList = [];
        this.planDetailList.map((planDetail, index1) => {
          planDetail.jobContentEquipmentList.map((jobContentEquipment, index2) => {
            jobContentEquipment.yearMonthDetailedList.sort(
              (a, b) => a.yearMonthPlanType - b.yearMonthPlanType,
            );

            // 找到所有年表
            let allYearDetailedList = jobContentEquipment.yearMonthDetailedList.filter(
              item => item.yearMonthPlanType === YearMonthPlanType.Year,
            );
            // 找到所有月表
            let allMonthDetailedList = jobContentEquipment.yearMonthDetailedList.filter(
              item => item.yearMonthPlanType === YearMonthPlanType.Month,
            );

            jobContentEquipment.yearMonthDetailedList.map((yearMonthDetailed, index3) => {
              yearMonthDetailed.planDetailedList.map((planDetailed, index4) => {
                let item = {
                  id: index1 + '_' + index2 + '_' + index3 + '_' + index4,
                  ...planDetail,
                  ...jobContentEquipment,
                  ...yearMonthDetailed,
                  ...planDetailed,
                  typeRowSpan: 0,
                  nameRowSpan: 0,
                  monthYearRowSpan: 0,
                  maintenanceUserListIds: planDetailed.maintenanceUserList
                    ? planDetailed.maintenanceUserList.map(item => {
                      return {
                        id: item.userId,
                        type: MemberType.User,
                      };
                    })
                    : [],
                  isShow: false,
                };
                if (index2 === 0 && index3 === 0 && index4 === 0) {
                  planDetail.jobContentEquipmentList.map(jobContentEquipment => {
                    jobContentEquipment.yearMonthDetailedList.map(yearMonthDetailed => {
                      item.typeRowSpan += yearMonthDetailed.planDetailedList.length;
                    });
                  });
                }

                if (index3 === 0 && index4 === 0) {
                  jobContentEquipment.yearMonthDetailedList.map(yearMonthDetailed => {
                    return (item.nameRowSpan += yearMonthDetailed.planDetailedList.length);
                  });

                  allYearDetailedList.map(_item => {
                    item.monthYearRowSpan += _item.planDetailedList.length;
                  });
                }

                if (index3 === allYearDetailedList.length && index4 === 0) {
                  allMonthDetailedList.map(_item => {
                    item.monthYearRowSpan += _item.planDetailedList.length;
                  });
                }

                planDetailList.push(item);
              });
            });
          });
        });
        this.flatPlanDetails = planDetailList;
        this.$nextTick(() => {
          let values = utils.objFilterProps(_otherWork, formFields);
          values.startRealityTime = moment(values.startRealityTime);
          values.endRealityTime = moment(values.endRealityTime);
          this.form.setFieldsValue(values);
        });
      }
    },

    close() {
      this.status = ModalStatus.Hide;
      this.form.resetFields();
      this.record = null;
      this.workUsers = [];
      this.flatPlanDetails = null;
    },

    //一键完成操作
    quicklyFish() {
      this.flatPlanDetails.map(item => {
        item.workCount = item.planCount;
      });
    },

    //设置时间禁选项
    startTimeDisabledDate(current) {
      return (
        current <=
        moment(this.otherWork.startRealityTime)
          .subtract(1, 'month')
          .endOf('month') ||
        current >=
        moment(this.otherWork.startRealityTime)
          .add(1, 'month')
          .startOf('month')
      );
    },

    endTimeDisabledDate(current) {
      return (
        current <=
        moment(this.otherWork.endRealityTime)
          .subtract(1, 'month')
          .endOf('month') ||
        current >=
        moment(this.otherWork.endRealityTime)
          .add(1, 'month')
          .startOf('month')
      );
    },

    //提交数据
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let planDetailList = JSON.parse(JSON.stringify(this.flatPlanDetails));
          let data;
          data = {
            id: this.otherWork.id,
            startRealityTime: moment(values.startRealityTime)
              .utc()
              .format(),
            endRealityTime: moment(values.endRealityTime)
              .utc()
              .format(),
            orderNo: this.otherWork.orderNo,
            feedback: this.otherWork.feedback,
            equipmentList: planDetailList.map(item => {
              return (item = {
                id: item.id,
                planCount: item.planCount,
                workCount: item.workCount,
                maintenanceUserList:
                  item.maintenanceUserListIds && item.maintenanceUserListIds.length > 0
                    ? item.maintenanceUserListIds.map(item => item.id)
                    : [],
                equipmentTestResultList: item.equipmentTestResultList.map(_item => {
                  return (_item = {
                    id: _item.id,
                    testResult: _item.testResult,
                    fileId: _item.file ? _item.file.id : null,
                  });
                }),
              });
            }),
          };
          if (this.status === ModalStatus.Edit) {
            let response = await apiWorkOrder.finish(true, true, data, this.repairTagKey);
            if (requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.$emit('success');
              this.close();
            }
          } else {
            this.close();
          }
        }
      });
    },
  },
  render() {
    return (
      <a-modal
        class="sm-cr-plan-other-work-modal"
        title={this.title}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
        ok-text="保存"
        width={'70%'}
      >
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={12}>
              <a-form-item label="实际开始时间" label-col={{ span: 5 }} wrapper-col={{ span: 19 }}>
                <a-date-picker
                  style="width: 100%;"
                  disabled={this.status == ModalStatus.View}
                  show-time
                  disabledDate={this.startTimeDisabledDate}
                  v-decorator={[
                    'startRealityTime',
                    {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请选择开始时间' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="实际结束时间" label-col={{ span: 5 }} wrapper-col={{ span: 19 }}>
                <a-date-picker
                  style="width: 100%;"
                  disabled={this.status == ModalStatus.View}
                  disabledDate={this.endTimeDisabledDate}
                  show-time
                  v-decorator={[
                    'endRealityTime',
                    {
                      initialValue: moment(),
                      rules: [{ required: true, message: '请选择结束时间' }],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="作业人员" label-col={{ span: 5 }} wrapper-col={{ span: 19 }}>
                <SmSystemUserSelect
                  axios={this.axios}
                  showUserTab={true}
                  height={50}
                  disabled={this.status == ModalStatus.View}
                  value={this.workUsers}
                  onChange={values => {
                    this.workUsers = values;
                    this.flatPlanDetails.map(item => {
                      item.maintenanceUserListIds = values;
                    });
                  }}
                />
              </a-form-item>
            </a-col>

            {this.status !== ModalStatus.View ? (
              <a-col sm={24} md={12}>
                <a-form-item label-col={{ span: 6 }} wrapper-col={{ span: 18, offset: 19 }}>
                  <a-button style="margin-right:20px;" type="primary" onClick={this.quicklyFish}>
                    一键完成
                  </a-button>
                </a-form-item>
              </a-col>
            ) : (
              undefined
            )}

            <a-col sm={24} md={24}>
              <a-table
                columns={this.columns}
                dataSource={this.flatPlanDetails}
                rowKey={record => record.id}
                scroll={{ y: 500 }}
                pagination={false}
                bordered
                {...{
                  scopedSlots: {
                    planCount: (text, record, index) => {
                      return text;
                    },
                    workCount: (text, record, index) => {
                      return (
                        <a-input-number
                          disabled={this.status == ModalStatus.View}
                          style="width: 100%;"
                          precision={3}
                          min={0}
                          max={record.planCount}
                          value={record.workCount}
                          onChange={value => {
                            record.workCount = value ? value : 0;
                          }}
                        />
                      );
                    },
                    maintenanceUserList: (text, record, index) => {
                      return (
                        <SmSystemUserSelect
                          axios={this.axios}
                          bordered={false}
                          showUserTab={true}
                          value={record.maintenanceUserListIds}
                          disabled={this.status == ModalStatus.View}
                          onChange={values => {
                            record.maintenanceUserListIds = values;
                          }}
                        />
                      );
                    },
                  },
                }}
              ></a-table>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    );
  },
};
