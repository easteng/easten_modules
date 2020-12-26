let url = '/api/app/resourceEquipment';
import qs from 'qs';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询单个
  async get(params) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params,
    });
  }

  // 查询设备关联文件列表
  async getFileList(params) {
    return await this.axios({
      url: `${url}/getFileList`,
      method: 'get',
      params,
    });
  }

  // 查询单个GetGisData
  async getGisData(params) {
    return await this.axios({
      url: `${url}/getGisData`,
      method: 'get',
      params,
    });
  }

  //查询多个
  async getByIds(ids) {
    return await this.axios({
      url: `${url}/getByIds`,
      method: 'get',
      params: {
        ids,
      },
      paramsSerializer: params => {
        return qs.stringify(params, {
          indices: false,
        });
      },
    });
  }

  // 查询单个
  async getByGroupNameAndName(params) {
    return await this.axios({
      url: `${url}/getByGroupNameAndName`,
      method: 'get',
      params,
    });
  }

  // 查询 获得所有列表
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

  // 查询  获取简易参数列表
  async getSimpleList(params) {
    return await this.axios({
      url: `${url}/getSimpleList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }

  // 查询  获取设备选择框中的简易参数列表
  async getInFaultList(params) {
    return await this.axios({
      url: `${url}/getInFaultList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
    });
  }
  // 查询  获取安装位置下的设备构建分类，按需逐级加载
  async searchListByScopeCode(data) {
    return await this.axios({
      url: `${url}/searchListByScopeCode`,
      method: 'post',
      data,
    });
  }

  // 获取一个范围的设备分组列表
  async getEquipmentGroupsByScopeCode(params) {
    return await this.axios({
      url: `${url}/getEquipmentGroupsByScopeCode`,
      method: 'get',
      params,
    });
  }

  // 根据库存设备Id获取产品
  async getScopesByGroupAndName(params) {
    return await this.axios({
      url: `${url}/getScopesByGroupAndName`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { indices: false });
      },
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

  // 添加设备关联文件
  async createFile(data) {
    return await this.axios({
      url: `${url}/createFile`,
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

  // 编辑Gis数据
  async updateGisData(data) {
    return await this.axios({
      url: `${url}/updateGisData`,
      method: 'put',
      data,
    });
  }

  // 批量编辑
  async updateLimitUseYear(data) {
    return await this.axios({
      url: `${url}/updateLimitUseYear`,
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

  // 删除
  async deleteFile(id) {
    return await this.axios({
      url: `${url}/deleteFile`,
      method: 'delete',
      params: { id },
    });
  }

  //导入EXCEL文件
  async upload(data) {
    return await this.axios({
      url: `${url}/upload`,
      method: 'post',
      processData: false,
      params: {},
      data,
    });
  }
}
