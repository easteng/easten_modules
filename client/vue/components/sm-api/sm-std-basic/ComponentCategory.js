let url = '/api/app/stdBasicComponentCategory';
import qs from 'qs';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  // 获取单个构件分类
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: {
        id,
      },
    });
  }
  // 获取构件分类中的最大编码
  async getListCode(id) {
    return await this.axios({
      url: `${url}/getListCode`,
      method: 'get',
      params: {
        id,
      },
    });
  }
  // 获取构件编码列表
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }

  //上传EXCEL文件
  async upLoad(data) {
    return await this.axios({
      url: `${url}/upLoad`,
      method: 'post',
      processData: false,
      data,
    });
  }
  //添加构件分类
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }
  // 编辑构件分类
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }
  //删除构件分类
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: {
        id,
      },
    });
  }
  //根据构件分类id获取其兄弟、父级及父级以上组织机构
  async getParentsByIds(ids) {
    return await this.axios({
      url: `${url}/getParentsByIds`,
      method: 'get',
      params: {
        ids,
      },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'repeat',
        });
      },
    });
  }
}
