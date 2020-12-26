// let url = '/api/app/basicInstallationSite';

let url = '/api/app/basicInstallationSite';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  // 获取单个信息
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: {
        id,
      },
    });
  }

  // 查询
  async getTreeList(params) {
    return await this.axios({
      url: `${url}/getTreeList`,
      method: 'get',
      params,
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

  // 删除
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: {
        id,
      },
    });
  }

  // cascader数据查询
  async getCascaderList(params) {
    return await this.axios({
      url: `${url}/getCascaderList`,
      method: 'get',
      params,
    });
  }

  // cascader数据查询  组织机构-机房
  async getCascaderListWithOrg(orgId) {
    return await this.axios({
      url: `${url}/getCascaderListWithOrg`,
      method: 'get',
      params: {
        orgId,
      },
    });
  }

  //导入EXCEL文件
  async upload(data) {
    return await this.axios({
      url: `${url}/upload`,
      method: 'post',
      processData: false,
      params: {},
      data,
    });
  }
  //获取安装位置信息
  async getListByScope(params) {
    return await this.axios({
      url: `${url}/getListByScope`,
      method: 'get',
      params,
    });
  }
}
