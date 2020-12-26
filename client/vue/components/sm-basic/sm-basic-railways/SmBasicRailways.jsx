// import moment from 'moment';
import './style/index.less';

import { StationsType } from '../../_utils/enum';
import * as utils from '../../_utils/utils';
import ApiRailway from '../../sm-api/sm-basic/Railway';
import SmBasicRailwayModal from './SmBasicRailwayModal';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vIf, vP } from '../../_utils/utils';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select/index';

import SmBasicRelateStationModal from './SmBasicRelateStationModal';
import SmBasicRailwaysImportModal from './SmBasicRailwaysImportModal';
import permissionsBasic from '../../_permissions/sm-basic';
import SmTemplateDownload from '../../sm-common/sm-import-template-module';
import SmExport from '../../sm-common/sm-export-module';

let apiRailway = new ApiRailway();

export default {
  name: 'SmBasicRailways',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      railways: [], // 列表数据源
      pageIndex: 1,
      queryParams: {
        RailwayName: '', // 搜索关键字
        StationName: '', // 搜索关键字
        Type: undefined,
        BelongOrgId: null,
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
          title: '线路名称',
          dataIndex: 'name',
          ellipsis: true,
          width: 180,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '所属单位',
          dataIndex: 'belongOrgsStr',
          ellipsis: true,
          width: 400,
        },
        {
          title: '起始站点',
          dataIndex: 'startStation',
          scopedSlots: { customRender: 'startStation' },
        },
        {
          title: '终止站点',
          dataIndex: 'lastStation',
          scopedSlots: { customRender: 'lastStation' },
        },
        {
          title: '线路类型',
          dataIndex: 'typeStr',
          ellipsis: true,
          width: 100,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
    innerColumns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '站点名称',
          dataIndex: 'name',
        },
        {
          title: '线路类型',
          dataIndex: 'typeStr',
          filters: [
            {
              text: '车站',
              value: '0',
            },
            {
              text: '区间',
              value: '1',
            }],
          onFilter: (value, record) => record.type == value,
        },
        {
          title: '公里标',
          dataIndex: 'kmMark',
          scopedSlots: { customRender: 'kmMark' },
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
      this.$refs.SmBasicRailwayModal.add();
    },
    edit(record) {
      this.$refs.SmBasicRailwayModal.edit(record);
    },
    view(record) {
      this.$refs.SmBasicRailwayModal.view(record);
    },
    relateStations(record) {
      this.$refs.SmBasicRelateStationModal.relateStations(record);
    },
    initAxios() {
      apiRailway = new ApiRailway(this.axios);
    },

    getStationTypeTitle(record) {
      if (record.stationType === 1) {
        return utils.getStationTypeTitle(StationsType.Station);
      } else if (record.stationType === 2) {
        return utils.getStationTypeTitle(StationsType.Section);
      } else {
        return utils.getStationTypeTitle();
      }
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiRailway.delete(record.id);
            _this.refresh(false, _this.pageIndex);

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
        this.queryParams.SkipCount = (this.pageIndex - 1) * this.queryParams.maxResultCount;
      }
      let response = await apiRailway.getList(this.queryParams);
      if (requestIsSuccess(response)) {
        let _railways = response.data.items;
        _railways.map(item => {
          item.stations.sort((a, b) => a.passOrder - b.passOrder);
          item.showStations = item.stations;
          if (item.type == 1) {
            item.isShowUp = true;
          }
        });
        this.railways = _railways;
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
      this.refresh(false);
    },
  },
  render() {
    let TypeOptions = [
      <a-select-option key="0">单线</a-select-option>,
      <a-select-option key="1">复线</a-select-option>,
    ];
    return (
      <div class="sm-basic-railways">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.RailwayName = '';
            this.queryParams.StationName = '';
            this.queryParams.Type = undefined;
            this.queryParams.BelongOrgId = null;
            this.refresh();
          }}
        >
          <a-form-item label="线路名称">
            <a-input
              placeholder="线路名称"
              allowClear
              value={this.queryParams.RailwayName}
              onInput={event => {
                this.queryParams.RailwayName = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="所属单位">
            <OrganizationTreeSelect
              axios={this.axios}
              value={this.queryParams.BelongOrgId}
              onChange={value => {
                this.queryParams.BelongOrgId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="站点名称">
            <a-input
              placeholder="站点名称"
              allowClear
              value={this.queryParams.StationName}
              onInput={event => {
                this.queryParams.StationName = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="线路类型">
            <a-select
              placeholder="线路类型"
              allowClear
              value={this.queryParams.Type}
              onChange={value => {
                this.queryParams.Type = value;
                this.refresh();
              }}
            >
              {TypeOptions}
            </a-select>
          </a-form-item>
          <template slot="buttons">
            <div style='display:flex'>
              {
                vIf(
                  <a-button type="primary" icon="plus" onClick={this.add}>
                    添加
                  </a-button>,
                  vP(this.permissions,
                    permissionsBasic.Railways.Create),
                )
              }
              {
                vIf(
                  <a-button
                    type="primary"
                    icon="import"
                    onClick={() => {
                      this.$refs.SmBasicRailwaysImportModal.upload();
                    }}
                  >
                    导入
                  </a-button>,
                  vP(this.permissions,
                    permissionsBasic.Railways.Import),
                )
              }
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  downloadKey="railways"
                  downloadFileName="组织-线路"
                >
                </SmTemplateDownload>,
                vP(this.permissions, permissionsBasic.Railways.Import),
              )}
              {vIf(
                <SmExport
                  axios={this.axios}
                  url='api/app/basicRailway/export'
                  templateName="railways"
                  rowIndex={4}
                  downloadFileName="组织-线路"
                >
                </SmExport>,
                vP(this.permissions, permissionsBasic.Railways.Export),
              )}
            </div>
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.railways}
          rowKey={record => record.id}
          loading={this.loading}
          //分页
          pagination={
            this.railways && this.railways.length > 0
              ? {
                showTotal: paginationConfig.showTotal,
                total: this.totalCount,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: this.queryParams.maxResultCount,
                current: this.pageIndex,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageChange,
              }
              : false
          }
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                let str = `${(this.pageIndex - 1) * this.queryParams.maxResultCount + (index + 1)}. ${record.name}`;
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              startStation: (text, record, index) => {
                let str = record.stations.length > 0 ? record.stations[0].name : null;
                return str == null ? '' : <a-tooltip title={str}>{str}</a-tooltip>;
              },
              lastStation: (text, record) => {
                let str =
                  record.stations.length > 0
                    ? record.stations[record.stations.length - 1].name
                    : null;
                return str == null ? '' : <a-tooltip title={str}>{str}</a-tooltip>;
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
                        vP(this.permissions,
                          permissionsBasic.Railways.Detail),
                      )
                    }
                    {
                      vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions,
                          permissionsBasic.Railways.Detail) &&
                        vP(this.permissions, [permissionsBasic.Railways.Relate,
                          permissionsBasic.Railways.Update,
                          permissionsBasic.Railways.Delete]),
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
                                      this.relateStations(record);
                                    }}
                                  >
                                    关联站点
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions,
                                  permissionsBasic.Railways.Relate),
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
                                  permissionsBasic.Railways.Update),
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
                                  permissionsBasic.Railways.Delete),
                              )
                            }
                          </a-menu>
                        </a-dropdown>,
                        vP(this.permissions,
                          [
                            permissionsBasic.Railways.Relate,
                            permissionsBasic.Railways.Update,
                            permissionsBasic.Railways.Delete,
                          ]),
                      )
                    }


                  </span>,
                ];
              },
              expandedRowRender: text => {
                return (
                  <div>
                    {text.type == 1 ? (
                      <a-radio-group value={text.isShowUp} onChange={(val) => {
                        text.isShowUp = val.target.value;
                        if (text.isShowUp) text.showStations = text.stations;
                        else text.showStations = text.downLinkStations;
                      }} >
                        <a-radio-button value={true}>
                          上行
                        </a-radio-button>
                        <a-radio-button value={false}>
                          下行
                        </a-radio-button>
                      </a-radio-group>
                    ) : undefined}
                    <a-table
                      rowKey={record => record.id}
                      slot-scope="text"
                      columns={this.innerColumns}
                      dataSource={text.showStations}
                      pagination={false}
                      loading={this.loading}
                      {...{
                        scopedSlots: {
                          index: (text, record, index) => {
                            return index + 1;
                          },
                          kmMark: (text, record) => {
                            return record.type == 0 ? record.kmMark : '';
                          },
                        },
                      }}
                    ></a-table>
                  </div>
                );
              },
            },
          }}
        ></a-table>

        <SmBasicRailwayModal
          ref="SmBasicRailwayModal"
          axios={this.axios}
          bordered={this.bordered}
          organizationId={this.queryParams.organizationId}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        <SmBasicRelateStationModal
          ref="SmBasicRelateStationModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

        <SmBasicRailwaysImportModal
          ref="SmBasicRailwaysImportModal"
          axios={this.axios}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div >
    );
  },
};
