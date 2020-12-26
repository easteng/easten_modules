//年月表计划相关接口
let url = '/api/app/crPlanWorkOrder';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获取已派工作业列表
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getListSentedWorkOrders`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 获取已派工作业详情
  async get(id, repairTagKey) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id, repairTagKey },
    });
  }

  // 撤销已派工作业
  async delete(id, repairTagKey) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id, repairTagKey },
    });
  }
}
