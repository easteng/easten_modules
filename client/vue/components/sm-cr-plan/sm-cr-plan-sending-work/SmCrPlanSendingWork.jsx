import './style';
import moment from 'moment';
import {
  DateReportType,
  SendWorkOperatorType,
  StandTestType,
  MemberType,
  RepairTagKeys,
} from '../../_utils/enum';
import * as utils from '../../_utils/utils';
import FileSaver from 'file-saver';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import SmSystemAllUserSelect from '../../sm-system/sm-system-member-modal';
import SmSystemUserSelect from '../../sm-system/sm-system-member-select';
import ApiWorkOrder from '../../sm-api/sm-cr-plan/WorkOrder';
import ApiAccount from '../../sm-api/sm-system/Account';

let apiWorkOrder = new ApiWorkOrder();
let apiAccount = new ApiAccount();

export default {
  name: 'SmCrPlanSendingWork',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    sendingWorkId: { type: String, default: null },//派工作业Id
    operatorType: { type: Number, default: SendWorkOperatorType.Add }, // 页面状态
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      iSendingWorkId: null,
      iOperatorType: SendWorkOperatorType.View,
      record: null, // 获取的数据库原始数据
      planDetailList: [], // 计划详细
      editFileRecord: null, // 要更新文件的测试项纪录
      dateRange: [moment(), moment()],
      fileModalIsVisible: false, //文件弹框是否弹出
      userSelectVisible: false,//用户选择框是否弹出
      maintenanceUserList: [],
    };
  },
  computed: {
    columns() {
      let arr = [
        {
          title: '设备名称/类别',
          dataIndex: 'deviceName',
          width: 130,
          ellipsis: true,
          customRender: (text, row, index) => {
            return {
              children: row.device.deviceName,
              attrs: { rowSpan: row.device.rowSpan },
            };
          },
        },
        {
          title: '设备型号/编号',
          dataIndex: 'equipmentName',
          width: 130,
          ellipsis: true,
          customRender: (text, row, index) => {
            return {
              children: row.equipment.equipmentName,
              attrs: { rowSpan: row.equipment.rowSpan },
            };
          },
        },
        {
          title: '年/月表',
          dataIndex: 'yearMonthPlanType',
          width: 90,
          customRender: (text, row, index) => {
            let strText = '';
            switch (row.yearMonth.yearMonthPlanType) {
            case DateReportType.Year:
              strText = '年表';
              break;
            case DateReportType.Month:
              strText = '月表';
              break;
            default:
              break;
            }
            return {
              children: strText,
              attrs: { rowSpan: row.yearMonth.rowSpan },
            };
          },
        },
        {
          title: '序号',
          dataIndex: 'number',
          width: 110,
          ellipsis: true,
        },
        {
          title: '工作内容',
          dataIndex: 'workContent',
          width: 650,
          scopedSlots: { customRender: 'workContent' },
        },
        {
          title: '作业数量',
          dataIndex: 'planCount',
          width: 90,
          ellipsis: true,
        },
        {
          title: '完成数量',
          dataIndex: 'workCount',
          width: 100,
          ellipsis: true,
          customRender: (text, row, index) => {
            return (
              <a-input-number
                disabled={
                  this.iOperatorType == SendWorkOperatorType.View ||
                  this.iOperatorType == SendWorkOperatorType.Acceptance
                }
                style="width:100%;"
                precision={3}
                min={0}
                max={row.planCount}
                // defaultValue={row.workCount = row.planCount}
                value={row.workCount}
                onChange={value => {
                  row.workCount = value ? value : 0;
                }}
              />
            );
          },
        },
        {
          title: '检修人',
          dataIndex: 'maintenanceUserList',
          width: 300,
          customRender: (text, row, index) => {
            return (
              <SmSystemUserSelect
                axios={this.axios}
                bordered={false}
                showUserTab={true}
                height={50}
                disabled={
                  this.iOperatorType == SendWorkOperatorType.View ||
                  this.iOperatorType == SendWorkOperatorType.Acceptance
                }
                value={row.maintenanceUserList}
                onChange={values => {
                  row.maintenanceUserList = values;
                }}
              />
            );
          },
        },
      ];

      if (this.iOperatorType != SendWorkOperatorType.Finish) {
        arr.push({
          title: '验收人',
          dataIndex: 'acceptanceUserList',
          width: 300,
          customRender: (text, row, index) => {
            return (
              <SmSystemUserSelect
                axios={this.axios}
                bordered={false}
                showUserTab={true}
                height={50}
                disabled={
                  this.iOperatorType == SendWorkOperatorType.View ||
                  this.iOperatorType == SendWorkOperatorType.Finish
                }
                value={row.acceptanceUserList}
                onChange={values => {
                  row.acceptanceUserList = values;
                }}
              />
            );
          },
        });
      }
      return arr;
    },
  },
  watch: {
    sendingWorkId: {
      handler: function (value, oldValue) {
        if (value) {
          this.iSendingWorkId = value;
          this.initAxios();
        } else {
          this.form.resetFields();
        }
      },
      immediate: true,
    },

    operatorType: {
      handler: function (value, oldValue) {
        if (value) {
          this.iOperatorType = value;
          this.initAxios();
        } else {
          this.form.resetFields();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
  },
  methods: {
    async initAxios() {
      apiWorkOrder = new ApiWorkOrder(this.axios);
      apiAccount = new ApiAccount(this.axios);
      await this.refresh();
    },
    async refresh() {
      this.record = null;
      let response = await apiWorkOrder.getDetail({ id: this.iSendingWorkId, repairTagKey: this.repairTagKey });
      if (utils.requestIsSuccess(response)) {
        this.record = response.data;
        this.dateRange = this.record ? [moment(this.record.startRealityTime), moment(this.record.endRealityTime)] : [moment(), moment()];
        // 解析计划详细列表数据
        this.resolverPlanDetailList2();
      }
    },

    // 解析计划详细列表数据
    resolverPlanDetailList() {
      if (this.record.planDetailList !== null && this.record.planDetailList.length > 0) {
        this.record.planDetailList.some((item, index) => {
          // 遍历设备名称/类别层
          if (item.jobContentEquipmentList === null || item.jobContentEquipmentList.length < 1) {
            let device = { deviceName: item.deviceName, rowSpan: 0 };
            let planDetail = this.initPlanDetailTemplate(`${index}`, device);
            this.planDetailList.push(planDetail);
          } else {
            item.jobContentEquipmentList.some((item2, index2) => {
              // 遍历设备型号/编号层
              if (item2.yearMonthDetailedList === null || item2.yearMonthDetailedList.length < 1) {
                let equipment = { equipmentName: item2.equipmentName, rowSpan: 0 };
                let device2 = { deviceName: item.deviceName, rowSpan: 0 };
                if (index2 === 0) {
                  device2.rowSpan = item.jobContentEquipmentList.length;
                }

                let planDetail = this.initPlanDetailTemplate(
                  `${index}-${index2}`,
                  device2,
                  equipment,
                );
                planDetail.equipmentId = item2.equipmentId;
                this.planDetailList.push(planDetail);
              } else {
                item2.yearMonthDetailedList.some((item3, index3) => {
                  // 遍历年/月表层
                  if (item3.planDetailedList == null || item3.planDetailedList.length < 1) {
                    let yearMonth = { yearMonthPlanType: item3.yearMonthPlanType, rowSpan: 0 };
                    let equipment2 = { equipmentName: item2.equipmentName, rowSpan: 0 };
                    let device3 = { deviceName: item.deviceName, rowSpan: 0 };
                    if (index3 === 0) {
                      equipment2.rowSpan = item2.yearMonthDetailedList.length;

                      if (index2 === 0) {
                        device3.rowSpan =
                          item2.yearMonthDetailedList.length * item.jobContentEquipmentList.length;
                      }
                    }

                    let planDetail = this.initPlanDetailTemplate(
                      `${index}-${index2}-${index3}`,
                      device3,
                      equipment2,
                      yearMonth,
                    );
                    planDetail.equipmentId = item2.equipmentId;
                    this.planDetailList.push(planDetail);
                  } else {
                    item3.planDetailedList.some((item4, index4) => {
                      // 遍历设备测试项结果
                      let yearMonth2 = { yearMonthPlanType: item3.yearMonthPlanType, rowSpan: 0 };
                      let equipment3 = { equipmentName: item2.equipmentName, rowSpan: 0 };
                      let device4 = { deviceName: item.deviceName, rowSpan: 0 };
                      if (index4 === 0) {
                        yearMonth2.rowSpan = item3.planDetailedList.length;

                        if (index3 === 0) {
                          equipment3.rowSpan =
                            item3.planDetailedList.length * item2.yearMonthDetailedList.length;
                          if (index2 === 0) {
                            device4.rowSpan =
                              item3.planDetailedList.length *
                              item2.yearMonthDetailedList.length *
                              item.jobContentEquipmentList.length;
                          }
                        }
                      }
                      let planDetail = this.initPlanDetailTemplate(
                        `${index}-${index2}-${index3}-${index4}`,
                        device4,
                        equipment3,
                        yearMonth2,
                      );

                      planDetail.equipmentId = item2.equipmentId;
                      planDetail.relatedEquipmentId = item4.id; // 管理设备Id
                      planDetail.planDetailedId = item4.planDetailedId;
                      planDetail.number = item4.number;
                      planDetail.workContent = item4.workContent;

                      planDetail.planCount = item4.planCount;
                      planDetail.workCount = item4.workCount;
                      planDetail.maintenanceUserList = item4.maintenanceUserList.map(
                        user => {
                          return {
                            id: user.userId,
                            type: MemberType.User,
                          };
                        },
                      ); // 保存检修人Id数组
                      planDetail.acceptanceUserList = item4.acceptanceUserList.map(
                        user => {
                          return {
                            id: user.userId,
                            type: MemberType.User,
                          };
                        },
                      ); // 保存验收人Id数组

                      // 初始化验收结果为合格
                      if (item4.equipmentTestResultList.length > 0) {
                        planDetail.equipmentTestResultList = item4.equipmentTestResultList;
                      }

                      this.planDetailList.push(planDetail);
                    });
                  }
                });
              }
            });
          }
        });
      }
    },
    resolverPlanDetailList2() {
      this.planDetailList = [];
      // 遍历设备名称/类别层
      this.record.planDetailList.some((item, index) => {
        // 遍历设备型号/编号层
        let deviceRowSpan = 0;
        item.jobContentEquipmentList.map(jobContentEquipment => {
          jobContentEquipment.yearMonthDetailedList.map(yearMonthDetailed => {
            return deviceRowSpan += yearMonthDetailed.planDetailedList.length;
          });
        });
        item.jobContentEquipmentList.some((item2, index2) => {
          // 遍历年/月表层
          let equipmentRowSpan = 0;// 设备型号/编号合并行数
          item2.yearMonthDetailedList.map(yearMonthDetailed => {
            return equipmentRowSpan += yearMonthDetailed.planDetailedList.length;
          });
          item2.yearMonthDetailedList.some((item3, index3) => {
            // 遍历详细计划
            item3.planDetailedList.some((item4, index4) => {
              let yearMonth = { yearMonthPlanType: item3.yearMonthPlanType, rowSpan: 0 };
              let equipment = { equipmentName: item2.equipmentName, rowSpan: 0 };
              let device = { deviceName: item.deviceName, rowSpan: 0 };

              if (index4 === 0) yearMonth.rowSpan = item3.planDetailedList.length;
              if (index4 === 0 && index3 === 0) equipment.rowSpan = equipmentRowSpan;
              if (index4 === 0 && index3 === 0 && index2 === 0) device.rowSpan = deviceRowSpan;

              let planDetail = this.initPlanDetailTemplate(
                `${index}-${index2}-${index3}-${index4}`,
                device,
                equipment,
                yearMonth,
              );

              planDetail.equipmentId = item2.equipmentId;
              planDetail.relatedEquipmentId = item4.id; // 管理设备Id
              planDetail.planDetailedId = item4.planDetailedId;
              planDetail.number = item4.number;
              planDetail.workContent = item4.workContent;
              planDetail.planCount = item4.planCount;
              planDetail.workCount = this.operatorType == SendWorkOperatorType.Finish ? item4.workCount != 0 ? item4.workCount : item4.planCount : item4.workCount;//初始化完成数量等于作业数量
              planDetail.maintenanceUserList = item4.maintenanceUserList.map(
                user => {
                  return {
                    id: user.userId,
                    type: MemberType.User,
                  };
                },
              ); // 保存检修人Id数组
              planDetail.acceptanceUserList = item4.acceptanceUserList.map(
                user => {
                  return {
                    id: user.userId,
                    type: MemberType.User,
                  };
                },
              ); // 保存验收人Id数组

              // 初始化验收结果为合格

              planDetail.equipmentTestResultList = item4.equipmentTestResultList;
              planDetail.equipmentTestResultList.map(item => {
                if (item.predictedValue !== null) {
                  item.testResult = item.testResult != null ? item.testResult : '合格';

                } else {
                  item.testResult = item.testResult != null ? item.testResult : '完成';
                }
              });
              this.planDetailList.push(planDetail);
            });
          });
        });
      });

    },

    // 初始化计划详细对象
    initPlanDetailTemplate(id, device, equipment, yearMonth) {
      return {
        id: id,
        device: device || {},
        equipmentId: null,
        equipment: equipment || {},
        yearMonth: yearMonth || {},
        relatedEquipmentId: null,
        planDetailedId: null,
        number: 0,
        workContent: 'workContent',
        isShorten: true,
        planCount: 0,
        workCount: 0,
        maintenanceUserList: [],
        acceptanceUserList: [],
        equipmentTestResultList: [],
      };
    },

    //设置时间禁选项
    disabledDate(current) {
      return (
        current <=
        moment(this.record.startRealityTime)
          .subtract(1, 'month')
          .endOf('month') ||
        current >=
        moment(this.record.startRealityTime)
          .add(1, 'month')
          .startOf('month')
      );
    },

    // 组建保存时的设备列表实例集合
    getEquipmentList() {
      let equipmentList = [];
      this.planDetailList.some((item, index) => {
        let equipment = {
          id: item.relatedEquipmentId, //关联设备ID
          planCount: item.planCount,
          workCount: item.workCount,
          repairTagKey: this.repairTagKey,
        };
        equipment.maintenanceUserList = item.maintenanceUserList ? item.maintenanceUserList.map(item => item.id) : [];
        equipment.acceptanceUserList = item.acceptanceUserList ? item.acceptanceUserList.map(item => item.id) : [];
        equipment.equipmentTestResultList = item.equipmentTestResultList.map(result => {
          return {
            id: result.id,
            testResult: result.testResult,
            checkResult: result.checkResult,
            fileId: result.file ? result.file.id : null,
          };
        });

        equipmentList.push(equipment);
      });

      return equipmentList;
    },

    // 一键验收
    async allAcceptanced() {
      let response = await apiAccount.getAppConfig();
      let checkUserId = undefined;

      if (utils.requestIsSuccess(response)) {
        checkUserId = response.data.currentUser.id;
      }
      this.planDetailList.some(item => {
        item.acceptanceUserList = [];//赋空
        item.acceptanceUserList.push({ id: checkUserId, type: MemberType.User });

        item.equipmentTestResultList.some(result => {
          result.checkResult = '合格';
        });
      });
    },
    //一键检修
    allRepair(value) {
      this.maintenanceUserList = value;
      //对表格中的检修人进行赋值
      this.planDetailList.map(item => {
        item.maintenanceUserList = value;
      });
    },
    // 保存
    async save(isSave) {
      let response = null;
      let equipmentList = this.getEquipmentList();
      if (this.iOperatorType == SendWorkOperatorType.Finish) {
        // 完成逻辑
        let data = {
          id: this.record.id,
          startRealityTime: this.dateRange[0].format(),
          endRealityTime: this.dateRange[1].format(),
          orderNo: this.record.orderNo,
          feedback: this.record.feedback,
          equipmentList: equipmentList,
        };
        response = await apiWorkOrder.finish(isSave, false, data, this.repairTagKey);
      } else if (this.iOperatorType == SendWorkOperatorType.Acceptance) {
        // 验收逻辑
        let data = {
          id: this.record.id,
          equipmentList: equipmentList,
        };
        response = await apiWorkOrder.acceptance(isSave, data, this.repairTagKey);
      } else if (this.iOperatorType == SendWorkOperatorType.Edit) {
        // 编辑逻辑
        let data = {
          id: this.record.id,
          startRealityTime: this.record.startRealityTime,
          endRealityTime: this.record.endRealityTime,
          orderNo: this.record.orderNo,
          feedback: this.record.feedback,
          equipmentList: equipmentList,
        };
        response = await apiWorkOrder.updateDetail(data, this.repairTagKey);
      }

      if (utils.requestIsSuccess(response)) {
        if (isSave) {
          if (this.iOperatorType == SendWorkOperatorType.Edit && response.data.finishInfos.length > 0) {
            let content = [];
            const h = this.$createElement;
            let _this = this;
            response.data.finishInfos.map(i => {
              content.push(<p>{i.content}</p>);
            });
            console.log(content);
            this.$info({
              title: '部分完成数量已被自动修改',
              width: "600px",
              content: (
                <div>
                  {content}
                </div>),
              onOk() {
                _this.$message.success('保存成功');
              },
            });
          } else
            this.$message.success('保存成功');
        }
        else this.close();
      }
    },

    // 导出
    async export() {
      let response = await apiWorkOrder.export(this.record.id, true, this.repairTagKey);
      if (utils.requestIsSuccess(response)) {
        let fileName = '';
        if (this.repairTagKey == RepairTagKeys.RailwayWired) {
          fileName = '一单两表.xlsx';
        } else if (this.repairTagKey == RepairTagKeys.RailwayHighSpeed) {
          fileName = '检修表.xlsx';
        }
        FileSaver.saveAs(new Blob([response.data], { type: 'application/vnd.ms-excel' }), fileName);
      }
    },

    // 取消
    close() {
      this.$emit('cancel');
    },

  },
  render() {
    // scroll={{ x: 'calc(800px + 60%)', y: 600 }}
    let planDetailTable = (
      <a-table
        columns={this.columns}
        rowKey={record => record.id}
        data-source={this.planDetailList}
        bordered
        pagination={false}
        scroll={{ x: 'calc(~"100% - 40px")', y: 600 }}
        {...{
          scopedSlots: {
            workContent: (text, record, index) => {
              return (
                <div class="test-result">
                  <div class="test-content">
                    <a-icon
                      type={record.isShorten ? 'down' : 'up'}
                      onClick={() => {
                        record.isShorten = !record.isShorten;
                      }}
                    />
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        <span >{text}</span>
                      </template>
                      <span class="test-content-span">{text}</span>
                    </a-tooltip>
                    {/* <span class="test-content-span">{text}</span> */}
                  </div>
                  <a-table
                    v-show={!record.isShorten}
                    pagination={false}
                    rowKey={record => record.id}
                    data-source={record.equipmentTestResultList}
                    columns={[
                      {
                        title: '测试项目',
                        dataIndex: 'testName',
                        width: 100,
                        ellipsis: true,
                      },
                      {
                        title: '检修记录',
                        dataIndex: 'testResult',
                        width: 250,
                        customRender: (text, record, index) => {
                          let item;
                          if (record.testType === StandTestType.Excel) {
                            if (record.uploadFile === null) item = <div></div>;
                            else {
                              item = (
                                <SmFileManageSelect
                                  ref="SmFileManageSelect"
                                  axios={this.axios}
                                  bordered={this.iOperatorType == SendWorkOperatorType.Finish ? true : false}
                                  multiple={false}
                                  height={40}
                                  disabled={
                                    this.iOperatorType == SendWorkOperatorType.View ||
                                    this.iOperatorType == SendWorkOperatorType.Acceptance
                                  }
                                  enableDownload={true}
                                  value={record.file ? record.file : {}}
                                  onChange={value => {
                                    record.file = value;
                                  }}
                                />
                              );
                            }
                          } else if (record.predictedValue && record.predictedValue.length > 0) {
                            item = (
                              <a-select
                                disabled={
                                  this.iOperatorType == SendWorkOperatorType.View ||
                                  this.iOperatorType == SendWorkOperatorType.Acceptance
                                }
                                // defaultValue={record.predictedValue[0]}
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
                                disabled={
                                  this.iOperatorType == SendWorkOperatorType.View ||
                                  this.iOperatorType == SendWorkOperatorType.Acceptance
                                }
                                value={record.testResult}
                                onInput={event => {
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
                      {
                        title: '验收记录',
                        dataIndex: 'checkResult',
                        width: 250,
                        customRender: (text, record, index) => {
                          return (
                            <a-select
                              disabled={
                                this.iOperatorType == SendWorkOperatorType.View ||
                                this.iOperatorType == SendWorkOperatorType.Finish
                              }
                              value={record.checkResult}
                              onChange={value => {
                                record.checkResult = value;
                              }}
                            >
                              <a-select-option value="合格">合格</a-select-option>
                              <a-select-option value="不合格">不合格</a-select-option>
                            </a-select>
                          );
                        },
                      },
                    ]}
                  />
                </div>
              );
            },
          },
        }}
      />
    );
    return (
      <div class="sm-cr-plan-sending-work">
        {/* 表单区 */}
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={12}>
              <a-form-item label="作业组长" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input disabled value={this.record ? this.record.workLeader.userName : ''} />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="作业成员" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled
                  value={
                    this.record
                      ? this.record.workMemberList.map(user => user.userName).toString()
                      : ''
                  }
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="驻站联络人员" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled
                  value={
                    this.record
                      ? this.record.stationLiaisonOfficerList.map(user => user.userName).toString()
                      : ''
                  }
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="现场联系人员" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>

                <a-input
                  disabled
                  value={
                    this.record
                      ? this.record.fieldGuardList.map(user => user.userName).toString()
                      : ''
                  }
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="计划作业时间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-range-picker
                  style="width: 100%"
                  allowClear={false}
                  disabled
                  value={[
                    this.record && this.record.startPlanTime ? moment(this.record.startPlanTime, 'YYYY-MM-DD HH:mm:ss') : null,
                    this.record && this.record.endPlanTime ? moment(this.record.endPlanTime, 'YYYY-MM-DD HH:mm:ss') : null,
                  ]}
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={(date, dateStrings) => {
                    this.record.startPlanTime = dateStrings[0];
                    this.record.endPlanTime = dateStrings[1];
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="实际作业时间" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-range-picker
                  style="width: 100%"
                  disabled={
                    this.iOperatorType == SendWorkOperatorType.View ||
                    this.iOperatorType == SendWorkOperatorType.Acceptance
                  }
                  allowClear={false}
                  showTime
                  value={this.dateRange}
                  onChange={value => {
                    this.dateRange = value;
                  }}
                  disabled-date={this.disabledDate}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="影响范围" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input disabled value={this.record ? this.record.influenceScope : ''} />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="命令票号" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
                <a-input
                  disabled={
                    this.iOperatorType == SendWorkOperatorType.View ||
                    this.iOperatorType == SendWorkOperatorType.Acceptance
                  }
                  value={this.record ? this.record.orderNo : ''}
                  onChange={event => {
                    this.record.orderNo = event.target.value;
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="完成情况" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-textarea
                  disabled={
                    this.iOperatorType == SendWorkOperatorType.View ||
                    this.iOperatorType == SendWorkOperatorType.Acceptance
                  }
                  value={this.record ? this.record.feedback : ''}
                  onChange={event => {
                    this.record.feedback = event.target.value;
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="计划内容" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-button
                  type="primary"
                  style="float: right;margin-bottom: 10px;z-index: 1;"
                  v-show={this.iOperatorType == SendWorkOperatorType.Acceptance}
                  onClick={() => {
                    this.allAcceptanced();
                  }}
                >
                  一键验收
                </a-button>

                <a-button
                  style=""
                  type="primary"
                  style="float: right;margin-bottom: 10px;z-index: 1;margin-right:20px;"
                  v-show={this.iOperatorType == SendWorkOperatorType.Finish}
                  onClick={
                    () => {
                      this.userSelectVisible = true;
                    }
                  }
                >
                  一键完成
                </a-button>
                <SmSystemAllUserSelect
                  axios={this.axios}
                  visible={this.userSelectVisible}
                  showUserTab={true}
                  selected={this.maintenanceUserList}
                  onChange={iValue => {
                    this.userSelectVisible = iValue;
                  }}
                  onOk={value => {
                    this.allRepair(value);
                  }}
                />
                {/* 计划内容展示区 */}
                {planDetailTable}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div style="float: right;padding-top: 10px;">
          <a-button
            type="primary"
            style="margin-right: 20px"
            v-show={this.iOperatorType != SendWorkOperatorType.View}
            onClick={() => {
              this.save(true);
            }}
          >
            保存
          </a-button>
          <a-button
            type="primary"
            style="margin-right: 20px"
            v-show={
              this.iOperatorType == SendWorkOperatorType.Finish ||
              this.iOperatorType == SendWorkOperatorType.Acceptance
            }
            onClick={() => {
              this.save(false);
            }}
          >
            提交
          </a-button>
          <a-button
            type="primary"
            style="margin-right: 20px"
            v-show={this.iOperatorType != SendWorkOperatorType.View}
            onClick={this.export}
          >
            导出检修表
          </a-button>
          <a-button onClick={this.close}>取消</a-button>
        </div>
      </div>
    );
  },
};
