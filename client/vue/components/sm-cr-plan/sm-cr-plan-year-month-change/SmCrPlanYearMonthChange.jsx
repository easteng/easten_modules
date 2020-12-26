import ApiYearMonthPlan from '../../sm-api/sm-cr-plan/YearMonthPlan';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import {
  requestIsSuccess,
  getRepairTypeTitle,
  getYearMonthPlanStateType,
} from '../../_utils/utils';
import SmCrPlanYearMonthChangeModal from './SmCrPlanYearMonthChangeModal';
import { RepairType, YearMonthPlanType, YearMonthPlanState } from '../../_utils/enum';
import FileSaver from 'file-saver';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import SmImport from '../../sm-import/sm-import-basic';

let apiYearMonthPlan = new ApiYearMonthPlan();

export default {
  name: 'SmCrPlanYearMonthChange',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    planType: { type: Number, default: YearMonthPlanType.Month }, //年月表类型
    orgName: { type: String, default: null },
    orgId: { type: String, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      file: {},
      isLoading: false, //加载框
      fileList: [],
      dataSource: [],
      isCanCreate: false, //是否可以添加
      isCanImport: false, //是否可以导入
      isCanExport: true, //是否可以导出
      isCanDele: true, //是否可以删除
      queryParams: {
        fileName: null,
        fileId: null,
        orgId: this.orgId,
        planType: this.planType,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        remark: null, //变更原因
      },
      form: this.$form.createForm(this),
    };
  },
  computed: {
    planCol() {
      if (this.planType == YearMonthPlanType.Month) {
        let arr = [];
        arr.push({
          title: '每月次数',
          width: 100,
          dataIndex: 'times',
          scopedSlots: { customRender: 'times' },
        });
        for (let i = 1; i <= 31; i++) {
          arr.push({
            title: i,
            width: 100,
            dataIndex: `col_${i}`,
          });
        }
        return arr;
      } else {
        //年表列
        return [
          {
            title: '年计划数量',
            width: 150,
            dataIndex: 'planCount',
            scopedSlots: { customRender: 'planCount' },
          },
          {
            title: '每年次数',
            width: 150,
            dataIndex: 'times',
            scopedSlots: { customRender: 'times' },
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
        ];
      }
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
          title: '总数量',
          width: 100,
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' },
        },
        ...this.planCol,
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
  },
  methods: {
    addData() {
      this.$refs.SmCrPlanYearMonthChangeModal.add(this.planType);
    },
    async remove(record) {
      //删除数据
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiYearMonthPlan.deletePlanAtler(record.id, _this.repairTagKey);
            _this.refresh();

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    async fileSelected(file) {

      if (file.size > 1024 * 1024 * 10) {
        this.$message.error('上传的文件不能大于10M');
        return false;
      }

      let importParamter = {
        'file.file': file,
        'importKey': 'yearMonthChange',
        'planType': this.queryParams.planType,
        'orgId': this.queryParams.orgId,
        'RepairTagKey': this.repairTagKey,
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
    },

    async export(record) {
      //导出按钮
      this.isLoading = true;
      let response = await apiYearMonthPlan.downLoadChange(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        FileSaver.saveAs(
          new Blob([response.data], { type: 'application/vnd.ms-excel' }),
          `${this.queryParams.year}年${this.orgName +
          (this.planType == YearMonthPlanType.Year ? '年表' : '月表')}变更计划.xlsx`,
        );
      }
      this.isLoading = false;
    },
    async subimt() {
      //提交审核
      let _this = this;
      this.$confirm({
        title: '重要提示',
        content: h => <div style="color:red;">确认要提交审核！</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            _this.isLoading = true;
            let response = await apiYearMonthPlan.submitChangeForExam(_this.queryParams, _this.repairTagKey);
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
      this.isLoading = true;
      let response = await apiYearMonthPlan.getOwnsChangPlan(this.queryParams, this.repairTagKey);
      this.isLoading = false;
      if (requestIsSuccess(response)) {
        this.dataSource = response.data;
        //显示审核状态
        if (this.dataSource.length > 0) {
          let item = this.dataSource[0];
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
        this.isCanDele = false;
        if (this.dataSource.length > 0) {
          this.isCanExport = false;
          let firstModel = this.dataSource[0];
          if (
            !(
              firstModel.state == YearMonthPlanState.UnCommit ||
              firstModel.state == YearMonthPlanState.UnPassed
            )
          ) {
            //生成按钮
            this.isCanCreate = true;
            this.isCanImport = true;
            this.isCanDele = true;
            this.queryParams.fileName = firstModel.fileName;
            this.queryParams.month = firstModel.execMonth;
            this.queryParams.remark = firstModel.changeReason;
          }
        } else {
          this.isCanImport = true;
        }
      }
    },
  },
  render() {
    //月份
    let monthOption = [];
    for (let i = new Date().getMonth() + 1; i <= 12; i++) {
      monthOption.push(<a-select-option key={i}>{i}月</a-select-option>);
    }
    return (
      <div>
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={12}>
              <a-form-item label="变更原因" label-col={{ span: 3 }} wrapper-col={{ span: 21 }}>
                <a-textarea
                  rows="3"
                  disabled={this.isCanCreate}
                  placeholder="请输入变更原因！"
                  value={this.queryParams.remark}
                  onInput={event => {
                    this.queryParams.remark = event.target.value;
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="文件上传" label-col={{ span: 3 }} wrapper-col={{ span: 21 }}>
                {/* <a-input disabled={true} placeholder="上传文件" value={this.queryParams.fileName} />
                <a-button
                  disabled={this.isCanCreate}
                  onClick={() => {
                    this.$refs.SmFileManageModel.view();
                  }}
                >
                  上传文件
                </a-button> */}
                <SmFileManageSelect
                  disabled={this.isCanCreate}
                  axios={this.axios}
                  multiple={false}
                  height={77}
                  placeholder={this.isCanCreate ? '' : '请上传文件'}
                  enableDownload={true}
                  value={this.file}
                  onChange={value => {
                    if (value.type === '.xlsx' || value.type === '.xls') {
                      this.file = value;
                      this.queryParams.fileName = this.file.name;
                      this.queryParams.fileId = this.file.id;
                    } else {
                      this.file = {};
                      this.$message.error('文件格式不正确，请重新上传文件!');
                    }
                  }}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label="执行时间" label-col={{ span: 3 }} wrapper-col={{ span: 21 }}>
                <a-select
                  disabled={this.isCanCreate}
                  placeholder="请选择月份！"
                  style="width:100%"
                  axios={this.axios}
                  value={this.queryParams.month}
                  onChange={value => {
                    this.queryParams.month = value;
                    this.refresh();
                  }}
                >
                  {monthOption}
                </a-select>
              </a-form-item>
            </a-col>

            <a-col sm={24} md={12}>
              <a-form-item label-col={{ span: 3 }} wrapper-col={{ span: 21, offset: 13 }}>
                <a-button
                  type="primary"
                  icon="plus"
                  onClick={this.addData}
                  disabled={this.isCanCreate}
                >
                  添加
                </a-button>
                <a-button
                  type="primary"
                  icon="download"
                  style="margin-left:10px;"
                  onClick={this.export}
                  disabled={this.isCanExport}
                >
                  导出
                </a-button>
                <SmImport
                  style="display: inline;margin-left: 10px;"
                  isImport={this.isCanImport}
                  ref="smImport"
                  url='api/app/crPlanYearMonthPlan/uploadChange'
                  axios={this.axios}
                  importKey="yearMonthChange"
                  repairTagKey={this.repairTagKey}
                  downloadErrorFile={true}
                  onSelected={file => this.fileSelected(file)}
                  onIsSuccess={() => this.refresh()}
                >
                </SmImport>
                {this.dataSource.length > 0 ? (
                  <a-tag
                    style="margin-left:40px;height:32px;line-height:30px"
                    color={this.examColor}
                  >
                    {this.examStr}
                  </a-tag>
                ) : null}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-table
          columns={this.columns}
          dataSource={this.dataSource}
          rowKey={record => record.id}
          pagination={false}
          scroll={{ x: 1300, y: 500 }}
          {...{
            scopedSlots: {
              finishedCount: (text, record) => {
                return (
                  <a-input-number
                    style="margin: -10px 0"
                    min={0}
                    value={record.finishedCount}
                    onChange={value => {
                      record.finishedCount = value;
                      console.log(value);
                      // this.onChange(value, record.id, 'finishedCount');
                    }}
                  />
                );
              },
              index: (text, record, index) => {
                return index + 1;
              },
              repairTypeStr: (text, record) => {
                return getRepairTypeTitle(record.repairType);
              },
              operations: (text, record) => {
                return [
                  <a-divider type="vertical" />,
                  <a
                    disabled={this.isCanDele}
                    onClick={() => {
                      this.remove(record);
                    }}
                  >
                    删除
                  </a>,
                ];
              },
            },
          }}
        ></a-table>
        <a-form-item>
          <div style="float:right;margin-top:8px">
            <a-button type="primary" onClick={this.subimt} disabled={this.isCanImport}>
              <a-icon type="audit" />
              提交
            </a-button>
            <a-button
              type="primary"
              style="margin-left: 5px;"
              onClick={() => {
                this.$emit('cancel');
              }}
            >
              <a-icon type="rollback" />
              返回
            </a-button>
          </div>
        </a-form-item>
        <SmCrPlanYearMonthChangeModal
          ref="SmCrPlanYearMonthChangeModal"
          axios={this.axios}
          planType={this.planType}
          orgId={this.orgId}
          repairTagKey={this.repairTagKey}
          installationSiteId={this.installationSiteId}
          bordered={this.bordered}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        {/* <SmFileManageModel
          ref="SmFileManageModel"
          axios={this.axios}
          onSelected={value => {
            this.queryParams.fileName = value[0].name;
            this.queryParams.fileId = value[0].id;
          }}
        /> */}
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
