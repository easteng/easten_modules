let url = '/api/app/oaDutySchedule';
import qs from 'qs';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  // 获取单个构件分类
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: {
        id,
      },
    });
  }

  // 查询值班表
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }

  //添加值班表
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }
  // 编辑值班表
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }
  //删除值班表
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: {
        id,
      },
    });
  }

}
