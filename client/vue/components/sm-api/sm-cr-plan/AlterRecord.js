//未完成计划变更相关接口
let url = '/api/app/crPlanAlterRecord';
import qs from 'qs';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询单个
  async get(params, repairTagKey) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 查询
  async getList(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 获取待选计划
  async getSelectablePlans(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getSelectablePlans`,
      method: 'get',
      params: { ...params, repairTagKey },
    });
  }

  // 根级id获取待选计划
  async getSelectablePlanByIds(params, repairTagKey) {
    return await this.axios({
      url: `${url}/getSelectablePlanByIds`,
      method: 'get',
      params: { ...params, repairTagKey },
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }

  // 添加
  async create(data, repairTagKey) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data: { ...data, repairTagKey },
    });
  }

  // 编辑
  async update(data, repairTagKey) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data: { ...data, repairTagKey },
    });
  }

  // 删除
  async delete(id, repairTagKey) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id, repairTagKey },
    });
  }

  // 导出
  async export(id) {
    let data = { id: id };
    return await this.axios({
      url: `${url}/export`,
      responseType: 'arraybuffer',
      method: 'post',
      processData: false,
      data,
    });
  }

  // 提交审批
  async submitForExam(data) {
    return await this.axios({
      url: `${url}/submitForExam`,
      method: 'post',
      data,
    });
  }

  // 审批
  async approvePlanAlter(data, repairTagKey) {
    return await this.axios({
      url: `${url}/approvePlanAlter`,
      method: 'post',
      data: { ...data, repairTagKey },
    });
  }
}
