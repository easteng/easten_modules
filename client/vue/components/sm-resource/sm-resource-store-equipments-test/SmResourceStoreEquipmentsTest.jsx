import { ModalStatus, PageState, StoreEquipmentTestState } from '../../_utils/enum';
import { requestIsSuccess, getStoreEquipmentTestPassed, vIf, vP } from '../../_utils/utils';
import permissionsSmResource from '../../_permissions/sm-resource';
import * as utils from '../../_utils/utils';
import './style/index.less';
import moment from 'moment';
import ApiStoreEquipmentTest from '../../sm-api/sm-resource/StoreEquipmentTest';
import ApiStoreEquipments from '../../sm-api/sm-resource/StoreEquipments';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import ApiUser from '../../sm-api/sm-system/User';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import OrganizationUserSelect from '../../sm-system/sm-system-organization-user-select/SmSystemOrganizationUserSelect';
import StoreEquipmentsSelect from '../sm-resource-store-equipments-select/SmResourceStoreEquipmentsSelect';
import RichTextEditor from '../../sm-file/sm-file-text-editor/SmFileTextEditor';

let apiStoreEquipmentTest = new ApiStoreEquipmentTest();
let apiOrganization = new ApiOrganization();
let apiStoreEquipments = new ApiStoreEquipments();
let apiUser = new ApiUser();

// 定义表单字段常量
const formFields = [
  'storeEquipmentTestRltEquipments',
  'organizationId',
  'organizationName',
  'address',
  'date',
  'code',
  'passed',
  'testerName',
];

export default {
  name: 'SmResourceStoreEquipmentsTest', //设备检测
  props: {
    id: { type: String, default: null },
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      organizationIdEmpty: null,//组织机构树选择和人员数据
      organizationDisabled: false,
      organizationName: null,
      testerDisabled: false,
      testerName: null,
      content: null,
      record: null,
      StoreEquipments: [],
      form: {},
      fileServerEndPoint: '', //文件服务请求头
      status: PageState.Add,
      contentState: true,
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },

  },

  watch: {
    id: {
      handler: function (value, oldValue) {
        this.initAxios();

        if (value && value.length > 0 && value !== null) {
          this.record = value;
          this.status = PageState.View;
          this.form = this.$form.createForm(this, {});
          this.view();
        } else {
          this.content = '';
          this.status = PageState.Add;
          this.form = this.$form.createForm(this, {});
          this.form.resetFields();
        }
      },
      immediate: true,
    },
    // organizationDisabled: {
    //   handler: function (value, oldValue) {

    //   },
    // },
    // testerName: {
    //   handler: function (value, oldValue) {

    //   },
    // },
    // content: {
    //   handler: function (value, oldValue) {
    //   },
    // },
    // immediate: true,
  },

  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
    this.fileServerEndPoint = localStorage.getItem('fileServerEndPoint');
    if (this.status == PageState.View) {
      this.view();
    } else {
      this.form.resetFields();
    }
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
      apiUser = new ApiUser(this.axios);
      apiStoreEquipmentTest = new ApiStoreEquipmentTest(this.axios);
      apiStoreEquipments = new ApiStoreEquipments(this.axios);
    },

    //详情获取数据
    async view() {
      let response = await apiStoreEquipmentTest.get({ id: this.record });
      if (requestIsSuccess(response)) {
        let data = response.data;
        let _storeEquipmentTestRltEquipments = [];
        data.storeEquipmentTestRltEquipments.map(item => {
          _storeEquipmentTestRltEquipments.push(item.storeEquipmentId);
        });
        this.record = {
          storeEquipmentTestRltEquipments: _storeEquipmentTestRltEquipments,
          organizationId: data.organizationId,
          organizationName: data.organizationName,
          address: data.address,
          date: moment(data.date),
          code: data.code,
          passed: data.passed,
          testerId: data.testerId,
          testerName: data.testerName,
        };
        let _record = data.content;
        this.content =
          _record == null
            ? null
            : _record.replace(new RegExp(`src="`, 'g'), `src="${this.fileServerEndPoint}`);
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...utils.objFilterProps(this.record, formFields) });
        });
      }
    },

    async ok() {
      // 数据提交
      if (this.status == PageState.View) {
        this.close();
      } else {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let _content = this.$refs['sc-rich-text-editor'].content();
            let reg = new RegExp(`${this.fileServerEndPoint}`, 'g');
            values.content = _content.replace(reg, '');

            if (this.check(values.code)) {
              let response = null;
              if (this.status === PageState.Add) {
                //创建检测单
                let storeEquipmentIds = [];
                values.storeEquipmentTestRltEquipments.map(item => {
                  storeEquipmentIds.push({
                    storeEquipmentId: item,
                  });
                });
                values.storeEquipmentTestRltEquipments = storeEquipmentIds;
                response = await apiStoreEquipmentTest.create({
                  ...values,
                });
                if (requestIsSuccess(response)) {
                  this.$message.success('操作成功');
                  this.$emit('success');
                  this.content = null;
                  this.testerName = null;
                  this.organizationIdEmpty = "Empty";
                  this.organizationName = null;
                  this.testerDisabled = false;
                  this.organizationDisabled = false;
                  this.form.resetFields();
                }
              }
            }
          }
        });
      }
    },

    //检测编号的正确性
    check(str) {
      let a = /[a-z]/i;
      let b = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
      if (a.test(str)) {
        this.$message.error('编号不能含有字母');
        return false;
      } else {
        if (b.test(str)) {
          this.$message.error('编号不能含有汉字');
          return false;
        } else {
          return true;
        }
      }
    },

    //根据id获取检测机构的名称
    async getOrganization(organizationId) {
      if (organizationId) {
        let response = await apiOrganization.get(organizationId);
        this.form.setFieldsValue({
          organizationName: response.data.name,
        });
        this.organizationName = this.form.getFieldValue('organizationName').replace(/[, ]/g, '');
      } else {
        this.form.setFieldsValue({
          organizationName: null,
        });
        this.organizationName = null;
      }
    },

    //根据id获取检测人员的姓名
    async getTester(testerId) {
      if (testerId) {
        let response = await apiUser.get({ id: testerId });
        this.form.setFieldsValue({
          testerName: response.data.name,
        });
        this.testerName = this.form.getFieldValue('testerName').replace(/[, ]/g, '');
      } else {
        this.form.setFieldsValue({
          testerName: null,
        });
        this.testerName = null;
      }
    },
  },

  render() {
    return (
      <div class="sm-resource-store-equipments-tests">
        <a-form form={this.form}>
          <a-row gutter={24}>
            <a-col sm={24} md={24}>
              <a-form-item
                label-col={{ span: 2 }}
                wrapper-col={{ span: 22 }}
                label="待检设备"
              >
                <StoreEquipmentsSelect
                  style="padding: 0;"
                  axios={this.axios}
                  multiple={true}
                  disabled={this.status == PageState.View}
                  placeholder={'请选择待检设备'}
                  height={60}
                  v-decorator={[
                    'storeEquipmentTestRltEquipments',
                    {
                      initialValue: [],
                      rules: [
                        {
                          required: true,
                          message: '请选择待检设备',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={12} md={12}>
              <a-form-item
                label="检测机构"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 20 }}
              >
                <OrganizationTreeSelect
                  axios={this.axios}
                  disabled={this.organizationDisabled || this.status == PageState.View}
                  onChange={value => {
                    this.getOrganization(value);
                  }}
                  v-decorator={[
                    'organizationId',
                    {
                      initialValue: null,
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={12} md={12}>
              <a-form-item
                label="检测机构名称"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 20 }}
              >
                <a-input
                  placeholder={this.status == PageState.View ? '' : '请输入检测机构名称'}
                  disabled={this.organizationName != null || this.status == PageState.View}
                  onChange={e => {
                    if (e.target.value == '') {
                      this.organizationDisabled = false;
                    } else {
                      this.organizationDisabled = true;
                    }
                  }}
                  v-decorator={[
                    'organizationName',
                    {
                      initialValue: null,
                      rules: [
                        { required: true, message: '请输入检测机构名称！' },
                        { max: 50, message: '名称最多输入50字符' },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={12} md={12}>
              <a-form-item
                label="检测地点"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 20 }}
              >
                <a-input
                  placeholder={'请输入检测地点'}
                  disabled={this.status == PageState.View}
                  v-decorator={[
                    'address',
                    {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入检测地点' },
                        { max: 50, message: '名称最多输入50字符' },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item
                label="检测日期"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 20 }}
              >
                <a-date-picker
                  disabled={this.status == PageState.View}
                  showTime
                  style="width:100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={(date, dateString) => {
                    this.form.setFieldsValue({
                      date: dateString,
                    });
                  }}
                  v-decorator={[
                    'date',
                    {
                      initialValue: null,
                      rules: [
                        {
                          required: true,
                          message: '请输入检测日期',
                        },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={24} md={24}>
              <a-form-item
                label="检测内容"
                label-col={{ span: 2 }}
                wrapper-col={{ span: 22 }}
              >
                <RichTextEditor
                  ref="sc-rich-text-editor"
                  axios={this.axios}
                  disabled={this.status == PageState.View}
                  value={this.content}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item
                label="检测编号"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 20 }}
              >
                <a-input
                  placeholder={'请输入检测编号'}
                  disabled={this.status == PageState.View}
                  v-decorator={[
                    'code',
                    {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入检测编号' },
                        { max: 50, message: '编码最多输入50字符', whitespace: true },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>

            <a-col sm={12} md={12}>
              <a-form-item
                label="检测结果"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 20 }}
              >
                <a-radio-group
                  disabled={this.status == PageState.View}
                  v-decorator={[
                    'passed',
                    {
                      initialValue: StoreEquipmentTestState.Qualified,
                    },
                  ]}
                >
                  <a-radio value={StoreEquipmentTestState.Qualified}>
                    {getStoreEquipmentTestPassed(StoreEquipmentTestState.Qualified) + '(备品)'}
                  </a-radio>
                  <a-radio value={StoreEquipmentTestState.Unqualified}>
                    {getStoreEquipmentTestPassed(StoreEquipmentTestState.Unqualified) + '(报废)'}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            {this.status == PageState.View ? "" :
              <a-col sm={12} md={12}>
                <a-form-item
                  label="检测人员"
                  label-col={{ span: 4 }}
                  wrapper-col={{ span: 20 }}
                >
                  <OrganizationUserSelect
                    organizationIdEmpty={this.organizationIdEmpty}
                    placeholder={'请输入检测人员'}
                    axios={this.axios}
                    disabled={this.testerDisabled || this.status == PageState.View}
                    onChange={value => {
                      this.getTester(value);
                    }}
                    v-decorator={[
                      'testerId',
                      {
                        initialValue: undefined,
                      },
                    ]}
                  />
                </a-form-item>
              </a-col>

            }

            <a-col sm={this.status == PageState.View ? 24 : 12} md={this.status == PageState.View ? 24 : 12}>
              <a-form-item
                label="检测人员姓名"
                label-col={{ span: this.status == PageState.View ? 2 : 4 }}
                wrapper-col={{ span: this.status == PageState.View ? 22 : 20 }}
              >
                <a-input
                  placeholder={'请输入检测人员姓名'}
                  disabled={this.testerName != null || this.status == PageState.View}
                  onChange={e => {
                    if (e.target.value == '') {
                      this.testerDisabled = false;
                    } else {
                      this.testerDisabled = true;
                    }
                  }}
                  v-decorator={[
                    'testerName',
                    {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请输入检测人员姓名' },
                        { max: 10, message: '编码最多输入10字符' },
                      ],
                    },
                  ]}
                />
              </a-form-item>
            </a-col>
            <a-col sm={12} md={12}>
              <a-col span={4}></a-col>
              <a-col span={8} style="padding-left: 0px; padding-right: 0px;">
                {this.status !== PageState.View
                  ? [
                    <a-button
                      style="margin-right: 15px"
                      onClick={() => {
                        this.$emit('cancel');

                        if (this.status != PageState.View) {
                          this.content = '';
                          this.organizationIdEmpty = "Empty";
                          this.form.resetFields();
                        }
                      }
                      }
                    >
                      取消
                    </a-button>,
                    vIf(
                      <a-button
                        type="primary"
                        loading={this.loading}

                        onClick={this.ok}
                      >
                        确定
                      </a-button>,
                      vP(this.permissions, permissionsSmResource.StoreEquipmentTest.Create),
                    ),
                  ]
                  :
                  (<a-button
                    onClick={() => {
                      this.$emit('cancel');
                      if (this.status != PageState.View) {
                        this.content = '';
                        this.form.resetFields();
                      }
                    }
                    }
                  >
                    取消
                  </a-button>)
                }
              </a-col>
            </a-col>
            <a-col sm={12} md={12}></a-col>
          </a-row>
        </a-form>
      </div>
    );
  },
};
