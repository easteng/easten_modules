import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import ApiRole from '../../sm-api/sm-system/Role';
import ApiUser from '../../sm-api/sm-system/User';
import { requestIsSuccess } from '../../_utils/utils';
import SmSystemDataDictionaryTreeSelect from '../sm-system-data-dictionary-tree-select';
import { pagination as paginationConfig } from '../../_utils/config';

let apiUser = new ApiUser();
let apiRole = new ApiRole();

const formFields = [
  'userName',
  'name',
  'surname',
  'email',
  'phoneNumber',
  'lockoutEnabled',
  'twoFactorEnabled',
];

export default {
  name: 'SmSystemUserModal',
  props: {
    organizationId: { type: String, default: null },
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      record: {},
      roles: [],
      users: [],
      queryParams: {
        filter: '',
        maxResultCount: paginationConfig.defaultPageSize,
      },
      pageIndex: 1,
      tabActiveKey: 'createUser',
      selectedRows: [],
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    userAndPositions() {
      return this.selectedRows.map(item => {
        return { userId: item.id, positionId: item.positionId };
      });
    },
    columns() {
      return [
        {
          title: '用户名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },
          ellipsis: true,
        },
        {
          title: '姓名',
          width: 80,
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '职位',
          width: 120,
          dataIndex: 'positionId',
          scopedSlots: { customRender: 'positionId' },
        },
      ];
    },
  },
  created() {
    this.initAxios();
    this.refresh();
    this.initRoles();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiUser = new ApiUser(this.axios);
      apiRole = new ApiRole(this.axios);
    },

    async refresh(resetPage = true) {
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }
      let response = await apiUser.search({
        excludeOrganizationId: this.organizationId,
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response)) {
        this.users = response.data.items;
        this.totalCount = response.data.totalCount;
      }
    },
    onSelectChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    isSelect(record) {
      return this.selectedRows.indexOf(record) >= 0;
    },

    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },

    async initRoles() {
      let response = await apiRole.getList();
      if (requestIsSuccess(response)) {
        this.roles = response.data.items;
      }
    },
    add() {
      this.form.resetFields();
      this.status = ModalStatus.Add;
      this.$nextTick(() => {
        this.form.resetFields();
        this.refresh(true);
      });
    },
    async edit(record) {
      let response = await apiUser.get({ id: record.id, organizationId: this.organizationId });
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.status = ModalStatus.Edit;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          if (this.organizationId) {
            values = {
              ...values,
              positionId: this.record ? this.record.positionId : null,
            };
          }
          this.form.setFieldsValue(values);
        });
      }
    },
    async view(record) {
      let response = await apiUser.get({ id: record.id, organizationId: this.organizationId });
      if (requestIsSuccess(response)) {
        this.record = response.data;
        this.status = ModalStatus.View;
        this.$nextTick(() => {
          let values = utils.objFilterProps(this.record, formFields);
          if (this.organizationId) {
            values = {
              ...values,
              positionId: this.record ? this.record.positionId : null,
            };
          }
          this.form.setFieldsValue(values);
        });
      }
    },

    close() {
      this.form.resetFields();
      this.status = ModalStatus.Hide;
      this.queryParams.filter = '';
      this.tabActiveKey = 'createUser';
      this.refresh(true);
    },

    async ok() {
      // 数据提交
      if (this.organizationId && this.tabActiveKey === 'addUsers') {
        let response = await apiUser.addForOrganization({
          organizationId: this.organizationId,
          userAndPositions: this.userAndPositions,
        });
        if (requestIsSuccess(response)) {
          this.$message.success('操作成功');
          this.close();
          this.$emit('success');
        }
      } else if (this.status == ModalStatus.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let userName = this.form.getFieldValue('userName');
            let name = this.form.getFieldValue('name');
            values.userName = userName.replace(/[, ]/g, '');
            values.name = name.replace(/[, ]/g, '');
            let response = null;
            if (this.status === ModalStatus.Add) {
              response = await apiUser.create({
                organizationId: this.organizationId,
                ...values,
              });
            } else if (this.status === ModalStatus.Edit) {
              response = await apiUser.get({
                id: this.record.id,
                organizationId: this.organizationId,
              });
              if (requestIsSuccess(response)) {
                let params = {
                  organizationId: this.organizationId,
                  concurrencyStamp: response.data.concurrencyStamp,
                  ...values,
                };
                response = await apiUser.update(this.record.id, params);
              }
            }

            if (requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
          }
        });
      }
    },
  },
  render() {
    let userForm = (
      <a-form form={this.form}>
        <a-form-item
          label="用户名"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={this.status != ModalStatus.Add}
            placeholder={this.status == ModalStatus.View ? '' : '请输入用户名'}
            v-decorator={[
              'userName',
              {
                initialValue: '',
                rules: [{ required: true, message: '请输入用户名！', whitespace: true }],
              },
            ]}
          />
        </a-form-item>

        <a-form-item
          label="密码"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
          v-show={this.status == ModalStatus.Add}
        >
          <a-input-password
            disabled={this.status != ModalStatus.Add}
            placeholder={this.status == ModalStatus.View ? '' : '请输入密码'}
            v-decorator={[
              'password',
              {
                initialValue: '',
                rules: [{ required: this.status == ModalStatus.Add, message: '请输入密码！', whitespace: true }],
              },
            ]}
          />
        </a-form-item>

        <a-form-item
          label="姓名"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={this.status == ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请输入姓名'}
            v-decorator={[
              'name',
              {
                initialValue: '',
                rules: [{ required: true, message: '请输入姓名！', whitespace: true }],
              },
            ]}
          />
        </a-form-item>

        <a-form-item
          label="邮箱"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={this.status == ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请输入邮箱'}
            v-decorator={[
              'email',
              {
                initialValue: '',
                rules: [
                  { required: false, message: '请输入邮箱！' },
                  { type: 'email', message: '请输入正确邮箱' },
                ],
              },
            ]}
          />
        </a-form-item>

        <a-form-item
          label="手机号"
          label-col={formConfig.labelCol}
          wrapper-col={formConfig.wrapperCol}
        >
          <a-input
            disabled={this.status == ModalStatus.View}
            placeholder={this.status == ModalStatus.View ? '' : '请输入手机号'}
            v-decorator={[
              'phoneNumber',
              {
                rules: [{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }],
                initialValue: '',
              },
            ]}
          />
        </a-form-item>

        {this.organizationId ? (
          <a-form-item
            label="职位"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmSystemDataDictionaryTreeSelect
              disabled={this.status == ModalStatus.View}
              axios={this.axios}
              groupCode={'UserPosition'}
              placeholder={this.status == ModalStatus.View ? '' : '请选择职位'}
              v-decorator={[
                'positionId',
                {
                  initialValue: null,
                },
              ]}
            />
          </a-form-item>
        ) : (
          undefined
        )}

        <a-form-item wrapper-col={formConfig.wrapperColTail}>
          <a-checkbox
            disabled={this.status == ModalStatus.View}
            v-decorator={[
              'lockoutEnabled',
              {
                valuePropName: 'checked',
                initialValue: false,
              },
            ]}
          >
            锁定
          </a-checkbox>
        </a-form-item>

        <a-form-item wrapper-col={formConfig.wrapperColTail}>
          <a-checkbox
            disabled={this.status == ModalStatus.View}
            v-decorator={[
              'twoFactorEnabled',
              {
                valuePropName: 'checked',
                initialValue: false,
              },
            ]}
          >
            二次认证
          </a-checkbox>
        </a-form-item>
      </a-form>
    );
    return (
      <a-modal
        title={`${this.title}用户`}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.ok}
        destroyOnClose={true}
      >
        {this.organizationId && this.status === ModalStatus.Add ? (
          <a-tabs
            activeKey={this.tabActiveKey}
            onChange={activeKey => {
              this.tabActiveKey = activeKey;
              if (this.tabActiveKey === 'addUsers') {
                this.refresh();
              }
            }}
          >
            {/* 新建用户标签页 */}
            <a-tab-pane tab="新建用户" key="createUser" forceRender>
              {userForm}
            </a-tab-pane>

            {/* 当前组织机构下属组织机构的用户数据展示标签页 */}
            <a-tab-pane tab="选择用户" key="addUsers" forceRender>
              <div class="sc-table-operator">
                {/* 操作区 */}
                <a-input-search
                  placeholder={this.status == ModalStatus.View ? '' : '请输入用户名、姓名、邮箱'}
                  value={this.queryParams.filter}
                  onChange={event => {
                    this.queryParams.filter = event.target.value;
                    this.refresh(true);
                  }}
                  style="margin-bottom: 16px;"
                  enterButton
                  onSearch={this.refresh}
                />

                {/* 展示区 */}
                <a-table
                  scroll={{ y: 300 }}
                  columns={this.columns}
                  rowKey={record => record.id}
                  dataSource={this.users}
                  bordered={this.bordered}
                  size="small"
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                      this.onSelectChange(selectedRows);
                    },
                  }}
                  {...{
                    scopedSlots: {
                      userName: (text, record) => {
                        let _userName = text;
                        if (record.email) {
                          _userName += `(${record.email})`;
                        }
                        return _userName;
                      },
                      name: (text, record) => {
                        return text;
                      },
                      positionId: (text, record) => {
                        return this.isSelect(record) ? (
                          <SmSystemDataDictionaryTreeSelect
                            axios={this.axios}
                            groupCode={'UserPosition'}
                            value={record.positionId}
                            onChange={value => {
                              record.positionId = value;
                            }}
                          />
                        ) : null;
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
                  showSizeChanger={!this.isSimple}
                  size='small'
                  showTotal={paginationConfig.showTotal}
                />
            
              </div>
            </a-tab-pane>
          </a-tabs>
        ) : (
          userForm
        )}
      </a-modal>
    );
  },
};
