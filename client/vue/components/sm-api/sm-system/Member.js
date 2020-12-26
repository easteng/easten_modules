let url = '/api/app/appMember';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  // 搜索
  async search(data) {
    return await this.axios({
      url: `${url}/search`,
      method: 'post',
      data,
    });
  }
}
