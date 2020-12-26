let url = '/api/app/BasicStation';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询单个站点
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }

  // 根据线路主键获得站点列表
  async getListByRailwayId(railwayId) {
    return await this.axios({
      url: `${url}/getListByRailwayId`,
      method: 'get',
      params:{railwayId},
    });
  }

  // 查询 获得所有列表
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }      

  //查询 极简数据
  async getSimpleList(params) {
    return await this.axios({
      url: `${url}/getSimpleList`,
      method: 'get',
      params,
    });
  } 

  // 查询 获得所有列表
  async getCascaderList(params) {
    return await this.axios({
      url: `${url}/getCascaderListWithOrg`,
      method: 'get',
      params,
    });
  }

  // 根据组织机构获取组织机构下所有站点
  async getListByOrg(params) {
    return await this.axios({
      url: `${url}/getListByOrg`,
      method: 'get',
      params,
    });
  }

  // 添加站点
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }

  // 编辑站点
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }

  // 删除站点
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id },
    });
  }
  //上传EXCEL文件
  async upLoad(data) {
    return await this.axios({
      url: `${url}/upLoad`,
      method: 'post',
      processData: false,
      data,
    });
  }
}
