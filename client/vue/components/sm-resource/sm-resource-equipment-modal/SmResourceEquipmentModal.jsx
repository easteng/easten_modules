import './style/index.less';
import Equipment from '../sm-resource-equipments';

export default {
  name: 'SmResourceEquipmentModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false },
    value: { type: Array, default: () => [] },//已选项
    multiple: { type: Boolean, default: false }, // 是否多选
  },
  data() {
    return {
      selectedEquipments: [], //已选设备
      iValue: null,   //已选id
      iVisible: false,
    };
  },

  watch: {
    value: {
      handler: function (value, oldvalue) {
        this.selectedEquipments = value;
        this.iValue = value.map(item => item.id);
      },
      immediate: true,
    },

    visible: {
      handler: function (value, oldValue) {
        this.selectedEquipments = this.value;
        this.iVisible = value;
      },
      immediate: true,
    },
  },

  methods: {
    onOk() {
      this.$emit('ok', this.selectedEquipments);
      this.onClose();
    },
    onClose() {
      this.$emit('change', false);
      this.selectedEquipments = [];
    },
  },
  render() {
    return (
      <a-modal
        width={820}
        title="设备选择"
        class="sm-emerg-selectedfaultEquipments-modal"
        visible={this.visible}
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        <div class="selected">
          {this.selectedEquipments && this.selectedEquipments.length > 0 ? (
            this.selectedEquipments.map(item => {
              return <div class="selected-item">
                <a-icon style={{ color: '#f4222d' }} type={'inbox'} />
                <span class="selected-name"> {item ? item.name : null} </span>
                <span
                  class="btn-close"
                  onClick={() => {
                    this.iValue = this.iValue.filter(id => id !== item.id);
                    this.selectedEquipments = this.selectedEquipments.filter(_item => _item.id !== item.id);
                  }}
                >
                  <a-icon type="close" />
                </span>
              </div>;
            })

          ) : (
            <span style="margin-left:10px;">请选择设备</span>
          )}
        </div>
        <div class="selectedManufacturers-list">
          <Equipment
            ref="Equipment"
            axios={this.axios}
            selected={this.selectedEquipments}
            isFault={true}
            isSimple={false}
            multiple={this.multiple}
            onChange={iSelected => (this.selectedEquipments = iSelected)}
            onInput={iValue => (this.iValue = iValue)}
          >
          </Equipment>

        </div>
      </a-modal>
    );
  },
};
