let url = '/api/app/BpmFormItem';

export default class Api {
  constructor(axios) {
    this.axios = axios || null;
  }

  // 查询
  async getList(params) {
    // return await this.axios({
    //   url: `${url}/getList`,
    //   method: 'get',
    //   params,
    // });
    return {
      status: 200,
      data: [
        {
          name: '基础',
          children: [
            {
              type: 'input',
              name: '单行文本',
              thumb: null,
            },
            {
              type: 'textarea',
              name: '多行文本',
              thumb: null,
            },
            {
              type: 'number',
              name: '数字',
              thumb: null,
            },
            {
              type: 'date-time',
              name: '日期时间',
              thumb: null,
            },
          ],
        },
        {
          name: '系统管理',
          group: 'system',
          children: [
            {
              type: 'user',
              name: '人员单选',
              thumb: null,
            },
            {
              type: 'users',
              name: '人员多选',
              thumb: null,
            },
            {
              type: 'organization',
              name: '部门单选',
              thumb: null,
            },
            {
              type: 'organizations',
              name: '部门多选',
              thumb: null,
            },
          ],
        },
      ],
    };
  }
}
