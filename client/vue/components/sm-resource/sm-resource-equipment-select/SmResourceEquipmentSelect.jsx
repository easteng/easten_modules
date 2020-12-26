// 文件选择对话框
import SmResourceEquipmentModal from '../sm-resource-equipment-modal';
import { requestIsSuccess } from '../../_utils/utils';
import ApiEquipment from '../../sm-api/sm-resource/Equipments';
import { PageState } from '../../_utils/enum';
import './style/index.less';

let apiEquipment = new ApiEquipment();

export default {
  name: 'SmResourceEquipmentSelect',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    axios: { type: Function, default: null },
    height: { type: Number, default: 100 }, // 当前选择框的大小
    disabled: { type: Boolean, default: false }, // 编辑模式和查看模式
    value: { type: [Array, String] }, // 已选择的内容
    placeholder: { type: String, default: '请点击选择设备' },
    multiple: { type: Boolean, default: false }, //是否多选，默认多选
    bordered: { type: Boolean, default: true }, // 边框模式
    pageState: { type: String, default: PageState.Add }, //页面状态
  },

  data() {
    return {
      id: null,
      iVisible: false,
      selectedFaultEquipments: [], //已选择设备
    };
  },

  computed: {
    visible() {
      return this.iVisible;
    },
    tags() {
      return this.selectedFaultEquipments;
    },
  },
  watch: {
    value: {
      handler: function (nVal, oVal) {
        if (this.multiple) {
          this.iValue = nVal;
        } else {
          this.iValue = [nVal];
        }
        this.initFaultEquipment();
      },
      immediate: true,
    },
    pageState: {
      handler: function (nVal, oVal) {
        if (nVal) {
          this.pageState = nVal;
        }
      },
      immediate: true,
    },
  },

  created() {
    this.initAxios();
    //this.initFaultEquipment();
  },
  methods: {
    initAxios() {
      apiEquipment = new ApiEquipment(this.axios);
    },

    faultEquipmentSelect() {
      if (!this.disabled) {
        this.iVisible = true;
      }
    },

    //已选设备数据初始化
    async initFaultEquipment() {
      let _selectedFaultEquipments = [];
      //this.iValue.map(async id => {
      if (this.iValue && this.iValue.length > 0 && this.multiple) {
        let response = await apiEquipment.getByIds(this.iValue);

        if (requestIsSuccess(response)) {
          _selectedFaultEquipments = response.data.items.map(item => item);
        }
      } else {
        this.iValue.map(async id => {
          if (id) {
            let response = await apiEquipment.getByIds(id);
            if (requestIsSuccess(response)) {
              _selectedFaultEquipments.push(response.data.items[0]);
            }
          }
        });
      }
      //});
      this.selectedFaultEquipments = _selectedFaultEquipments;
    },

    selected(data) {
      this.iValue = data.map(item => item.id);
      this.selectedFaultEquipments = data;
      if (this.multiple) {
        this.$emit(
          'change',
          this.selectedFaultEquipments && this.selectedFaultEquipments.length > 0
            ? this.selectedFaultEquipments.map(item => item.id)
            : [],
        );
        this.$emit('input', this.selectedFaultEquipments);
      } else {
        this.$emit(
          'change',
          this.selectedFaultEquipments[0] ? this.selectedFaultEquipments[0].id : null,
        );
        this.$emit('input', this.selectedFaultEquipments);
      }
      //   this.$emit('input', this.selectedFaultEquipments);
      //   this.$emit('change', this.selectedFaultEquipments.map(item => item.id));
    },
  },
  render() {
    let faultEquipments = this.tags.map(item => {
      return (
        <div class="selected-item">
          <a-icon style={'color: #f4222d;margin-top:4px'} type={'inbox'} />
          <span class="selected-name">{item ? item.name : null} </span>
          {!this.disabled ? (
            <span
              class="btn-close"
              onClick={e => {
                e.stopPropagation();
                this.iValue = this.iValue.filter(id => id !== item.id);
                this.selectedFaultEquipments = this.selectedFaultEquipments.filter(
                  _item => _item.id !== item.id,
                );
                this.$emit(
                  'change',
                  this.selectedFaultEquipments.map(item => item.id),
                );
                this.$emit('input', this.selectedFaultEquipments);
              }}
            >
              <a-icon type="close" />
            </span>
          ) : (
            undefined
          )}
        </div>
      );
    });

    return (
      <div
        class={{
          'fault-equipment-select-panel': true,
          'ant-input': true,
          disabled: this.disabled,
          bordered: this.bordered,
        }}
        onClick={() => this.faultEquipmentSelect()}
        onMouseEnter={() => this.enter()}
        style={{
          height: this.bordered ? this.height + 'px' : 'auto',
        }}
      >
        {this.tags.length == 0 ? <label class="tip">{this.placeholder}</label> : ''}

        <div class="selectedEquipment">{faultEquipments} </div>
        <div style={' align-self:center;padding-right: 10px; '}>
          {faultEquipments.length > 0 && this.pageState != PageState.View ? (
            <a-icon
              class="btn-close-circle"
              onClick={e => {
                e.stopPropagation();
                this.selectedFaultEquipments = [];
                this.$emit(
                  'change',
                  this.selectedFaultEquipments.map(item => item.id),
                );
                this.$emit('input', this.selectedFaultEquipments);
              }}
              theme="filled"
              type="close-circle"
            />
          ) : (
            undefined
          )}
        </div>

        {/* 设备选择模态框 */}
        <SmResourceEquipmentModal
          ref="SmResourceEquipmentModal"
          axios={this.axios}
          visible={this.iVisible}
          value={this.selectedFaultEquipments}
          multiple={this.multiple}
          onOk={this.selected}
          onChange={v => (this.iVisible = v)}
        />
      </div>
    );
  },
};
