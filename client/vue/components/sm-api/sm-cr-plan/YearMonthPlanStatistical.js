let url = '/api/app/crPlanStatistical';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 根据用户组织机构Id获取整个段的年计划完成情况统计列表
  async getYearStatistical(id, repairTagKey) {
    return await this.axios({
      url: `${url}/getYearStatistical`,
      method: 'get',
      params: { id, repairTagKey },
    });
  }

  // 根据查询条件获取整个段的月计划完成情况统计列表
  async getMonthStatistical(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getMonthStatistical`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根据查询条件获取设备类型的完成情况统计列表
  async getEquipmentStatistical(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getEquipmentStatistical`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根据查询条件获取计划状态追踪数据
  async getPlanStateTracking(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getPlanStateTracking`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根据查询条件获取月计划完成情况
  async getMonthCompletion(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getMonthCompletion`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根据查询条件获取月计划完成率列表
  async getMonthCompletionRates(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getMonthCompletionRates`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根据查询条件获取年完成率列表
  async getYearCompletionRates(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getYearCompletionRates`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 单项项完成情况统计
  async getSingleStatistical(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getSingleStatistical`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }
}
