import "../style/index";
import { ModalStatus } from "../../../_utils/enum";
import * as utils from '../../../_utils/utils';
import ApiDutySchedule from '../../../sm-api/sm-oa/DutySchedule';
import SmSystemOrganizationTreeSelect from '../../../sm-system/sm-system-organization-tree-select';
import SmSystemUserSelect from '../../../sm-system/sm-system-user-select';
import ApiUser from '../../../sm-api/sm-system/User';
import { requestIsSuccess } from '../../../_utils/utils';
import { form as formConfig, tips } from '../../../_utils/config';

let apiUser = new ApiUser();
let apiDutySchedule = new ApiDutySchedule();
import moment from 'moment';
import { conforms } from "lodash";

// 定义表单字段常量
const formFields = [
  'date',
  'remark',
];
export default {
  name: 'SmOaDutyScheduleModal',
  props: {
    axios: { type: Function, default: null },

  },
  data() {
    return {
      counter: 0,
      organizationId: undefined,//组织机构id
      userId: undefined,//人员id
      dutyScheduleRltUsers: [],
      status: ModalStatus.Hide, // 模态框状态
      form: {}, // 表单
      loading: false, //确定按钮加载状
      isShow: false,//提示信息的状态
      errorMessage: '',//错误提示信息
      record: null,//当前值班信息
    };
  },


  computed: {
    // filteredOptions() {
    //   let result = [];
    //   for (let item in QuestionType) {
    //     console.log(item);
    //     console.log(this.selectedItems);
    //     if (item !== this.currentType) {
    //       result.push(item);
    //     }
    //   }
    //   return result;
    // },
    title() {
      // 计算模态框的标题变量
      return utils.getModalTitle(this.status);
    },
    visible() {
      // 计算模态框的显示变量k
      return this.status !== ModalStatus.Hide;
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          ellipsis: true,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '姓名',
          ellipsis: true,
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          ellipsis: true,
          scopedSlots: { customRender: 'phone' },
        },

        {
          title: '操作',
          dataIndex: 'operations',
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    async addDutySchedule() {
      if (this.userId) {
        let response = await apiUser.get({ id: this.userId });
        if (requestIsSuccess(response) && response.data) {
          let user = response.data;
          if (user.length > 0 || user) {
            if (!this.dutyScheduleRltUsers.some(item => item.id == user.id)) {
              this.dutyScheduleRltUsers.push(user);
            } else {
              this.isShow = true;
              this.errorMessage = `当前人员 ${user.name} 已在当日值班表中`;
              setTimeout(() => {
                this.isShow = false;
              }, 4000);
            }

          }
        }
        this.userId = undefined;
      }

    },
    initAxios() {
      apiUser = new ApiUser(this.axios);
      apiDutySchedule = new ApiDutySchedule(this.axios);
    },
    //
    remove(id) {
      let dutyScheduleRltUsers = [...this.dutyScheduleRltUsers];
      this.dutyScheduleRltUsers = dutyScheduleRltUsers.filter(item => item.id !== id);
    },
    add(value, organizationId) {
      this.status = ModalStatus.Add;
      this.record = value;
      this.organizationId = organizationId;
      if (value) {
        let date = moment(new Date(value), 'YYYY-MM-DD');
        this.$nextTick(() => {
          this.form.resetFields();
          this.form.setFieldsValue({ date: date });
        });
      }
    },
    //编辑
    async edit(record) {
      this.status = ModalStatus.Edit;
      if (record) {
        this.record = record;
        this.organizationId = record.organizationId;
        record.date = moment(record.date, 'YYYY-MM-DD');
        if (record.dutyScheduleRltUsers && record.dutyScheduleRltUsers.length > 0) {
          record.dutyScheduleRltUsers.map(item => {
            this.dutyScheduleRltUsers.push(item.user);
          });
        }
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(record, formFields) });
        });
      }
    },
    close() {
      this.form.resetFields();
      this.dutyScheduleRltUsers = [];
      this.status = ModalStatus.Hide;
      this.loading = false;
    },

    // 数据提交
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);
          let data = {
            ...values,
            organizationId: this.organizationId,
            date: moment(values.date).format(),
          };
          console.log(this.dutyScheduleRltUsers);
          let relateInfos = [];
          if (this.dutyScheduleRltUsers.length > 0) {
            await this.dutyScheduleRltUsers.map(item => {
              console.log(item);
              relateInfos.push({ userId: item.id });
            });

          }
          data.dutyScheduleRltUsers = relateInfos;
          this.loading = true;
          let response = null;
          if (this.status === ModalStatus.Add) {
            //添加
            response = await apiDutySchedule.create(data);
          } else if (this.status === ModalStatus.Edit) {
            // 编辑
            response = await apiDutySchedule.update({ id: this.record.id, ...data });
          }
          if (utils.requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }

        }

      });

      this.loading = false;
    },
  },

  render() {
    return (
      <a-modal
        class="sm-oa-duty-schedule-modal"
        title={`${this.title}值班管理`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.loading}
        destroyOnClose={true}
        okText="保存"
        onOk={this.ok}
        width={700}
      >
        <a-form form={this.form}>
          <a-form-item label="组织机构"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <SmSystemOrganizationTreeSelect
              axios={this.axios}
              disabled
              value={this.organizationId}
              onChange={value => {
                this.organizationId = value;
              }}
            />
          </a-form-item>
          <a-form-item label="值班时间"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-date-picker
              disabled
              style="width: 100%"
              placeholder='请选择日期'
              v-decorator={[
                'date',
              ]}
            />
          </a-form-item>
          <a-form-item label="值班人员"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <div class="user-button">
              <div class="user">
                <SmSystemUserSelect
                  axios={this.axios}
                  organizationId={this.organizationId}
                  value={this.userId}
                  onChange={value => {
                    this.userId = value;
                  }}
                />
                <a-alert
                  message={this.errorMessage}
                  type="error"
                  show-icon
                  class={this.isShow ? 'show' : 'isShow'}
                />
              </div>
              <div class="add-button">
                <a-button
                  type="primary"
                  onClick={() => {
                    this.addDutySchedule();
                  }}
                >添加</a-button>
              </div>
            </div>
          </a-form-item>
          <a-form-item label="值班信息"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-table
              size="middle"
              columns={this.columns}
              rowKey={record => record.id}
              dataSource={this.dutyScheduleRltUsers}
              loading={this.loading}
              pagination={false}
              {...{
                scopedSlots: {
                  index: (text, record, index) => {
                    let result = index + 1;
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                  name: (text, record, index) => {
                    let result = record.name ? record.name : '';
                    return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                  },
                  duty: (text, record, index) => {

                    let result = record.position ? record.position.name : '';
                    return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                  },
                  phone: (text, record, index) => {
                    let result = record.phoneNumber ? record.phoneNumber : '';
                    return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                  },
                  operations: (text, record) => {
                    return [
                      <span>
                        <a-button
                          type="primary"
                          onClick={() => {
                            this.remove(record.id);
                          }}
                        >
                          删除
                        </a-button>
                      </span>,
                    ];
                  },
                },
              }}
            ></a-table>
          </a-form-item>
          <a-form-item label="备注"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-textarea
              rows="3"
              disabled={this.status == ModalStatus.View}
              placeholder={this.status == ModalStatus.View ? '' : '请输入备注'}
              v-decorator={[
                'remark',
                {
                  initialValue: '',
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
