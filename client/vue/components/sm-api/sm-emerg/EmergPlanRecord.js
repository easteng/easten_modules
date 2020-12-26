let url = '/api/app/emergPlanRecord';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }


  // 添加
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }

}
