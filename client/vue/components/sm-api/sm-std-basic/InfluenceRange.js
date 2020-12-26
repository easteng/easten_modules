let url = '/api/app/stdBasicInfluenceRange';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获取单个
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  // 查询
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 添加
  async create(data, repairTagKey) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data: { ...data, repairTagKey },
    });
  }

  // 编辑
  async update(data, repairTagKey) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data: { ...data, repairTagKey },
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
