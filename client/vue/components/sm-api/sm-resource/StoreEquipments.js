import qs from 'qs';
let url = '/api/app/resourceStoreEquipment';
export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }
  //查询库存信息
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }
  //根据Codes查询库存信息
  async getListByCode(params) {
    return await this.axios({
      url: `${url}/getListByCode`,
      method: 'get',
      params,
      paramsSerializer: params => {
        return qs.stringify(params, {
          indices: false,
        });
      },
    });
  }

  async getListByIds(ids) {
    return await this.axios({
      url: `${url}/getListByIds`,
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
  //批量添加库存设备
  async create(data) {
    return await this.axios({
      url: `${url}/create`,
      method: `post`,
      data,
    });
  }

  //修改库存设备状态
  async updateState(params) {
    return await this.axios({
      url: `${url}/updateState`,
      method: `put`,
      params,
      paramsSerializer: params => {
        console.log(qs.stringify(params));
        return qs.stringify(params, {
          indices: false,
        });
      },
    });
  }

  //获取库存设备履历
  async getStoreEquipmentRecords(params) {
    return await this.axios({
      url: `${url}/getStoreEquipmentRecords`,
      method: `get`,
      params,
    });
  }

//获取库存设备履历
async exportStoreEquipments(data) {
  return await this.axios({
    url: `${url}/exportStoreEquipments`,
    method: `post`,
    data,
    // ids: JSON.stringify(ids) ,
    // paramsSerializer: ids => {
    //   return qs.stringify(ids, {
    //     indices: false
    //   });
    // },
  });
}

}
