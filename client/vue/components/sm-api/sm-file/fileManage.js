/**
 * 接口说明：文件管理组件接口
 * 作者：easten
 */
import qs from 'qs';
let url = '/api/app/fileFileManager';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  /**
   * 搜索查询
   * @param {*} data
   * @returns 在指定组织或者文件夹下的第一级资源信息
   * @memberof Api
   */
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }
  /**
   * @description 获取文件地址前缀
   * @author easten
   * @date 2020-07-16
   * @returns 
   * @memberof Api
   */
  async getEndPoint() {
    return await this.axios({
      url: `${url}/getEndPoint`,
      method: 'get',
    });
  }
  
  /**
   * 根据条件获取组织机构的id
   * @param {*} params
   * @returns
   * @memberof Api
   */
  async getOragniaztionId(params){
    return await this.axios({
      url: `${ url}/getOrganizationId`,
      method: 'get',
      params,
    });
  }
  /**
   * 获取组织树结构
   * @returns 树结构
   * @memberof Api
   */
  async getOrganizationTreeList() {
    return await this.axios({
      url: `${url}/GetOrganizationTreeList`,
      method: 'get',
    });
  }
  /**
   * 获取共享中心目录树列表
   * @returns
   * @memberof Api
   */
  async getShareCenterTreeList() {
    return await this.axios({
      url: `${url}/GetShareCenterTreeList`,
      method: 'get',
    });
  }
  /**
   * 获取“我的”文件目录，只获取当前用户上传的文件信息，并且是未公开的
   * @returns
   * @memberof Api
   */
  async getMineTreeList() {
    return await this.axios({
      url: `${url}/GetMineTreeList`,
      method: 'get',
    });
  }
  /**
   * 根据节点获取资源信息
   * @param {*} data
   * @returns 资源分页列表
   * @memberof Api
   */
  async getResourceList(params) {
    return await this.axios({
      url: `${url}/GetResourceList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }
  /**
   * 获取资源的具体权限，用于反向绑定
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async getResourcePermission(params) {    
    return await this.axios({
      url: `${url}/GetResourcePermission`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }
  /**
   *获取共享资源的权限信息
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async getResourceShare(params) {
    return await this.axios({
      url: `${url}/GetResourceShare`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }
  /**
   * 批量设置资源标签信息
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async createResourceTag(data) {
    return await this.axios({
      url: `${url}/createResourceTag`,
      method: 'post',
      data,
    });
  }
  /**
   * 文件移动
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async createFileMove(data) {
    return await this.axios({
      url: `${url}/createFileMove`,
      method: 'post',
      data,
    });
  }
  /**
   * 文件复制
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async createFileCopy(data) {
    return await this.axios({
      url: `${url}/createFileCopy`,
      method: 'post',
      data,
    });
  }
  /**
   * 资源还原
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async restore(data) {
    return await this.axios({
      url: `${url}/restore`,
      method: 'post',
      data,
    });
  }
  /**
   * 设置资源的权限
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async setResourcePermission(data) {
    return await this.axios({
      url: `${url}/setResourcePermission`,
      method: 'post',
      data,
    });
  }
  /**
   * 设置资源共享
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async SetResourceShare(data) {
    return await this.axios({
      url: `${url}/SetResourceShare`,
      method: 'post',
      data,
    });
  }
  /**
   * @description 发布资源
   * @author easten
   * @date 2020-07-03
   * @param {*} params
   * @returns 
   * @memberof Api
   */
  async PublishResource(data){
    return await this.axios({
      url: `${ url}/PublishResource`,
      method: 'post',
      data,
    });
  }
  async update(data) {}
  /**
   * 批量删除资源
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async delete(params) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }

  /**
   * @description 清空回收站
   * @author easten
   * @date 2020-07-07
   * @returns boolen
   * @memberof Api
   */
  async deleteAll(){
    return await this.axios({
      url: `${ url}/deleteAll`,
      method: 'delete',
    });
  }
}
