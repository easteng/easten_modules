/**
 * 接口说明：文件管理服务
 * 作者：easten
 */

let url = '/api/app/fileFile';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  /**
   * 获取文件上传的签名信息，需要文件的类型生成对应的上传签名地址
   * @param {String} type 文件类型，值传递文件的后缀名即可
   * @returns 文件上传的签名地址
   * @memberof Api
   */
  async getPresignUrl(params) {
    return await this.axios({
      url: `${url}/getPresignUrl`,
      method: 'get',
      params: params,
    });
  }

  /**
   * 获取文件版本信息
   * @param {*} id 文件id
   * @returns 文件版本信息
   * @memberof Api
   */
  async getVersions(id){
    return await this.axios({
      url: `${ url}/getVersionList`,
      method: 'get',
      params: {  id},
    });
  }
  /**
   *新增文件
   * @param {*} data 文件字段对象
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
   * 新增文件版本信息
   * @param {*} data 文件信息
   * @returns bool
   * @memberof Api
   */
  async createFileVersion(data) {
    return await this.axios({
      url: `${url}/createFileVersion`,
      method: 'post',
      data,
    });
  }
  /**
   * 选择最新版本
   * @param {*} id 指定的文件id
   * @returns bool
   * @memberof Api
   */
  async selectNewVersion(data) {
    return await this.axios({
      url: `${ url}/selectNewVersion`,
      method: 'post',
      data,
    });
  }
  /**
   * 更新文件名称
   * @param {*} data
   * @returns
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
   * 删除指定的文件
   * @param {*} id 文件id
   * @returns bool
   * @memberof Api
   */
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id },
    });
  }
  /**
   * 删除指定的文件版本信息
   * @param {*} id 文件版本id
   * @returns bool
   * @memberof Api
   */
  async deleteFileVersion(id) {
    return await this.axios({
      url: `${url}/deleteFileVersion`,
      method: 'delete',
      params: { id },
    });
  }
}
