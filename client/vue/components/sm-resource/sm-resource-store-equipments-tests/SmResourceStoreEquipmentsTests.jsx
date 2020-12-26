import { requestIsSuccess, getStoreEquipmentTestPassed, vIf, vP } from '../../_utils/utils';
import permissionsSmResource from '../../_permissions/sm-resource';
import { StoreEquipmentTestState } from '../../_utils/enum';
import { pagination as paginationConfig } from '../../_utils/config';
import moment from 'moment';
import ApiStoreEquipmentTest from '../../sm-api/sm-resource/StoreEquipmentTest';
import StoreHouseTreeSelect from '../sm-resource-store-house-tree-select'; //仓库的树结构
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
let apiStoreEquipmentTest = new ApiStoreEquipmentTest();

const StoreEquipmentTestRouterPath = '/components/sm-resource-store-equipments-test-cn';

export default {
  name: 'SmResourceStoreEquipmentsTests', //检测记录
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },

  data() {
    return {
      fileServerEndPoint: '', //文件服务请求头
      storeEquipmentTests: [], //数据存储
      loading: false,
      scroll: 1300,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        code: '', // 检测单编号搜索
        passed: '', //是否合格
        keyWord: '', //关键字查询
        storeHouseId: null,
        maxResultCount: paginationConfig.defaultPageSize,
        startTime: moment(moment())
          .startOf('year')
          .format('YYYY-MM-DD 00:00:00'), //开始时间
        endTime: moment(moment())
          .endOf('year')
          .format('YYYY-MM-DD 23:59:59'), //结束时间
      },
      dateRange: [moment(moment()).startOf('year'), moment(moment()).endOf('year')],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 80,
          ellipsis: true,
        },
        {
          title: '检测编号',
          dataIndex: 'code',
          width: 120,
          ellipsis: true,
        },
        {
          title: '设备',
          dataIndex: 'storeEquipmentName',
          scopedSlots: { customRender: 'storeEquipmentName' },
          ellipsis: true,
        },
        {
          title: '设备类型',
          dataIndex: 'storeEquipmentProductCategory',
          scopedSlots: { customRender: 'storeEquipmentProductCategory' },
          ellipsis: true,
        },
        {
          title: '检测结果',
          dataIndex: 'passed',
          scopedSlots: { customRender: 'passed' },
          width: 120,
          ellipsis: true,
        },
        {
          title: '检测时间',
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' },
          ellipsis: true,
          width: 120,
        },
        {
          title: '内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
          ellipsis: true,
        },
        {
          title: '检测人',
          dataIndex: 'testerName',
          width: 100,
          scopedSlots: { customRender: 'testerName' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
    this.fileServerEndPoint = localStorage.getItem('fileServerEndPoint');
  },

  methods: {
    initAxios() {
      apiStoreEquipmentTest = new ApiStoreEquipmentTest(this.axios);
    },

    // 检测单详情
    view(record) {
      this.$emit('view', record.id);
      // this.$router.push({
      //   path: StoreEquipmentTestRouterPath,
      //   query: {
      //     id: record.id,
      //   },
      // });
    },

    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiStoreEquipmentTest.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        this.storeEquipmentTests = response.data.items;
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
  },
  render() {
    let Options = [];
    for (let item in StoreEquipmentTestState) {
      Options.push(
        <a-select-option key={`${StoreEquipmentTestState[item]}`}>
          {getStoreEquipmentTestPassed(StoreEquipmentTestState[item])}
        </a-select-option>,
      );
    }
    return (
      <div class="sm-resource-store-equipments-tests">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.name = '';
            this.dateRange = [moment(moment()).startOf('year'), moment(moment()).endOf('year')];
            this.queryParams.organizationId = null;
            this.queryParams.storeHouseId = null;
            this.queryParams.code = '';
            this.queryParams.passed = '';
            this.queryParams.keyWord = '';
            this.queryParams.startTime = moment(moment()).startOf('year').format('YYYY-MM-DD 00:00:00');
            this.queryParams.endTime = moment(moment()).endOf('year').format('YYYY-MM-DD 23:59:59');
            this.refresh();
          }}
        >
          <a-form-item label="组织机构">
            <OrganizationTreeSelect
              axios={this.axios}
              treeCheckable={false}
              treeCheckStrictly={true}
              value={this.queryParams.organizationId}
              onInput={value => {
                this.queryParams.organizationId = value;
                this.queryParams.storeHouseId = this.mode === 'default' ? null : [];
                this.$emit('orgInput', value);
                this.$emit('orgChange', value);
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="仓库">
            <StoreHouseTreeSelect
              placeholder="请选择仓库"
              axios={this.axios}
              organizationId={this.queryParams.organizationId}
              value={this.queryParams.storeHouseId}
              onChange={value => {
                this.queryParams.storeHouseId = value;
                // this.$emit('input', value, this.iOrganizationId);
                // this.$emit('change', value, this.iOrganizationId);
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="检测日期">
            <a-range-picker
              allowClear={false}
              // showTime
              style="width: 100%;"
              value={this.dateRange ? this.dateRange : null}
              onChange={value => {
                this.queryParams.startTime = moment(value[0]._d).format('YYYY-MM-DD 00:00:00');
                this.queryParams.endTime = moment(value[1]._d).format('YYYY-MM-DD 23:59:59');
                this.dateRange = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              value={this.queryParams.passed}
              onChange={value => {
                this.queryParams.passed = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
          </a-form-item>
          <a-form-item label="检测编号">
            <a-input
              placeholder="请输入检测编号"
              value={this.queryParams.code}
              onInput={event => {
                this.queryParams.code = event.target.value;
                this.refresh();
              }}
            ></a-input>
          </a-form-item>

          <a-form-item label="关键字">
            <a-input
              placeholder="设备名称/内容/设备类型"
              value={this.queryParams.keyWord}
              onChange={event => {
                this.queryParams.keyWord = event.target.value;
                this.refresh();
              }}
            ></a-input>
          </a-form-item>
        </sc-table-operator>
        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.storeEquipmentTests}
          rowKey={record => record.id}
          loading={this.loading}
          pagination={false}
          // rowSelection={{
          //   columnWidth: 30,
          //   onChange: selectedRowKeys => {
          //     this.selectedArticleIds = selectedRowKeys;
          //   },
          // }}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                let str = index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              code: (text, record, index) => {
                return ' ' + text;
              },
              storeEquipmentName: (text, record, index) => {
                let storeEquipmentNames = [];
                let str = '';
                if (record.storeEquipmentTestRltEquipments) {
                  record.storeEquipmentTestRltEquipments.map(item => {
                    storeEquipmentNames.push(item.storeEquipment.name);
                  });
                  str = storeEquipmentNames.join(',');
                }
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              storeEquipmentProductCategory: (text, record) => {
                let storeEquipmentProductCategories = [];
                let storeEquipmentProductCategory = [];
                let str = '';
                if (record.storeEquipmentTestRltEquipments) {
                  record.storeEquipmentTestRltEquipments.map(item => {
                    storeEquipmentProductCategory = storeEquipmentProductCategories.find(
                      x => x == item.storeEquipment.productCategory.name,
                    );
                    storeEquipmentProductCategory == undefined
                      ? storeEquipmentProductCategories.push(
                        item.storeEquipment.productCategory.name,
                      )
                      : null;
                  });
                  str = storeEquipmentProductCategories.join(',');
                }
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              passed: (text, record) => {
                return getStoreEquipmentTestPassed(record.passed);
              },
              date: (text, record) => {
                let data = text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
                return <a-tooltip title={data}>{data}</a-tooltip>;
              },
              content: (text, record) => {
                let content = record.content;
                let str = content == null ? null : content.replace(/<[^>]+>/g, "").replace(/&nbsp;/ig, "");
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              testerName: (text, record) => {
                let name = text;
                return <a-tooltip title={name}>{name}</a-tooltip>;
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.view(record);
                        }}
                      >
                        查看
                      </a>,
                      vP(this.permissions, permissionsSmResource.StoreEquipmentTest.Detail),
                    )}
                  </span>,
                ];
              },
            },
          }}
        ></a-table>

        {/* 分页器 */}
   
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
