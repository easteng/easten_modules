
import ApiInfluenceRange from '../../sm-api/sm-std-basic/InfluenceRange';
import SmStdBasicInfluenceRangeModal from './SmStdBasicInfluenceRangeModal';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vIf, vP, getRepairLevelTitle } from '../../_utils/utils';
import { RepairLevel } from '../../_utils/enum';
import permissionsSmStdBasic from '../../_permissions/sm-std-basic';
import moment from 'moment';

let apiInfluenceRange = new ApiInfluenceRange();

export default {
  name: 'SmStdBasicInfluenceRanges',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      record: null,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        repairLevel: null,
        keyword: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
      loading: false,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '维修级别',
          dataIndex: 'repairLevelStr',
          width: 200,
          ellipsis: true,
        },
        {
          title: '影响范围',
          dataIndex: 'content',
          ellipsis: true,
        },
        {
          title: '上次编辑时间',
          dataIndex: 'time',
          width: 180,
          scopedSlots: { customRender: 'time' },
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
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    add(record) {
      if (record == null) {
        record = {};
      }
      if (this.queryParams.repairLevel != null)
        record.repairLevel = this.queryParams.repairLevel;
      this.record = record;
      this.$refs.SmStdBasicInfluenceRangeModal.add(record);
    },
    edit(record) {
      this.record = record;
      this.$refs.SmStdBasicInfluenceRangeModal.edit(record);
    },
    view(record) {
      this.record = record;
      this.$refs.SmStdBasicInfluenceRangeModal.view(record);
    },
    initAxios() {
      apiInfluenceRange = new ApiInfluenceRange(this.axios);
    },

    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiInfluenceRange.delete(record.id);
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

      let response = await apiInfluenceRange.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      }, this.repairTagKey);
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

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
  },
  render() {
    let options = [];
    for (let item in RepairLevel) {
      options.push(
        <a-select-option key={RepairLevel[item]}>
          {getRepairLevelTitle(RepairLevel[item])}
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
            this.queryParams.repairLevel = null;
            this.queryParams.keyword = '';
            this.refresh();
          }}
        ><a-form-item label="维修级别" label-col={{ span: 4 }} wrapper-col={{ span: 20 }}>
            <a-select
              allowClear
              value={this.queryParams.repairLevel}
              onChange={val => {
                this.queryParams.repairLevel = val;
                this.refresh();
              }}
            >
              {options}
            </a-select>
          </a-form-item>
          <a-form-item label="关键字">
            <a-input
              allowClear
              placeholder="影响范围"
              value={this.queryParams.keyword}
              onInput={event => {
                this.queryParams.keyword = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>
          <template slot="buttons">
            <a-button type="primary" icon="plus" onClick={() => this.add(null)}>
              添加
            </a-button>
          </template>
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
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              time: (text, record) => {
                let time = moment(record.lastModifyTime);
                return time.valueOf() > 0 ? time.format('YYYY-MM-DD HH:mm:ss') : '';
              },
              operations: (text, record) => {
                return [
                  <span>
                    {vIf(
                      <a
                        onClick={() => {
                          this.view(record);
                        }}
                      >详情
                      </a>,
                      vP(this.permissions, permissionsSmStdBasic.InfluenceRanges.Detail),
                    )}
                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmStdBasic.InfluenceRanges.Detail) &&
                      vP(this.permissions, [permissionsSmStdBasic.InfluenceRanges.Update, permissionsSmStdBasic.InfluenceRanges.Delete]),
                    )}

                    {vIf(
                      <a-dropdown trigger={['click']}>
                        <a
                          class="ant-dropdown-link"
                          onClick={e => e.preventDefault()}>
                          更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.edit(record);
                                }}
                              >编辑
                              </a>,
                              vP(this.permissions, permissionsSmStdBasic.InfluenceRanges.Update),
                            )}
                          </a-menu-item>
                          <a-menu-item>
                            {vIf(
                              <a
                                onClick={() => {
                                  this.remove(record);
                                }}
                              >删除
                              </a>,
                              vP(this.permissions, permissionsSmStdBasic.InfluenceRanges.Delete),
                            )}
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>,
                      vP(this.permissions, [permissionsSmStdBasic.InfluenceRanges.Update, permissionsSmStdBasic.InfluenceRanges.Delete]),
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


        <SmStdBasicInfluenceRangeModal
          ref="SmStdBasicInfluenceRangeModal"
          axios={this.axios}
          bordered={this.bordered}
          onSuccess={() => {
            this.refresh(false);
          }}
          repairTagKey={this.repairTagKey}
        />
      </div>
    );
  },
};
