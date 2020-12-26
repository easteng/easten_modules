import { ModalStatus } from '../../_utils/enum';
import { form as formConfig } from '../../_utils/config';
import * as utils from '../../_utils/utils';
import { requestIsSuccess } from '../../_utils/utils';
import ApiAccount from '../../sm-api/sm-system/Account';

let apiAccount = new ApiAccount();

export default {
  name: 'SmSystemUserPasswordModal',
  props: {
    value: { type: Boolean, default: null },
    axios: { type: Function, default: null },
  },
  data() {
    return {
      form: {},
      confirmDirty: false,
      status: ModalStatus.Hide,
      record: null,
    };
  },
  computed: {
    title() {
      return utils.getModalTitle(this.status);
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    initAxios() {
      apiAccount = new ApiAccount(this.axios);
    },
    edit(record) {
      console.log(record);
      this.record = record;
      this.status = ModalStatus.Edit;
    },

    close() {
      this.status = ModalStatus.Hide;
    },
    handlePasswordConfirmBlur(value){
      const conform= this.form.getFieldValue('confirm');
      if(conform && value!=conform){
        this.$nextTick(() => {
          this.form.setFieldsValue({confirm:undefined});
        });
      }
    
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('您前后两次输入的密码不一致!');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirmPassword'], { force: true });
      }
      callback();
    },
    async ok() {
      if (this.status === ModalStatus.Edit) {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            let response = await apiAccount.reset({userId:this.record.id,password:this.form.getFieldValue('password')});
            if (requestIsSuccess(response)) {
              this.$message.success('操作成功');
              this.close();
              this.$emit('success');
            }
          }
        });
      } else {
        this.close();
      }
    },
  },
  render() {
    return (
      <a-modal
        title='重置密码'
        visible={this.visible}
        onCancel={this.close}
        destroyOnClose={true}
        okText='确定'
        onOk={this.ok}
        width={500}
      >
        <a-form form={this.form}>
          <a-form-item 
            label="新密码" 
            hasFeedback
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              type="password"
              onChange={(value)=>this.handlePasswordConfirmBlur(value)}
              placeholder="请输入新密码"
              v-decorator={[
                'password',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码!',
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                },
              ]}
            />
          </a-form-item>
          <a-form-item 
            label="确认密码" 
            hasFeedback
            label-col={formConfig.labelCol}
            wrapper-col={formConfig.wrapperCol}
          >
            <a-input
              placeholder="请再次输入新密码"
              v-decorator={[
                'confirm',
                {
                  initialValue: null,
                  rules: [
                    {
                      required: true,
                      message: '请确认新密码!',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                },
              ]}
              type="password"
              onFocus={this.handleConfirmBlur}
            />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
};
