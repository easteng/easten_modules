import axios from 'axios';
import Vue from 'vue';
import Cookies from 'js-cookie';
import config from '@/config';

const instance = axios.create({
  baseURL: config.apis.default.url,
  timeout: 1000000,
});

instance.interceptors.request.use(
  function(_config) {
    let tokenValue = localStorage.getItem(config.tokenKey);
    let organizationId = localStorage.getItem('organizationId');
    if (tokenValue) {
      _config.headers.common['Authorization'] = 'Bearer ' + tokenValue;
      _config.headers.common['OrganizationId'] = organizationId || '';
    }
    return _config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

let vm = new Vue({});
instance.interceptors.response.use(
  response => {
    if (response.request.responseURL.indexOf('ReturnUrl') >= 0) {
      vm.$message.error('未授权，请先登录');
    }
    return response;
  },
  error => {
    let msg = '';
    if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message &&
      error.response.data.error.details
    ) {
      msg = error.response.data.error.details;
    } else if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message
    ) {
      msg = error.response.data.error.message;
    } else if (!error.response) {
      msg = '未知错误';
    }

    vm.$message.error(msg);
    return error.response;
  },
);
export default instance;
