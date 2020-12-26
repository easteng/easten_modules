let url = '/api/app/appOrganization';
import qs from 'qs';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询
  async getTreeList(params) {
    return await this.axios({
      url: `${url}/getTreeList`,
      method: 'get',
      params,
    });
  }

  // 查询当前用户所在组织机构
  async getCurrentUserOrganizations(params) {
    return await this.axios({
      url: `${url}/getCurrentUserOrganizations`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        });
      },
    });
  }

  /**
   * @description 根据条件获取组织机构信息
   * @author easten
   * @date 2020-09-23
   * @param {*} params
   * @returns
   * @memberof Api
   */
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        });
      },
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
  
  // 批量编辑组织类型
  async batchUpdateType(data) {
    return await this.axios({
      url: `${url}/batchUpdateType`,
      method: 'post',
      data,
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

  // 详情
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  // 判断该组织机构下是否有用户
  async hasUsers(id) {
    return await this.axios({
      url: `${url}/hasUser`,
      method: 'post',
      params: { id },
    });
  }

  //获取已登录的用户所属的组织机构
  async getLoginUserOrganizationIds() {
    return await this.axios({
      url: `${url}/getLoginUserOrganizationIds`,
      method: 'get',
    });
  }

  // 上传获取顶级组织机构
  async upload(data) {
    return await this.axios({
      url: `${url}/upload`,
      method: 'post',
      processData: false,
      data,
    });
  }

  // 根据选择项导入组织机构
  async import(params) {
    return await this.axios({
      url: `${url}/import`,
      method: 'post',
      params,
    });
  }

  /**
   * @description 文件导出
   * @author easten
   * @date 2020-11-10
   * @param {*} params
   * @returns 
   * @memberof Api
   */
  async export(data){
    return await this.axios({
      url: `${ url}/export`,
      responseType:'arraybuffer',
      method: 'post',
      params:data,
    });
  }
}
