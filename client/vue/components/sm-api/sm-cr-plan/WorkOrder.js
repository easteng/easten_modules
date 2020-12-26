//派工作业相关接口
let url = '/api/app/crPlanWorkOrder';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  async getListSentedWorkOrders(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getListSentedWorkOrders`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 派工作业列表
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  async getOtherHomeworkList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getOtherHomeworkList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 派工单获取数据
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }

  // 详细、完成、验收获取数据
  async getDetail(params) {
    return await this.axios({
      url: `${url}/getDetail`,
      method: 'get',
      params,
    });
  }

  // 完成中的保存和提交按钮，保存时issave=true，提交时issave=false
  async finish(issave, isOtherPlan, data, repairTagKey) {
    return await this.axios({
      url: `${url}/finish`,
      method: 'post',
      params: { issave, isOtherPlan },
      data: { ...data, repairTagKey },
    });
  }

  // 验收中的保存和提交按钮，保存时issave=true，提交时issave=false
  async acceptance(issave, data, repairTagKey) {
    return await this.axios({
      url: `${url}/acceptance`,
      method: 'post',
      params: { issave },
      data: { ...data, repairTagKey },
    });
  }

  // 导出 ismaintenance=True:导出检修表  False:导出派工单
  async export(id, ismaintenance, repairTagKey) {
    return await this.axios({
      url: `${url}/export`,
      responseType: 'arraybuffer',
      method: 'post',
      params: { id, ismaintenance, repairTagKey },
    });
  }

  async create(isOtherPlan, data, repairTagKey) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      params: { isOtherPlan },
      data: { ...data, repairTagKey },
    });
  }

  // 派工单中的保存
  async update(data, repairTagKey) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data: { ...data, repairTagKey },
    });
  }

  // 编辑派工单（已完成模块使用）
  async updateDetail(data, repairTagKey) {
    return await this.axios({
      url: `${url}/updateDetail`,
      method: 'put',
      data: { ...data, repairTagKey },
    });
  }

  // 撤销
  async remove(id, isOtherPlan, repairTagKey) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id, isOtherPlan, repairTagKey },
    });
  }
}
