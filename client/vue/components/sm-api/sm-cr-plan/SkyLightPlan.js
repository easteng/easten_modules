//天窗计划和其他计划相关接口
let url = '/api/app/crPlanSkylightPlan';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获得天窗列表
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  //获取其他计划列表
  async getOtherPlanList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getOtherPlanList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 下发其他计划
  async publishOtherPlan(data, repairTagKey) {
    return await this.axios({
      url: `${url}/publishOtherPlan`,
      method: 'post',
      data: { ...data, repairTagKey },
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

  // 发布天窗计划
  async publishPlan(data, repairTagKey) {
    return await this.axios({
      url: `${url}/publishPlan`,
      method: 'post',
      data: { ...data, repairTagKey },
    });
  }

  // 撤销天窗计划
  async backoutPlan(data) {
    return await this.axios({
      url: `${url}/backoutPlan`,
      method: 'post',
      data,
    });
  }

  // 添加天窗计划
  async create(isOther, data, repairTagKey) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data: { ...data, repairTagKey },
      params: { isOther },
    });
  }

  //编辑天窗计划
  async update(isOther, data, repairTagKey) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data: { ...data, repairTagKey },
      params: { isOther },
    });
  }

  // 删除天窗计划
  async remove(params) {
    return await this.axios({
      url: `${url}/remove`,
      method: 'delete',
      params,
    });
  }

  // 获取单条待选计划
  async getSelectablePlan(params) {
    return await this.axios({
      url: `/api/app/crPlanAlterRecord/getSelectablePlan`,
      method: 'get',
      params,
    });
  }


}
