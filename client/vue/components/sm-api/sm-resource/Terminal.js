let url = '/api/app/resourceTerminal';
import qs from 'qs';

export default class Terminal {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 根据设备 Id 获取端子列表
  async getListByEquipmentId(params) {
    return await this.axios({
      url: `${url}/getListByEquipmentId`,
      method: 'get',
      params,
    });
  }
}
