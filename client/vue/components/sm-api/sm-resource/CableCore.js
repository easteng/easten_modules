let url = '/api/app/resourceCableCore';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询电缆线芯
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }

  async updateTerminalLink(data){
    return await this.axios({
      url: `${ url}/updateTerminalLink`,
      method: 'put',
      data,
    });
  }

  async updateCableCore(data){
    return await this.axios({
      url: `${ url}/updateCableCore`,
      method: 'put',
      data,
    });
  }
}
