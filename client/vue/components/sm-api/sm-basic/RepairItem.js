let url = '/api/app/basicRepairDetail';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询对象
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }

  // 查询对象
  async getStandTest(params) {
    return await this.axios({
      url: `${url}/getStandTest`,
      method: 'get',
      params,
    });
  }

  // 获得（设备类型、设备名称已有列表）
  async getCreateInfos(params) {
    return await this.axios({
      url: `${url}/getCreateInfos`,
      method: 'get',
      params,
    });
  }

  // 获得（设备类型、设备名称已有列表）
  async getReparilIFDCodeTree(params) {
    return await this.axios({
      url: `${url}/getReparilIFDCodeTree`,
      method: 'get',
      params,
    });
  }

  // 查询 获得所有列表
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

  // 添加测试项
  async createStandTest(data) {
    return await this.axios({
      url: `${url}/createStandTest`,
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

  // 编辑测试项
  async updateStandTest(data) {
    return await this.axios({
      url: `${url}/updateStandTest`,
      method: 'put',
      data,
    });
  }

  // 维修项关联IFD
  async updateIFD(data) {
    return await this.axios({
      url: `${url}/updateIFD`,
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

  // 删除测试项
  async deleteStandTest(id) {
    return await this.axios({
      url: `${url}/deleteStandTest`,
      method: 'delete',
      params: { id },
    });
  }
}
