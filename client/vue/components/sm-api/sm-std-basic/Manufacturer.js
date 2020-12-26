let url = '/api/app/stdBasicManufacture';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 获取单个厂家
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }

  // 查询厂家
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }

  // 根据产品主键查厂家
  async getListByProductId(params) {
    return await this.axios({
      url: `${url}/getListByProductId`,
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
    });
  }

  //上传EXCEL文件
  async upLoad(data) {
    return await this.axios({
      url: `${url}/upload`,
      method: 'post',
      processData: false,
      data,
    });
  }

  //获取设备连锁类型
  async getTypeList(params) {
    return await this.axios({
      url: `/api/app/basicEquipmentControlType/getList`,
      method: 'get',
      params,
    });
  }
}
