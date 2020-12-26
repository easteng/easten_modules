let url = '/api/app/resourceCableLocation';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询单个实体
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  // 查询电缆埋深信息
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
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
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
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
}
