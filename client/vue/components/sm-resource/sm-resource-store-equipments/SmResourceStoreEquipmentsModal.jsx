import { ModalStatus } from '../../_utils/enum';
import SmResourceStoreEquipmentRecord from '../sm-resource-store-equipment-record/SmResourceStoreEquipmentRecord';
export default {
  name: 'SmResourceStoreEquipmentsModal',
  props: {
    axios: { type: Function, default: null },
    value: { type: Array, default: null },
  },
  data() {
    return {
      disabled: true,
      record: null,
      iValue: null,
      titleName: '',
      iVisible: false,
      status: ModalStatus.Hide, // 模态框状态
      confirmLoading: false, //确定按钮加载状态
    };
  },
  computed: {
    visible() {
      // 计算模态框的显示变量k
      return this.status !== ModalStatus.Hide;
    },
  },
  watch: {
  },
  methods: {
    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
      this.confirmLoading = false;
    },
    view(record) {
      this.titleName = record.name;
      this.record = record;
      this.status = ModalStatus.View;
      this.iValue = record.id;
    },
  },
  render() {
    return (
      <a-modal
        width={600}
        title={this.titleName + '设备履历'}
        visible={this.visible}
        onCancel={this.close}
        onOk={this.close}
        confirmLoading={this.confirmLoading}
      >
        <SmResourceStoreEquipmentRecord
          value={this.iValue}
          axios={this.axios}
          iconParameter={2}
          showPerson={this.disabled}
          // showInfo={this.disabled}
          bordered={false}
        />
      </a-modal>
    );
  },
};
