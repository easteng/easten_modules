let url = '/api/app/crPlanStatistics';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 根据查询条件获取整个段的月计划完成情况统计列表
  async getYearPlanProgress(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getYearPlanProgress`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根据某个设备类型的完成情况
  async getRepairGroupFinishData(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getRepairGroupFinishData`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }
}
