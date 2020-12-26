import { getSkyligetTypeTitle, getYearMonthPlanStateType, getPlanState } from '../../../_utils/utils';
import { PlanState } from '../../../_utils/enum';
import moment from 'moment';

const formatterTime = (val) => {
  return val ? moment(val).format('YYYY-MM-DD') : '';
};
export default {
  name: 'SmPlanInfo',
  props: {
    planDetails: { type: Array, default: () => [] }, // 计划详细记录
    planChanges: { type: Array, default: () => [] }, // 计划变更记录
  },
  data() {
    return {
      planList: [], // 计划列表
      changeList: [], // 变更列表
    };
  },
  computed: {
    changeColumns() {
      let arry = [
        {
          title: '变更数量',
          dataIndex: 'changeCount',
          width: 100,
        },
        {
          title: '审批状态',
          dataIndex: 'approvalStatus',
          width: 100,
          customRender: (text, row, index) => {
            let value = getYearMonthPlanStateType(text);
            return value;
          },
        },
        {
          title: '变更时间',
          dataIndex: 'changeTime',
          width: 200,
          render: this.formatterTime,
        },
        {
          title: '变更原因',
          dataIndex: 'changeReason',
          ellipsis: true,
        },
      ];
      return arry;
    },
    columns() {
      let arry = [
        {
          title: '',
          dataIndex: 'descreption',
          width: 65,
          customRender: (text, row, index) => {
            let length = this.planList.length;
            if (index < length - 1) {
              const obj = {
                children: text,
                attrs: {},
              };
              if (index === 0) {
                obj.attrs.rowSpan = length - 1;
              } else {
                obj.attrs.rowSpan = 0;
              }
              return obj;
            } else {
              return {
                children: text,
                attrs: {
                  colSpan: 2,
                },
              };
            }

          },
        },
        {
          title: '计划数量',
          dataIndex: 'planCount',
          ellipsis: true,
          width: 90,
          customRender: (text, row, index) => {
            if (index !== this.planList.length - 1) return text;
            return {
              children: text,
              attrs: {
                colSpan: 0,
              },
            };
          },
        },

        {
          title: '完成数量',
          dataIndex: 'finishCount',
          ellipsis: true,
          width: 90,
          customRender: (text, row, index) => {
            if (index < this.planList.length - 1) return text;
            return {
              children: text.toString().split(".").length > 1 && text.toString().split(".")[1].length > 3 ? parseFloat(text.toFixed(3)) : text,
              attrs: {
                colSpan: 11,
              },
            };
          },
        },
        {
          title: '未完成数',
          dataIndex: 'unFinishedCount',
          width: 90,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'planState',
          width: 90,
          customRender: (text, row, index) => {
            if (index < this.planList.length - 1) return <a-tag color={this.getTagColor(row.planState)}>
              {getPlanState(row.planState)}
            </a-tag>;
            return {
              children: <a-tag color={this.getTagColor(row.planState)}>
                {getPlanState(row.planState)}
              </a-tag>,
              attrs: {
                colSpan: 0,
              },
            };
          },
        },
        {
          title: '计划类型',
          dataIndex: 'planType',
          width: 90,
          customRender: (text, row, index) => {
            let value = getSkyligetTypeTitle(text);
            return value;
          },
        },
        {
          title: '计划时间',
          dataIndex: 'planTime',
          width: 110,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '站点',
          dataIndex: 'stationName',
          width: 90,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '实际作业时间',
          dataIndex: 'workTime',
          width: 300,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '作业组长',
          dataIndex: 'workLeader',
          width: 90,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '检修工区',
          dataIndex: 'maintenanceUnit',
          width: 120,
          ellipsis: true,
          customRender: this.renderContent,
        },
        {
          title: '验收工区',
          dataIndex: 'communicationUnit',
          width: 120,
          ellipsis: true,
          customRender: this.renderContent,
        },
      ];
      return arry;
    },
  },
  watch: {
    planDetails: {
      handler: function () {
        this.planList = this.planDetails;
      },
      immediate: true,
    },
    planChanges: {
      handler: function () {
        this.changeList = this.planChanges;
      },
      immediate: true,
    },
  },
  async created() {
  },
  methods: {
    renderContent(value, row, index) {
      const obj = {
        children: value,
        attrs: {},
      };
      if (index === this.planList.length - 1) {
        obj.attrs.colSpan = 0;
      }
      return obj;
    },

    getTagColor(planState) {
      let tagColor = '';
      switch (planState) {
      case PlanState.UnDispatching: {
        //未派工
        tagColor = 'red';
        break;
      }
      case PlanState.Dispatching: {
        //已派工
        tagColor = 'blue';
        break;
      }
      case PlanState.NotIssued: {
        //未下发
        tagColor = 'red';
        break;
      }
      case PlanState.Issued: {
        //已下发
        tagColor = 'blue';
        break;
      }
      case PlanState.Complete: {
        //已完成
        tagColor = 'green';
        break;
      }
      }
      return tagColor;
    },

  },
  render() {
    return (
      <div>
        {/* 计划详细列表 */}
        <div>
          <a-table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={this.planList}
            bordered
            pagination={false}
            scroll={{ x: 'calc(400px + 50%)', y: 600 }}
          />
        </div>

        {/* 变更原因列表 */}
        <div
          v-show={this.changeList != null && this.changeList.length > 0}
          style="padding-top: 10px;"
        >
          <a-table
            columns={this.changeColumns}
            rowKey={record => record.id}
            dataSource={this.changeList}
            bordered
            pagination={false}
          />
        </div>
      </div>
    );
  },
};
