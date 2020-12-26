import qs from 'qs';

let url = '/api/app/categoryRltArticle';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
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

  // 编辑启用状态
  async updateEnable(data) {
    return await this.axios({
      url: `${url}/updateEnable`,
      method: 'put',
      data,
    });
  }

  // 编辑排序
  async updateOrder(data) {
    return await this.axios({
      url: `${url}/updateOrder`,
      method: 'put',
      data,
    });
  }

  // 删除
  async delete(ids) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { ids },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        });
      },
    });
  }
  
}
