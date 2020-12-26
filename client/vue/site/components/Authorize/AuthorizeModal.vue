<template>
  <a-modal
    v-model="visible"
    :confirm-loading="confirmLoading"
    :title="'登录'"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form :form="form" @submit="onOk">
      <a-form-item label="账户" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="[
            'username',
            { rules: [{ required: true, message: '请输入用户名或者邮箱' }], initialValue: 'admin' },
          ]"
          placeholder="请输入用户名或者邮箱"
        />
      </a-form-item>

      <a-form-item label="密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码' }], initialValue: '1q2w3E*' },
          ]"
          placeholder="请输入密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { isZhCN } from '../../util';
import Cookies from 'js-cookie';
import config from '@/config';
import * as authApi from './api';

export default {
  name: 'AuthorizeModal',
  data() {
    return {
      confirmLoading: false,
      visible: false,
      isCN: isZhCN(this.name),
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
    };
  },
  watch: {
    visible: function(value, oldValue) {
      if (value) {
        this.form.resetFields();
        this.confirmLoading = false;
      }
    },
  },
  created() {},
  methods: {
    onOk() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);

          this.confirmLoading = true;
          await this.toLogin(values);
          this.confirmLoading = false;
        }
      });
    },
    async toLogin(params) {
      // getOpenIdConfig
      let resOpenIdConfig = await authApi.getOpenIdConfig();
      if (!(resOpenIdConfig.status === 200 && resOpenIdConfig.data.jwks_uri)) {
        this.$message.error('获取 OpenIdConfig 失败');
        return false;
      }

      // getJwks
      let resJwks = await authApi.getJwks(resOpenIdConfig.data.jwks_uri);
      if (resJwks.status !== 200) {
        this.$message.error('获取 Jwks 失败');
        return false;
      }

      // getToken
      let resToken = await authApi.getToken(params);
      if (resToken && resToken.status === 200 && resToken.data && resToken.data.access_token) {
        localStorage.setItem(config.tokenKey, resToken.data.access_token);
        this.visible = false;
        this.$emit('success');
        this.$message.success('登录成功');
        return true;
      }
      return false;
    },

    onCancel() {
      console.log('onCancel');
    },
  },
};
</script>
