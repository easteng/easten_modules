import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { requestIsSuccess, vP, vIf } from '../../_utils/utils';
import permissionsSmResource from '../../_permissions/sm-resource';
import moment from 'moment';
import './style/index';
import StoreHouseTreeSelect from '../sm-resource-store-house-tree-select';//仓库的树结构
import SmSystemOrganizationUserSelect from '../../sm-system/sm-system-organization-user-select';
import ApiStoreEquipmentTransfer from '../../sm-api/sm-resource/StoreEquipmentTransfer';//库存设备接口

let apiStoreEquipmentTransfer = new ApiStoreEquipmentTransfer();
const formFields = [
  'storeHouseId',
];
export default {
  name: 'SmResourceStoreImportAltExport',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    type: { type: String, default: null },//出入库类型
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      organizationIdEmpty: null,//组织机构树选择和人员数据
      storeImportData: [],//入库数据源
      storeExportData: [],//出库数据源
      delateId: [],//存放页面不显示的Id
      totalCount: 0,
      isVisibility: false,
      importStoreEquipment: [],//入库设备信息
      exportStoreEquipment: [],//入库设备信息
      IdData: [],//存放页面不显示的Id
      form: {}, // 表单
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      userId: null,
      userName: null,
      queryParams: {
        storeHouseId: null,
        code: null,
      },
      loading: false,
      isShow: false,
      errorMessage: '',
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '库存编号',
          dataIndex: 'code',
          ellipsis: true,
          scopedSlots: { customRender: 'code' },
        },
        {
          title: '分类型号',
          dataIndex: 'ProductCategoryId',
          scopedSlots: { customRender: 'ProductCategoryId' },

        },
        {
          title: '编码时间',
          dataIndex: 'creationTime',
          ellipsis: true,
          scopedSlots: { customRender: 'creationTime' },

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
    'queryParams.storeHouseId': {
      handler: function (val, oldval) {
        if (this.type == "export" && this.storeExportData.length > 0) {
          if (!this.storeExportData.some(item => item.storeHouseId == this.queryParams.storeHouseId)) {
            this.storeExportData = [];
          }

        }
      },
      deep: true,
    },
  },
  async created() {
    this.form = this.$form.createForm(this, {});
    this.initAxios();
    this.refresh();

  },
  methods: {
    initAxios() {
      apiStoreEquipmentTransfer = new ApiStoreEquipmentTransfer(this.axios);
    },
    // 入库和出库
    ok() {
      this.form.validateFields(async (err, values) => {
        let response = null;
        if (this.type == "import") {
          for (let item of this.storeImportData) {
            if (!this.importStoreEquipment.some(items => items.storeEquipmentId == item.id)) {
              this.importStoreEquipment.push({
                storeEquipmentId: item.id,
              });
            }
          }
          if (!err) {
            let data = {
              ...values,
              storeEquipmentTransferRltEquipments: this.importStoreEquipment,
              userName: this.userName,
            };
            response = await apiStoreEquipmentTransfer.import(data);
            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.$emit('ok');
              this.setValue();
            }
          }
        } else {

          for (let item of this.storeExportData) {
            if (!this.exportStoreEquipment.some(items => items.storeEquipmentId == item.id)) {
              this.exportStoreEquipment.push({
                storeEquipmentId: item.id,
              });
            }
          }
          if (!err) {
            console.log(values);
            let data = {
              ...values,
              storeEquipmentTransferRltEquipments: this.exportStoreEquipment,
              userName: this.userName,
            };
            response = await apiStoreEquipmentTransfer.export(data);
            if (utils.requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.$emit('ok');
              this.setValue();
            }
          }
        }

      });
      this.organizationIdEmpty = "Empty";
    },
    //重置值
    setValue() {
      this.form.resetFields();
      this.storeImportData = [];
      this.storeExportData = [];
      this.organizationIdEmpty = "Empty";
      this.importStoreEquipment = [];
      this.exportStoreEquipment = [];
      this.userId = null;
      this.userName = null;
      this.queryParams = {
        code: null,
      };
      this.form.setFieldsValue({ storeHouseId: null });
      this.refresh(true);
    },
    //返回
    back() {
      this.setValue();
    },
    // 在delateImportId数组里面存放需要删除的id
    remove(record) {
      this.queryParams.code = null;
      this.delateId.push(record.id);
      this.pageIndex = 1;
      this.pageSize = paginationConfig.defaultPageSize;
      this.loading = false;
      if (this.type == "import") {
        this.storeImportData = this.storeImportData.filter((item) => !this.delateId.includes(item.id));
        this.delateId = [];
      }
      if (this.type == "export") {
        // 过滤不需要显示的id
        this.storeExportData = this.storeExportData.filter((item) => !this.delateId.includes(item.id));
        this.delateId = [];
      }
    },

    // 刷新列表   
    async refresh(reset = true) {
      this.loading = false;
      this.isShow = false;
      if (reset) {
        this.pageIndex = 1;
        this.pageSize = paginationConfig.defaultPageSize;
      }
      //入库
      if (this.type == "import") {
        let response = await apiStoreEquipmentTransfer.getEquipmentImport({
          code: this.queryParams.code,
        });
        if (requestIsSuccess(response) && response.data) {
          let _response = response.data;
          if (_response.length == 0 && this.queryParams.code != null) {
            this.isShow = true;
            this.errorMessage = `没有查到该设备 ${this.queryParams.code} 的信息`;
          }
          if (this.storeImportData.some(item => item.code == this.queryParams.code)) {
            this.isShow = true;
            this.errorMessage = `该设备 ${this.queryParams.code} 已经在入库列表中`;
          }
          if (!this.storeImportData.some(item => item.code == this.queryParams.code)) {
            this.storeImportData.push(..._response);
            this.queryParams.code = null;
          }
        }
      }
      //出库
      if (this.type == "export") {
        let response = null;
        response = await apiStoreEquipmentTransfer.getEquipmentExport({
          ...this.queryParams,
        });
        if (requestIsSuccess(response) && response.data) {
          let _response = response.data;
          if (_response.length == 0 && this.queryParams.code != null) {
            this.isShow = true;
            this.errorMessage = `没有查到该设备 ${this.queryParams.code} 的信息`;
          }
          if (this.storeExportData.some(item => item.code == this.queryParams.code)) {
            this.isShow = true;
            this.errorMessage = `该设备 ${this.queryParams.code} 已经在出库列表中`;
          }
          // 1、根据编码和仓库查
          if (this.queryParams.storeHouseId && this.queryParams.code) {
            if (!this.storeExportData.some(item => item.code == this.queryParams.code)) {
              this.storeExportData.push(..._response);
              this.queryParams.code = null;
            }
          }
          // 2、根据编码查
          if (!this.queryParams.storeHouseId && this.queryParams.code) {
            if (this.storeExportData.length == 0) {
              for (let item of _response) {
                this.form.setFieldsValue({ storeHouseId: item.storeHouseId });
              }
            }
            this.storeExportData.push(..._response);
            this.queryParams.code = null;
          }
        }

      }
      setTimeout(() => {
        this.isShow = false;
      }, 2000);

    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
    },
  },
  render() {
    return (
      <div class="sm-resource-store-house">
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={12} md={12}>
              <a-form-item label={this.type == 'import' ? "入库仓库" : "出库仓库"} label-col={{ span: 4 }} wrapper-col={{ span: 20 }} >
                <StoreHouseTreeSelect
                  placeholder="请选择"
                  enabled={this.type == 'export' ? false : true}
                  axios={this.axios}
                  onChange={value => {
                    console.log(value);
                    this.queryParams.storeHouseId = value;
                  }
                  }
                  v-decorator={[
                    'storeHouseId',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请选择仓库',
                          whitespace: true,
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={12} md={12}>
              <a-form-item label={this.type == 'import' ? "入库人" : "出库人"} label-col={{ span: 4 }} wrapper-col={{ span: 20 }} >
                <SmSystemOrganizationUserSelect
                  organizationIdEmpty={this.organizationIdEmpty}
                  placeholder="请选择"
                  axios={this.axios}
                  onChange={value => {
                    this.queryParams.userId = value;
                  }
                  }
                  v-decorator={[
                    'userId',
                    {
                      initialValue: undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择入库人',
                          whitespace: true,
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item label="设备搜索" label-col={{ span: 2 }} wrapper-col={{ span: 22 }}>
                <a-input-search
                  allowClear
                  onSearch={() => {
                    this.refresh();
                  }}
                  enter-button="搜索"
                  placeholder="请输入库存编码或者扫码"
                  value={this.queryParams.code}
                  onInput={event => {
                    this.queryParams.code = event.target.value;
                  }}
                />
                <a-alert
                  message={this.errorMessage}
                  class={this.isShow ? 'isShow' : 'show'}
                  banner
                  closable
                  type="error"
                />
              </a-form-item>

            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item class="a-form-item-labe" wrapper-col={{ span: 22, offset: 2 }} >
                <a-table
                  columns={this.columns}
                  rowKey={record => record.id}
                  dataSource={this.type == "import" ? this.storeImportData : this.storeExportData}

                  loading={this.loading}
                  pagination={{
                    showTotal: paginationConfig.showTotal,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSize: this.pageSize,
                    current: this.pageIndex,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageChange,
                  }}
                  {...{
                    scopedSlots: {
                      code: (text, record, index) => {
                        return record.code;
                      },
                      ProductCategoryId: (text, record, index) => {
                        return record.productCategory.code;
                      },
                      creationTime: (text, record, index) => {
                        return record.creationTime ? moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss') : '';
                      },
                      operations: (text, record) => {
                        return [
                          <span>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.remove(record);
                                }}
                              >
                                删除
                              </a>,
                              vP(this.permissions, permissionsSmResource.StoreEquipmentTransfer.Create),
                            )}

                          </span>,
                        ];
                      },
                    },
                  }}
                >
                  <span slot="customTitle"><a-icon type="smile-o" /> name</span>
                </a-table>
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item label="备注" label-col={{ span: 2 }} wrapper-col={{ span: 22 }} >
                <a-textarea
                  rows="3"
                  placeholder="请输入备注"
                  v-decorator={[
                    'remark',
                    {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '备注不能为空',
                          whitespace: true,
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={24} md={24}>
              <a-form-item class="a-form-item-labe" wrapper-col={{ span: 22, offset: 2 }} >
                <div style="float: left">
                  <a-button
                    style="margin-right:20px"
                    onClick={() => {
                      this.back();
                    }}>
                    返回
                  </a-button>
                  {vIf(
                    <a-button
                      type="primary"
                      onClick={() => {
                        this.ok();
                      }}
                    >
                      确定
                    </a-button>,
                    vP(this.permissions, permissionsSmResource.StoreEquipmentTransfer.Create),
                  )}


                </div>
              </a-form-item>
            </a-col>

          </a-row>
        </a-form>
      </div>

    );
  },
};
