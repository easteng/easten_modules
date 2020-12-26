
import qs from 'qs';
let url='/api/app/resourceStoreEquipmentTransfer';
export default class Api{
  constructor(axios){
    this.axios=axios||null;
  }
  // 获取单个信息
  async get(id) {
    return await this.axios({
      url: `${url}/get`,
      method: 'get',
      params: { id },
    });
  }
  //查询出入库信息
  async getList(params) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params,
    });
  }
  //查询库存信息
  async getEquipmentImport(params){
    return await this.axios({
      url:`${url}/getEquipmentImport`,
      method:'get',
      params,
    });
  }
  //查询入库信息
  async getEquipmentExport(params){
    return await this.axios({
      url:`${url}/getEquipmentExport`,
      method:'get',
      params,
    });
  }
  //入库
  async import(data){
    return await this.axios({
      url:`${url}/import`,
      method:`post`,
      data,
    });
  }

  //出库
  async export(data){
    return await this.axios({
      url:`${url}/export`,
      method:`post`,
      data,
    });
  }
}

