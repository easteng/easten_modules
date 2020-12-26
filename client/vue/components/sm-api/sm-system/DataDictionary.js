let url = '/api/app/appDataDictionary';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询
  async getTreeList(params) {
    return await this.axios({
      url: `${url}/getTreeList`,
      method: 'get',
      params,
    });
  }
  // 通过values值查询
  async getValues(params) {
    return await this.axios({
      url: `${url}/getValues`,
      method: 'get',
      params,
    });
  }
  // 添加
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }

  // 编辑
  async update(id, data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      params: { id },
      data,
    });
  }

  // 删除
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id },
    });
  }

  // 详情
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }
}
