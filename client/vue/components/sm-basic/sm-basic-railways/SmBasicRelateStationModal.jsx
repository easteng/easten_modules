import ApiStation from '../../sm-api/sm-basic/Station';
import { pagination as paginationConfig, tips as tipsConfig, tips } from '../../_utils/config';
import { requestIsSuccess } from '../../_utils/utils';
import difference from 'lodash/difference';
import { treeArrayItemAddProps } from '../../_utils/tree_array_tools';
import ApiRailway from '../../sm-api/sm-basic/Railway';

let apiStation = new ApiStation();
let apiRailway = new ApiRailway();

const leftTableColumns = [
  {
    dataIndex: 'name',
    title: '站点名称',
    ellipsis: true,
  },
];
const rightTableColumns = [
  {
    dataIndex: 'index',
    title: '排序',
    width: 60,
    ellipsis: true,
    scopedSlots: { customRender: 'index' },
  },
  {
    dataIndex: 'name',
    title: '站点名称',
    ellipsis: true,
    width: 80,
    scopedSlots: { customRender: 'name' },
  },
  {
    dataIndex: 'kmMark',
    title: '公里标',
    width: 90,
    scopedSlots: { customRender: 'kmMark' },
  },
  // {
  //   dataIndex: 'operator',
  //   title: '操作',
  //   width: 45,
  //   scopedSlots: { customRender: 'operator' },
  // },
];
const rightTableColumns4DoubelLine = [
  {
    dataIndex: 'index',
    title: '排序',
    width: 50,
    ellipsis: true,
    scopedSlots: { customRender: 'index' },
  },
  {
    dataIndex: 'name',
    title: '站点名称',
    ellipsis: true,
    width: 120,
    scopedSlots: { customRender: 'name' },
  },
  {
    dataIndex: 'upKmMark',
    title: '上行公里标',
    width: 160,
    scopedSlots: { customRender: 'upKmMark' },
  },
  {
    dataIndex: 'kmMark2',
    title: '下行公里标',
    width: 160,
    scopedSlots: { customRender: 'downKmMark' },
  },
];

export default {
  name: 'SmBasicRelateStationModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      railway: null,
      stations: [],
      allStations: [],
      status: false,
      targetObj: [],
      disabled: false,
      showSearch: false,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
        name: null,
      },
      isDoubleLine: false,
    };
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiStation = new ApiStation(this.axios);
      apiRailway = new ApiRailway(this.axios);
    },

    async refresh(resetPage = true) {
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiStation.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response)) {
        response.data.items.map(item => {
          item.title = item.name;
          item.value = item.id;
          item.key = item.id;
          item.kmMark = 0;
          if (this.isDoubleLine) {
            item.disableUpKmMark = false;
            item.disableDownKmMark = false;
            item.kmMark2 = 0;
          }
        });
        this.totalCount = response.data.totalCount - this.targetObj.length;
        this.stations = response.data.items;
        this.targetObj.map(staItem => {
          let temp = this.stations.find(s => s.id == staItem.id);
          if (temp == null) {
            let sameOldSta = this.allStations.find(s => s.id == staItem.id);
            staItem.name = sameOldSta.name;
            staItem.title = sameOldSta.name;
            staItem.key = staItem.id;
            staItem.value = staItem.id;
            this.stations.push({
              id: staItem.id,
              name: staItem.name,
              title: staItem.name,
              key: staItem.id,
              value: staItem.id,
              kmMark: staItem.kmMark,
              kmMark2: staItem.kmMark2,
            });

          } else {
            temp.kmMark = staItem.kmMark;
            temp.kmMark2 = staItem.kmMark2;
            temp.disableDownKmMark = staItem.disableDownKmMark;
            temp.disableUpKmMark = staItem.disableUpKmMark;
          }
        });
        if (!response.data.items.length > 0) {
          if (this.pageIndex > 1) {
            this.pageIndex -= 1;
          }
          this.refresh(false);
        }
      }
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        await this.refresh(false);
      }
    },

    async relateStations(record) {
      this.isDoubleLine = record.type == 1 ? true : false;
      this.rightColumns = this.isDoubleLine ? rightTableColumns4DoubelLine : rightTableColumns;
      // 弹出模态框
      this.status = true;
      this.targetObj = [];
      let response = await apiRailway.get(record.id);
      if (requestIsSuccess(response)) {
        this.railway = response.data;
        if (this.isDoubleLine) {
          //求上下行的并集 以显示所有站点
          for (let i = 0; i < this.railway.downLinkStations.length; i++) {
            const ele = this.railway.downLinkStations[i];
            let temp = this.railway.stations.find(s => s.id == ele.id);
            if (temp == undefined || temp == null) {
              this.railway.stations.push({
                id: ele.id,
                name: ele.name,
                type: ele.type,
                kmMark: 0,
                disableUpKmMark: true,
                kmMark2: ele.kmMark,
              });
            }
          }
        }
        //以上行站点为主进行站点信息的赋值
        for (let i = 0; i < this.railway.stations.length; i++) {
          const element = this.railway.stations[i];
          if (element.type == 0) {
            let tempItem = {
              id: element.id,
              name: element.name,
              title: element.name,
              key: element.id,
              value: element.id,
              kmMark: element.kmMark,
            };
            if (this.isDoubleLine) {
              tempItem.disableUpKmMark = element.disableUpKmMark;
              let downSta = this.railway.downLinkStations.find(s => s.id == element.id);
              if (downSta == null || downSta == undefined) {
                tempItem.kmMark2 = 0;
                tempItem.disableDownKmMark = true;
              }
              else
                tempItem.kmMark2 = downSta.kmMark;
            }
            this.targetObj.push(tempItem);
          }
        }

        response = await apiStation.getSimpleList({ type: 0 });
        if (requestIsSuccess(response)) {
          this.allStations = response.data;
        }
      }
      await this.refresh();
      this.reOrder();
      // this.stations.map(item => {
      //   for (let i = 0; i < this.railway.stations.length; i++) {
      //     if (this.railway.stations[i].id == item.id) {
      //       item.kmMark = this.railway.stations[i].kmMark;
      //       if (this.isDoubleLine) {
      //         let downSta = this.railway.downLinkStations.find(s => s.id == item.id);
      //         if (downSta == null || downSta == undefined) {
      //           item.kmMark2 = -89;
      //         }
      //         else
      //           item.kmMark2 = downSta.kmMark2;
      //       }
      //       break;
      //     }
      //   }
      // });
    },

    onChange(nextTargetKeys, direction, moveKeys) {
      let temp = [];
      for (let i = 0; i < nextTargetKeys.length; i++) {
        const ele = nextTargetKeys[i];
        let kmMark = 0;
        let kmMark2 = 0;
        let id = '';
        let name = '';
        for (let j = 0; j < this.targetObj.length; j++) {
          const elemObj = this.targetObj[j];
          if (elemObj.id == ele) {
            kmMark = elemObj.kmMark;
            kmMark2 = elemObj.kmMark2;
            id = elemObj.id;
            name = elemObj.name;
            break;
          }
        }
        temp.push({ id: ele, kmMark: kmMark, kmMark2: kmMark2, name: name, title: name, key: id, value: id });
      }
      // temp.sort(function (a, b) {
      //   if (a.kmMark < b.kmMark) {
      //     return -1;
      //   } else if (a.kmMark == b.kmMark) {
      //     return 0;
      //   } else {
      //     return 1;
      //   }
      // });
      this.targetObj = temp;
      this.reOrder();
      for (let i = 0; i < this.targetObj.length; i++) {
        const element = this.targetObj[i];
        //修改原有数据 刷新右侧公里标
        for (let j = 0; j < this.stations.length; j++) {
          const staEle = this.stations[j];
          if (staEle.id == element.id) {
            staEle.kmMark = element.kmMark;
            staEle.kmMark2 = element.kmMark2;
          }
          moveKeys.map(item => {
            if (staEle.id == item) {
              staEle.kmMark = 0;
              staEle.kmMark2 = 0;
            }
          });
        }
      }
      this.refresh(false);
    },

    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        columnWidth: 30,
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
    close() {
      this.status = false;
      // this.refresh();
      this.targetObj = [];
      this.stations = [];
      this.allStations = [];
    },
    reOrder() {
      for (let i = 0; i < this.targetObj.length; i++) {
        const element = this.targetObj[i];
        //修改原有数据 刷新右侧公里标
        for (let j = 0; j < this.stations.length; j++) {
          const staEle = this.stations[j];
          if (staEle.id == element.id) {
            element.kmMark = staEle.kmMark;
            element.kmMark2 = staEle.kmMark2;
          }
        }
      }
      let thisInstance = this;
      this.targetObj.sort(function (a, b) {
        let staA = thisInstance.stations.find(s => s.id == a.id);
        let staB = thisInstance.stations.find(s => s.id == b.id);
        let aKmMark = a.kmMark;
        let bKmMark = b.kmMark;
        if (staA.disableUpKmMark) { aKmMark = a.kmMark2; }
        if (staB.disableUpKmMark) { bKmMark = b.kmMark2; }
        if (aKmMark < bKmMark) {
          return -1;
        } else if (aKmMark == bKmMark) {
          return 0;
        } else {
          return 1;
        }
      });
    },

    async ok() {
      // return;
      // 数据提交
      let data = {
        raliwayId: this.railway.id,
        relateInfos: [],
        downLinkRelateInfos: [],
      };
      let thisInstance = this;
      let relateInfos = [];
      for (let i = 0; i < this.targetObj.length; i++) {
        const item = this.targetObj[i];
        if (thisInstance.isDoubleLine) {
          let sta = thisInstance.stations.find(s => s.id == item.id);
          if (sta.disableUpKmMark) continue;
        }
        relateInfos.push({
          staId: item.id,
          kmMark: item.kmMark != null ? item.kmMark : 0,
        });
      }
      data.relateInfos = relateInfos;
      if (this.isDoubleLine) {
        let relateInfos2 = [];
        for (let i = 0; i < this.targetObj.length; i++) {
          const item = this.targetObj[i];
          if (thisInstance.isDoubleLine) {
            let sta = thisInstance.stations.find(s => s.id == item.id);
            if (sta.disableDownKmMark) continue;
          }
          relateInfos2.push({
            staId: item.id,
            kmMark: item.kmMark2 != null ? item.kmMark2 : 0,
          });
        }
        data.downLinkRelateInfos = relateInfos2;
      }
      console.log(data);
      let response = null;
      if ((this.status = true))
        response = await apiRailway.updateStations(data);
      if (requestIsSuccess(response)) {
        this.$message.success('操作成功');
        this.close();
        this.$emit('success');
      }
    },
  },
  render() {
    const scopedSlots = {
      children: ({
        props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
        on: { itemSelectAll, itemSelect },
      }) => {
        return [
          <a-table
            scroll={{
              y: 300,
            }}
            rowSelection={this.getRowSelection({
              disabled: listDisabled,
              selectedKeys,
              itemSelectAll,
              itemSelect,
            })}
            pagination={false}
            columns={direction === 'left' ? this.leftColumns : this.rightColumns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : null }}
            customRow={({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })}
            scopedSlots={{
              index: (text, record, index) => {
                let str = index + 1;
                return <a-tooltip title={str}>{str}</a-tooltip>;
              },
              name: (text, record, index) => {
                // return `${filteredItems.indexOf(record) + 1}. ${text}`;
                return <a-tooltip title={text}>{text}</a-tooltip>;
              },
              kmMark: (text, record) => {
                return (
                  <span>
                    <a-input-number
                      value={record.kmMark}
                      onChange={value => {
                        record.kmMark = value;
                      }}
                      precision={0}
                      onClick={() => {
                        event.stopPropagation();
                      }}
                      onBlur={value => {
                        this.reOrder();
                      }}
                    ></a-input-number>
                  </span>
                );
              },
              upKmMark: (text, record) => {
                return (
                  <span>
                    <a-switch
                      checked={!record.disableUpKmMark}
                      disabled={record.disableDownKmMark}
                      onChange={value => {
                        record.disableUpKmMark = !value;
                        if (!value) {
                          record.kmMark = 0;
                        }
                        this.reOrder();
                      }}
                      onClick={() => {
                        event.stopPropagation();
                        return;
                      }}
                    />
                    {!record.disableUpKmMark ? (

                      <a-input-number
                        value={record.kmMark}
                        onChange={value => {
                          record.kmMark = value;
                        }}
                        precision={0}
                        onClick={() => {
                          event.stopPropagation();
                        }}
                        onBlur={value => {
                          this.reOrder();
                        }}
                      ></a-input-number>
                    ) : undefined}
                  </span>
                );
              },
              downKmMark: (text, record) => {
                return (
                  <span>
                    <a-switch
                      checked={!record.disableDownKmMark}
                      disabled={record.disableUpKmMark}
                      onChange={value => {
                        record.disableDownKmMark = !value;
                        if (!value) {
                          record.kmMark2 = 0;
                        }
                        this.reOrder();
                      }}
                      onClick={() => {
                        event.stopPropagation();
                        return;
                      }}
                    />
                    {!record.disableDownKmMark ?
                      (
                        <a-input-number
                          value={record.kmMark2}
                          onChange={value => {
                            record.kmMark2 = value;
                          }}
                          precision={0}
                          onClick={() => {
                            event.stopPropagation();
                          }}
                          onBlur={value => {
                            this.reOrder();
                          }}
                        ></a-input-number>
                      )
                      : undefined}
                  </span>);
              },
              operator: (text, record, index) => {
                return (
                  <span class="operator">
                    <a-icon
                      class="opetator-icon"
                      type="up"
                      onClick={event => {
                        event.stopPropagation();
                        if (index === 0) return;
                        let tempId = this.targetKeys[index];
                        this.targetKeys[index] = this.targetKeys[index - 1];
                        this.targetKeys[index - 1] = tempId;
                        this.targetKeys = [...this.targetKeys];
                      }}
                    />
                    <a-icon
                      class="opetator-icon"
                      type="down"
                      onClick={() => {
                        event.stopPropagation();
                        if (index === filteredItems.length - 1) return;
                        let tempId = this.targetKeys[index];
                        this.targetKeys[index] = this.targetKeys[index + 1];
                        this.targetKeys[index + 1] = tempId;
                        this.targetKeys = [...this.targetKeys];
                      }}
                    />
                  </span>
                );
              },
            }}
          />,
          direction === 'left' ? (

            <a-pagination
              style="float:right; margin:10px"
              total={this.totalCount}
              size="small"
              pageSize={this.queryParams.maxResultCount}
              current={this.pageIndex}
              onChange={this.onPageChange}
              onShowSizeChange={this.onPageChange}
              showTotal={paginationConfig.showTotal}
            />

          ) : (
            undefined
          ),
        ];
      },
    };
    return (
      <a-modal
        class="relate-station-modal"
        title="站点关联"
        visible={this.status}
        onCancel={this.close}
        onOk={this.ok}
        width={1000}
      >
        <a-transfer
          class="transfer-box"
          titles={['站点列表', '已添加']}
          dataSource={this.stations}
          targetKeys={this.targetObj.map(s => {
            return s.id;
          })}
          disabled={this.disabled}
          showSearch
          onChange={this.onChange}
          onSearch={(type, val) => {
            if (type == 'left') {
              this.queryParams.name = val;
              this.pageIndex = 1;
              this.refresh();
            }
          }}
          filterOption={(inputValue, item) => item.title.indexOf(inputValue) !== -1}
          leftColumns={this.leftColumns}
          rightColumns={this.rightColumns}
          showSelectAll={false}
          scopedSlots={scopedSlots}
        // listStyle={{
        //   width: '150px',
        // }}
        ></a-transfer>
      </a-modal>
    );
  },
};
