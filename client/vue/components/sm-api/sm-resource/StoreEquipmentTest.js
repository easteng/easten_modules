let url = '/api/app/resourceStoreEquipmentTest';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  //查询检测单信息
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }
  //查询库存信息
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }
  //批量添加库存设备
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: `post`,
      data,
    });
  }
}
