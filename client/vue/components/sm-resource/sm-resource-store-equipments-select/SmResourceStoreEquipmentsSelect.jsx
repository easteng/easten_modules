// 文件选择对话框
import SmResourceStoreEquipmentsModal from './SmResourceStoreEquipmentsModal';
import { requestIsSuccess } from '../../_utils/utils';
import ApiStoreEquipment from '../../sm-api/sm-resource/StoreEquipments';
import './style/index.less';
import { Checkbox } from 'ant-design-vue';
let apiStoreEquipment = new ApiStoreEquipment();

export default {
  name: 'SmResourceStoreEquipmentsSelect',

  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    height: { type: Number, default: 100 }, // 当前选择框的大小
    disabledState: { type: Number, default: null }, // 禁用待检设备状态栏
    value: { type: [Array, String] }, // 已选择的内容
    disabled: { type: Boolean, default: false },//是否禁用
    multiple: { type: Boolean, default: false }, //是否多选，默认多选
    placeholder: { type: String, default: '请点击选择库存设备' },
    bordered: { type: Boolean, default: true }, // 边框模式
  },

  data() {
    return {
      stateDisabled: null,
      columns: [],
      iValue: [],
      iVisible: false,
      selectedStoreEquipments: [],//已选择库存设备
    };
  },

  computed: {
    visible() {
      return this.iVisible;
    },
    tags() {
      return this.selectedStoreEquipments;
    },
  },

  watch: {
    value: {
      handler(nVal, oVal) {
        if (this.multiple) {
          this.iValue = nVal;
        } else {

          this.iValue = [nVal];
        }
        this.initStoreEquipment();
      },
      immediate: true,
    },
    disabledState: {
      handler(nVal, oVal) {
        this.stateDisabled = nVal;
      },
      immediate: true,
    },
  },

  created() {
    this.initAxios();
    this.initStoreEquipment();
  },

  methods: {
    initAxios() {
      apiStoreEquipment = new ApiStoreEquipment(this.axios);
    },

    storeEquipmentSelect() {
      if (!this.disabled) {
        this.iVisible = true;
      }
    },

    //已选库存设备数据初始化
    async initStoreEquipment() {
      let _selectedStoreEquipments = [];
      if (this.iValue && this.iValue.length > 0 && this.multiple) {

        let response = await apiStoreEquipment.getListByIds(this.iValue);
        if (requestIsSuccess(response)) {
          _selectedStoreEquipments = response.data.items.map(item => item);
        }
      } else {
        this.iValue.map(async id => {
          if (id) {
            let response = await apiStoreEquipment.getListByIds(id);
            if (requestIsSuccess(response)) {
              _selectedStoreEquipments.push(response.data.items[0]);
            }
          }
        });
      }
      this.selectedStoreEquipments = _selectedStoreEquipments;
    },

    selected(v) {
      this.iValue = v;
      this.initStoreEquipment();
      if (this.multiple) {
        this.$emit('change', this.iValue);
      } else {
        this.$emit('change', this.iValue[0]);
      }
    },

  },
  render() {
    let storeEquipment = this.tags.map(item => {
      return <div class="selected-item" width="15%" >
        <a-icon style={{ color: '#B4EEB4' }} type={'project'} />
        <span class="selected-name"> {item ? item.name : null}  </span>
        {!this.disabled ?
          <span
            class="btn-close"
            onClick={e => {
              e.stopPropagation();
              this.iValue = this.iValue.filter(id => id !== item.id);
              this.selectedStoreEquipments = this.selectedStoreEquipments.filter(_item => _item.id !== item.id);
              this.selected(this.iValue);
            }}
          >
            <a-icon type="close" />
          </span> : undefined}
      </div>;
    });

    return (
      <div
        flex-direction='column'
        class={{
          'storeEquipment-select-panel': true,
          disabled: this.disabled,
          bordered: this.bordered,
        }}
        onClick={() => this.storeEquipmentSelect()}
        style={{
          minHeight: this.bordered ? this.height + 'px' : 'auto',
        }}
      >
        {this.tags.length == 0 ? <label class="tip">{this.placeholder}</label> : ''}
        <div style="display:flex;">{storeEquipment}</div>
        {/* 文件选择模态框 */}
        <SmResourceStoreEquipmentsModal
          ref="SmResourceStoreEquipmentsModal"
          disabledSatet={this.stateDisabled}
          axios={this.axios}
          visible={this.iVisible}
          value={this.iValue}
          multiple={this.multiple}
          onOk={this.selected}
          onChange={visible => (this.iVisible = visible)}
        />
      </div>
    );
  },
};
