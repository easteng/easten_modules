let url = '/api/app/stdBasicStandardEquipment';

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
    });
  }

  // 获取单个设备信息
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

  // 导入
  async import(data) {
    return await this.axios({
      url: `${url}/import`,
      method: 'post',
      processData: false,
      data,
    });
  }

  // 导入数据
  async upload(data) {
    return await this.axios({
      url: `${url}/upload`,
      method: 'post',
      processData: false,
      data,
    });
  }
}
