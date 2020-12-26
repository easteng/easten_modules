import ApiMaintenanceRecord from '../../sm-api/sm-cr-plan/MaintenanceRecord';
import * as utils from '../../_utils/utils';
import { requestIsSuccess } from '../../_utils/utils';
import moment from 'moment';
import { PageState } from '../../_utils/enum';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';

import "./style/index.less";

let apiMaintenanceRecord = new ApiMaintenanceRecord();
export default {
  name: 'SmCrPlanMaintenanceRecord',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
    organizationId: { type: String, default: null },
    equipmentId: { type: String, default: null },
    repairGroupId: { type: String, default: null },
    repairTagKey: { type: String, default: null }, //维修项标签
    equipType: { type: String, default: null },
    equipName: { type: String, default: null },
    equipModelNumber: { type: String, default: null },
    equipModelCode: { type: String, default: null },
    // maintenanceOrg: { type: String, default: null },
    installationSite: { type: String, default: null },
    // pageState: { type: String, default: PageState.Add }, // 页面状态
  },
  data() {
    return {
      iVisible: false,
      iOrganizationId: null,
      iEquipmentId: null,
      iRepairGroupId: null,
      iEquipType: null,
      iEquipName: null,
      iEquipModelNumber: null,
      iEquipModelCode: null,
      // iMaintenanceOrg: null,
      iInstallationSite: null,
      loading: false,
      foreData: [],
      record: [],
      pageSize: paginationConfig.defaultPageSize,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        skipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
        organizationId: null, //维护组织单元
        equipmentId: null, //设备类型
        repairGroupId: null, //设备名称/类别
        isAll: false,
        year: new Date().getFullYear(),
        month: undefined,
      },
      columns: [],
      listEle: [],
      showRecordType: 0,//记录展示方式 0列表 1表格
    };
  },

  computed: {},
  watch: {
    organizationId: {
      handler: function (value, oldValue) {
        this.iOrganizationId = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    equipmentId: {
      handler: function (value, oldValue) {
        this.iEquipmentId = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    repairGroupId: {
      handler: function (value, oldValue) {
        this.iRepairGroupId = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    equipType: {
      handler: function (value, oldValue) {
        this.iEquipType = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    equipName: {
      handler: function (value, oldValue) {
        this.iEquipName = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    equipModelNumber: {
      handler: function (value, oldValue) {
        this.iEquipModelNumber = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    equipModelCode: {
      handler: function (value, oldValue) {
        this.iEquipModelCode = value;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    // maintenanceOrg: {
    //   handler: function (value, oldValue) {
    //     this.iMaintenanceOrg = value;
    //   },
    //   immediate: true,
    // },
    installationSite: {
      handler: function (value, oldValue) {
        this.iInstallationSite = value;
        this.initAxios();
        this.refresh();
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
      apiMaintenanceRecord = new ApiMaintenanceRecord(this.axios);
    },

    //初始化计划列表
    async refresh(resetPage = true) {
      this.columns = [];
      this.listEle = [];
      this.foreData = [];
      this.record = [];
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.skipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      this.queryParams.organizationId = this.iOrganizationId;
      this.queryParams.equipmentId = this.iEquipmentId;
      this.queryParams.repairGroupId = this.iRepairGroupId;
      // console.log(this.queryParams);
      let response = await apiMaintenanceRecord.getMaintenanceRecord(this.queryParams, this.repairTagKey);
      if (requestIsSuccess(response)) {
        if (response.data.items.length > 0) {
          this.foreData = response.data.items;
          this.showRecord(this.showRecordType);
        }
        // this.record = response.data.items;
        this.totalCount = response.data.totalCount;

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

    //创建表格表头
    createColumns(data) {
      this.columns = [
        {
          title: '检修时间',
          dataIndex: 'col0',
          // width: 90,
          ellipsis: true,
          scopedSlots: { customRender: 'testResultCell' },
        },
      ];
      let colIndex = 0;
      data.recordDatas.map(item => {
        let group = {
          title: item.repairItem,
          // width: 100 * item.testItems.length,
          ellipsis: true,
          children: [],
        };
        for (let i = 0; i < item.testItems.length; i++) {
          const ele = item.testItems[i];
          let groupItem = {
            title: ele.repairTestItem,
            dataIndex: 'col' + ++colIndex,
            // width: 100,
            ellipsis: true,
            scopedSlots: { customRender: 'testResultCell' },
          };
          group.children.push(groupItem);
        }
        let groupItemRepair = {
          title: '检修人',
          dataIndex: 'col' + ++colIndex,
          // width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'testResultCell' },
        };
        group.children.push(groupItemRepair);
        let groupItemCheck = {
          title: '验收人',
          dataIndex: 'col' + ++colIndex,
          // width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'testResultCell' },
        };
        group.children.push(groupItemCheck);
        this.columns.push(group);
      });
      if (data.recordDatas.length == 0) {
        this.columns.push({
          title: "测试项",
          ellipsis: true,
          dataIndex: 'col1',
          scopedSlots: { customRender: 'testResultCell' },
        });
      }
      // console.log(this.columns);
    },

    //获取表格数据
    getData(items) {
      items.map(item => {
        let data = {};
        data.col0 = { text: moment(new Date(item.workOrderRealEndTime)).format('YYYY-MM-DD'), checkStatus: null, textType: 0, file: null };
        let index = 0;
        item.recordDatas.map(repairItem => {
          //测试项
          repairItem.testItems.map(testItem => {
            let propName = 'col' + ++index;
            let tmpTestRes = {
              text: testItem.testResult != null ? testItem.testResult : '',
              checkStatus: testItem.isQualified,
              testType: testItem.testType,
              file: testItem.file,
            };
            data[propName] = tmpTestRes;
          });
          //检修 验收
          let propNameTestUser = 'col' + ++index;
          data[propNameTestUser] = { text: repairItem.testUserName != null ? repairItem.testUserName : '', checkStatus: null, textType: 0, file: null };
          let propNameCheckUser = 'col' + ++index;
          data[propNameCheckUser] = { text: repairItem.checkUserName != null ? repairItem.checkUserName : '', checkStatus: null, textType: 0, file: null };
        });
        if (item.recordDatas.length == 0) {
          data.col1 = { text: '未关联测试项', checkStatus: null, textType: 0, file: null };
        }
        this.record.push(data);
      });
      // console.log(this.record);
    },

    //创建列表数据
    createList(data) {
      // console.log(data);
      data.map(record => {
        let testItem = [];
        record.recordDatas.map(item => {
          let tests = [];
          item.testItems.map(test => {
            tests.push(
              <a-list-item >
                <a-list-item-meta
                  title={test.repairTestItem}
                ></a-list-item-meta>
                {test.testType == 3 ?
                  (<div style="display: flex; align-items: center;">
                    <SmFileManageSelect
                      axios={this.axios}
                      value={test.file}
                      height={40}
                      disabled={true}
                      enableDownload={true}
                      bordered={false}
                    />
                    {test.isQualified != 2 ? (
                      test.isQualified == 1 ?
                        <span style="color:#00dc00; margin-left:10px">合格</span> :
                        null
                    ) : (<span style="color:red; margin-left:10px">不合格</span>)}
                  </div>
                  ) :
                  test.isQualified != 2 ? (
                    test.isQualified == 1 ?
                      <span style="color:#00dc00">{test.testResult}</span> :
                      <span>{test.testResult}</span>
                  ) : (
                    <span style="color:red">{test.testResult}</span>
                  )
                }
              </a-list-item>,
            );
          });
          testItem.push(
            <a-list item-layout="horizontal"  >
              <a-list-item >
                <a-list-item-meta
                  title={item.repairItem}
                >
                  <div slot="description">
                    <a-list size="small" bordered >
                      {tests}
                    </a-list>
                    <div>
                      <span>检修人：{item.testUserName}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
                      <span>验收人：{item.checkUserName}</span>
                    </div>
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>,
          );
        });
        if (record.recordDatas.length == 0) {
          testItem.push(
            <a-list item-layout="horizontal"  >
              <a-list-item >
                <a-list-item-meta title={"未关联测试项"}>
                </a-list-item-meta>
              </a-list-item>
            </a-list>,
          );
        }
        this.listEle.push(
          <a-descriptions-item label={moment(new Date(record.workOrderRealEndTime)).format('YYYY-MM-DD')} span={2}>
            {testItem}
          </a-descriptions-item>,
        );
      });
    },

    //创建记录
    showRecord(type) {
      this.columns = [];
      this.listEle = [];
      this.record = [];
      if (this.foreData.length > 0)
        if (type == 0) {//列表
          this.createList(this.foreData);
        } else if (type == 1)//表格
        {
          this.createColumns(this.foreData[0]);
          this.getData(this.foreData);
        }
    },

    onBack() {
      this.record = [];
      this.listEle = [];
      this.$emit('cancel', false);
    },
  },
  render() {
    let yearOptions = [];
    let maxYear = new Date().getFullYear() - 5;
    for (let i = maxYear; i < maxYear + 10; i++) {
      yearOptions.push(<a-select-option key={i}>{i}年</a-select-option>);
    }

    let monthOptions = [];
    for (let i = 1; i <= 12; i++) {
      monthOptions.push(<a-select-option key={i}>{i}月</a-select-option>);
    }

    return (
      <div class="sm-cr-plan-maintenance-record">
        <a-row gutter={24}>
          <a-col sm={24} md={24}>
            <a-form-item style="margin-bottom:0; float:right">
              <a-button type="default" style="margin-left:20px;" onClick={this.onBack}>
                返回
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>

        <a-descriptions bordered column={2}>
          <a-descriptions-item label="设备类型">
            <a-tooltip placement="bottomLeft" title={this.iEquipType}>
              <span class="info-span">{this.iEquipType}</span>
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item label="设备编码">
            <a-tooltip placement="bottomLeft" title={this.iEquipModelCode}>
              <span class="info-span">{this.iEquipModelCode}</span>
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item label="设备名称">
            <a-tooltip placement="bottomLeft" title={this.iEquipName}>
              <span class="info-span">{this.iEquipName}</span>
            </a-tooltip>
          </a-descriptions-item>
          {/* <a-descriptions-item label="维护单位">
            <a-tooltip placement="bottomLeft" title={this.iMaintenanceOrg}>
              <span class="info-span">{this.iMaintenanceOrg}</span>
            </a-tooltip>
          </a-descriptions-item> */}
          <a-descriptions-item label="设备型号">
            <a-tooltip placement="bottomLeft" title={this.iEquipModelNumber}>
              <span class="info-span">{this.iEquipModelNumber}</span>
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item label="安装地点">
            <a-tooltip placement="bottomLeft" title={this.iInstallationSite}>
              <span class="info-span">{this.iInstallationSite}</span>
            </a-tooltip>
          </a-descriptions-item>
          <a-descriptions-item label="显示方式">
            <a-select
              value={this.showRecordType}
              onChange={(val) => {
                this.showRecordType = val;
                this.showRecord(val);
              }}>
              <a-select-option value={0}>列表</a-select-option>
              <a-select-option value={1}>表格</a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="检修时间" span={2}>
            <span>
              <a-select
                value={this.queryParams.year}
                onChange={value => {
                  this.queryParams.year = value;
                  this.refresh();
                }}
              >
                {yearOptions}
              </a-select>
              <a-select
                allowClear={true}
                placeholder="月份"
                style="width:90px"
                value={this.queryParams.month}
                onChange={value => {
                  this.queryParams.month = value;
                  this.refresh();
                }}
              >
                {monthOptions}
              </a-select>
              <a-button type="primary" style="margin-left:20px;" onClick={this.refresh}>
                查询
              </a-button>
            </span>
          </a-descriptions-item>
          {this.showRecordType == 0 ?
            (this.listEle)
            : undefined}
        </a-descriptions >
        {this.showRecordType == 1 ? (
          <a-table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.record}
            pagination={false}
            // loading={this.loading}
            bordered
            size="middle"
            scroll={{ x: true }}
            {...{
              scopedSlots: {
                testResultCell: (text, record, index) => {
                  // console.log(text);
                  if (text.testType == 3) {
                    // console.log(text);
                    return <div style="display: flex; align-items: center;">
                      <SmFileManageSelect
                        axios={this.axios}
                        value={text.file}
                        height={40}
                        disabled={true}
                        enableDownload={true}
                        bordered={false}
                      />
                      {text.checkStatus != 2 ? (
                        text.checkStatus == 1 ?
                          <span style="color:#00dc00; margin-left:10px">合格</span> :
                          null
                      ) : (<span style="color:red; margin-left:10px">不合格</span>)}
                    </div>;
                  } else {
                    let ele = text.checkStatus != 2 ? (
                      text.checkStatus == 1 ?
                        <span style="color:#00dc00">{text}</span> :
                        <span>{text}</span>
                    ) : (<span style="color:red">{text}</span>);
                    return ele;
                  }
                },
              },
            }}
          ></a-table>
        ) : (
          undefined
        )}
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
        {this.loading ? (
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
