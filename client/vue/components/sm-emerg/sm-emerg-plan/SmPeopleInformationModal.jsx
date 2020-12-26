import { ModalStatus } from '../../_utils/enum';
import ApiUser from '../../sm-api/sm-system/User';
import SmOaDutySchedule from '../../sm-oa/sm-oa-duty-schedule';
let apiUser = new ApiUser();

export default {
  name: 'SmEmergPlanModal',
  props: {
    axios: { type: Function, default: null },
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      loading: false, //确定按钮是否处于加载状态
    };
  },

  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
    columns() {
      return [
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
      ];
    },
  },
  async created() {
    this.initAxios();
    this.form = this.$form.createForm(this, {});
  },

  methods: {
    initAxios() {
      apiUser = new ApiUser(this.axios);
    },
    clickOpen(){
      this.status = ModalStatus.Add;
    },
    clickClose() {
      this.status = ModalStatus.Hide;
    },
  },
  render() {
    return (
      <a-modal
        width="1000px"
        visible={this.visible}
        onOk={this.clickClose}
        title='人员信息'
        confirmLoading={this.loading}
        onCancel={this.clickClose}
        destroyOnClose={true}
      >
        <div>
          <a-tabs default-active-key="operator" onChange="callback">
            <a-tab-pane key="operator" tab="值班人员">
              <SmOaDutySchedule
                axios={this.axios}
                isOaDutySchedule={true}
                //permissions={this.permissions}
              />
            </a-tab-pane>
            <a-tab-pane key="nearby" tab="附近人员">
              {/* 操作区 */}
              <div style={'float:right'}>
                <a-input style={'width:207px;margin-right:10px'}></a-input>
                <a-button style={'margin-right:10px'} type="primary" onClick={this.clickClose}>搜索</a-button>
                <a-button type="primary" onClick={this.clickClose}>一键通知</a-button>
              </div>
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
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="expert" tab="专家">
              {/* 操作区 */}
              <div style={'float:right'}>
                <a-input style={'width:207px;margin-right:10px'}></a-input>
                <a-button style={'margin-right:10px'} type="primary" onClick={this.clickClose}>搜索</a-button>
                <a-button type="primary" onClick={this.clickClose}>一键通知</a-button>
              </div>
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
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-modal>
    );
  },
};