import qs from 'qs';

let url = '/api/app/emergFault';
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

  // 获取详情
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
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

  //创建记录表
  async applyEmergPlan(data) {
    return await this.axios({
      url: `${url}/applyEmergPlan`,
      method: 'post',
      data,
    });
  }

  //创建记录表
  async Process(data) {
    return await this.axios({
      url: `${url}/Process`,
      method: 'post',
      data,
    });
  }
}
