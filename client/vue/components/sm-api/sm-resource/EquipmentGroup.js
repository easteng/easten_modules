let url = '/api/app/resourceEquipmentGroup';
import qs from 'qs';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  // 获取单个设备分组
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: {
        id,
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
  // 获取设备分组列表
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, {
          indices: false,
        });
      },
    });
  }
  //添加设备分组
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: 'post',
      data,
    });
  }
  // 编辑设备分组
  async update(data) {
    return await this.axios({
      url: `${url}/update`,
      method: 'put',
      data,
    });
  }
  //删除设备分组
  async delete(id) {
    return await this.axios({
      url: `${url}/delete`,
      method: 'delete',
      params: {
        id,
      },
    });
  }
}
