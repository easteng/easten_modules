import ApiManufacturer from '../../sm-api/sm-std-basic/Manufacturer';
import SmStdBasicManufacturerModal from './SmStdBasicManufacturerModal';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import { ModalStatus } from '../../_utils/enum';
import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmExport from '../../sm-common/sm-export-module';
import permissionsSmStdBasic from '../../_permissions/sm-std-basic';

let apiManufacturer = new ApiManufacturer();

export default {
  name: 'SmStdBasicManufacturers',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    isSimple: { type: Boolean, default: false },//是否精简模式
    multiple: { type: Boolean, default: false },//是否多选
    selected: { type: Array, default: () => [] },//所选厂家
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      manufacturers: [],
      record: null,
      selectedManufacturerIds: [],//已选厂家Ids
      iSelected: [],//已选厂家
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        keyword: '',
        sorting: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      fileList: [],
    };
  },
  computed: {
    columns() {
      return this.isSimple ?
        [
          {
            title: '厂家名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
            ellipsis: true,
          },
          {
            title: '编码',
            dataIndex: 'csrgCode',
            width: 100,
            ellipsis: true,
          },
          {
            title: '厂家简称',
            dataIndex: 'shortName',
            ellipsis: true,
          },
          {
            title: '地址',
            dataIndex: 'address',
            ellipsis: true,
          },
        ]
        :
        [
          {
            title: '厂家名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
            ellipsis: true,
          },
          {
            title: '厂家简称',
            dataIndex: 'shortName',
            ellipsis: true,
          },
          {
            title: 'CSRG编码',
            dataIndex: 'csrgCode',
            width: 140,
            ellipsis: true,
          },
          {
            title: 'Code编码',
            dataIndex: 'code',
            width: 140,
            ellipsis: true,
          },
          {
            title: '联系人',
            dataIndex: 'principal',
            ellipsis: true,
          },
          {
            title: '联系电话',
            dataIndex: 'telephone',
            ellipsis: true,
          },
          {
            title: '地址',
            dataIndex: 'address',
            ellipsis: true,
          },
          {
            title: '操作',
            dataIndex: 'operations',
            width: 160,
            scopedSlots: { customRender: 'operations' },
          },
        ];
    },
  },
  watch: {
    selected: {
      handler: function (value, oldVal) {
        this.iSelected = value;
        this.selectedManufacturerIds = value.map(item => item.id);
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    add(record) {
      this.record = record;
      this.$refs.SmStdBasicManufacturerModal.add(record);
    },
    edit(record) {
      this.record = record;
      this.$refs.SmStdBasicManufacturerModal.edit(record);
    },
    view(record) {
      this.record = record;
      this.$refs.SmStdBasicManufacturerModal.view(record);
    },
    initAxios() {
      apiManufacturer = new ApiManufacturer(this.axios);
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiManufacturer.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.$message.success('操作成功');
              _this.refresh(false, null, _this.pageIndex);
            }
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    async refresh(resetPage = true, parent = null, page) {
      this.loading = true;
      if (parent == null) {
        this.manufacturers = [];
      }
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let queryParams = {};
      if (parent) {
        queryParams.parentId = parent.id;
        queryParams.isAll = true;
      } else {
        queryParams = { ...this.queryParams };
      }

      let response = await apiManufacturer.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        if (parent) {
          parent.children = response.data.items;
        } else {
          this.manufacturers = response.data.items;
          this.totalCount = response.data.totalCount;
        }
        if (page && this.totalCount && this.queryParams.maxResultCount) {
          let currentPage = parseInt(this.totalCount / this.queryParams.maxResultCount);
          if (this.totalCount % this.queryParams.maxResultCount !== 0) {
            currentPage = page + 1;
          }
          if (page > currentPage) {
            this.pageIndex = currentPage;
            this.refresh(false, null, this.pageIndex);
          }
        }

      }
      this.loading = false;
    },

    //更新所选数据
    updateSelected(selectedRows) {
      if (this.multiple) {
        // 过滤出其他页面已经选中的
        let _selected = [];
        for (let item of this.iSelected) {
          let target = this.manufacturers.find(subItem => subItem.id === item.id);
          if (!target) {
            _selected.push(item);
          }
        }

        // 把当前页面选中的加入
        for (let id of this.selectedManufacturerIds) {
          let manufacturer = this.manufacturers.find(item => item.id === id);
          if (!!manufacturer) {
            _selected.push(JSON.parse(JSON.stringify(manufacturer)));
          }
        }

        this.iSelected = _selected;
      } else {
        this.iSelected = selectedRows;
      }

      this.$emit('change', this.iSelected);
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
        'importKey': 'manufacturers',
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
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
            this.queryParams.keyword = '';
            this.refresh();
          }}
        >
          <a-form-item label="关键字">
            <a-input
              placeholder="请输入厂家名称、编码、地址"
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          {!this.isSimple ? <template slot="buttons">
            <div style={'display:flex'}>
              {vIf(
                <a-button type="primary" icon="plus" onClick={() => this.add(null)}>
                  添加
                </a-button>,
                vP(this.permissions, permissionsSmStdBasic.Manufactures.Create),
              )}
              {vIf(
                <SmImport
                  ref="smImport"
                  url='api/app/stdBasicManufacture/upload'
                  axios={this.axios}
                  downloadErrorFile={true}
                  importKey="manufacturers"
                  onSelected={file => this.fileSelected(file)}
                  onIsSuccess={() => this.refresh()}
                />,
                vP(this.permissions, permissionsSmStdBasic.Manufactures.Import),
              )}
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  downloadKey="manufacturers"
                  downloadFileName="厂家"
                >
                </SmTemplateDownload>,
                vP(this.permissions, permissionsSmStdBasic.Manufactures.Import),
              )}
              {vIf(
                <SmExport
                  url='api/app/stdBasicManufacture/export'
                  axios={this.axios}
                  templateName="manufacturers"
                  downloadFileName="厂家"
                  rowIndex={5}
                />,
                vP(this.permissions, permissionsSmStdBasic.Manufactures.Export),
              )}
            </div>
          </template> : undefined}
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.manufacturers}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          onExpand={(expanded, record) => {
            if (expanded && record.children.length == 0) {
              this.refresh(false, record);
            }
          }}
          rowSelection={this.isSimple ? {
            type: this.multiple ? 'checkbox' : 'radio',
            columnWidth: 30,
            selectedRowKeys: this.selectedManufacturerIds,
            onChange: (selectedRowKeys, selectedRows) => {
              this.selectedManufacturerIds = selectedRowKeys;
              this.updateSelected(selectedRows);
            },
          } : undefined}
          scroll={this.isSimple ? { y: 300 } : undefined}
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                let result = `${index +
                  1 +
                  this.queryParams.maxResultCount * (this.pageIndex - 1)}. ${text}`;
                return (
                  <a-tooltip placement="topLeft" title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },

              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.add(record);
                        }}
                      >
                        添加子项
                      </a>,
                      vP(this.permissions, permissionsSmStdBasic.Manufactures.Create),
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmStdBasic.Manufactures.Create) &&
                      vP(this.permissions, [
                        permissionsSmStdBasic.Manufactures.Detail,
                        permissionsSmStdBasic.Manufactures.Update,
                        permissionsSmStdBasic.Manufactures.Delete,
                      ]),
                    )}

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.view(record);
                                }}
                              >
                                详情
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmStdBasic.Manufactures.Detail),
                          )}
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
                            vP(this.permissions, permissionsSmStdBasic.Manufactures.Update),
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
                            vP(this.permissions, permissionsSmStdBasic.Manufactures.Delete),
                          )}

                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [
                        permissionsSmStdBasic.Manufactures.Detail,
                        permissionsSmStdBasic.Manufactures.Update,
                        permissionsSmStdBasic.Manufactures.Delete,
                      ]),
                    )}

                  </span>,
                ];
              },
            },
          }}
        ></a-table>

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
          size={this.isSimple ? 'small' : ''}
          showTotal={paginationConfig.showTotal}
        />


        <SmStdBasicManufacturerModal
          ref="SmStdBasicManufacturerModal"
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
