let url = '/api/app/resourceTerminalBusiness';
import qs from 'qs';

export default class TerminalBusiness {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 更新
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }


  // 更新/api/app/resourceTerminalBusiness/create
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }


  // 更新
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
      params:{id},
    });
  }
}
