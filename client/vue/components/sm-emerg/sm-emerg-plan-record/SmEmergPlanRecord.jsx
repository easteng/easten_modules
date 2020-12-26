import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, objFilterProps } from '../../_utils/utils';
import ApiEmergPlan from '../../sm-api/sm-emerg/EmergPlan';
import ApiFault from '../../sm-api/sm-emerg/Fault';
import ApiEmergPlanRecord from '../../sm-api/sm-emerg/EmergPlanRecord';
import ComponentCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import './style/index.less';

let apiEmergPlan = new ApiEmergPlan();
let apiFault = new ApiFault();
let apiEmergPlanRecord = new ApiEmergPlanRecord();


const faultFormFields = [
  'organizationId', //车间工区organizationId
  'railwayId',  //所属路线
  'stationId',  //车站区间
  'faultRltComponentCategories',  //关联构件
  'faultRltEquipments', //关联设备
  'equipmentNames', //设备名称
  'summary',  //故障概述
  'levelId',  //故障等级ID   LevelId
  'content', //故障详情
  'abnormal', //监测异常
  'reasonTypeId', //原因分类id
  'reason', //原因分析
  'weatherDetail', //天气详情
  'temperatureGap', //温差-存最低和最高
  'disposeProcess', //处理过程
  'disposePersons', //处理人
  'remark', //备注
  'checkInTime',  //故障时间
  'checkOutTime', //销记时间

];
const recordFormFields = [
  'name',
  'componentCategoryIds',
  'fileIds',
  'summary',
  'levelId',
  'remark',
  'flow',
  'content',
  'id',
];

export default {
  name: 'SmEmergPlanRecord',
  props: {
    axios: { type: Function, default: null },
    idFault: { type: String, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      emergPlanData: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        keywords: null, // 名称搜索
        compoentCategoryIds: [], //构件分类
        maxResultCount: paginationConfig.defaultPageSize,
        levelId: undefined, //预案等级
      },
    };
  },

  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '预案名称',
          dataIndex: 'name',
          ellipsis: true,
        },

        {
          title: '预案摘要',
          dataIndex: 'summary',
          ellipsis: true,
        },
        {
          title: '构件分类',
          dataIndex: 'emergPlanRltComponentCategories',
          scopedSlots: { customRender: 'compoentCategories' },
          ellipsis: true,
        },
        {
          title: '主要附件',
          dataIndex: 'emergPlanRltFiles',
          scopedSlots: { customRender: 'files' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: '140px',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },

  watch: {
    idFault: {
      handler: function (value, oldValue) {
        if (value) {
          this.refresh();
        } else {
          this.form.resetFields();
        }
      },
      immediate: true,
    },
  },

  async created() {
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiEmergPlan = new ApiEmergPlan(this.axios);
      apiEmergPlanRecord = new ApiEmergPlanRecord(this.axios);
      apiFault = new ApiFault(this.axios);
    },
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = {
        keywords: this.queryParams.keywords, // 名称搜索
        componentCategoryIds: this.queryParams.compoentCategoryIds.map(item => item), //构件分类
        levelId: this.queryParams.levelId, //预案等级
        maxResultCount: paginationConfig.defaultPageSize,
        maxResultCount: this.queryParams.maxResultCount,
      };

      let response = await apiEmergPlan.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data.items) {
        this.emergPlanData = response.data.items;
        this.totalCount = response.data.totalCount;
      }
      this.loading = false;
    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
    //调用
    async invoke(record) {
      let _this = this;
      let response = await apiFault.get(_this.idFault);

      if (requestIsSuccess(response) && response.data) {
        this.$confirm({
          content: h => <div>您确定要调用此预案吗？调用后不可更改！</div>,
          okType: 'primary',
          onOk() {
            return new Promise(async (resolve, reject) => {
              let faults = { ...response.data }; //故障信息
              let faultValues = objFilterProps(faults, faultFormFields); //过滤掉多余故障信息
              let _data = { id: _this.idFault, emergPlanRecordId: record.id, ...faultValues }; //故障数据

              let _record = JSON.parse(JSON.stringify(record)); //创建预案记录新数据转json
              let recordValues = {
                ..._record,
                componentCategoryIds: _record.emergPlanRltComponentCategories.map(item => item.componentCategoryId),
                fileIds: _record.emergPlanRltFiles.map(item => item.fileId),
              };
              let data = objFilterProps(recordValues, recordFormFields);

              let recordResponse = await apiEmergPlanRecord.create(data);
              if (requestIsSuccess(recordResponse)) {
                let faultResponse = await apiFault.update(_data);
                if (requestIsSuccess(recordResponse) && requestIsSuccess(faultResponse)) {
                  _this.refresh(false);
                  _this.$message.success('调用成功');
                  setTimeout(resolve, 100);
                } else {
                  setTimeout(reject, 100);
                }
              }

            });
          },
        });
      }

    },

    //详情
    view(record) { },

  },
  render() {
    return (
      <div class="SmEmergPlanRecord">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              keywords: null,
              compoentCategoryIds: [],
              levelId: undefined,
            };
            this.refresh();
          }}
        >
          <a-form-item label="关键字">
            <a-input
              placeholder="请输入关键字"
              value={this.queryParams.keywords}
              onInput={value => {
                this.queryParams.keywords = value.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="构件分类">
            <ComponentCategoryTreeSelect
              axios={this.axios}
              placeholder="请选择"
              treeCheckable={true}
              treeCheckStrictly={true}
              value={this.queryParams.compoentCategoryIds}
              onChange={value => {
                this.queryParams.compoentCategoryIds = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="预案等级">
            <DataDictionaryTreeSelect
              axios={this.axios}
              groupCode={'EMERG_LEVEL'}
              value={this.queryParams.level}
              onInput={value => {
                this.queryParams.levelId = value;
                this.refresh();
              }}
            />
          </a-form-item>

        </sc-table-operator>
        {/* 表格展示 */}
        <a-table
          columns={this.columns}
          dataSource={this.emergPlanData}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={false}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              compoentCategories: (text, record, index) => {
                let result = '';
                record.emergPlanRltComponentCategories.map(
                  (item, index) =>
                    (result += `${index == 0 ? '' : '，'}${item.componentCategory.name}`),
                );
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              files: (text, record, index) => {
                return record.emergPlanRltFiles.length !== 0 ? (
                  <SmFileManageSelect
                    axios={this.axios}
                    enableDownload={true}
                    disabled={true}
                    bordered={false}
                    value={record.emergPlanRltFiles.map(item => item.file)}
                  />
                ) : (
                  ''
                );
              },
              operations: (text, record, index) => {
                return [
                  <span>
                    <a
                      onClick={() => {
                        this.view(record);
                      }}
                    >
                      详情
                    </a>
                    <a-divider type="vertical" />

                    <a
                      onClick={() => {
                        this.invoke(record);
                      }}
                    >
                      调用
                    </a>

                  </span>,
                ];
              },
            },
          }}
        ></a-table>
     
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
  
      </div>
    );
  },
};
