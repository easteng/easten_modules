let url = '/api/app/stdBasicRepairItem';
import qs from 'qs';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询单个
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }

  // 查询列表
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

  // 获取最大编码
  async getMaxNumber(params) {
    return await this.axios({
      url: `${url}/getMaxNumber`,
      method: 'get',
      params,
    });
  }
  // 标签迁移
  async createTagMigration(data) {
    return await this.axios({
      url: `${url}/createTagMigration`,
      method: 'post',
      data,
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

  //批量编辑维修项执行单位
  async updateOrganizationType(data) {
    return await this.axios({
      url: `${url}/updateOrganizationType`,
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
