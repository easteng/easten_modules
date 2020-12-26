import ApiWorkflowTemplate from '../../sm-api/sm-bpm/WorkflowTemplate';
import { ModalStatus } from '../../_utils/enum';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { requestIsSuccess, vP, vIf } from '../../_utils/utils';

import WorkflowModal from '../sm-bpm-workflows/src/WorkflowModal';
import moment from 'moment';
import './style';
import permissionsSmBpm from '../../_permissions/sm-bpm';

let apiWorkflowTemplate = new ApiWorkflowTemplate();

export default {
  name: 'SmBpmWorkflowTemplates',
  props: {
    axios: { type: Function, default: null },
    bordered: { type: Boolean, default: false },
    forCurrentUser: { type: Boolean, default: false },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      workflows: [],
      workflowsBackup: [],
      totalCount: 0,
      pageIndex: 1,
      queryParams: {
        name: '',
        published: undefined,
        sorting: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      form: this.$form.createForm(this),
    };
  },
  computed: {
    columns() {
      let _base = [
        {
          title: '#',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
      ];

      let _more = [
        {
          title: '启用状态',
          dataIndex: 'published',
          scopedSlots: { customRender: 'published' },
        },
        {
          title: '版本：v 表单 . 流程',
          dataIndex: 'versionList',
          // width: 200,
          scopedSlots: { customRender: 'versionList' },
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'creationTime' },
        },
        {
          title: '发布时间',
          dataIndex: 'publishedTime',
          scopedSlots: { customRender: 'publishedTime' },
        },
        {
          title: '系统模板',
          dataIndex: 'isStatic',
          scopedSlots: { customRender: 'isStatic' },
        },
      ];

      let operator = [
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
        },
      ];

      return this.forCurrentUser
        ? [
          ..._base,
          {
            title: '版本',
            dataIndex: 'version',
            scopedSlots: { customRender: 'version' },
          },
          {
            title: '发布时间',
            dataIndex: 'publishedTime',
            scopedSlots: { customRender: 'publishedTime' },
          },
          ...operator,
        ]
        : [..._base, ..._more, ...operator];
    },
  },
  watch: {},
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    async add() {
      let newWorkflow = {
        name: '新建工作流模板',
        published: false,
        edit: true,
        errorMessage: null,
      };

      let response = await apiWorkflowTemplate.create(newWorkflow);
      if (requestIsSuccess(response)) {
        await this.refresh();
        this.$nextTick(() => {
          for (let item of this.workflows) {
            if (item.id === response.data.id) {
              item.edit = true;
              break;
            }
          }
        });
      }
    },
    initAxios() {
      apiWorkflowTemplate = new ApiWorkflowTemplate(this.axios);
    },
    remove(record) {
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiWorkflowTemplate.delete(record.id);
            _this.refresh(false, _this.pageIndex);

            setTimeout(requestIsSuccess(response) ? resolve : reject, 100);
          });
        },
      });
    },
    initial(record) {
      this.$refs.WorkflowModal.edit(record.id);
    },
    async refresh(resetPage = true, page) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let _params = {
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      };
      if (_params.published === undefined) {
        delete _params.published;
      } else {
        _params.published = Boolean(_params.published);
      }

      if (this.forCurrentUser) {
        _params.forCurrentUser = true;
      }

      let response = await apiWorkflowTemplate.getList(_params);

      if (requestIsSuccess(response)) {
        let workflows = response.data.items;
        workflows.map(item => {
          item.edit = false;
          item.errorMessage = null;
        });
        this.workflowsBackup = JSON.parse(JSON.stringify(workflows));
        this.workflows = workflows;
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
    async update(record) {
      let response = await apiWorkflowTemplate.update({
        id: record.id,
        name: record.name,
      });
      if (requestIsSuccess(response)) {
        this.refresh();
      }
    },
    async updatePublishState(id, published) {
      let response = await apiWorkflowTemplate.updatePublishState(id, published);
      if (requestIsSuccess(response)) {
        this.refresh();
      }
    },
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
    onSuccess(isInitial) {
      this.$emit('success', isInitial);
    },
  },
  render() {
    return (
      <div class="sm-bpm-workflow-templates">
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.name = '';
            this.queryParams.published = undefined;
            this.refresh();
          }}
        >
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

          {!this.forCurrentUser ? (
            <a-form-item label="是否启用">
              <a-select
                allowClear
                axios={this.axios}
                value={this.queryParams.published}
                onChange={value => {
                  console.log(value);
                  this.queryParams.published = value;
                  this.refresh();
                }}
              >
                <a-select-option value={1}>已启用</a-select-option>
                <a-select-option value={0}>已禁用</a-select-option>
              </a-select>
            </a-form-item>
          ) : (
            undefined
          )}

          <template slot="buttons">
            {!this.forCurrentUser ? (
              <a-button type="primary" icon="plus" onClick={this.add}>
                添加
              </a-button>
            ) : null}
          </template>
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
              name: (text, record) => {
                return record.edit ? (
                  <div>
                    {record.errorMessage ? (
                      <a-alert
                        type="error"
                        message={record.errorMessage}
                        banner
                        style="margin-bottom: 10px"
                      />
                    ) : null}
                    <a-input
                      value={record.name}
                      style="width: 100%;"
                      onInput={event => {
                        record.name = event.target.value;
                        if (record.name.trim() === '') {
                          record.errorMessage = '名称不能为空';
                        } else if (record.name.trim().length > 20) {
                          record.errorMessage = '名称不能超过 20 个字符';
                        } else {
                          record.errorMessage = '';
                        }
                      }}
                    ></a-input>
                  </div>
                ) : (
                  text
                );
              },
              creationTime: (text, record) => {
                let time = moment(text);
                return text && time.valueOf() != 0 ? time.format('YYYY-MM-DD HH:mm:ss') : undefined;
              },
              publishedTime: (text, record) => {
                let time = moment(record.lastModificationTime);
                return record.published && record.lastModificationTime && time.valueOf() != 0
                  ? time.format('YYYY-MM-DD HH:mm:ss')
                  : undefined;
              },
              versionList: (text, record) => {
                return (
                  <div>
                    {record.formTemplates.map(form => {
                      return (
                        <div class="version-form">
                          <div class="form-title">
                            <span>{form.version}</span>
                          </div>
                          <div class="form-flows">
                            {form.flowTemplates.map(flow => {
                              return (
                                <span class="flow-title">
                                  v {form.version}.{flow.version}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              },
              version: (text, record) => {
                let formTemplate = record.formTemplates.length
                  ? record.formTemplates[record.formTemplates.length - 1]
                  : null;

                let flowTemplate =
                  formTemplate && formTemplate.flowTemplates.length
                    ? formTemplate.flowTemplates[formTemplate.flowTemplates.length - 1]
                    : null;
                return formTemplate && flowTemplate
                  ? `${formTemplate.version}.${flowTemplate.version}`
                  : '';
              },
              published: (text, record) => {
                return record.published ? <a-tag color="green">已启用</a-tag> : undefined;
              },
              isStatic: (text, record) => {
                return record.isStatic ? <a-tag color="green">是</a-tag> : undefined;
              },
              operations: (text, record) => {
                if (this.forCurrentUser) {
                  return (
                    <a
                      onClick={() => {
                        this.initial(record);
                      }}
                    >
                      发起
                    </a>
                  );
                } else {
                  return record.edit ? (
                    <span>
                      <a
                        disabled={
                          !!record.errorMessage ||
                          record.name ===
                          this.workflowsBackup.find(item => item.id === record.id).name
                        }
                        onClick={() => {
                          this.update(record);
                        }}
                      >
                        保存
                      </a>
                      <a-divider type="vertical" />
                      <a
                        onClick={() => {
                          record.edit = false;
                          let _record = this.workflowsBackup.find(item => item.id === record.id);
                          record.name = _record.name;
                        }}
                      >
                        取消
                      </a>
                    </span>
                  ) : (
                    <span>
                      {vIf(
                        <a-button
                          style="padding:0"
                          type="link"
                          disabled={!record.formTemplates.length}
                          onClick={() => {
                            this.$emit('view', record.id);
                          }}
                        >
                            详情
                        </a-button>,
                        vP(this.permissions, permissionsSmBpm.WorkflowTemplate.Detail),
                      )
                      }
                      {vIf(
                        <a-divider type="vertical" />,
                        vP(this.permissions, permissionsSmBpm.WorkflowTemplate.Detail) &&
                          vP(this.permissions, [
                            permissionsSmBpm.WorkflowTemplate.Update,
                            permissionsSmBpm.WorkflowTemplate.PublishState,
                            permissionsSmBpm.WorkflowTemplate.Delete,
                          ]),
                      )}
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
                                        this.$emit('edit', record.id);
                                      }}
                                    >
                                        编辑
                                    </a>
                                  </a-menu-item>,
                                  vP(this.permissions, permissionsSmBpm.WorkflowTemplate.Update),
                                )
                              }

                              {vIf(
                                <a-menu-item>
                                  <a
                                    onClick={() => {
                                      record.errorMessage = '';
                                      record.edit = true;
                                    }}
                                  >
                                      重命名
                                  </a>
                                </a-menu-item>,
                                vP(this.permissions, permissionsSmBpm.WorkflowTemplate.Update),
                              )}


                              {record.published ? (
                                vIf(
                                  <a-menu-item>
                                    <a
                                      onClick={() => {
                                        this.updatePublishState(record.id, false);
                                      }}
                                    >
                                        禁用
                                    </a>
                                  </a-menu-item>,
                                  vP(this.permissions, permissionsSmBpm.WorkflowTemplate.PublishState),
                                )
                              ) : (
                                vIf(
                                  <a-menu-item disabled={!record.formTemplates.length}>
                                    <a
                                      onClick={() => {
                                        this.updatePublishState(record.id, true);
                                      }}
                                    >
                                          启用
                                    </a>
                                  </a-menu-item>,
                                  vP(this.permissions, permissionsSmBpm.WorkflowTemplate.PublishState),
                                )
                              )}
                              {!record.isStatic ? (
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
                                  vP(this.permissions, permissionsSmBpm.WorkflowTemplate.Delete),
                                )
                              ) : (
                                ''
                              )}
                            </a-menu>
                          </a-dropdown>,
                          vP(this.permissions,
                            [
                              permissionsSmBpm.WorkflowTemplate.Delete,
                              permissionsSmBpm.WorkflowTemplate.PublishState,
                              permissionsSmBpm.WorkflowTemplate.Update,
                            ]),
                        )
                      }

                    </span>
                  );
                }
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
          isInitial={true}
          onSuccess={this.onSuccess}
        />
      </div>
    );
  },
};
