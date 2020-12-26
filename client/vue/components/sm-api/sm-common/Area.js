let url = '/api/app/commonArea';
import qs from 'qs';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询 获得所有省级数据
  async getList(id,deep) {
    return await this.axios({
      url: `${url}/getList`,
      method: 'get',
      params:{
        KeyWord:deep,
        ParentId:id,
      } ,
    });
  }


  // 查询 根据parentId查询列表
  async getListByIds(ids) {
    return await this.axios({
      url: `${url}/getListByIds`,
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
