// 文件迁移接口
let url = '/api/app/fileMigration';

export default class Api{
  constructor(axios){
    this.axios=axios||null;
  }

  /**
   * @description 数据对比，对比两个服务中数据的异同
   * @author easten
   * @date 2020-10-09
   * @param {*} data
   * @returns 
   * @memberof Api
   */
  async dataContrast(data){
    return await this.axios({
      url: `${ url}/dataContrast`,
      method: 'post',
      data,
    });
  }

  /**
   * @description 开始迁移
   * @author easten
   * @date 2020-10-09
   * @returns 
   * @memberof Api
   */
  async start(){
    return await this.axios({
      url: `${ url}/start`,
      method: 'post',
    });
  }

  /**
   * @description 获取进度信息
   * @author easten
   * @date 2020-10-09
   * @returns 
   * @memberof Api
   */
  async getProcess(){
    return await this.axios({
      url: `${ url}/getProcess`,
      method: 'get',
    });
  }


  /**
   * @description 取消迁移
   * @author easten
   * @date 2020-10-09
   * @returns 
   * @memberof Api
   */
  async cancel(){
    return await this.axios({
      url: `${ url}/cancel`,
      method: 'post',
    });
  }
}