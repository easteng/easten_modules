import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import ApiStoreHouse from '../../sm-api/sm-resource/StoreHouse';
import './style/index.less';
import SmResourceStoreHouseModel from './SmResourceStoreHouseModel';
import { StoreHouseEnable } from '../../_utils/enum';
import ApiArea from '../../sm-api/sm-common/Area';
import AreaModule from "../../sm-common/sm-area-module";
import { requestIsSuccess, getStoreHouseEnableOption, vIf, vP } from '../../_utils/utils';
import permissionsSmResource from '../../_permissions/sm-resource';

let apiStoreHouse = new ApiStoreHouse();
let apiArea = new ApiArea();

export default {
  name: 'SmResourceStoreHouse',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        keyWords: '', //模糊查询
        enabled: StoreHouseEnable.All, //状态
        areaId: [],
        maxResultCount: paginationConfig.defaultPageSize,
      },
      storeHouse: [], // 列表数据源
      loading: false,
      positions: null,
      index: null,
      record: null,
      recorParent: null,
      expandedRowKeys: [],//展开的行
    };
  },
  computed: {
    dataSource() {
      return this.sortByOrder(this.storeHouse);
    },
    columns() {
      return [
        {
          title: '名称',
          dataIndex: 'name',
          width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
        },
        {

          title: '状态',
          dataIndex: 'enabled',
          scopedSlots: { customRender: 'enabled' },

        },
        {

          title: '库存',
          dataIndex: 'count',
          ellipsis: true,
          scopedSlots: { customRender: 'count' },

        },
        {
          title: '区域',
          ellipsis: true,
          dataIndex: 'areaId',
          scopedSlots: { customRender: 'areaId' },
        },
        {
          title: '详细地址',
          dataIndex: 'address',
          ellipsis: true,
          scopedSlots: { customRender: 'address' },
        },
        {

          title: '坐标位置',
          dataIndex: 'position',
          scopedSlots: { customRender: 'position' },
        },

        {
          title: '排序',
          dataIndex: 'order',
          scopedSlots: { customRender: 'order' },
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
  watch: {},
  async created() {
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiStoreHouse = new ApiStoreHouse(this.axios);
      apiArea = new ApiArea(this.axios);
    },
    // 添加
    add(record) {
      this.record = record;
      this.$refs.SmResourceStoreHouseModel.add(record);
    },
    // 编辑
    edit(record) {
      this.record = record;
      this.$refs.SmResourceStoreHouseModel.edit(record);
    },

    // 详情
    view(record) {
      this.record = record;
      this.$refs.SmResourceStoreHouseModel.view(record);
    },


    // 删除
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiStoreHouse.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.record = record;
              _this.$message.success('操作成功');
              _this.refresh(false, null, _this.pageIndex);
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },

    //修改状态
    async checkEnable(record) {
      let enable = !record.enabled;

      let _this = this;
      this.$confirm({
        title: record.enabled === true ? tipsConfig.UnEnableStoreHouse.title : tipsConfig.EnableStoreHouse.title,
        content: h => record.enabled === true ? <div style="color:red;">{tipsConfig.UnEnableStoreHouse.content}</div> : <div style="color:red;">{tipsConfig.EnableStoreHouse.content}</div>,
        okType: 'danger',
        async onOk() {
          let response = await apiStoreHouse.updateEnable({ id: record.id, enabled: enable });
          if (requestIsSuccess(response)) {
            _this.$message.success('操作成功');
            _this.refresh(false, null, _this.pageIndex);
          }
        },
        onCancel() { },
      });

    },
    // 根据order字段对仓库进行排序
    sortByOrder(array) {
      array
        .sort((a, b) => a.order - b.order)
        .map(item => {
          if (item.children && item.children.length > 0) {
            this.sortByOrder(item.children);
          }
        });
      return array;
    },

    // 刷新列表
    async refresh(resetPage = true, parent = null, page) {
      this.loading = true;
      if (parent === null) {
        this.storeHouse = [];
      }
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let areaId = "";
      for (let item in this.queryParams.areaId) {
        areaId = this.queryParams.areaId[item];
      }
      let queryParams = {};
      if (parent) {
        queryParams.parentId = parent.id;
        queryParams.isAll = true;
      } else {
        queryParams = { ...this.queryParams, areaId: areaId };
      }
      let response = await apiStoreHouse.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });

      if (requestIsSuccess(response) && response.data && response.data.items) {
        if (parent) {
          parent.children = response.data.items;
        } else {
          this.storeHouse = response.data.items;
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
    //栏目启用状态
    let Options = [];
    for (let item in StoreHouseEnable) {
      Options.push(
        <a-select-option key={`${StoreHouseEnable[item]}`}>
          {getStoreHouseEnableOption(StoreHouseEnable[item])}
        </a-select-option>,
      );
    }

    return (
      <div class="sm-resource-store-house">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.keyWords = '';
            this.queryParams.enabled = StoreHouseEnable.All;
            this.queryParams.areaId = [];
            this.refresh();
          }}
        >
          <a-form-item label="区域">
            <AreaModule
              axios={this.axios}
              placeholder="请输入"
              deep={2}
              value={this.queryParams.areaId}
              onChange={value => {
                this.queryParams.areaId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="关键字">
            <a-input
              placeholder="请输入名称/详细地址"
              value={this.queryParams.keyWords}
              onInput={event => {
                this.queryParams.keyWords = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              placeholder="请选择"
              value={this.queryParams.enabled}
              onChange={value => {
                this.queryParams.enabled = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
          </a-form-item>
          {vIf(
            <template slot="buttons">
              <a-button type="primary" onClick={() => this.add()} icon="plus">
                添加
              </a-button>
            </template>,
            vP(this.permissions, permissionsSmResource.StoreHouse.Create),
          )}

        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.dataSource}
          bordered={this.bordered}
          onExpand={(expanded, record) => {
            if (expanded && record.children.length == 0) {
              this.refresh(false, record);
            }
          }}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              name: (text, record, index) => {
                let result = `${index +
                  1 +
                  this.queryParams.maxResultCount * (this.pageIndex - 1)} `;
                return record.enabled === true ?
                  <span>{result}<si-store color="green" />
                    <a-tooltip title={text} placement="topLeft">{text}</a-tooltip>
                  </span> :
                  <span>
                    {result}
                    <si-store />
                    <a-tooltip title={text} placement="topLeft">
                      {text}
                    </a-tooltip>
                  </span>;
              },
              enabled: (text, record, index) => {
                return record.enabled == true ? <a-tag color="green">正常</a-tag> : <a-tag color="red">已停用</a-tag>;
              },
              count: (text, record, index) => {
                return '';
              },

              areaId: (text, record, index) => {
                let area = "";
                if (record.area != null) {
                  area = record.area.fullName + area;
                  if (record.area.parent != null) {
                    area = record.area.parent.fullName + area;
                    if (record.area.parent.parent != null) {
                      area = record.area.parent.parent.fullName + area;
                    }
                  }
                }
                let result = area.replace(/'/g, '');
                return <a-tooltip title={result} placement="topLeft">{result}</a-tooltip>;
              },
              address: (text, record, index) => {
                let result = record.address ? record.address : '';
                return <a-tooltip title={result} placement="topLeft">{result}</a-tooltip>;
              },
              position: (text, record, index) => {
                let position = JSON.parse(record.position);
                let result = position.longitude ? `${position.longitude},  ${position.latitude}` : position.latitude;
                return <a-tooltip title={result} placement="topLeft">{result}</a-tooltip>;
              },
              order: (text, record, index) => {
                let result = record.order;
                return <a-tooltip title={result} placement="topLeft">{result}</a-tooltip>;

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
                      vP(this.permissions, permissionsSmResource.StoreHouse.Detail),
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmResource.StoreHouse.Detail) &&
                      vP(this.permissions, [
                        permissionsSmResource.StoreHouse.Create,
                        permissionsSmResource.StoreHouse.Update,
                        permissionsSmResource.StoreHouse.UpdateEnable,
                        permissionsSmResource.StoreHouse.Delete,
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
                                  this.add(record);
                                }}
                              >
                                增加子项
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmResource.StoreHouse.Create),
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
                            vP(this.permissions, permissionsSmResource.StoreHouse.Update),
                          )}

                          {vIf(
                            record.enabled ? (
                              <a-menu-item>
                                <a
                                  onClick={() => {
                                    this.checkEnable(record);
                                  }}
                                >
                                  停用
                                </a>
                              </a-menu-item>
                            ) : (
                              <a-menu-item>
                                <a
                                  onClick={() => {
                                    this.checkEnable(record);
                                  }}
                                >
                                    启用
                                </a>
                              </a-menu-item>
                            ),
                            vP(this.permissions, permissionsSmResource.StoreHouse.UpdateEnable),
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
                            vP(this.permissions, permissionsSmResource.StoreHouse.Delete),
                          )}

                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [
                        permissionsSmResource.StoreHouse.Create,
                        permissionsSmResource.StoreHouse.Update,
                        permissionsSmResource.StoreHouse.UpdateEnable,
                        permissionsSmResource.StoreHouse.Delete,
                      ]),
                    )}
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


        {/* 添加/编辑模板 */}
        <SmResourceStoreHouseModel
          ref="SmResourceStoreHouseModel"
          axios={this.axios}
          onSuccess={(action, data) => {
            this.refresh(false);
          }}
        />


      </div>
    );
  },
};
