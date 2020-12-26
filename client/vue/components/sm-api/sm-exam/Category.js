let url = '/api/app/examCategory';
import qs from 'qs';


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
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
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
    });
  }



  async getTreeList(params) {
    return await this.axios({
      url: `${url}/getTreeList`,
      method: 'get',
      params,
    });
  }




  //根据父级id获取组织机构
  async getByParentId(parentId) {
    return await this.axios({
      url: `${url}/getByParentId`,
      method: 'get',
      params: { parentId },
    });
  }

  //根据分类id获取其兄弟、父级及父级以上组织机构
  async getParentsByIds(ids) {
    return await this.axios({
      url: `${url}/getParentsByIds`,
      method: 'get',
      params: { ids },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        });
      },
    });
  }
}
