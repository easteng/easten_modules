let url = '/api/app/bpmWorkflowTemplate';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }

  // 详情
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  // 获取首次发起表单
  async GetWorkflowForInitial(id) {
    return await this.axios({
      url: `${url}/GetWorkflowForInitial`,
      method: 'get',
      params: { id },
    });
  }

  // 添加
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }

  // 编辑
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }

  // 编辑表单模板
  async updateFlowTemplate(data) {
    return await this.axios({
      url: `${url}/updateFlowTemplate`,
      method: 'put',
      data,
    });
  }

  // 编辑表单模板和流程模板
  async updateFormTemplateAndFlowTemplate(data) {
    return await this.axios({
      url: `${url}/updateFormTemplateAndFlowTemplate`,
      method: 'put',
      data,
    });
  }

  // 更新发布成员
  async updateMembers(data) {
    return await this.axios({
      url: `${url}/updateMembers`,
      method: 'put',
      data,
    });
  }

  // 编辑
  async updatePublishState(id, published) {
    return await this.axios({
      url: `${url}/updatePublishState`,
      method: 'put',
      data: {
        id,
        published,
      },
    });
  }

  // 删除
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id },
    });
  }
}
