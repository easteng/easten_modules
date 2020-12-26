import ApiStandardEquipment from '../../sm-api/sm-std-basic/StandardEquipment';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getServiceLifeUnit, vIf, vP } from '../../_utils/utils';
import permissionsSmStdBasic from '../../_permissions/sm-std-basic';
import SmStdBasicProductCategoryTreeSelect from '../sm-std-basic-product-category-tree-select';
import SmStdBasicStandardEquipmentModal from './SmStdBasicStandardEquipmentModal';
import SmStdBasicConnectionModal from './SmStdBasicTerminalModal';

import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmExport from '../../sm-common/sm-export-module';

let apiStandardEquipment = new ApiStandardEquipment();

export default {
  name: 'SmStdBasicStandardEquipments',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      standardEquipments: [],
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        keywords: '',
        productCategoryId: null,
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      fileList: [],
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 100,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '产品分类',
          dataIndex: 'productCategoryParentParent',
          ellipsis: true,
          scopedSlots: { customRender: 'productCategoryParentParent' },
        },
        {
          title: '产品名称',
          dataIndex: 'productCategoryParent',
          scopedSlots: { customRender: 'productCategoryParent' },
          ellipsis: true,
        },
        {
          title: '产品型号',
          dataIndex: 'productCategory',
          ellipsis: true,
          scopedSlots: { customRender: 'productCategory' },
        },
        {
          title: '单位',
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          ellipsis: true,
        },
        {
          title: '使用寿命',
          dataIndex: 'serviceLife',
          scopedSlots: { customRender: 'serviceLife' },
          ellipsis: true,
        },
        {
          title: 'CSRG编码',
          dataIndex: 'csrgCode',
          ellipsis: true,
        },
        {
          title: 'Code编码',
          dataIndex: 'code',
          ellipsis: true,
        },
        {
          title: '产品厂商',
          dataIndex: 'manufacturer',
          ellipsis: true,
          scopedSlots: { customRender: 'manufacturer' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
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
    add() {
      this.$refs.SmStdBasicStandardEquipmentModal.add();
    },
    edit(record) {
      this.$refs.SmStdBasicStandardEquipmentModal.edit(record);
    },
    editConnection(record) {
      this.$refs.SmStdBasicConnectionModal.editConnection(record);
    },
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiStandardEquipment.delete(record.id);
            _this.refresh(false, _this.pageIndex);
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    view(record) {
      this.$refs.SmStdBasicStandardEquipmentModal.view(record);
    },
    initAxios() {
      apiStandardEquipment = new ApiStandardEquipment(this.axios);
    },

    //更新数据
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiStandardEquipment.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        this.standardEquipments = response.data.items;
        this.totalCount = response.data.totalCount;
        if (page && this.totalCount && this.queryParams.maxResultCount) {
          let currentPage = parseInt(this.totalCount / this.queryParams.maxResultCount);
          if (this.totalCount % this.queryParams.maxResultCount !== 0) {
            currentPage = page + 1;
          }
          if (page > currentPage) {
            this.pageIndex = currentPage;
            this.refresh(false, this.pageIndex);
          }
        }
      }
      this.loading = false;
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'stdEquipment',
      };
      // 执行文件上传    
      await this.$refs.stdEquipmentImport.exect(importParamter);
    },

    // 上传前
    beforeUpload(file) {
      if (file.size > 1024 * 1024 * 20) {
        this.$message.error('上传的文件不能大于20M');
        return false;
      }
      let hasExist = this.fileList.some(item => item.name === file.name);
      if (!hasExist) {
        this.fileList = [...this.fileList, file];
      }
      return false;
    },
    //上传文件
    async uploadFile() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.fileList[0]);
      let response = await apiStandardEquipment.upload(formData);
      this.fileList = [];
      this.isLoading = false;
      if (requestIsSuccess(response)) {
        if (response.data) {
          this.$info({
            title: '产品数据导入结果',
            width: 600,
            content: (
              <a-row>
                <a-col span="22">
                  <a-textarea readOnly rows="14" value={response.data} />
                </a-col>
                <a-col span="2"></a-col>
              </a-row>
            ),
          });
          this.refresh();
        } else {
          this.$message.info('导入失败');
        }
      }
    },
  },
  render() {
    return (
      <div>
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.keywords = '';
            this.queryParams.productCategoryId = null;
            this.refresh();
          }}
        >
          <a-form-item label="产品型号">
            <SmStdBasicProductCategoryTreeSelect
              axios={this.axios}
              maxTagCount={3}
              placeholder="请选择产品型号"
              treeCheckable={false}
              showSearch={true}
              value={this.queryParams.productCategoryId}
              onChange={value => {
                this.queryParams.productCategoryId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="模糊查询">
            <a-input
              placeholder="请输入编码、厂商"
              value={this.queryParams.keywords}
              onInput={event => {
                this.queryParams.keywords = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons">
            <div style={'display:flex'}>
              {vIf(
                <a-button type="primary" icon="plus" onClick={this.add}>
                  添加
                </a-button>,
                vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Create),
              )}

              {vIf(
                <SmImport
                  ref="stdEquipmentImport"
                  url='api/app/stdBasicStandardEquipment/upload'
                  axios={this.axios}
                  downloadErrorFile={true}
                  importKey="stdEquipment"
                  onSelected={file => this.fileSelected(file)}
                  onIsSuccess={() => this.refresh()}
                />,
                vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Import),
              )}
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  downloadKey="standardEquipments"
                  downloadFileName="产品（标准设备）"
                >
                </SmTemplateDownload>,
                vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Import),
              )}
              {vIf(
                <SmExport
                  url='api/app/stdBasicStandardEquipment/export'
                  axios={this.axios}
                  templateName="standardEquipments"
                  downloadFileName="产品（标准设备）"
                  rowIndex={5}
                />,
                vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Export),
              )}

            </div>
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.standardEquipments}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              productCategoryParentParent: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={
                      record.productCategory &&
                        record.productCategory.parent &&
                        record.productCategory.parent.parent
                        ? record.productCategory.parent.parent.name
                        : ''
                    }
                  >
                    {record.productCategory &&
                      record.productCategory.parent &&
                      record.productCategory.parent.parent
                      ? record.productCategory.parent.parent.name
                      : ''}
                  </a-tooltip>
                );
              },
              productCategoryParent: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={
                      record.productCategory && record.productCategory.parent
                        ? record.productCategory.parent.name
                        : ''
                    }
                  >
                    {record.productCategory && record.productCategory.parent
                      ? record.productCategory.parent.name
                      : ''}
                  </a-tooltip>
                );
              },
              productCategory: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={record.productCategory ? record.productCategory.name : ''}
                  >
                    {record.productCategory ? record.productCategory.name : ''}
                  </a-tooltip>
                );
              },
              unit: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={record.productCategory ? record.productCategory.unit : ''}
                  >
                    {record.productCategory ? record.productCategory.unit : ''}
                  </a-tooltip>
                );
              },

              serviceLife: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={
                      record.serviceLife
                        ? record.serviceLife + getServiceLifeUnit(record.serviceLifeUnit)
                        : ''
                    }
                  >
                    {record.serviceLife
                      ? record.serviceLife + getServiceLifeUnit(record.serviceLifeUnit)
                      : ''}
                  </a-tooltip>
                );
              },

              manufacturer: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={record.manufacturer ? record.manufacturer.name : ''}
                  >
                    {record.manufacturer ? record.manufacturer.name : ''}
                  </a-tooltip>
                );
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
                        详情
                      </a>,
                      vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Detail),
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Detail) &&
                      vP(this.permissions,
                        [
                          permissionsSmStdBasic.StandardEquipments.Update,
                          permissionsSmStdBasic.StandardEquipments.Delete,
                        ]),
                    )}

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          {/* <a-menu-item>
                         <a
                           onClick={() => {
                             this.editConnection(record);
                           }}
                         >
                           端子维护
                         </a>
                       </a-menu-item> */}
                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.edit(record);
                                }}
                              >
                                编辑
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Update),
                          )}

                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.remove(record);
                                }}
                              >
                                删除
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmStdBasic.StandardEquipments.Delete),
                          )}
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [
                        permissionsSmStdBasic.StandardEquipments.Update,
                        permissionsSmStdBasic.StandardEquipments.Delete,
                      ]),
                    )}

                  </span>,
                ];
              },
            },
          }}
        />

        {/* 分页器 */}
        <a-pagination
          style="margin-top:10px; text-align: right;"
          total={this.totalCount}
          pageSize={this.queryParams.maxResultCount}
          current={this.pageIndex}
          onChange={this.onPageChange}
          onShowSizeChange={this.onPageChange}
          showSizeChanger
          showQuickJumper
          showTotal={paginationConfig.showTotal}
        />

        <SmStdBasicStandardEquipmentModal
          ref="SmStdBasicStandardEquipmentModal"
          axios={this.axios}
          bordered={this.bordered}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

        <SmStdBasicConnectionModal
          ref="SmStdBasicConnectionModal"
          axios={this.axios}
          bordered={this.bordered}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
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
