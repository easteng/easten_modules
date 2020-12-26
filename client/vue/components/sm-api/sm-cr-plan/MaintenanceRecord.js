//检修记录相关接口
let url = '/api/app/crPlanMaintenanceRecord';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获取检修设备
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 获取检修设备检修记录
  async getMaintenanceRecord(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getMaintenanceRecord`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }
}
