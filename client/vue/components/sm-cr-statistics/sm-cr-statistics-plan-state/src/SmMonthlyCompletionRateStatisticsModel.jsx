import { ModalStatus } from '../../../_utils/enum';

export default {
  name: 'SmMonthlyCompletionRateStatisticsModel',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      records: {}, // 表单绑定的对象,
    };
  },
  computed: {
    visible() {
      // 计算模态框的显示变量
      return this.status !== ModalStatus.Hide;
    },
    columns() {
      let arry = [
        {
          title: '车间',
          dataIndex: 'organizationName',
        },
        {
          title: '未完成数量',
          dataIndex: 'unFinishedCount',
        },
        {
          title: '变更数量',
          dataIndex: 'changeCount',
        },
      ];
      return arry;
    },
  },
  watch: {
  },
  async created() {
    this.form = this.$form.createForm(this, {});
  },
  methods: {
    view(detailList) {
      this.status = ModalStatus.Edit;
      if (detailList != null && detailList.length > 0) {
        detailList.some((item, index) => {
          item.id = index;
        });
      }
      this.records = detailList;
    },
    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
    },
  },
  render() {
    return (
      <a-modal title="详细" visible={this.visible} onCancel={this.close} onOk={this.close}>
        <a-table
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={this.records}
          pagination={false}
        />
      </a-modal>
    );
  },
};
