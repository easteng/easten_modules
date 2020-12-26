import qs from 'qs';

let url = '/api/app/examExamPaper';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: `get`,
      params,
    });
  }

  // 获取详情
  get(id) {
    return this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  // 获取题库题目详情
  getQuestionList(params) {
    return this.axios({
      url: `${url}/getQuestionList`,
      method: 'get',
      params,
    });
  }

  // 添加
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }


  // 编辑
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }


  // 删除
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: { id },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        });
      },
    });
  }

}
