// 文件导入接口定义
let url = '/api/app/commonFileImport';
import qs from 'qs';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  /**
   * @description 文件导入检测
   * @author easten
   * @date 2020-09-02
   * @param {*} key 导入标识
   * @returns 当前文件的状态
   * @memberof Api
   */
  async check(key) {
    return await this.axios({
      url: `${url}/check`,
      method: 'post',
      params: { key },
    });
  }

  /**
   * @description 获取文件导入进度
   * @author easten
   * @date 2020-09-08
   * @param {*} key
   * @returns 
   * @memberof Api
   */
  async getProgresse(key){
    return await this.axios({
      url: `${ url}/getProgress`,
      method: 'get',
      params: { key },
    });
  }

  /**
   * @description 文件下载
   * @author easten
   * @date 2020-09-08
   * @param {*} key
   * @returns 
   * @memberof Api
   */
  async download(key){
    return await this.axios({
      url: `${ url}/download`,
      responseType:'arraybuffer',
      method: 'post',
      params: { key },
    });
  }

  async downloadTemplate(name){
    return await this.axios({
      url: `${url}/downloadTemplate`,
      responseType:'arraybuffer',
      method: 'post',
      params: {name},
    });
  }
}
