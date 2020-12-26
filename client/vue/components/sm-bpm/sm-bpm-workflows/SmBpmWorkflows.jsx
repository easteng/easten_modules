import ApiWorkflow from '../../sm-api/sm-bpm/Workflow';
import { WorkflowState, UserWorkflowGroup } from '../../_utils/enum';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, getWorkflowState, getUserWorkflowGroup } from '../../_utils/utils';

import WorkflowModal from './src/WorkflowModal';
import moment from 'moment';
import SmFileTag from '../../sm-file/sm-file-tag';
import './style';

let apiWorkflow = new ApiWorkflow();

export default {
  name: 'SmBpmWorkflows',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    group: { type: Number, default: null },
    state: { type: Number, default: WorkflowState.All },
  },
  data() {
    return {
      workflows: [],
      workflowsBackup: [],
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        name: null,
        group: UserWorkflowGroup.Initial,
        state: WorkflowState.All,
        sorting: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          title: '#',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '版本',
          dataIndex: 'version',
          scopedSlots: { customRender: 'version' },
        },
        {
          title: '简报',
          dataIndex: 'infos',
          scopedSlots: { customRender: 'infos' },
        },
        {
          title: '发起时间',
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'time' },
        },
      ];

      let endTime = {
        title: '结束时间',
        dataIndex: 'endTime',
        scopedSlots: { customRender: 'updateTime' },
      };
      let updateTime = {
        title: '更新时间',
        dataIndex: 'updateTime',
        scopedSlots: { customRender: 'updateTime' },
      };
      let state = {
        title: '状态',
        dataIndex: 'state',
        scopedSlots: { customRender: 'state' },
      };
      let operator = {
        title: '操作',
        dataIndex: 'operations',
        width: 140,
        scopedSlots: { customRender: 'operations' },
      };

      return this.queryParams.state === WorkflowState.Finished
        ? [...columns, endTime, state, operator]
        : [...columns, updateTime, state, operator];
    },
  },
  watch: {
    group: {
      handler: function (value, oldValue) {
        this.queryParams.group = value || UserWorkflowGroup.Initial;
        this.queryParams.state = WorkflowState.All;
      },
      immediate: true,
    },
    state: {
      handler: function (value, oldValue) {
        this.queryParams.state = value;
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiWorkflow = new ApiWorkflow(this.axios);
    },
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let _params = {
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      };

      let response = await apiWorkflow.getList(_params);

      if (requestIsSuccess(response)) {
        this.workflows = response.data.items;
        this.totalCount = response.data.totalCount;
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
    onSuccess() {
      this.refresh();
    },
    async view(record) {
      if (record.state === WorkflowState.Stopped && this.queryParams.group === UserWorkflowGroup.Initial) {
        this.$refs.WorkflowModal.isInitial = true;
        // 已拒绝的数据需要根据当前工作流的id获取到该工作流对应的工作流模板的数据
        let response = await apiWorkflow.getWorkflowTemplateId(record.id);
        if (requestIsSuccess(response)) {
          if (response.data) {
            this.$refs.WorkflowModal.edit(response.data);
          }
        }
      } else {
        this.$refs.WorkflowModal.isInitial = false;
        this.$refs.WorkflowModal.edit(record.id);
      }
    },
    isJson(jsonStr) {
      try {
        if (typeof JSON.parse(jsonStr) === 'object') {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    viewBtnState(record) {
      if ((record.state === WorkflowState.Stopped && this.queryParams.group == UserWorkflowGroup.Initial) && record.isStatic) {
        return true;
      }
      return false;
    },
  },
  render() {
    let _userWorkflowGroup = [];
    for (let item in UserWorkflowGroup) {
      _userWorkflowGroup.push(UserWorkflowGroup[item]);
    }

    let _workflowState = [];
    for (let item in WorkflowState) {
      _workflowState.push(WorkflowState[item]);
    }

    return (
      <div class="sm-bpm-workflows">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
            // console.log(this.queryParams.name);
            // console.log(this.queryParams.group);
            // console.log(this.queryParams.state);
          }}
          onReset={() => {

            this.queryParams.name = null;
            this.queryParams.group = this.group;
            this.queryParams.state = this.state;
            this.refresh();
          }}
        >
          {this.group === null ? (
            <a-form-item label="分组">
              <a-select
                allowClear
                axios={this.axios}
                value={this.queryParams.group}
                onChange={value => {
                  this.queryParams.group = value;
                  this.refresh();
                }}
              >
                {_userWorkflowGroup.map(item => (
                  <a-select-option value={item}>{getUserWorkflowGroup(item)}</a-select-option>
                ))}
              </a-select>
            </a-form-item>
          ) : (
            undefined
          )}

          {([UserWorkflowGroup.Initial, UserWorkflowGroup.Approved, UserWorkflowGroup.Cc].indexOf(
            this.group,
          ) >= 0 &&
            this.state === WorkflowState.All) ||
            this.group === null ? (
              <a-form-item label="状态">
                <a-select
                  allowClear
                  axios={this.axios}
                  value={this.queryParams.state}
                  onChange={value => {
                    this.queryParams.state = value;
                    this.refresh();
                  }}
                >
                  {_workflowState.map(item => (
                    <a-select-option value={item}>{getWorkflowState(item)}</a-select-option>
                  ))}
                </a-select>
              </a-form-item>
            ) : (
              undefined
            )}

          <a-form-item label="名称">
            <a-input
              axios={this.axios}
              value={this.queryParams.name}
              onInput={event => {
                this.queryParams.name = event.target.value;
                this.refresh();
              }}
            />
          </a-form-item>

          <template slot="buttons"></template>
        </sc-table-operator>

        {/* 展示区 */}
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.workflows}
          bordered={this.bordered}
          pagination={false}
          loading={this.loading}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              version: (text, record) => {
                return `${record.formTemplateVersion}.${record.flowTemplateVersion}`;
              },
              infos: (text, record) => {
                return (
                  <div
                    class="infos"
                    style="display: flex;
                           flex-direction: column;
                           font-size: 12px;
                           "
                  >
                    {record.infos.map(info => {
                      if (this.isJson(info.info)) {
                        let imgs = JSON.parse(info.info);
                        return (
                          <span class="info-item">
                            <span style="">{info.label + ': '}</span>
                            { (imgs instanceof Array) ? imgs.map(a => {
                              return <SmFileTag url={a.url} fileType={a.type} fileName={a.name} />;
                              // return <span class='img-tag'>{a.name}{a.type}</span>;
                            }) : null}
                          </span>
                        );
                      } else {
                        return (
                          <span class="info-item">
                            <span style="">{info.label + ': '}</span>
                            <span>{info.info}</span>
                          </span>
                        );
                      }
                    })}
                  </div>
                );
              },
              time: (text, record) => {
                let time = moment(text);
                return time.valueOf() > 0 ? time.format('YYYY-MM-DD HH:mm:ss') : undefined;
              },
              updateTime: (text, record) => {
                let time = moment(record.lastModificationTime);
                return time.valueOf() > 0 ? time.format('YYYY-MM-DD HH:mm:ss') : undefined;
              },
              state: (text, record) => {
                let color = '';
                let title = '';
                switch (record.state) {
                case WorkflowState.Finished:
                  color = 'green';
                  title = '已完成';
                  break;
                case WorkflowState.Waiting:
                  color = 'blue';
                  title = '待审批';
                  break;
                case WorkflowState.Stopped:
                  color = 'red';
                  title = '已拒绝';
                  break;
                case WorkflowState.Rejected:
                  color = 'orange';
                  title = '已退回';
                  break;
                }

                return <a-tag color={color}>{title}</a-tag>;
              },
              operations: (text, record) => {
                return (
                  <span>
                    <a
                      onClick={() => {
                        // this.$emit('view', record.id);
                        this.view(record);
                      }}
                      disabled={this.viewBtnState(record)}
                    >
                      {/* 如果是系统流程，重启发起按钮禁用 */}
                      {this.queryParams.group === UserWorkflowGroup.Waiting ? '审批' : ((record.state === WorkflowState.Stopped && this.queryParams.group == UserWorkflowGroup.Initial) ? '重新发起' : '详情')}
                    </a>
                    {/* <a-divider type="vertical" /> */}
                  </span>
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

        <WorkflowModal
          ref="WorkflowModal"
          axios={this.axios}
          isInitial={false}
          onSuccess={this.onSuccess}
          group={this.queryParams.group}
        />
      </div>
    );
  },
};
