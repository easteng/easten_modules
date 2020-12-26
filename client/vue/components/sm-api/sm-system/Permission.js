let url = 'api/permission-management';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  //查询
  async getList(params) {
    return await this.axios({
      url: `${url}/permissions`,
      method: 'get',
      params,
    });
  }

  // 编辑
  async edit(params, data) {
    return await this.axios({
      url: `${url}/permissions`,
      method: 'put',
      params: params,
      data,
    });
  }
}
