/**
 * 接口说明：标签管理服务接口
 * 作者：easten
 */

let url = '/api/app/fileTag';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  /**
   * 根据组织id获取标签信息
   * @param {*} id 组织结构id
   * @returns tag model
   * @memberof Api
   */
  async getList(id) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params: { id },
    });
  }
  /**
   * 新增一个标签信息
   * @param {*} data
   * @returns bool
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
   * 更新标签名称
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
  /**
   * 删除标签信息
   * @param {*} id
   * @returns
   * @memberof Api
   */
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id },
    });
  }

  async getTagIds(params){
    return await this.axios({
      url: `${ url}/getTagIds`,
      method: 'get',
      params
    });
  }
}
