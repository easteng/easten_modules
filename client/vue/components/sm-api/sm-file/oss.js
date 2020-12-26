/**
 * 接口说明：oss 服务管理接口
 * 作者：easten
 */

let url = '/api/app/fileOssConfig';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  /**
   * 获取oss 配置列表
   * @returns
   * @memberof Api
   */
  async getList() {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
    });
  }

  
  /**
   * @description 获取文件管理服务的状态
   * @author easten 
   * @date 2020-09-21
   * @param {*} id
   * @returns 状态信息
   * @memberof Api
   */
  async getOssState(id){
    return await this.axios({
      url: `${ url}/GetOssState`,
      method: 'get',
      params: {id},
    });
  }

  /**
   * 新增oss 配置
   * @param {*} data
   * @returns
   * @memberof Api
   */
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }
  /**
   * 启动指定的oss服务
   * @param {*} id
   * @returns
   * @memberof Api
   */
  async enable(id) {
    return await this.axios({
      url: `${url}/enable`,
      method: 'post',
      params: { id },
    });
  }
  /**
   * 检测服务状态
   * @param {*} id
   * @returns
   * @memberof Api
   */
  async check(id) {
    return await this.axios({
      url: `${url}/check`,
      method: 'post',
      params: { id },
    });
  }
  /**
   * 清空指定的oss 服务数据
   * @param {*} id
   * @returns bool
   * @memberof Api
   */
  async clear(id) {
    return await this.axios({
      url: `${url}/clear`,
      method: 'post',
      params: { id },
    });
  }
  /**
   * 更新oss 配置
   * @param {*} data
   * @returns bool
   * @memberof Api
   */
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }
  async delete(id) {}
}
