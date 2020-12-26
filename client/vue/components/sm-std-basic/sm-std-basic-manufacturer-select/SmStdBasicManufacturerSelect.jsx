// 文件选择对话框
import SmStdBasicManufacturerModal from '../sm-std-basic-manufacturer-modal';
import { requestIsSuccess } from '../../_utils/utils';
import ApiManufacturer from '../../sm-api/sm-std-basic/Manufacturer';
import './style/index.less';

let apiManufacturer = new ApiManufacturer();

export default {
  name: 'SmStdBasicManufacturerSelect',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    axios: { type: Function, default: null },
    height: { type: Number, default: 80 }, // 当前选择框的大小
    disabled: { type: Boolean, default: false }, // 编辑模式和查看模式
    value: { type: [Array, String] }, // 已选择的内容
    multiple: { type: Boolean, default: false }, //是否多选，默认多选
    placeholder: { type: String, default: '请点击选择厂家' },
    bordered: { type: Boolean, default: true }, // 边框模式
  },

  data() {
    return {
      iValue: [],
      iVisible: false,
      selectedManufacturers: [],//已选择厂家
    };
  },

  computed: {
    visible() {
      return this.iVisible;
    },
    tags() {
      return this.selectedManufacturers;
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
        this.initManufactuter();
      },
      // immediate: true,
    },
  },

  created() {
    this.initAxios();
    this.initManufactuter();
  },

  methods: {
    initAxios() {
      apiManufacturer = new ApiManufacturer(this.axios);
    },

    manufacturerSelect() {
      if (!this.disabled) {
        this.iVisible = true;
      }
    },

    //已选厂家数据初始化
    initManufactuter() {
      let _selectedManufacturers = [];
      if (this.iValue.length > 0) {
        this.iValue.map(async id => {
          if (id) {
            let response = await apiManufacturer.get(id);
            if (requestIsSuccess(response)) {
              _selectedManufacturers.push(response.data);
            }
          }
        });
      }
      this.selectedManufacturers = _selectedManufacturers;
    },

    selected(value) {
      this.selectedManufacturers = value;
      if (this.multiple) {
        this.$emit(
          'change',
          this.selectedManufacturers && this.selectedManufacturers.length > 0
            ? this.selectedManufacturers.map(item => item.id)
            : [],
        );
      } else {
        this.$emit(
          'change',
          this.selectedManufacturers[0] ? this.selectedManufacturers[0].id : null,
        );
      }
    },

  },
  render() {
    let manufacturers = this.tags.map(item => {
      return <div class="selected-item">
        <div class="selected-name"> {item ? item.name : null} </div>
        {!this.disabled ?
          <span
            class="btn-close"
            onClick={e => {
              e.stopPropagation();
              this.iValue = this.iValue.filter(id => id !== item.id);
              this.selectedManufacturers = this.selectedManufacturers.filter(_item => _item.id !== item.id);
              if (this.multiple) {
                this.$emit(
                  'change',
                  this.iValue && this.iValue.length > 0
                    ? this.iValue.map(item => item)
                    : [],
                );
              } else {
                this.$emit(
                  'change',
                  this.iValue[0] ? this.iValue[0].id : null,
                );
              }
            }}
          >
            <a-icon type="close" />
          </span> : undefined}
      </div>;
    });

    return (
      <div
        class={{
          'manufacturer-select-panel': true,
          disabled: this.disabled,
          bordered: this.bordered,
        }}
        style={{
          height: this.bordered ? this.height + 'px' : 'auto',
        }}
        onClick={() => this.manufacturerSelect()}
      >
        {this.tags.length == 0 ? <label class="tip">{this.placeholder}</label> : <div class="selected">{manufacturers}</div>}

        {/* 文件选择模态框 */}
        <SmStdBasicManufacturerModal
          ref="SmStdBasicManufacturerModal"
          axios={this.axios}
          visible={this.iVisible}
          value={this.selectedManufacturers}
          multiple={this.multiple}
          onOk={this.selected}
          onChange={visible => (this.iVisible = visible)}
        />
      </div>
    );
  },
};
