let url = '/api/identity/roles';
let urlExtend = '/api/app/appRole';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 详情
  async get(id) {
    return await this.axios({
      url: `${urlExtend}/get`,
      method: 'get',
      params: { id },
    });
  }

  //  获取权限
  async getRolePermission(params) {
    return await this.axios({
      url: `${urlExtend}/getRolePermission`,
      method: 'get',
      params,
    });
  }

  // 查询
  async getList(params) {
    return await this.axios({
      url: `${urlExtend}/getList`,
      method: 'get',
      params,
    });
  }
  // 检查是否存在默认字段
  async checkDefaultRole() {
    return await this.axios({
      url: `${urlExtend}/checkDefaultRole`,
      method: 'post',
    });
  }

  // 编辑权限
  async setRolePermission(params, data) {
    return await this.axios({
      url: `${urlExtend}/setRolePermission`,
      method: 'post',
      params,
      data,
    });
  }

  // 添加
  async add(data) {
    return await this.axios({
      url: `${urlExtend}/create`,
      method: 'post',
      data,
    });
  }

  // 编辑
  // async edit(id, data) {
  //   return await this.axios({
  //     url: `${url}/${id}`,
  //     method: 'put',
  //     data,
  //   });
  // }
  async edit(id, data) {
    return await this.axios({
      url: `${urlExtend}/update`,
      method: 'put',
      params: { id },
      data,
    });
  }

  // 删除
  async remove(id) {
    return await this.axios({
      url: `${urlExtend}/delete`,
      params: { id },
      method: 'delete',
    });
  }
}
