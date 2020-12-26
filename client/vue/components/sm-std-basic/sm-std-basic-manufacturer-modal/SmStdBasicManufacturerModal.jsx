import './style/index.less';
import SmStdBasicManufacturers from '../sm-std-basic-manufacturers';


export default {
  name: 'SmStdBasicManufacturerModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false },
    placeholder: { type: String, default: '请点击选择厂家' },
    value: { type: [String, Array], default: null },//已选项
    multiple: { type: Boolean, default: false }, // 是否多选
  },
  data() {
    return {
      selectedManufacturers: [],
      iVisible: false,
    };
  },

  computed: {
    tags() {
      return this.selectedManufacturers;
    },
  },

  watch: {
    value: {
      handler: function (value) {
        this.selectedManufacturers = value;
      },
      immediate: true,
    },

    visible: {
      handler: function (value, oldValue) {
        this.iVisible = value;
        this.selectedManufacturers = this.value;
      },
      immediate: true,
    },
  },

  async created() { },

  methods: {
    onOk() {
      this.$emit('ok', this.selectedManufacturers);
      this.onClose();
    },
    onClose() {
      this.$emit('change', false);
      this.selectedManufacturers = [];
    },
  },

  render() {
    return (
      <a-modal
        width={1000}
        title="厂家选择"
        class="sm-basic-selectedManufacturers-modal"
        visible={this.iVisible}
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        <div class="selected">
          {this.tags && this.tags.length > 0 ? (
            this.tags.map(item => {
              return <div class="selected-item">
                <a-icon style={{ color: '#f4222d' }} type={'bank'} />
                <span class="selected-name"> {item ? item.name : null} </span>
                <span
                  class="btn-close"
                  onClick={() => {
                    this.selectedManufacturers = this.selectedManufacturers.filter(_item => _item.id !== item.id);
                  }}
                >
                  <a-icon type="close" />
                </span>
              </div>;
            })

          ) : (
            <span style="margin-left:10px;">请选择</span>
          )}
        </div>
        <div class="selectedManufacturers-list">
          <SmStdBasicManufacturers
            axios={this.axios}
            isSimple={true}
            multiple={this.multiple}
            selected={this.selectedManufacturers}
            onChange={selected => {
              this.selectedManufacturers = [];
              this.selectedManufacturers = selected;
            }}
          />
        </div>
      </a-modal>
    );
  },
};
