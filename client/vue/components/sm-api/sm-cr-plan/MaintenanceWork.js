//天窗计划和其他计划相关接口
let url = '/api/app/crPlanMaintenanceWork';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获得维修计划管理
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }
  // 获取详情
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }
  // 添加维修计划
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }
  // 删除维修计划

  async delete(params) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params,
    });
  }
}
