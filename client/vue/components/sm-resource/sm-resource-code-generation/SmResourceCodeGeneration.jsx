import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import permissionsSmResource from '../../_permissions/sm-resource';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import SmStdBasicProductCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-product-category-tree-select';
import SmStdBasicManufacturerSelect from '../../sm-std-basic/sm-std-basic-manufacturer-select';
import ApiStoreEquipment from '../../sm-api/sm-resource/StoreEquipments';
import moment from 'moment';
import './style/index.js';
let apiStoreEquipment = new ApiStoreEquipment();

export default {
  name: 'SmResourceCodeGeneration', //编码生成
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      codeGenerations: [], //数据存储
      returnData: [],
      loading: false,
      now: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss.SSSS'),
      count: 1,
      totalCount: 0,
      codes: null,
      pageIndex: 1,
      queryParams: {
        codes: null,
        maxResultCount: paginationConfig.defaultPageSize,
      },
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 100,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: '产品分类/型号',
          dataIndex: 'productCategory',
          scopedSlots: { customRender: 'productCategory' },
          ellipsis: true,
        },
        {
          title: '厂家',
          dataIndex: 'manufacturer',
          scopedSlots: { customRender: 'manufacturer' },
          ellipsis: true,
        },
        {
          title: '数量',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 120,
          scopedSlots: { customRender: 'operations' },
          ellipsis: true,
          fixed: 'right',
        },
      ];
    },
    dataColumns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: '产品分类/型号',
          dataIndex: 'productCategory',
          scopedSlots: { customRender: 'productCategory' },
          ellipsis: true,
        },
        {
          title: '库存编号',
          dataIndex: 'code',
          ellipsis: true,
        },
      ];
    },
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.codeGenerations;
        this.returnData;
      },
      // immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.initMinio();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiStoreEquipment = new ApiStoreEquipment(this.axios);
    },

    //删除编码对象
    remove(index) {
      this.codeGenerations.splice(index, 1);
    },
    //增加编码对象
    addStoreEquipmentsCode() {
      this.count++;
      this.codeGenerations.push({
        key: this.count,
        productCategory: null,
        manufacturer: null,
        count: null,
      });
    },

    async refresh() {
      this.codeGenerations.push({
        key: 1,
        productCategory: null,
        manufacturer: null,
        count: null,
      });
    },

    async saveCode() {

      //将下方设备显示区的数据源制空
      this.returnData = [];
      this.loading = false;
      let storeEquipments = [];
      let temp = true;

      for (let item of this.codeGenerations) {
        if (item.productCategory == null || item.manufacturer == null || item.count <= 0) {
          temp = false;
          break;
        } else {
          for (let i = 0; i < item.count; i++) {
            storeEquipments.push({
              productCategoryId: item.productCategory,
              manufacturerId: item.manufacturer,
              manufactureDate: this.now,
            });
          }
        }
      }
      if (temp) {
        this.loading = true;
        let response = await apiStoreEquipment.create(storeEquipments);
        if (requestIsSuccess(response) && response.data) {

          this.codes = response.data;
          this.getCodes();
          this.$message.success('操作成功');

          //将添加设备区制空
          this.codeGenerations = [];
          this.codeGenerations.push({
            key: 1,
            productCategory: null,
            manufacturer: null,
            count: null,
          });
          this.queryParams.productCategory = null;
          this.manufacturer = null;
          this.loading = false;
        }
      }
      else {
        this.loading = false;
        this.$message.error('您没有输入厂家、产品分类或者输入的数量不正确，请重新输入');
      }

    },

    async getCodes(resetPage = true) {
      let data = [];
      for (let item of this.codes) {
        data.push(
          item.code,
        );
      }
      let queryParams = {
        codes: data.map(item => item),
        maxResultCount: this.queryParams.maxResultCount,
      };
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiStoreEquipment.getListByCode({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });

      if (requestIsSuccess(response) && response.data) {
        this.returnData = response.data.items;
        this.totalCount = response.data.totalCount;
      }
    },

    async exportData() {
      let ids = [];
      this.returnData.map(item => ids.push(
        item.id,
      ));
      let response = await apiStoreEquipment.exportStoreEquipments(this.returnData);
      if (requestIsSuccess(response) && response.data) {
        this.$message.success('导出成功');
      }
    },

    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.getCodes(false);
      }
    },
    initMinio() { },
  },
  render() {
    return (
      <div class="sm-resource-code-generation" >
        <a-row type="flex" justify="center">
          <a-col sm={24} lg={21} xxl={18} >
            <a-row >
              <a-col span={3}>
                <div class="ant-form-item-label" style="float:right;">产品分类</div>
              </a-col>
              <a-col span={1}></a-col>
              <a-col span={18}>
                <a-table
                  columns={this.columns}
                  rowKey={record => record.key}
                  dataSource={this.codeGenerations}
                  bordered={false}
                  pagination={false}
                  {...{
                    scopedSlots: {
                      index: (text, record, index) => {
                        let str = index + 1;
                        return <a-tooltip title={str}>{str}</a-tooltip>;
                      },
                      productCategory: (text, record, index) => {
                        return (
                          <SmStdBasicProductCategoryTreeSelect
                            axios={this.axios}
                            showSearch={true}
                            value={record.productCategory}
                            ref="SmStdBasicProductCategoryTreeSelect"
                            placeholder={'请选择产品型号'}
                            onChange={value => {
                              record.productCategory = value;
                            }}
                          />
                        );
                      },
                      manufacturer: (text, record, index) => {
                        return (
                          <SmStdBasicManufacturerSelect
                            class="ant-input"
                            axios={this.axios}
                            placeholder={'请选择厂家'}
                            value={record.manufacturer}
                            height={32}
                            onChange={value => {
                              record.manufacturer = value;
                            }}
                          />
                        );
                      },
                      count: (text, record, index) => {
                        return (
                          <a-input-number
                            style="width:100%"
                            placeholder="请输入数量"
                            min={0}
                            value={record.count}
                            onChange={value => {
                              record.count = value;
                            }
                            }
                          />
                        );
                      },
                      operations: (text, record, index) => {
                        return vIf(
                          <span>
                            <a
                              onClick={() => {
                                this.remove(index);
                              }}
                            >
                              删除
                            </a>
                          </span>,
                          vP(this.permissions, permissionsSmResource.StoreEquipments.Create),
                        );
                      },
                    },
                  }}
                ></a-table>
              </a-col>
            </a-row>
            <br />
            <a-row>
              <a-col span={3}></a-col>
              <a-col span={1}></a-col>
              {vIf(
                <a-col span={18}>
                  <a-button type="primary" onClick={this.addStoreEquipmentsCode} style="margin-right: 15px;">增加</a-button>
                  <a-button type="primary" onClick={this.saveCode}>生成</a-button>
                </a-col>,
                vP(this.permissions, permissionsSmResource.StoreEquipments.Create),
              )}

            </a-row>
            <a-divider ></a-divider>
            <a-row >
              <a-col span={3}>
                <div class="ant-form-item-label" style="float:right">已生成</div>
              </a-col>
              <a-col span={1}></a-col>
              <a-col span={18}>
                <a-table
                  columns={this.dataColumns}
                  rowKey={record => record.id}
                  dataSource={this.returnData}
                  bordered={false}
                  loading={this.loading}
                  pagination={false}
                  {...{
                    scopedSlots: {
                      index: (text, record, index) => {
                        let str = index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                        return <a-tooltip title={str}>{str}</a-tooltip>;
                      },
                      productCategory: (text, record) => {
                        let str = record.productCategory ? record.productCategory.name : '';
                        return <a-tooltip title={str}>{str}</a-tooltip>;
                      },
                      code: (text, record) => {

                        return text;
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

              </a-col>
            </a-row>
            <br />
            <a-row>
              <a-col span={3}>
              </a-col>
              <a-col span={1}></a-col>
              <a-col span={18}>
                {/* <a-button type="primary" style="margin-right: 15px;">打印</a-button>
                <a-button type="primary" onClick={this.exportData}>导出</a-button> */}
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        {/* </div> */}
      </div >
    );
  },
};
