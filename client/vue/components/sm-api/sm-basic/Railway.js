let url = '/api/app/basicRailway';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询线路
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }

  // 添加线路
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }

  // 给线路关联站点
  async updateStations(data) {
    return await this.axios({
      url: `${url}/updateStations`,
      method: 'put',
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

  // 获取单个线路
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }
  //上传EXCEL文件
  async upLoad(data, belongOrgCode) {
    return await this.axios({
      url: `${url}/upLoad?belongOrgCode=${belongOrgCode}`,
      method: 'post',
      processData: false,
      data,
    });
  }
}
