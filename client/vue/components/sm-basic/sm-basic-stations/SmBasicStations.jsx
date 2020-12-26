import ApiStation from '../../sm-api/sm-basic/Station';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getStationTypeTitle, vPermission, vP, vIf } from '../../_utils/utils';

import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select/index';
import SmBasicRailwayTreeSelect from '../sm-basic-railway-tree-select/index';
import SmBasicStationsModal from './SmBasicStationsModal';
import SmImport from '../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmExport from '../../sm-common/sm-export-module';
import permissionsBasic from '../../_permissions/sm-basic';
let apiStation = new ApiStation();

export default {
  name: 'SmBasicStations',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      stations: [],
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        repairTeamId: null,
        name: '',
        SkipCount: 0,
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      fileList: [],
      loading: false,
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
          title: '站点名称',
          dataIndex: 'name',
          ellipsis: true,
          // width: 150,
        },
        // {
        //   title: '站区类型',
        //   dataIndex: 'typeStr',
        // },
        {
          title: '所属线路',
          dataIndex: 'belongRailways',
          ellipsis: true,
          width: 400,
        },
        // {
        //   title: '维护车间',
        //   dataIndex: 'repairTeamParentStr',
        // },
        {
          title: '维护班组',
          dataIndex: 'repairTeams',
          ellipsis: true,
          width: 300,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true,
          width: 200,
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
      this.$refs.SmBasicStationsModal.add();
    },
    edit(record) {
      this.$refs.SmBasicStationsModal.edit(record);
    },
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiStation.delete(record.id);
            _this.refresh(false, _this.pageIndex);

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
    view(record) {
      this.$refs.SmBasicStationsModal.view(record);
    },
    initAxios() {
      apiStation = new ApiStation(this.axios);
    },
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.SkipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      let response = await apiStation.getList(this.queryParams);
      if (requestIsSuccess(response)) {
        let _dat = response.data.items.map(item => {
          return {
            ...item,
            stationTypeStr: getStationTypeTitle(item.stationType),
          };
        });
        this.stations = _dat;
        this.totalCount = response.data.totalCount;
        if (page && this.totalCount && this.queryParams.maxResultCount) {
          let currentPage = parseInt(this.totalCount / this.queryParams.maxResultCount);
          if (this.totalCount % this.queryParams.maxResultCount !== 0) {
            currentPage = page + 1;
          }
          if (page > currentPage) {
            this.pageIndex = currentPage;
            this.queryParams.SkipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
            this.refresh(false, this.pageIndex);
          }
        }
      }

      this.loading = false;
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      this.queryParams.SkipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'stations',
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
            this.queryParams.repairTeamId = null;
            this.queryParams.belongRaId = null;
            this.queryParams.name = '';
            this.refresh();
          }}
        >
          <a-form-item label="站点名称">
            <a-input
              allowClear
              placeholder="请输入站点名称"
              value={this.queryParams.name}
              onInput={event => {
                this.queryParams.name = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="所属线路">
            <SmBasicRailwayTreeSelect
              axios={this.axios}
              value={this.queryParams.belongRaId}
              onInput={value => {
                this.queryParams.belongRaId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="维护班组">
            <OrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.repairTeamId}
              onInput={value => {
                this.queryParams.repairTeamId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <template slot="buttons">
            <div style={'display:flex'}>
              {
                vIf(
                  <a-button type="primary" icon="plus" onClick={this.add}>
                    添加
                  </a-button>,
                  vP(this.permissions, permissionsBasic.Stations.Create),
                )
              }
              {
                vIf(
                  < SmImport
                    ref="smImport"
                    url='/api/app/basicStation/upload'
                    axios={this.axios}
                    downloadErrorFile={true}
                    importKey="stations"
                    onSelected={file => this.fileSelected(file)}
                    onIsSuccess={() => this.refresh()}
                  />,
                  vP(this.permissions, permissionsBasic.Stations.Import),
                )
              }
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  downloadKey="stations"
                  downloadFileName="线路-站点"
                >
                </SmTemplateDownload>,
                vP(this.permissions, permissionsBasic.Stations.Import),
              )}
              {vIf(
                < SmExport
                  url='/api/app/basicStation/export'
                  axios={this.axios}
                  templateName="stations"
                  downloadFileName="线路-站点"
                  rowIndex={4}
                />,
                vP(this.permissions, permissionsBasic.Stations.Export),
              )}
            </div>
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.stations}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              operations: (text, record) => {
                return [
                  <span>
                    {
                      vIf(
                        <div style="display: initial">
                          <a
                            onClick={() => {
                              this.view(record);
                            }}
                          >
                            详情
                          </a>
                        </div>,
                        vP(this.permissions, permissionsBasic.Stations.Detail),
                      )
                    }
                    {
                      vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions, permissionsBasic.Stations.Detail) &&
                        vP(this.permissions, [permissionsBasic.Stations.Update,
                          permissionsBasic.Stations.Delete]),
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
                                      this.edit(record);
                                    }}
                                  >
                                    编辑
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions, [permissionsBasic.Stations.Update]),
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
                                vP(this.permissions, [permissionsBasic.Stations.Delete]),
                              )
                            }
                          </a-menu>
                        </a-dropdown>,
                        vP(this.permissions,
                          [
                            permissionsBasic.Stations.Update,
                            permissionsBasic.Stations.Delete,
                          ]),
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


        <SmBasicStationsModal
          ref="SmBasicStationsModal"
          axios={this.axios}
          bordered={this.bordered}
          organizationId={this.queryParams.repairTeamId}
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
