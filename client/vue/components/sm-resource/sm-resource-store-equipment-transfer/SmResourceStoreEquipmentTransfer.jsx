import { pagination as paginationConfig } from '../../_utils/config';
import { deleteEmptyProps } from '../../_utils/tree_array_tools';
import moment from 'moment';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import StoreHouseTreeSelect from '../sm-resource-store-house-tree-select';//仓库的树结构
import ApiStoreEquipmentTransfer from '../../sm-api/sm-resource/StoreEquipmentTransfer';//库存设备接口
import { StoreEquipmentTransferTypeEnable } from '../../_utils/enum';
import { requestIsSuccess, getStoreEquipmentTransferTypeEnable } from '../../_utils/utils';
import SmResourceStoreEquipmentTransferModel from './SmResourceStoreEquipmentTransferModel';
import './style/index';
let apiStoreEquipmentTransfer = new ApiStoreEquipmentTransfer();
export default {
  name: 'SmResourceStoreEquipmentTransfer',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    organizationId: { type: String, default: null },
    mode: { type: String, default: 'default' },

  },
  data() {
    return {
      iOrganizationId: null,
      totalCount: 0,
      pageIndex: 1,
      model: ['input', 'change'],
      queryParams: {
        storeHouseId: null,
        startTime: null, //开始时间
        endTime: null, //结束时间
        type: undefined,
        keyWord: null,
        maxResultCount: paginationConfig.defaultPageSize,
      },
      storeEquipmentTransfer: [], // 列表数据源
      loading: false,
      positions: null,
      index: null,
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          ellipsis: true,
          scopedSlots: { customRender: 'index' },
        },
        {

          title: '仓库名称',
          width: 200,
          dataIndex: 'storeHouseId',
          ellipsis: true,
          scopedSlots: { customRender: 'storeHouseId' },
        },
        {

          title: '类型',
          dataIndex: 'type',
          ellipsis: true,
          scopedSlots: { customRender: 'type' },

        },
        {
          title: '设备',
          width: 200,
          ellipsis: true,
          dataIndex: 'equipmentName',
          scopedSlots: { customRender: 'equipmentName' },
        },
        {
          title: '设备总数',
          ellipsis: true,
          dataIndex: 'equipmentCount',
          scopedSlots: { customRender: 'equipmentCount' },
        },
        {
          title: '备注',
          ellipsis: true,
          width: 180,
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
        },
        {
          title: '人员',
          ellipsis: true,
          dataIndex: 'peopleName',
          scopedSlots: { customRender: 'peopleName' },
        },
        {
          title: '时间',
          ellipsis: true,
          width: '160px',
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'creationTime' },
        },
        {
          title: '操作',
          dataIndex: 'operations',

          scopedSlots: { customRender: 'operations' },
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
    value: {
      handler: function (val, oldVal) {
        if ((val === null || val === undefined) && this.mode === 'multiple') {
          this.queryParams.storeHouseId = null;
        } else {
          this.queryParams.storeHouseId = val;
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
      apiStoreEquipmentTransfer = new ApiStoreEquipmentTransfer(this.axios);

    },

    // 详情
    view(record) {
      this.$refs.SmResourceStoreEquipmentTransferModel.view(record);
    },

    async refresh(resetPage = true) {

      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let data = {
        ...this.queryParams,
        organizationId: this.iOrganizationId,
        startTime: this.dateRange[0] ? this.dateRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
        endTime: this.dateRange[1] ? this.dateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
      };
      let response = await apiStoreEquipmentTransfer.getList({
        ...data,
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
      });

      if (requestIsSuccess(response) && response.data && response.data.items) {
        this.storeEquipmentTransfer = response.data.items;
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
    //设备是否出库
    let TypeOptions = [];
    for (let item in StoreEquipmentTransferTypeEnable) {
      TypeOptions.push(
        <a-select-option key={`${StoreEquipmentTransferTypeEnable[item]}`}>
          {getStoreEquipmentTransferTypeEnable(StoreEquipmentTransferTypeEnable[item])}
        </a-select-option>,
      );
    }

    return (
      <div class="sm-resource-store-equipment-transfer">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.iOrganizationId = null,
            this.queryParams = {
              storeHouseId: null,
              startTime: null, //开始时间
              endTime: null, //结束时间
              state: StoreEquipmentTransferTypeEnable.All,
              keyWord: null,
              maxResultCount: paginationConfig.defaultPageSize,
            },
            this.dateRange = [moment(moment()).startOf('month'), moment(moment()).endOf('month')];
            this.refresh();
          }}
        >
          <a-form-item label="组织机构">
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              value={this.iOrganizationId}
              onInput={value => {
                this.iOrganizationId = value;
                this.queryParams.storeHouseId = this.mode === 'default' ? null : [];
                this.$emit('orgInput', value);
                this.$emit('orgChange', value);
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="仓库">
            <StoreHouseTreeSelect
              axios={this.axios}
              organizationId={this.iOrganizationId}
              value={this.queryParams.storeHouseId}
              onInput={value => {
                this.queryParams.storeHouseId = value;
                this.$emit('input', value, this.iOrganizationId);
                this.$emit('change', value, this.iOrganizationId);
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="时间">
            <a-range-picker
              class="data-picker"
              value={this.dateRange}
              onChange={value => {
                this.dateRange = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="类型">
            <a-select
              placeholder="出库/入库"
              value={this.queryParams.type}
              onChange={value => {
                this.queryParams.type = value;
                this.refresh();
              }}
              allowClear
            >
              {TypeOptions}
            </a-select>
          </a-form-item>

          <a-form-item label="关键字">
            <a-input
              allowClear
              placeholder="分类/库存编号/备注/人员姓名/设备名称"
              value={this.queryParams.keyWord}
              onInput={event => {
                this.queryParams.keyWord = event.target.value;

                this.refresh();
              }}
            />
          </a-form-item>

        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.storeEquipmentTransfer}
          // bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                let result = index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                return <a-tooltip title={result}>{result}</a-tooltip>;
              },
              storeHouseId: (text, record, index) => {
                let result = record.storeHouse ? record.storeHouse.name : '';
                return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
              },
              type: (text, record, index) => {
                let result = record.type == 1 ? "入库" : "出库";
                return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
              },
              equipmentName: (text, record, index) => {
                let equipmentName = '';
                record.storeEquipmentTransferRltEquipments.map(item => {
                  equipmentName = equipmentName + item.storeEquipment.name + ',';
                });
                let result = equipmentName.slice(0, equipmentName.length - 1);
                return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
              },
              equipmentCount: (text, record, index) => {

                let result = record.storeEquipmentTransferRltEquipments ? record.storeEquipmentTransferRltEquipments.length : 0;
                return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
              },
              remark: (text, record, index) => {
                let result = record.remark;
                return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
              },
              peopleName: (text, record, index) => {
                let username = null;
                username = record.userName;
                if (username == null) {
                  username = record.user ? record.user.name : '';
                }

                return <a-tooltip placement="topLeft" title={username}>{username}</a-tooltip>;
              },
              creationTime: (text, record, index) => {
                let result = record.creationTime ? moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss') : '';
                return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
              },
              operations: (text, record) => {
                return [
                  <span>
                    <a
                      onClick={() => {
                        this.view(record);
                      }}
                    >
                      设备详情
                    </a>
                  </span>,
                ];
              },
            },
          }}
        >
          <span slot="customTitle"><a-icon type="smile-o" /> name</span>
        </a-table>
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

        {/* 详情模板 */}
        <SmResourceStoreEquipmentTransferModel
          ref="SmResourceStoreEquipmentTransferModel"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
