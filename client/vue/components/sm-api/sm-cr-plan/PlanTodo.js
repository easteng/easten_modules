//年月表计划相关接口
let url = '/api/app/crPlanPlanTodo';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获得待办列表
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
      url: `${url}/getWorkOrderByPlanId`,
      method: 'get',
      params,
    });
  }
  //创建派工
  async create(data, isOtherPlan) {
    return await this.axios({
      url: `/api/app/crPlanWorkOrder/create`,
      method: 'post',
      params: { isOtherPlan },
      data,
    });
  }

  // 撤销天窗计划
  async backoutPlan(data) {
    return await this.axios({
      url: `/api/app/crPlanSkylightPlan/backoutPlan`,
      method: 'post',
      data,
    });
  }
}
