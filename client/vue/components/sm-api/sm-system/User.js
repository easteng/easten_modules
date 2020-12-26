let url = '/api/app/appUser';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  // 查询用户
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }
  // async get(id) {
  //   return await this.axios({
  //     url: `${url}/get`,
  //     method: 'get',
  //     params: { id },
  //   });
  // }
  // 查询单个用户
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }

  // 查询单个用户
  async findByUsername(username) {
    return await this.axios({
      url: `${url}/findByUsername`,
      method: 'post',
      params: { username },
    });
  }

  // 搜索可加入的用户
  async search(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }

  async getPermissions() {
    return await axios({
      url: '/api/app/appUser/getUserPermissions',
      methods: 'get',
    });
  }

  // 添加系统单个用户
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }

  // 给组织机构分配多个用户
  async addForOrganization(data) {
    return await this.axios({
      url: `${url}/setUserInfo`,
      method: 'post',
      data,
    });
  }

  // 编辑
  async update(id, data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      params: { id },
      data,
    });
  }

  // 编辑角色
  async updateRoles(id, data) {
    return await this.axios({
      url: `${url}/updateRoles`,
      method: 'put',
      params: { id },
      data,
    });
  }

  // 修改密码
  async updatePassword(params) {
    return await this.axios({
      url: `${url}/updatePassword`,
      method: 'put',
      params,
    });
  }

  // 将用户移出当前组织机构
  async removeFromOrganization(params) {
    return await this.axios({
      url: `${url}/removeFromOrganization`,
      method: 'delete',
      params,
    });
  }

  // 删除
  async remove(id) {
    return await this.axios({
      url: `${url}/remove`,
      method: 'delete',
      params: { id },
    });
  }

  // 获取用户所属角色
  async getRoles(id, organizationId) {
    return await this.axios({
      url: `${url}/getRoles`,
      method: 'get',
      params: { id, organizationId },
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
}
