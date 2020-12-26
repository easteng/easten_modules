import ApiRepairItem from '../../sm-api/sm-std-basic/RepairItem';
import ApiRepairTestItem from '../../sm-api/sm-std-basic/RepairTestItem';
import DataDictionaryTreeSelect from '../../sm-system/sm-system-data-dictionary-tree-select';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import {
  requestIsSuccess,
  getDateReportTypeTitle,
  getRepairTypeTitle,
  getRepairValTypeTitle,
  getRepairPeriodUnit,
  vIf,
  vP,
} from '../../_utils/utils';
import permissionsSmStdBasic from '../../_permissions/sm-std-basic';
import SmStdBasicRepairItemModal from './SmStdBasicRepairItemModal';
import { DateReportType, RepairType, RepairPeriodUnit } from '../../_utils/enum';
import SmStdBasicRepairTestItemModal from './SmStdBasicRepairTestItemModal';
import SmFileManageSelect from '../../sm-file/sm-file-manage-select';
import SmStdBasicComponentCategorySelect from '../sm-std-basic-component-category-tree-select';
import SmStdBasicRepairGroupSelect from '../sm-std-basic-repair-group-select';
import SmStdBasicRepairTestItemUpgradeModal from './SmStdBasicRepairTestItemUpgradeModal';
import SmStdBasicRepaiOrganizationTypeUpgradeModal from './SmStdBasicRepaiOrganizationTypeUpgradeModal';
import SmStdBasicRepairTagMigrationModal from './SmStdBasicRepairTagMigrationModal';
let apiRepairItem = new ApiRepairItem();
let apiRepairTestItem = new ApiRepairTestItem();

export default {
  name: 'SmStdBasicRepairItems',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      repairItems: [],
      totalCount: 0,
      pageIndex: 1,
      repairCycleType: '年', //列表显示的年/月表次料
      yearOrMonth: undefined, //是年表还是月表
      queryParams: {
        isMonth: undefined, //年月表类型
        type: undefined, //维修类别
        keyWords: '', //模糊查询
        topGroupId: undefined, //设备类型
        groupId: undefined, //设备名称
        componentCategoryIds: [], //关联构件分类
        maxResultCount: paginationConfig.defaultPageSize,
        tagId: undefined, //维修标签
      },
      form: this.$form.createForm(this),
      selectUpgradeRepairIds: [],
      repairTagKeyId: null, //维修标签Id
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '编号',
          dataIndex: 'number',
          width: 60,
        },
        {
          title: '年/月表',
          dataIndex: 'isMonth',
          width: 80,
          scopedSlots: { customRender: 'isMonth' },
        },

        {
          title: '设备类型',
          dataIndex: 'topGroup',
          width: 100,
          scopedSlots: { customRender: 'topGroup' },
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'group',
          width: 100,
          scopedSlots: { customRender: 'group' },
          ellipsis: true,
        },
        {
          title: '执行单位',
          dataIndex: 'oorganizationType',
          width: 100,
          scopedSlots: { customRender: 'oorganizationType' },
          ellipsis: true,
        },
        {
          title: '维修类别',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          ellipsis: true,
        },
        {
          title: '工作内容',
          width: 150,
          dataIndex: 'content',
          ellipsis: true,
        },
        {
          title: '单位',
          width: 90,
          dataIndex: 'unit',
          ellipsis: true,
        },
        {
          title: '周期',
          width: 80,
          dataIndex: 'period',
          scopedSlots: { customRender: 'period' },
          ellipsis: true,
        },
        {
          title: '构件分类',
          width: 100,
          dataIndex: 'componentCategories',
          scopedSlots: { customRender: 'componentCategories' },
          ellipsis: true,
        },
        {
          title: '备注',
          width: 80,
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 130,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
    innerColumns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '测试项目',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          width: 80,
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          ellipsis: true,
        },
        {
          title: '单位',
          width: 90,
          dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          ellipsis: true,
        },
        {
          width: 100,
          title: '预设值',
          dataIndex: 'defaultValue',
          ellipsis: true,
        },
        {
          width: 100,
          title: '阈值',
          dataIndex: 'ratedVal',
          scopedSlots: { customRender: 'ratedVal' },
          ellipsis: true,
        },
        {
          width: 200,
          title: '上传文件',
          dataIndex: 'file',
          scopedSlots: { customRender: 'file' },
          ellipsis: true,
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
    initAxios() {
      apiRepairItem = new ApiRepairItem(this.axios);
      apiRepairTestItem = new ApiRepairTestItem(this.axios);
    },

    add() {
      this.$refs.SmStdBasicRepairItemModal.add(this.queryParams);
    },
    edit(record) {
      this.$refs.SmStdBasicRepairItemModal.edit(record);
    },
    addTestItem(record) {
      //添加测试面
      this.$refs.SmStdBasicRepairTestItemModal.add(record);
    },
    editTestItem(record) {
      //编辑测试项
      this.$refs.SmStdBasicRepairTestItemModal.edit(record);
    },
    //标签迁移
    tagsMigration() {
      this.$refs.SmStdBasicRepairTagMigrationModal.migration();
    },
    removeStandTest(record) {
      //删除测试项
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiRepairTestItem.delete(record.id);
            _this.refresh();

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiRepairItem.delete(record.id);
            _this.refresh(false, _this.pageIndex);
            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },

    view(record) {
      this.$refs.SmStdBasicRepairItemModal.view(record);
    },

    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let response = await apiRepairItem.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
        repairTagKey: this.repairTagKey,
      });
      if (requestIsSuccess(response) && response.data) {
        this.repairItems = response.data.items;
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

    //弹出更新测试项
    upgradeRepairTestItems(type, record = null) {
      let isAll = false;
      let ids = [];
      if (type == 'ALL') isAll = true;
      else if (type == 'SINGLE') ids.push(record.id);
      else if (type == 'CHECKED') {
        if (this.selectUpgradeRepairIds.length == 0) {
          this.$message.warning('请先勾选维修项');
          return;
        }
        ids = this.selectUpgradeRepairIds;
      }
      this.$refs.SmStdBasicRepairTestItemUpgradeModal.show(isAll, ids);
    },
    //弹出更新执行单位
    upgradeRepairOrganizationType() {
      let repairIds = [];
      if (this.selectUpgradeRepairIds.length == 0) {
        this.$message.warning('请先勾选维修项');
        return;
      }
      repairIds = this.selectUpgradeRepairIds;
      this.$refs.SmStdBasicRepaiOrganizationTypeUpgradeModal.show(repairIds);
    },
  },
  render() {
    //年月表类型
    let dateReportTypeOption = [];
    for (let item in DateReportType) {
      dateReportTypeOption.push(
        <a-select-option key={DateReportType[item]}>
          {getDateReportTypeTitle(DateReportType[item])}
        </a-select-option>,
      );
    }

    //维修类别
    let repairTypeOption = [];
    for (let item in RepairType) {
      repairTypeOption.push(
        <a-select-option key={RepairType[item]}>
          {getRepairTypeTitle(RepairType[item])}
        </a-select-option>,
      );
    }

    return (
      <div class="sm-std-basic-repair-items">
        {/* 操作区 */}
        <sc-table-operator
          advancedCount={5}
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              isMonth: undefined,
              type: undefined,
              keyWords: '',
              topGroupId: undefined,
              groupId: undefined,
              componentCategoryIds: [],
              tagId: this.queryParams.tagId,
            };

            this.yearOrMonth = undefined;
            this.refresh();
          }}
        >
          <a-form-item label="年月表">
            <a-select
              placeholder="请选择年月类型"
              allowClear
              value={this.yearOrMonth}
              onChange={value => {
                this.yearOrMonth = value;
                if (this.yearOrMonth == DateReportType.Year) {
                  this.queryParams.isMonth = false;
                } else if (this.yearOrMonth == DateReportType.Month) {
                  this.queryParams.isMonth = true;
                } else {
                  this.queryParams.isMonth = undefined;
                }
                this.refresh();
              }}
            >
              {dateReportTypeOption}
            </a-select>
          </a-form-item>

          <a-form-item label="构件分类">
            <SmStdBasicComponentCategorySelect
              placeholder="请选择构件分类"
              multiple={true}
              treeCheckable={true}
              treeCheckStrictly={true}
              axios={this.axios}
              value={this.queryParams.componentCategoryIds}
              onChange={value => {
                this.queryParams.componentCategoryIds = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="设备类型">
            <SmStdBasicRepairGroupSelect
              placeholder="请选择设备类型"
              permissions={this.permissions}
              allowClear
              isTop={true}
              axios={this.axios}
              value={this.queryParams.topGroupId}
              onChange={value => {
                this.queryParams.topGroupId = value;
                this.queryParams.groupId = undefined;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="设备名称">
            <SmStdBasicRepairGroupSelect
              placeholder="请选择设备名称"
              allowClear
              parentId={this.queryParams.topGroupId}
              permissions={this.permissions}
              axios={this.axios}
              value={this.queryParams.groupId}
              onChange={value => {
                this.queryParams.groupId = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="维修类别">
            <a-select
              placeholder="请选择维修类别"
              axios={this.axios}
              allowClear
              value={this.queryParams.type}
              onChange={value => {
                this.queryParams.type = value;
                this.refresh();
              }}
            >
              {repairTypeOption}
            </a-select>
          </a-form-item>

          <a-form-item label="关键字">
            <a-input
              placeholder="请输入单位、内容、备注"
              value={this.queryParams.keyWords}
              allowClear={true}
              onInput={event => {
                this.queryParams.keyWords = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <template slot="buttons">
            {vIf(
              <a-button type="primary" icon="plus" onClick={this.add}>
                添加
              </a-button>,
              vP(this.permissions, permissionsSmStdBasic.RepairItems.Create),
            )}
            {/* {vIf(
              <span>
                <a-button
                  type="primary"
                  icon="check-square"
                  onClick={() => this.upgradeRepairTestItems('CHECKED')}
                >
                  更新选中测试项
                </a-button>
                <a-button
                  type="primary"
                  icon="sync"
                  onClick={() => this.upgradeRepairTestItems('ALL')}
                >
                  更新所有测试项
                </a-button>
              </span>,
              vP(this.permissions, permissionsSmStdBasic.RepairTestItems.Create),
            )} */}
            {vIf(
              <a-button
                type="primary"
                icon="sync"
                onClick={() => this.upgradeRepairOrganizationType()}
              >
                更新选中执行单位
              </a-button>,
              vP(this.permissions, permissionsSmStdBasic.RepairItems.Update),
            )}

            {vIf(
              <a-button type="primary" onClick={() => this.tagsMigration()}>
                <si-currency-converter class="icon-converter" size={18} />
                  标签迁移
              </a-button>,
              vP(this.permissions, permissionsSmStdBasic.RepairItems.CreateTagMigration),
            )}
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.repairItems}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          rowSelection={{
            columnWidth: 30,
            selectRowKeys: this.selectUpgradeRepairIds,
            onChange: selectedRows => {
              this.selectUpgradeRepairIds = selectedRows;
            },
          }}
          {...{
            scopedSlots: {
              // index: (text, record, index) => {
              //   return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              // },
              isMonth: (text, record) => {
                return record.isMonth
                  ? getDateReportTypeTitle(DateReportType.Month)
                  : getDateReportTypeTitle(DateReportType.Year);
              },
              type: (text, record) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={record.type ? getRepairTypeTitle(record.type) : ''}
                  >
                    {record.type ? getRepairTypeTitle(record.type) : ''}
                  </a-tooltip>
                );
              },
              topGroup: (text, record) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={record.group && record.group.parent ? record.group.parent.name : ''}
                  >
                    {record.group && record.group.parent ? record.group.parent.name : ''}
                  </a-tooltip>
                );
              },
              group: (text, record) => {
                return (
                  <a-tooltip placement="topLeft" title={record.group ? record.group.name : ''}>
                    {record.group ? record.group.name : ''}
                  </a-tooltip>
                );
              },
              oorganizationType: (text, record) => {
                let value = record.repairItemRltOrganizationTypes
                  .map(item => item.organizationType.name)
                  .join('，');

                return (
                  <a-tooltip placement="topLeft" title={value}>
                    {value}
                  </a-tooltip>
                );
              },
              componentCategories: (text, record) => {
                let value = record.repairItemRltComponentCategories
                  .map(item => item.componentCategory.name)
                  .join('，');

                return (
                  <a-tooltip placement="topLeft" title={value}>
                    {value}
                  </a-tooltip>
                );
              },
              period: (text, record) => {
                let unit =
                  record.periodUnit && record.periodUnit !== RepairPeriodUnit.Other
                    ? `次/ ${getRepairPeriodUnit(record.periodUnit)}`
                    : '';
                let value =
                  record.period != undefined && record.period != null ? record.period + unit : '';
                return (
                  <a-tooltip placement="topLeft" title={value}>
                    {value}
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
                      vP(this.permissions, permissionsSmStdBasic.RepairItems.Detail),
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmStdBasic.RepairItems.Detail) &&
                      vP(this.permissions, [
                        permissionsSmStdBasic.RepairTestItems.Create,
                        permissionsSmStdBasic.RepairItems.Update,
                        permissionsSmStdBasic.RepairItems.Delete,
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
                                  this.addTestItem(record);
                                }}
                              >
                                添加测试项
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmStdBasic.RepairTestItems.Create),
                          )}
                          {/* {vIf(
                            <a-menu-item>
                              <a
                                onClick={() => {
                                  this.upgradeRepairTestItems('SINGLE', record);
                                }}
                              >
                                更新测试项
                              </a>
                            </a-menu-item>,
                            vP(this.permissions, permissionsSmStdBasic.RepairTestItems.Create),
                          )} */}

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
                            vP(this.permissions, permissionsSmStdBasic.RepairItems.Update),
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
                            vP(this.permissions, permissionsSmStdBasic.RepairItems.Delete),
                          )}
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [
                        permissionsSmStdBasic.RepairTestItems.Create,
                        permissionsSmStdBasic.RepairItems.Update,
                        permissionsSmStdBasic.RepairItems.Delete,
                      ]),
                    )}
                  </span>,
                ];
              },
              expandedRowRender: text => {
                return (
                  <a-table
                    rowKey={record => record.id}
                    slot-scope="text"
                    columns={this.innerColumns}
                    dataSource={text.repairTestItems}
                    pagination={false}
                    {...{
                      scopedSlots: {
                        index: (text, record, index) => {
                          return index + 1;
                        },
                        type: (text, record, index) => {
                          let value = record.type ? getRepairValTypeTitle(record.type) : '';
                          return (
                            <a-tooltip placement="topLeft" title={value}>
                              {value}
                            </a-tooltip>
                          );
                        },
                        ratedVal: (text, record) => {
                          let value =
                            (record.maxRated == null ? '' : record.minRated) +
                            '-' +
                            (record.minRated == null ? '' : record.maxRated);
                          return (
                            <a-tooltip placement="topLeft" title={value}>
                              {value}
                            </a-tooltip>
                          );
                        },
                        file: (text, record) => {
                          if (record.type == 3) {
                            return (
                              <SmFileManageSelect
                                axios={this.axios}
                                value={text ? text : {}}
                                disabled={true}
                                multiple={false}
                                enableDownload={true}
                                placeholder=""
                                bordered={false}
                              />
                            );
                          }

                          return undefined;
                        },
                        operations: (text, record) => {
                          return [
                            <span>
                              {vIf(
                                <a
                                  onClick={() => {
                                    this.editTestItem(record);
                                  }}
                                >
                                  编辑
                                </a>,
                                vP(this.permissions, permissionsSmStdBasic.RepairTestItems.Update),
                              )}

                              {vIf(
                                <a-divider type="vertical" />,
                                vP(
                                  this.permissions,
                                  permissionsSmStdBasic.RepairTestItems.Update,
                                ) &&
                                vP(
                                  this.permissions,
                                  permissionsSmStdBasic.RepairTestItems.Delete,
                                ),
                              )}

                              {vIf(
                                <a
                                  onClick={() => {
                                    this.removeStandTest(record);
                                  }}
                                >
                                  删除
                                </a>,
                                vP(this.permissions, permissionsSmStdBasic.RepairTestItems.Delete),
                              )}
                            </span>,
                          ];
                        },
                      },
                    }}
                  ></a-table>
                );
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

        <SmStdBasicRepairTestItemUpgradeModal
          ref="SmStdBasicRepairTestItemUpgradeModal"
          axios={this.axios}
          onSuccess={() => {
            console.log('Upgrade Success');
          }}
        ></SmStdBasicRepairTestItemUpgradeModal>

        <SmStdBasicRepairItemModal
          ref="SmStdBasicRepairItemModal"
          axios={this.axios}
          bordered={this.bordered}
          repairTagKey={this.repairTagKey}
          organizationId={this.queryParams.repairTeamId}
          onSuccess={() => {
            // this.queryParams = {
            //   isMonth: undefined,
            //   type: undefined,
            //   keyWords: '',
            //   topGroupId: undefined,
            //   groupId: undefined,
            //   componentCategoryIds: [],
            //   tagId: undefined,
            // };
            // this.yearOrMonth = undefined;
            this.refresh(false);
          }}
        />
        <SmStdBasicRepairTestItemModal
          ref="SmStdBasicRepairTestItemModal"
          axios={this.axios}
          bordered={this.bordered}
          repairTagKey={this.repairTagKey}
          organizationId={this.queryParams.repairTeamId}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
        <SmStdBasicRepaiOrganizationTypeUpgradeModal
          ref="SmStdBasicRepaiOrganizationTypeUpgradeModal"
          axios={this.axios}
          bordered={this.bordered}
          repairTagKey={this.repairTagKey}
          onSuccess={() => {
            this.refresh(false);
          }}
        />

        <SmStdBasicRepairTagMigrationModal
          ref="SmStdBasicRepairTagMigrationModal"
          axios={this.axios}
          bordered={this.bordered}
          repairTagKey={this.repairTagKey}
          onSuccess={() => {
            this.refresh(false);
          }}
        />
      </div>
    );
  },
};
