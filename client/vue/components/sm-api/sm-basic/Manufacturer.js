let url = '/api/app/BasicManufacturer';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询厂家
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

  // 获取单个厂家
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  //上传EXCEL文件
  async upLoad(data) {
    return await this.axios({
      url: `${url}/upLoad`,
      responseType: 'arraybuffer',
      method: 'post',
      processData: false,
      data,
    });
  }
}
