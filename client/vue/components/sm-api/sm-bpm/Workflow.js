let url = '/api/app/bpmWorkflow';

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
  // 判断当前节点是否可以回退流程
  async canReturnStep(data) {
    return await this.axios({
      url: `${url}/CanReturnStep`,
      method: 'post',
      data,
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
  // 详情GetWorkflow
  async getWorkflow(id) {
    return await this.axios({
      url: `${url}/getWorkflow`,
      method: 'get',
      params: { id },
    });
  }
  // 获取工作流模板
  async getWorkflowTemplateId(id) {
    return await this.axios({
      url: `${url}/GetWorkflowTemplateId`,
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

  // 处理审批
  async process(data) {
    return await this.axios({
      url: `${url}/process`,
      method: 'post',
      data,
    });
  }
  //获取流程简报信息
  async getWorkflowData(id) {
    return await this.axios({
      url: `${url}/getWorkflowData`,
      method: 'get',
      params: { id },
    });
  }
}
