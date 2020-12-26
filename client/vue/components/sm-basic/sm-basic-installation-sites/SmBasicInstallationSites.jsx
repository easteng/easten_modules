import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { InstallationSiteLocationType } from '../../_utils/enum';
import { requestIsSuccess, getInstallationSiteLocationTypeTitle, vIf, vP } from '../../_utils/utils';
import SmSystemOrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import SmBasicInstallationSiteModal from './SmBasicInstallationSiteModal';
import SmBasicRailwayTreeSelect from '../sm-basic-railway-tree-select';
import SmSystemDataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import permissionsBasic from '../../_permissions/sm-basic';
import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import ApiStation from '../../sm-api/sm-basic/Station';
import SmExport from '../../sm-common/sm-export-module';
import StationCascader from '../../sm-basic/sm-basic-station-cascader';
import SmBasicStationSelectByRailway from '../sm-basic-station-select-by-railway';
let apiStation = new ApiStation();
let apiInstallationSite = new ApiInstallationSite();

export default {
  name: 'SmBasicInstallationSites',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    isSimple: { type: Boolean, default: false },//是否精简模式
    multiple: { type: Boolean, default: false },//是否多选
    selected: { type: Array, default: () => [] },//所选机房
    permissions: { type: Array, default: () => [] },//权限
    // railwayRltStation: { type: Object, default: null },//线路和站id
  },

  data() {
    return {
      isLoading: false,
      fileList: [],
      loading: false,
      installationSites: [],
      selectedInstallationSiteIds: [],//已选机房ids
      iSelected: [],//已选机房
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        keyword: '',
        stationId: undefined,
        railwayId: undefined,
        organizationId: undefined,
        typeId: null,
        locationType: undefined, //位置类别
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      record: null,
      stationOption: [],//线路关联站点
    };
  },
  computed: {
    columns() {
      return this.isSimple ?
        [
          {
            title: '线别',
            dataIndex: 'railway',
            scopedSlots: { customRender: 'railway' },
            ellipsis: true,
          },
          {
            title: '车站区间',
            dataIndex: 'station',
            scopedSlots: { customRender: 'station' },
            ellipsis: true,
          },
          {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
            width: 140,
            ellipsis: true,
          },
          {
            title: '使用单位',
            dataIndex: 'organization',
            ellipsis: true,
            scopedSlots: { customRender: 'organization' },
          },
          {
            title: 'CSRG编码',
            dataIndex: 'csrgCode',
            width: 180,
            ellipsis: true,
          },
          // {
          //   title: 'Code编码',
          //   dataIndex: 'code',
          //   ellipsis: true,
          // },
          // {
          //   title: '机房类别',
          //   dataIndex: 'type',
          //   scopedSlots: { customRender: 'type' },
          //   ellipsis: true,
          // },
          {
            title: '位置类别',
            dataIndex: 'locationType',
            scopedSlots: { customRender: 'locationType' },
            ellipsis: true,
          },
          {
            title: '机房位置',
            dataIndex: 'location',
            ellipsis: true,
          },
        ] :
        [
          {
            title: '线别',
            dataIndex: 'railway',
            scopedSlots: { customRender: 'railway' },
            ellipsis: true,
          },
          {
            title: '车站区间',
            dataIndex: 'station',
            scopedSlots: { customRender: 'station' },
            ellipsis: true,
          },
          {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
            width: 180,
            ellipsis: true,
          },

          // {
          //   title: 'Code编码',
          //   dataIndex: 'code',
          //   ellipsis: true,
          // },
          {
            title: '使用单位',
            dataIndex: 'organization',
            ellipsis: true,
            scopedSlots: { customRender: 'organization' },
          },
          {
            title: 'CSRG编码',
            dataIndex: 'csrgCode',
            width: 180,
            ellipsis: true,
          },
          {
            title: '机房类别',
            dataIndex: 'type',
            scopedSlots: { customRender: 'type' },
            ellipsis: true,
          },
          {
            title: '位置类别',
            dataIndex: 'locationType',
            scopedSlots: { customRender: 'locationType' },
            ellipsis: true,
          },
          {
            title: '机房位置',
            dataIndex: 'location',
            ellipsis: true,
          },
          {
            title: '操作',
            dataIndex: 'operations',
            width: 150,
            scopedSlots: { customRender: 'operations' },
          },
        ];
    },
  },
  watch: {
    selected: {
      handler: function (value, oldVal) {
        this.iSelected = value;
        this.selectedInstallationSiteIds = value.map(item => item.id);
      },
      immediate: true,
    },
    // railwayRltStation: {
    //   handler: function (value, oldVal) {
    //     this.queryParams.railwayId = this.railwayRltStation.railwayId;
    //     this.queryParams.stationId = this.railwayRltStation.stationId;
    //     this.queryParams.organizationId = this.railwayRltStation.organizationId;
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiInstallationSite = new ApiInstallationSite(this.axios);
      apiStation = new ApiStation(this.axios);
    },
    add(record) {
      this.record = record;
      this.$refs.SmBasicInstallationSiteModal.add(record);
    },
    edit(record) {
      this.record = record;
      this.$refs.SmBasicInstallationSiteModal.edit(record);
    },
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiInstallationSite.delete(record.id);
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
      this.$refs.SmBasicInstallationSiteModal.view(record);
    },

    //根据线路获取站点
    async getListByRailwayId(railwayId) {
      let response = await apiStation.getListByRailwayId(railwayId);
      if (requestIsSuccess(response) && response.data) {
        this.stationOption = [];
        for (let item of response.data) {
          this.stationOption.push(<a-select-option key={item.id}>
            {item.name}
          </a-select-option>);
        }
      }
    },
    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'installationSites',
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
    },

    //更新数据
    async refresh(resetPage = true, parent = null, page) {
      if (parent === null) {
        this.installationSites = [];
      }
      this.loading = true;
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
      let response = await apiInstallationSite.getTreeList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });
      if (requestIsSuccess(response) && response.data.items) {
        if (parent) {
          parent.children = response.data.items;
        } else {
          this.installationSites = response.data.items;
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
      this.record = null;
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    //更新所选数据
    updateSelected(selectedRows) {
      if (this.multiple) {
        // 过滤出其他页面已经选中的
        let _selected = [];
        for (let item of this.iSelected) {
          let target = this.installationSites.find(subItem => subItem.id === item.id);
          if (!target) {
            _selected.push(item);
          }
        }

        // 把当前页面选中的加入
        for (let id of this.selectedInstallationSiteIds) {
          let installationSite = this.installationSites.find(item => item.id === id);
          if (!!installationSite) {
            _selected.push(JSON.parse(JSON.stringify(installationSite)));
          }
        }

        this.iSelected = _selected;
      } else {
        this.iSelected = selectedRows;
      }

      this.$emit('change', this.iSelected);
    },
  },
  render() {
    //位置类别类型枚举
    let locationTypeOptions = [];
    for (let item in InstallationSiteLocationType) {
      locationTypeOptions.push(
        <a-select-option key={`${InstallationSiteLocationType[item]}`}>
          {getInstallationSiteLocationTypeTitle(InstallationSiteLocationType[item])}
        </a-select-option>,
      );
    }

    return (
      <div>
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.keyword = '';
            this.queryParams.typeId = null;
            this.queryParams.organizationId = undefined;
            this.queryParams.railwayId = undefined;
            this.queryParams.stationId = undefined;
            this.queryParams.locationType = undefined;
            this.refresh();
          }}
        >
          <a-form-item label="所属线别">
            <SmBasicRailwayTreeSelect
              organizationId={this.queryParams.organizationId}
              axios={this.axios}
              value={this.queryParams.railwayId}
              onChange={value => {
                this.queryParams.railwayId = value;
                this.queryParams.stationId = undefined;
                this.getListByRailwayId(value);
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="车站(区间)">
            <SmBasicStationSelectByRailway
              axios={this.axios}
              // organizationId={this.queryParams.organizationId}
              railwayId={this.queryParams.railwayId}
              placeholder="请选择车站(区间)"
              value={this.queryParams.stationId}
              allowClear
              onChange={value => {
                this.queryParams.stationId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          {/* <StationCascader
              axios={this.axios}
              organizationId={this.queryParams.organizationId}
              railwayId={this.queryParams.railwayId}
              placeholder="请选择车站(区间)"
              value={this.queryParams.stationId}
              allowClear
              onChange={value => {
                this.queryParams.stationId = value;
                this.refresh();
              }}
            />
          </a-form-item> */}
          {/* <a-form-item label="所属线别">
            <SmBasicRailwaySelect
              axios={this.axios}
              showSearch={true}
              value={this.queryParams.railwayId}
              onInput={value => {
                this.queryParams.railwayId = value;
                this.getListByRailwayId(value);
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="车站区间">
            <a-select
              placeholder="请选择车站区间"
              value={this.queryParams.stationId}
              allowClear
              onChange={
                value => {
                  this.queryParams.stationId = value;
                  this.refresh();
                }
              }
            >
              {this.stationOption}
            </a-select>
          </a-form-item> */}

          <a-form-item label="关键词">
            <a-input
              placeholder="请输入名称、编码、机房位置"
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="使用单位">
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.organizationId}
              onInput={value => {
                this.queryParams.organizationId = value;
                this.queryParams.railwayId = undefined;
                this.queryParams.stationId = undefined;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="机房类别">
            <SmSystemDataDictionaryTreeSelect
              axios={this.axios}
              groupCode={'InstallationSiteType'}
              value={this.queryParams.typeId}
              onInput={value => {
                this.queryParams.typeId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="位置类别">
            <a-select
              allowClear
              value={this.queryParams.locationType}
              placeholder='请选择位置类别'
              onChange={value => {
                this.queryParams.locationType = value;
                this.refresh();
              }}
            >
              {locationTypeOptions}
            </a-select>
          </a-form-item>

          {!this.isSimple ? <template slot="buttons">
            <div style={'display:flex'}>
              {
                vIf(
                  <a-button type="primary" icon="plus" onClick={() => this.add(null)}>
                    添加
                  </a-button>,
                  vP(this.permissions, permissionsBasic.InstallationSites.Create),
                )
              }
              {vIf(
                <SmImport
                  ref="smImport"
                  url='api/app/basicInstallationSite/upload'
                  axios={this.axios}
                  downloadErrorFile={true}
                  importKey="installationSites"
                  onSelected={file => this.fileSelected(file)}
                  onIsSuccess={() => this.refresh()}
                />,
                vP(this.permissions,
                  permissionsBasic.InstallationSites.Import),
              )
              }
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  downloadKey="installationSites"
                  downloadFileName="机房"
                >
                </SmTemplateDownload>,
                vP(this.permissions, permissionsBasic.InstallationSites.Import),
              )}
              {vIf(
                <SmExport
                  url='api/app/basicInstallationSite/export'
                  axios={this.axios}
                  templateName="installationSites"
                  downloadFileName="机房"
                  rowIndex={5}
                />,
                vP(this.permissions,
                  permissionsBasic.InstallationSites.Export),
              )}
            </div>
          </template> : undefined}

        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.installationSites}
          bordered={this.bordered}
          onExpand={(expanded, record) => {
            if (expanded && record.children.length == 0) {
              this.refresh(false, record);
            }
          }}
          rowSelection={this.isSimple ? {
            type: this.multiple ? 'checkbox' : 'radio',
            columnWidth: 30,
            selectedRowKeys: this.selectedInstallationSiteIds,
            onChange: (selectedRowKeys, selectedRows) => {
              this.selectedInstallationSiteIds = selectedRowKeys;
              this.updateSelected(selectedRows);
            },
          } : undefined}
          scroll={this.isSimple ? { y: 300 } : undefined}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              railway: (text, record, index) => {
                let string = `${index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1)}.${record.railway ? record.railway.name : ''}`;
                return <a-tooltip placement="topLeft" title={string}>
                  {string}
                </a-tooltip>;
              },

              station: (text, record) => {
                let string = record.station ? record.station.name : '';
                return <a-tooltip placement="topLeft" title={string}>
                  {string}
                </a-tooltip>;
              },

              name: (text, record, index) => {
                let result = ` ${text}`;
                return (
                  <a-tooltip placement="topLeft" title={text}>
                    <span>{text}</span>
                  </a-tooltip>
                );
              },

              organization: (text, record) => {
                let string = record.organization ? record.organization.name : '';
                return <a-tooltip placement="topLeft" title={string}>
                  {string}
                </a-tooltip>;
              },

              type: (text, record) => {
                let string = record.type ? record.type.name : '';
                return <a-tooltip placement="topLeft" title={string}>
                  {string}
                </a-tooltip>;
              },

              locationType: (text, record) => {
                let string = record.locationType ? getInstallationSiteLocationTypeTitle(record.locationType) : '';
                return <a-tooltip placement="topLeft" title={string}>
                  {string}
                </a-tooltip>;
              },

              operations: (text, record) => {
                return [
                  <span>
                    {
                      vIf(
                        <div style="display: initial">
                          <a
                            onClick={() => {
                              this.add(record);
                              this.record = record;
                            }}
                          >
                            添加子项
                          </a>
                        </div>,
                        vP(this.permissions,
                          permissionsBasic.InstallationSites.Create),
                      )
                    }
                    {
                      vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions,
                          permissionsBasic.InstallationSites.Create) &&
                        vP(this.permissions, [permissionsBasic.InstallationSites.Detail,
                          permissionsBasic.InstallationSites.Update,
                          permissionsBasic.InstallationSites.Delete]),
                      )
                    }
                    {
                      vIf(
                        <a-dropdown trigger={['click']}>
                          <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            更多 <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">
                            {
                              vIf(
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.view(record);
                                    }}
                                  >
                                    详情
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions,
                                  permissionsBasic.InstallationSites.Detail),
                              )
                            }
                            {
                              vIf(
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.edit(record);
                                    }}
                                  >
                                    编辑
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions,
                                  permissionsBasic.InstallationSites.Update),
                              )
                            }
                            {
                              vIf(
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.remove(record);
                                    }}
                                  >
                                    删除
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions,
                                  permissionsBasic.InstallationSites.Delete),
                              )
                            }

                          </a-menu>
                        </a-dropdown>,
                        vP(this.permissions, [permissionsBasic.InstallationSites.Detail,
                          permissionsBasic.InstallationSites.Update,
                          permissionsBasic.InstallationSites.Delete]),
                      )
                    }


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

        <SmBasicInstallationSiteModal
          ref="SmBasicInstallationSiteModal"
          axios={this.axios}
          bordered={this.bordered}
          onSuccess={(action, data) => {
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
