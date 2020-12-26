/**
 * 接口说明：文件夹接口
 * 作者：easten
 */

let url = '/api/app/fileFolder';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  /**
   * 根据id获取详细的文件夹信息
   * @param {*} id
   * @returns 文件夹实体
   * @memberof Api
   */
  async get(id) {
    return await this.axios({
      url: `${ url}/get`,
      method: 'get',
      params: { id},
    });
  }

  /**
   * @description 文件下载列表获取
   * @author easten
   * @date 2020-07-13
   * @param {*} id
   * @returns
   * @memberof Api
   */
  async getFiles(id){
    return await this.axios({
      url: `${ url}/getDownloadFile`,
      method: 'get',
      params: { id },
    });
  }
  /**
   * 创建一个文件夹
   * @param {*} data 文件夹创建对象
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
   * 更新文件夹的名字
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
   * 删除指定的文件夹
   * @param {*} id 文件夹id
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
}
