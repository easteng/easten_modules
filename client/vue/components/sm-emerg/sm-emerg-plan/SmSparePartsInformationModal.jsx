import { ModalStatus } from '../../_utils/enum';
import SmStoreEquipment from '../../sm-resource/sm-resource-store-equipments';

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
      columns:[{
        title: '序号',
        dataIndex: 'index',
        scopedSlots: { customRender: 'index' },
        width: 60,
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '产品分类',
        dataIndex: 'productCategory',
        scopedSlots: { customRender: 'productCategory' },
        ellipsis: true,
      },
      {
        title: '规格',
        dataIndex: 'model',
        scopedSlots: { customRender: 'model' },
        ellipsis: true,
      },
      {
        title: '库存编号',
        dataIndex: 'code',
        scopedSlots: { customRender: 'code' },
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'state',
        scopedSlots: { customRender: 'state' },
        ellipsis: true,
        width: 80,
      },
      {
        title: '厂家名称',
        dataIndex: 'manufacturerName',
        scopedSlots: { customRender: 'manufacturerName' },
        ellipsis: true,
      },
      {
        title: '出厂日期',
        dataIndex: 'manufactureDate',
        scopedSlots: { customRender: 'manufactureDate' },
        ellipsis: true,
      },
      {
        title: '入库日期',
        dataIndex: 'inboundDate',
        scopedSlots: { customRender: 'inboundDate' },
        ellipsis: true,
      },
      {
        title: '入库人员',
        dataIndex: 'userName',
        scopedSlots: { customRender: 'userName' },
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'operations',
        scopedSlots: { customRender: 'operations' },
        ellipsis: true,
        width: 60,
        fixed: 'right',
      },
      ],
    };
  },

  computed: {
    visible() {
      return this.status !== ModalStatus.Hide;
    },
  },
  async created() {
    this.form = this.$form.createForm(this, {});
  },

  methods: {
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
        title='备品信息'
        confirmLoading={this.loading}
        onCancel={this.clickClose}
        destroyOnClose={true}
      >
        <div>
          <SmStoreEquipment
            axios={this.axios}
            isSpareParts={true}
            columns={this.columns}
            //permissions={this.permissions}
          />
        </div>
      </a-modal>
    );
  },
};