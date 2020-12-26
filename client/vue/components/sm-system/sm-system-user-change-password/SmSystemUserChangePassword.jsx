/**
 * 
 */
import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import ApiUser from '../../sm-api/sm-system/User';
import { requestIsSuccess } from '../../_utils/utils';
let apiUser = new ApiUser();
const formFields = [
  'oldPassword',
  'newPassword',
  'newPasswordConfirm',
];

export default {
  name: 'SmSystemUserChangePassword',
  props: {
    value: { type: Boolean, default: false },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide,
      form: {},
      iValue: false,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.iValue = val;
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiUser = new ApiUser(this.axios);
    },
    close() {
      this.form.resetFields();
      this.iValue = false;
      this.$emit('change', false);
      this.$emit('input', false);
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次密码不一致');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },
    async ok() {
      // 数据提交
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let response = await apiUser.updatePassword(values);
          if (requestIsSuccess(response)) {
            this.$message.success('操作成功');
            this.close();
            this.$emit('success');
          }
        }
      });
    },
  },
  render() {

    return (
      <a-modal
        title="修改密码"
        visible={this.iValue}
        onCancel={this.close}
        onOk={this.ok}
      >
        <a-form form={this.form}>
          <a-form-item
            label="新密码"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              type="password"
              placeholder={'请输入新密码'}
              v-decorator={[
                'newPassword',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入新密码！', whitespace: true }],
                },
                // {
                //   validator: validateToNextPassword,
                // },
              ]}
            />
          </a-form-item>

          <a-form-item
            label="确认密码"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              type="password"
              placeholder={'请再次输入新密码'}
              v-decorator={[
                'newPasswordConfirm',
                {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请再次输入新密码', whitespace: true },
                    { validator: this.compareToFirstPassword }],
                },

              ]}
            />
          </a-form-item>

          <a-form-item
            label="原始密码"
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              type="password"
              placeholder={'请输入原始密码'}
              v-decorator={[
                'oldPassword',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入原始密码！', whitespace: true }],
                },
              ]}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
