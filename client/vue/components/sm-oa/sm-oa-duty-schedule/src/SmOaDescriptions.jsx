import { ModalStatus } from '../../../_utils/enum';

export default {
  name: 'SmOaDescriptions',
  props: {
    axios: { type: Function, default: null },
    record: { type: Object, default: null },
    isOaDutySchedule:{ type: Boolean, default: false }, //人员信息，是否是人员信息下的值班管理
  },
  data() {
    return {
      status: ModalStatus.Hide,
    };
  },

  computed: {
    dataSource() {
      let data = [];
      if (this.record) {
        data = this.record.dutyScheduleRltUsers;
      }
      return data;
    },
    columns() {
      return this.isOaDutySchedule ?
        [
          {
            title: '#',
            dataIndex: 'index',
            width: '40px',
            ellipsis: true,
            scopedSlots: { customRender: 'index' },
          },
          {
            title: '姓名',
            dataIndex: 'name',
            ellipsis: true,
            width: '65px',
            scopedSlots: { customRender: 'name' },
          },
          {
            title: '职务',
            dataIndex: 'duty',
            ellipsis: true,
            width: '61px',
            scopedSlots: { customRender: 'duty' },

          },
          {
            title: '电话',
            ellipsis: true,
            dataIndex: 'phone',
            width: '86px',
            scopedSlots: { customRender: 'phone' },
          },
          {
            title: '备注',
            dataIndex: 'operations',
            width: '56px',
            scopedSlots: { customRender: 'operations' },
          },
        ] :
        [
          {
            title: '#',
            dataIndex: 'index',
            width: 40,
            ellipsis: true,
            scopedSlots: { customRender: 'index' },
          },
          {

            title: '姓名',
            dataIndex: 'name',
            ellipsis: true,
            scopedSlots: { customRender: 'name' },
          },
          {

            title: '职务',
            dataIndex: 'duty',
            ellipsis: true,
            scopedSlots: { customRender: 'duty' },

          },
          {
            title: '电话',
            ellipsis: true,
            dataIndex: 'phone',
            scopedSlots: { customRender: 'phone' },
          },
        ];
    },
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },

  async created() {
  },

  methods: {
    //人员信息下，打开值班人员详细modal：

    clickOpen(){
      this.status = ModalStatus.Add;
    },
    clickClose() {
      this.status = ModalStatus.Hide;
    },

    //人员信息结束
  },
  render() {
    return (
      <div class="oa-descriptions">
        {this.isOaDutySchedule ? 
          [
            <a-modal
              visible={this.visible}
              onOk={this.clickClose}
              title='值班人员详细信息'
              confirmLoading={this.loading}
              onCancel={this.clickClose}
              destroyOnClose={true}
            >
              {/* 操作区 */}
              <div style={'float:right'}>
                <a-button type="primary" onClick={this.clickClose}>一键通知</a-button>
              </div>

              {/* 展示区 */}
              <a-table
                style={'pointer-events: none;'}
                columns={this.columns}
                rowKey={record => record.id}
                dataSource={this.dataSource}
                bordered={this.bordered}
                pagination={false}
                loading={this.loading}
                {...{
                  scopedSlots: {
                    index: (text, record, index) => {
                      let result = index + 1;
                      return <a-tooltip title={result}>{result}</a-tooltip>;
                    },
                    name: (text, record, index) => {
                      let user = record ? record.user : '';
                      let result = user.name ? user.name : '';
                      return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                    },
                    duty: (text, record, index) => {
                      let user = record ? record.user : '';
                      let result = user.position ?
                        user.position ? user.position.name : ''
                        : '';
                      return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                    },
                    phone: (text, record, index) => {
                      let user = record ? record.user : '';
                      let result = user.phoneNumber ? user.phoneNumber : '';
                      return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                    },
                    operations: (text, record) => {
                      return [
                        <span>
                            已通知
                        </span>,
                      ];
                    },
                  },
                }}
              >
                <span slot="customTitle"><a-icon type="smile-o" /> name</span>
              </a-table>
            </a-modal>,
          ] : 
          <a-card title="详情" class="descriptions-card">
            {/* 展示区 */}
            <a-table
              columns={this.columns}
              rowKey={record => record.id}
              dataSource={this.dataSource}
              bordered={this.bordered}
              pagination={false}
              loading={this.loading}
              {...{
                scopedSlots: {
                  index: (text, record, index) => {
                    let result = index + 1;
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                  name: (text, record, index) => {
                    let user = record ? record.user : '';
                    let result = user.name ? user.name : '';
                    return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                  },
                  duty: (text, record, index) => {
                    let user = record ? record.user : '';
                    let result = user.position ?
                      user.position ? user.position.name : ''
                      : '';
                    return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                  },
                  phone: (text, record, index) => {
                    let user = record ? record.user : '';
                    let result = user.phoneNumber ? user.phoneNumber : '';
                    return <a-tooltip placement="topLeft" title={result}>{result}</a-tooltip>;
                  },
                },
              }}
            >
              <span slot="customTitle"><a-icon type="smile-o" /> name</span>
            </a-table>
          </a-card>
        }
        
      </div>

    );
  },
};