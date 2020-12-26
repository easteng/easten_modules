import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getGroup, getState, vP, vIf } from '../../_utils/utils';
import moment from 'moment';
import { State, Group } from '../../_utils/enum';
import ApiFault from '../../sm-api/sm-emerg/Fault';
import ApiStation from '../../sm-api/sm-basic/Station';
import SmEmergFaultsModal from './SmEmergFaultsModal';
import ComponentCategoryTreeSelect from '../../sm-std-basic/sm-std-basic-component-category-tree-select';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import FaultEquipmentSelete from '../../sm-resource/sm-resource-equipment-select';
import SmBasicRailwayTreeSelect from '../../sm-basic/sm-basic-railway-tree-select';
import permissionsSmEmerg from '../../_permissions/sm-emerg';

let apiFault = new ApiFault();
let apiStation = new ApiStation();

//const FaultRouterPath = '/components/sm-emerg-fault-cn';
//const FaultRouterPath = '/emerg/fault';
//const ProcessRouterPath = '/components/sm-emerg-plan-cn';

export default {
  name: 'SmEmergFaults',
  props: {
    permissions: { type: Array, default: () => [] },
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
  },
  data() {
    return {
      stationOption: [],//线路关联站点
      faults: [], // 列表数据源
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        organization: null,    //车间工区
        railwayId: null, //所属线别
        station: '', //车站区间
        faultRltComponentCategories: [],  //设备类型
        equipmentIds: [], //设备名称
        state: null,  //故障状态
        summary: null,    //故障概述
        startTime: null, //开始时间
        endTime: null, //结束时间
        maxResultCount: paginationConfig.defaultPageSize,
        group: null, //处理状态
        keywords: null,  //关键字
      },
      checkInTimeRange: [],
      loading: false,
      viewState: 'disable',
      iVisible: false,
      iValue: null,
      append: null,    //添加新旧故障
    };
  },
  computed: {
    visible() {
      return this.iVisible;
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 90,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '故障时间',
          dataIndex: 'checkInTime',
          ellipsis: true,
          scopedSlots: { customRender: 'checkInTime' },
        },
        {
          title: '设备类型',
          dataIndex: 'faultRltComponentCategories',
          ellipsis: true,
          scopedSlots: { customRender: 'faultRltComponentCategories' },
        },
        {
          title: '设备名称',
          dataIndex: 'equipmentNames',
          ellipsis: true,
          scopedSlots: { customRender: 'equipmentNames' },
        },
        {
          title: '监测异常项目',
          dataIndex: 'abnormal',
          ellipsis: true,
        },
        {
          title: '故障现象',
          dataIndex: 'content',
          ellipsis: true,
          scopedSlots: { customRender: 'content' },
        },
        {
          title: '车站区间',
          dataIndex: 'station',
          ellipsis: true,
          scopedSlots: { customRender: 'station' },
        },
        {
          title: '故障概述',
          dataIndex: 'summary',
          ellipsis: true,
          scopedSlots: { customRender: 'summary' },
        },
        {
          title: '故障状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
        },
        {
          title: '处理流程',
          dataIndex: 'disposeFlow',
          scopedSlots: { customRender: 'disposeFlow' },
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
    this.queryParams.group = Group.Launched;
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiFault = new ApiFault(this.axios);
      apiStation = new ApiStation(this.axios);
    },
    //添加（新故障，可处理，不可处理）
    appendNewFault() {
      this.append = 'new';
      this.$emit('appendNewFault', this.append);
    },
    //添加案例（老故障，只可提交）
    appendOldFault() {
      this.append = 'old';
      this.$emit('appendOldFault', this.append);
    },
    // 详细
    view(record) {
      this.$emit('view', record.id, 'normal');
    },
    //编辑
    edit(record) {
      if (record.state == State.Pending) {
        this.append = 'new';
      } else {
        this.append = 'old';
      }
      this.$emit('edit', record.id, record.state, this.append);
    },
    //马上处理
    immediatelyDispose(record) {
      this.$refs.SmEmergFaultsModal;
      this.iVisible = true;
      this.iValue = record;
    },
    //处理流程
    process(record) {
      this.$emit('process', true, record.id);
    },

    //根据线路获取站点
    async getListByRailwayId(railwayId) {
      let response = await apiStation.getListByRailwayId(railwayId);
      if (requestIsSuccess(response)) {
        this.stationOption = [];
        for (let item of response.data) {
          this.stationOption.push(<a-select-option key={item.id}>
            {item.name}
          </a-select-option>);
        }
      }
    },
    //删除
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiFault.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.refresh(fasle, _this.pageIndex);
              _this.$message.success('删除成功');
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },

    //刷新列表
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let queryParams = {
        organizationId: this.queryParams.organization,    //车间工区
        railwayId: this.queryParams.railwayId,  //所属线别
        stationId: this.queryParams.station, //车站区间
        componentCategoryIds: this.queryParams.faultRltComponentCategories.map(item => item),  //设备类型
        equipmentIds: this.queryParams.equipmentIds.map(item => item), //设备名称
        startTime: this.checkInTimeRange[0] ? this.checkInTimeRange[0].format('YYYY-MM-DD HH:MM:ss') : null,
        endTime: this.checkInTimeRange[1] ? this.checkInTimeRange[1].format('YYYY-MM-DD HH:MM:ss') : null,
        state: this.queryParams.state,  //故障状态
        group: this.queryParams.group,   //处理状态
        keywords: this.queryParams.keywords,   //关键字
        maxResultCount: this.queryParams.maxResultCount,
      };


      let response = await apiFault.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...queryParams,
      });

      if (requestIsSuccess(response) && response.data) {
        this.faults = response.data.items;
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
  },

  render() {
    //故障状态枚举
    let Options = [];
    for (let item in State) {
      Options.push(
        <a-select-option key={`${State[item]}`}>
          {getState(State[item])}
        </a-select-option>,
      );
    }
    //处理状态类型枚举
    let groupOptions = [];
    for (let item in Group) {
      groupOptions.push(
        <a-select-option key={`${Group[item]}`}>
          {getGroup(Group[item])}
        </a-select-option>,
      );
    }

    return (
      <div class="sm-emerg-fault">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams = {
              organization: [],    //车间工区
              station: '', //车站区间
              faultRltComponentCategories: [],  //设备类型
              equipmentIds: [], //设备名称
              state: null,  //故障状态
              keywords: null, //关键字
              group: Group.Launched,
            };
            this.checkInTimeRange = [];
            this.refresh();
          }}
        >
          <a-form-item label="车间工区">
            <OrganizationTreeSelect
              axios={this.axios}
              placeholder='请选择车间工区'
              treeCheckStrictly={true}   // 父子节点手否严格
              value={this.queryParams.organization ? this.queryParams.organization : null}
              maxTagCount={2}
              onInput={value => {
                this.queryParams.organization = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="所属线别">
            <SmBasicRailwayTreeSelect
              axios={this.axios}
              placeholder='请选择所属线别'
              value={this.queryParams.railwayId ? this.queryParams.railwayId : undefined}
              onInput={value => {
                this.queryParams.railwayId = value;
                this.refresh();
              }}
              onChange={(value, data) => {
                if (this.record) {
                  this.record.stationId = null;
                  let values = utils.objFilterProps(this.record, formFields);
                  this.form.setFieldsValue(values);
                }
                this.getListByRailwayId(value);
              }}
            />
          </a-form-item>

          <a-form-item label="车站区间">
            <a-select
              allowClear
              placeholder='请选择车站区间'
              value={this.queryParams.station ? this.queryParams.station : undefined}
              onChange={value => {
                this.queryParams.station = value;
                this.refresh();
              }}
            >
              {this.stationOption}
            </a-select>
          </a-form-item>

          <a-form-item label="设备类型">
            <ComponentCategoryTreeSelect
              axios={this.axios}
              treeCheckStrictly={true}
              placeholder='请选择设备类型'
              value={this.queryParams.faultRltComponentCategories}
              treeCheckable={true}
              onInput={value => {
                this.queryParams.faultRltComponentCategories = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="设备名称">
            <FaultEquipmentSelete
              //class='ant-input'
              style={'height:32px; width:100%;max-width:424px;'}
              axios={this.axios}
              multiple={true}
              value={this.queryParams.equipmentIds}
              onChange={value => {
                this.queryParams.equipmentIds = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="处理状态">
            <a-select
              // allowClear
              value={this.queryParams.group === 1 ? getGroup(this.queryParams.group) : this.queryParams.group}
              placeholder='请选择处理状态'
              onChange={value => {
                this.queryParams.group = value;
                this.refresh();
              }}
            >
              {groupOptions}
            </a-select>
          </a-form-item>

          <a-form-item label="故障状态">
            <a-select
              allowClear
              value={this.queryParams.state ? this.queryParams.state : undefined}
              placeholder='请选择故障状态'
              onChange={value => {
                this.queryParams.state = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
          </a-form-item>

          <a-form-item label="故障时间">
            <a-range-picker
              style="width: 100%"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={this.checkInTimeRange}
              onChange={value => {
                this.checkInTimeRange = value;
                this.refresh();
              }}
            />
          </a-form-item>

          <a-form-item label="关键字" style={'margin-left: 14px'}>
            <a-input
              placeholder="故障详情、异常、原因分析、处理过程、备注"
              value={this.queryParams.keywords}
              onInput={event => {
                this.queryParams.keywords = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons">

            {vIf(
              <a-button type="primary" onClick={this.appendNewFault} icon="plus">
                添加
              </a-button>,
              vP(this.permissions, permissionsSmEmerg.Faults.Create),
            )}
            {vIf(
              <a-button type="primary" onClick={this.appendOldFault} icon="plus">
                添加案例
              </a-button>,
              vP(this.permissions, permissionsSmEmerg.Faults.Create),
            )}
          </template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          dataSource={this.faults}
          rowKey={record => record.id}
          bordered={this.bordered}
          loading={this.loading}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              //日期格式化
              checkInTime: (text, record, index) => {
                let checkInTime = record.checkInTime ? moment(record.checkInTime).format('YYYY-MM-DD HH:mm:ss') : '';
                return (<a-tooltip placement='topLeft' title={checkInTime}><span>{checkInTime}</span></a-tooltip>);
              },

              faultRltComponentCategories: (text, record, index) => {
                let result = "";
                record.faultRltComponentCategories.map(
                  (item, index) => (result += `${index == 0 ? '' : ','}${item.componentCategory.name}`),
                );
                return (
                  <a-tooltip placement='topLeft' title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },

              equipmentNames: (text, record) => {
                let result = record.equipmentNames;
                return (
                  <a-tooltip placement='topLeft' title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },

              station: (text, record) => {
                let result = record.station.name;
                return (
                  <a-tooltip placement='topLeft' title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              content: (text, record) => {
                let result = record.content;
                return (
                  <a-tooltip placement='topLeft' title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },
              summary: (text, record) => {
                let result = record.summary;
                return (
                  <a-tooltip placement='topLeft' title={result}>
                    <span>{result}</span>
                  </a-tooltip>
                );
              },

              state: (text, record) => {
                return getState(record.state);
              },

              disposeFlow: (text, record) => {
                return vIf(
                  <a
                    onClick={record.emergPlanRecordId != null ? () => this.process(record)
                      : () => this.immediatelyDispose(record)
                    }
                  >
                    {(record.state != State.UnSubmitted && record.state != State.Submitted) ? (record.emergPlanRecordId != null ? '处理流程' : '马上处理') : undefined}
                  </a>,
                  vP(this.permissions, permissionsSmEmerg.Faults.Detail),
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
                      vP(this.permissions, permissionsSmEmerg.Faults.Detail),
                    )}

                    {vIf(
                      <a-divider type="vertical" />,
                      vP(this.permissions, permissionsSmEmerg.Faults.Detail) &&
                      vP(this.permissions, permissionsSmEmerg.Faults.Update, permissionsSmEmerg.Faults.Delete),
                    )}
                    {vIf(
                      <span>
                        <a-dropdown trigger={['click']}>
                          <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            更多 <a-icon type="down" />
                          </a>
                          <a-menu slot="overlay">
                            {vIf(
                              (record.state == 1 || record.state == 3) ?
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      this.edit(record);
                                    }}
                                  > 编辑
                                  </a>
                                </a-menu-item> : undefined,
                              vP(this.permissions, permissionsSmEmerg.Faults.Update),
                            )}

                            {vIf(
                              <a-menu-item>
                                <a
                                  onClick={() => {
                                    this.remove(record);
                                  }}
                                > 删除
                                </a>
                              </a-menu-item>,
                              vP(this.permissions, permissionsSmEmerg.Faults.Delete),
                            )}
                          </a-menu>
                        </a-dropdown>
                      </span>,
                      vP(this.permissions, permissionsSmEmerg.Faults.Update, permissionsSmEmerg.Faults.Delete),
                    )}
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

        {/* 应急预案选择模态框 */}
        <SmEmergFaultsModal
          ref="SmEmergFaultsModal"
          permissions={this.permissions}
          axios={this.axios}
          visible={this.visible}
          isInvoke={this.visible}
          value={this.iValue}
          onView={id => this.$emit('applyView', id)}
          onSuccess={() => {
            this.refresh(false);
          }}
          onChange={v => (this.iVisible = v)}
        />
      </div>
    );
  },
};
