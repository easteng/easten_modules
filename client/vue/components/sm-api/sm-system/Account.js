let url = '/api/account';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 添加系统单个用户
  async reset(data) {
    return await this.axios({
      url: `${url}/reset`,
      method: 'post',
      data,
    });
  }

  //获取当前登录用户信息
  async getAppConfig() {
    let res = await this.axios({
      url: '/api/abp/application-configuration',
      methods: 'Get',
    });
    return res;
  }
}
