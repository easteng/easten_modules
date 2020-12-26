import moment from 'moment';
import { form as formConfig } from '../../_utils/config';
import ApiEquipments from '../../sm-api/sm-resource/Equipments';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getRunningState, vIf, vP } from '../../_utils/utils';
import permissionsSmResource from '../../_permissions/sm-resource';
import SmResourceEquipmentsModal from './SmResourceEquipmentsModal';
// import { DateReportType,RepairType } from '../../_utils/enum';
import CrmCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import SmBasicInstallationSiteSelect from '../../sm-basic/sm-basic-installation-site-select';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmImportModal from '../../sm-import/sm-import-modal';
import SmExport from '../../sm-common/sm-export-module';
let apiEquipments = new ApiEquipments();

export default {
  name: 'SmResourceEquipments',

  model: {
    prop: 'visible',
    event: 'change',
  },

  props: {
    permissions: { type: Array, default: () => [] },
    isFault: { type: Boolean, default: false }, //是否是故障的设备选择模式
    visible: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false }, // 是否多选
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    isSimple: { type: Boolean, default: false },
    installationSiteId: { type: String, default: null },
    organizationId: { type: String, default: null }, //待选计划中所传当前用户所属组织机构
    // organizationId: { type: String, default: '39f8411a-ed55-9d74-b2fd-2c19ddcbfbda' }, //待选计划中所传当前用户所属组织机构
    // iFDCodes: { type: Array, default: () => [] }, //待选计划中所传构件分类Code集合
    iFDCodes: { type: Array, default: () => ['SCC.001.001.002.001.009'] }, //待选计划中所传构件分类Code集合
    selected: { type: Array, default: () => [] }, //待选计划所选设备集合
  },
  data() {
    return {
      upLoading: false,
      fileList: [],
      equipments: [],
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        orgId: null,
        iFDCodes: [],
        organizationIds: [], //维护单位
        componentCategoryId: null, //构件分类
        installationSiteId: undefined,
        keyword: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      batchEditForm: this.$form.createForm(this),
      batchEditConfirmLoading: false,
      batchEditVisible: false,
      selectedEquipmentIds: [], //所选设备id集合
      iSelected: [],
      loading: false,
      expanded: false, //当前行是否展开
      iVisible: false, //模态框显示
      importComponents: [   // 工程数据导入功能配置
        {
          importKey: "engineringEquipment",
          title: "工程设备导入",
          downloadErrorFile: true,
          url: '/api/app/resourceEquipment/engineeringDataImport', // 相对地址
          parameters: {
            'file.file': null,
            'importKey': 'engineringEquipment',
            'type': 0,
          },
        },
        {
          importKey: "EngineCableImport",
          title: "工程电缆导入",
          downloadErrorFile: true,
          url: '/api/app/resourceEquipment/engineeringDataImport', // 相对地址
          parameters: {
            'file.file': null,
            'importKey': 'EngineCableImport',
            'type': 1,
          },
        },
        {
          importKey: "CableWiring",
          title: "线缆配线导入",
          downloadErrorFile: true,
          url: '/api/app/resourceEquipment/engineeringDataImport', // 相对地址
          parameters: {
            'file.file': null,
            'importKey': 'CableWiring',
            'type': 2,
          },
        },
        {
          importKey: "CabinetWiring",
          title: "机柜配线导入",
          downloadErrorFile: true,
          url: '/api/app/resourceEquipment/engineeringDataImport', // 相对地址
          parameters: {
            'file.file': null,
            'importKey': 'CabinetWiring',
            'type': 3,
          },
        },
      ],
      downloadComponents: [
        {
          downloadKey: "engineeringEquipments",
          title: "工程设备文件",
          icon: "setting",
        },
        {
          downloadKey: "engineeringCable",
          title: "工程电缆文件",
          icon: "deployment-unit",
        },
        {
          downloadKey: "cableWiring",
          title: "线缆配线文件",
          icon: "unordered-list",
        },
        {
          downloadKey: "cabinetWiring",
          title: "机柜配线文件",
          icon: "border-verticle",
        },
      ],
      exportComponents: [
        {
          templateName: "engineeringEquipments",
          title: "工程设备文件",
          icon: "setting",
        },
        {
          templateName: "engineeringCable",
          title: "工程电缆文件",
          icon: "deployment-unit",
        },
        {
          templateName: "cableWiring",
          title: "线缆配线文件",
          icon: "unordered-list",
        },
        {
          templateName: "cabinetWiring",
          title: "机柜配线文件",
          icon: "border-verticle",
        },
      ],
    };
  },
  computed: {
    columns() {
      return this.isSimple
        ? [
          {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
            // width: 90,
            ellipsis: true,
          },
          {
            title: '设备编码',
            dataIndex: 'code',
            ellipsis: true,
          },
          {
            title: '作业数量',
            dataIndex: 'workCount',
            scopedSlots: { customRender: 'workCount' },
          },
        ]
        : this.isFault
          ? [
            {
              title: '名称',
              dataIndex: 'name',
              scopedSlots: { customRender: 'name' },
              // width: 90,
              ellipsis: true,
            },
            {
              title: '设备编码',
              dataIndex: 'code',
              ellipsis: true,
            },
            {
              title: '生产厂家',
              dataIndex: 'manufacturer',
              scopedSlots: { customRender: 'manufacturer' },
              ellipsis: true,
            },
          ]
          : [
            {
              title: '名称',
              dataIndex: 'name',
              scopedSlots: { customRender: 'name' },
              // width: 90,
              ellipsis: true,
            },
            {
              title: '维护单位',
              dataIndex: 'equipmentRltOrganizations',
              scopedSlots: { customRender: 'equipmentRltOrganizations' },
              ellipsis: true,
            },
            {
              title: '设备分类',
              dataIndex: 'componentCategory',
              scopedSlots: { customRender: 'componentCategory' },
              ellipsis: true,
            },
            {
              title: '设备编码',
              dataIndex: 'code',
              ellipsis: true,
            },

            {
              title: '安装地点',
              dataIndex: 'installationSite',
              scopedSlots: { customRender: 'installationSite' },
              ellipsis: true,
              width: 150,
            },
            {
              title: '设备型号',
              dataIndex: 'productCategory',
              scopedSlots: { customRender: 'productCategory' },
              ellipsis: true,
              width: 120,
            },
            {
              title: '生产厂家',
              dataIndex: 'manufacturer',
              scopedSlots: { customRender: 'manufacturer' },
              ellipsis: true,
            },
            {
              title: '运行状态',
              dataIndex: 'state',
              scopedSlots: { customRender: 'state' },
              width: 120,
              ellipsis: true,
            },
            {
              title: '操作',
              dataIndex: 'operations',
              width: 160,
              scopedSlots: { customRender: 'operations' },
              ellipsis: true,
              fixed: 'right',
            },
          ];
    },
  },
  watch: {
    installationSiteId: {
      handler: function (value, oldVal) {
        this.queryParams.installationSiteId = value ? value : undefined;
      },
      immediate: true,
    },
    organizationId: {
      handler: function (value, oldVal) {
        this.queryParams.orgId = value ? value : null;
      },
      immediate: true,
    },
    iFDCodes: {
      handler: function (value, oldVal) {
        this.queryParams.iFDCodes = value;
      },
      immediate: true,
    },
    selected: {
      handler: function (value, oldVal) {
        this.iSelected = value;
        this.selectedEquipmentIds = value.map(item => item.id);
      },
      immediate: true,
    },

    visible: {
      handler: function (value, oldValue) {
        this.iSelected = this.selected;
        this.iVisible = value;
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    isSelected(record) {
      return this.selectedEquipmentIds.indexOf(record) >= 0;
    },

    add(record) {
      this.$refs.SmResourceEquipmentsModal.add(record);
    },
    batchEdit() {
      this.batchEditVisible = true;
    },
    async batchEditOk() {
      this.batchEditForm.validateFields(async (err, values) => {
        if (!err) {
          this.batchEditConfirmLoading = true;
          let idArr = new Array();
          for (let i = 0; i < this.equipments.length; i++) {
            idArr.push(this.equipments[i].id);
          }
          let param = {
            ids: idArr,
            limitUseYear: values.years,
          };
          let response = await apiEquipments.updateLimitUseYear(param);
          this.batchEditConfirmLoading = false;
          if (requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.batchEditVisible = false;
            this.refresh();
          } else {
            this.$message.error('操作失败');
          }
        }
      });
    },

    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'resourceequipments',
      };
      // 执行文件上传    
      await this.$refs.resourceEquipment.exect(importParamter);
    },

    handleBatchEditCancel() {
      this.batchEditVisible = false;
      this.batchEditForm.resetFields();
    },

    edit(record) {
      this.$refs.SmResourceEquipmentsModal.edit(record);
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiEquipments.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.$message.success('操作成功');
              _this.refresh(false, null, _this.pageIndex);
            }
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    view(record) {
      this.$refs.SmResourceEquipmentsModal.view(record);
    },

    initAxios() {
      apiEquipments = new ApiEquipments(this.axios);
    },

    async refresh(resetPage = true, parent = null, page) {
      if (parent == null) {
        this.equipments = [];
      }
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let queryParams = this.isSimple
        ? {
          iFDCodes: this.queryParams.iFDCodes,
          orgId: this.queryParams.orgId,
          installationSiteId: this.queryParams.installationSiteId,
          keyword: this.queryParams.keyword,
          maxResultCount: this.queryParams.maxResultCount,
        }
        : this.isFault
          ? {
            installationSiteId: this.queryParams.installationSiteId,
            keyword: this.queryParams.keyword,
            maxResultCount: this.queryParams.maxResultCount,
          }
          : {
            organizationIds: this.queryParams.organizationIds,
            componentCategoryId: this.queryParams.componentCategoryId,
            installationSiteId: this.queryParams.installationSiteId,
            keyword: this.queryParams.keyword,
            maxResultCount: this.queryParams.maxResultCount,
          };
      let newQueryParams = {};
      if (parent) {
        newQueryParams.parentId = parent.id;
        newQueryParams.isAll = true;
      } else {
        newQueryParams = { ...queryParams };
      }
      this.loading = true;
      let response = this.isSimple
        ? await apiEquipments.getSimpleList({
          skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
          ...newQueryParams,
        })
        : await apiEquipments.getList({
          skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
          ...newQueryParams,
        });

      if (requestIsSuccess(response) && response.data) {
        if (parent) {
          parent.children = response.data.items;
        } else {
          this.equipments = response.data.items;
          this.totalCount = response.data.totalCount;
        }
        if (this.isSimple || this.isFault) {
          this.equipments = this.equipments.map(item => {
            return {
              ...item,
              workCount: 1,
            };
          });
          this.iSelected.map(item => {
            let target = this.equipments.find(_item => _item.id === item.id);
            if (target) {
              target.workCount = item.workCount;
            }
          });
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

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    // 更新设备作业数量
    updateWorkCount(record) {
      let target = this.iSelected.find(item => item.id === record.id);
      if (target) {
        target.workCount = record.workCount;
      }
      this.$emit('change', this.iSelected);
    },

    //更新所选设备列表
    updateSelected() {
      // 过滤出其他页面已经选中的,把当前页的放入新数组中
      let _selected = [];
      let _iValue = [];
      for (let item of this.iSelected) {
        let target = this.equipments.find(subItem => subItem.id === item.id);
        if (!target && item.workCount != 0) {
          _selected.push(item);
          _iValue.push(item.id);
        }
      }

      // 把当前页面选中的加入
      for (let id of this.selectedEquipmentIds) {
        let equipment = this.equipments.find(item => item.id === id);
        if (!!equipment && equipment.workCount != 0) {
          _selected.push(JSON.parse(JSON.stringify(equipment)));
          _iValue.push(id);
        }
      }

      this.iSelected = _selected;
      this.selectedEquipmentIds = _iValue;
      this.$emit('change', this.iSelected);
      this.$emit('input', this.selectedEquipmentIds);
    },
  },

  render() {
    //let page = this;
    return (
      <div>
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.organizationIds = [];
            this.queryParams.installationSiteId = this.isSimple
              ? this.queryParams.installationSiteId
              : undefined;
            this.queryParams.componentCategoryId = null;
            this.queryParams.keyword = '';
            this.queryParams.iFDCodes = this.queryParams.iFDCodes;
            this.queryParams.orgId = this.queryParams.orgId;
            this.refresh();
          }}
        >
          {this.isSimple || this.isFault ? (
            undefined
          ) : (
            <a-form-item label="维护单位">
              <OrganizationTreeSelect
                axios={this.axios}
                multiple={true}
                value={this.queryParams.organizationIds}
                onInput={value => {
                  this.queryParams.organizationIds = value;
                  this.refresh();
                }}
              />
            </a-form-item>
          )}

          <a-form-item label="安装地点">
            <SmBasicInstallationSiteSelect
              axios={this.axios}
              height={32}
              value={this.queryParams.installationSiteId}
              placeholder="请选择"
              onChange={value => {
                this.queryParams.installationSiteId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          {this.isSimple || this.isFault ? (
            undefined
          ) : (
            <a-form-item label="设备分类">
              <CrmCategoryTreeSelect
                axios={this.axios}
                value={this.queryParams.componentCategoryId}
                onInput={value => {
                  this.queryParams.componentCategoryId = value;
                  this.refresh();
                }}
              />
            </a-form-item>
          )}

          <a-form-item label="关键字">
            <a-input
              placeholder={
                this.isSimple || this.isFault ? '请输入名称、编码' : '请输入名称、型号、厂家、编码'
              }
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          {this.isSimple || this.isFault ? (
            undefined
          ) : (
            <template slot="buttons">
              <div style={'display:flex'}>
                {vIf(
                  <a-button type="primary" icon="plus" onClick={() => this.add(null)}>
                      添加
                  </a-button>,
                  vP(this.permissions, permissionsSmResource.Equipments.Create),
                )}

                {vIf(
                  <SmImport
                    ref="resourceEquipment"
                    url='api/app/resourceEquipment/upload'
                    axios={this.axios}
                    downloadErrorFile={true}
                    importKey="resourceequipments"
                    onSelected={file => this.fileSelected(file)}
                    onIsSuccess={() => this.refresh()}
                  />,
                  vP(this.permissions, permissionsSmResource.Equipments.Import),
                )}

                {vIf(
                  <SmTemplateDownload
                    axios={this.axios}
                    downloadKey="equipments"
                    downloadFileName="设备"
                    defaultTitle="导入模板下载"
                  >
                  </SmTemplateDownload>,
                  vP(this.permissions, permissionsSmResource.Equipments.Import),
                )}

                {vIf(
                  <SmExport
                    url='api/app/resourceEquipment/export'
                    axios={this.axios}
                    templateName="equipments"
                    downloadFileName="设备"
                    rowIndex={1}
                  />,
                  vP(this.permissions, permissionsSmResource.Equipments.Export),
                )}

                {vIf(
                  <SmImportModal
                    title="工程数据导入"
                    axios={this.axios}
                    subComponents={this.importComponents}
                    width="100%"
                  />,
                  vP(this.permissions, permissionsSmResource.Equipments.Import),
                )}

                {vIf(
                  <SmTemplateDownload
                    defaultTitle="工程导入模板下载"
                    axios={this.axios}
                    downComponents={this.downloadComponents}
                  >
                  </SmTemplateDownload>,
                  vP(this.permissions, permissionsSmResource.Equipments.Import),
                )}

                {vIf(
                  <SmExport
                    defaultTitle="工程数据文件导出"
                    url='api/app/resourceEquipment/export'
                    axios={this.axios}
                    exportComponents={this.exportComponents}
                  />,
                  vP(this.permissions, permissionsSmResource.Equipments.Export),
                )}


              </div>
              {/* <a-button type="primary" icon="edit" onClick={this.batchEdit}>
              编辑
            </a-button> */}
              <a-modal
                title="批量编辑"
                visible={this.batchEditVisible}
                onOk={this.batchEditOk}
                confirmLoading={this.batchEditConfirmLoading}
                onCancel={this.handleBatchEditCancel}
              >
                <a-form form={this.batchEditForm}>
                  <a-form-item
                    label="使用年限"
                    label-col={formConfig.labelCol}
                    wrapper-col={formConfig.wrapperCol}
                  >
                    <a-input
                      v-decorator={[
                        'years',
                        {
                          initialValue: '',
                          rules: [{ pattern: /(^[1-9]\d*$)/, message: '请输入正确使用年限！' }],
                        },
                      ]}
                    />
                  </a-form-item>
                </a-form>
              </a-modal>
            </template>
          )}
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.equipments}
          bordered={this.bordered}
          onExpand={(expanded, record) => {
            this.expanded = expanded;
            if (expanded && record.children.length == 0) {
              this.refresh(false, record);
            }
          }}
          rowSelection={
            this.isSimple || this.isFault
              ? {
                type: this.multiple ? 'checkbox' : 'radio', //多选模式Or单选模式。故障中的设备选择框要用到。
                columnWidth: 30,
                selectedRowKeys: this.selectedEquipmentIds,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.selectedEquipmentIds = selectedRowKeys;
                  this.iSelected = selectedRows;
                  if (this.multiple) {
                    this.updateSelected();
                  } else {
                    //this.iSelected = selectedRows;
                    this.$emit('change', this.iSelected);
                    this.$emit('input', this.selectedEquipmentIds);
                    this.updateSelected();//单选也要更新
                  }
                },
              }
              : undefined
          }
          scroll={this.isSimple || this.isFault ? { y: 300 } : undefined}
          pagination={false}
          loading={this.loading}
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
              equipmentRltOrganizations: (text, record, index) => {
                let str = '';
                if (
                  record.equipmentRltOrganizations &&
                  record.equipmentRltOrganizations.length > 0
                ) {
                  record.equipmentRltOrganizations.map((item, index) => {
                    str += `${item.organization.name}${index !== record.equipmentRltOrganizations.length - 1 ? '、' : ''
                    }`;
                  });
                }
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              componentCategory: (text, record, index) => {
                let str = record.componentCategory
                  ? record.componentCategory.parent
                    ? record.componentCategory.parent.name + '-' + record.componentCategory.name
                    : ''
                  : '';
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },

              installationSite: (text, record, index) => {
                let str = record.installationSite ? record.installationSite.name : '';
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },

              productCategory: (text, record, index) => {
                let str = record.productCategory ? record.productCategory.name : '';
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },

              manufacturer: (text, record, index) => {
                let str = record.manufacturer ? record.manufacturer.name : '';
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },

              state: (text, record, index) => {
                return getRunningState(record.state);
              },

              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a onClick={() => { this.add(record); }}   >添加子项</a>,
                      vP(this.permissions, permissionsSmResource.Equipments.Create),
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmResource.Equipments.Create) &&
                      vP(this.permissions, [permissionsSmResource.Equipments.Detail, permissionsSmResource.Equipments.Update, permissionsSmResource.Equipments.Delete]),
                    )}

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>     更多 <a-icon type="down" /> </a>
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
                            vP(this.permissions, permissionsSmResource.Equipments.Detail),
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
                            vP(this.permissions, permissionsSmResource.Equipments.Update),
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
                            vP(this.permissions, permissionsSmResource.Equipments.Delete),
                          )}
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [
                        permissionsSmResource.Equipments.Detail, permissionsSmResource.Equipments.Update, permissionsSmResource.Equipments.Delete]),
                    )}
                  </span>,
                ];
              },

              workCount: (text, record, index) => {
                return this.isSelected(record.id) ? (
                  <a-input-number
                    // min={0}
                    // precision={3}
                    value={record.workCount}
                    onChange={value => {
                      if (value === null) {
                        record.workCount = 0;
                      } else {
                        record.workCount = value;
                      }
                      this.updateWorkCount(record);
                    }}
                  />
                ) : (
                  record.workCount
                );
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
          size={this.isSimple || this.isFault ? 'small' : ''}
          showTotal={paginationConfig.showTotal}
        />


        <SmResourceEquipmentsModal
          ref="SmResourceEquipmentsModal"
          axios={this.axios}
          bordered={this.bordered}
          onSuccess={(action, data) => {
            this.refresh(false);
          }}
        />
        {this.upLoading ? (
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
