import './style/index.less';
import SmBasicInstallationSites from '../sm-basic-installation-sites';

export default {
  name: 'SmBasicInstallationSiteModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false },
    placeholder: { type: String, default: '请点击选择' },
    value: { type: [String, Array], default: null },//已选项
    multiple: { type: Boolean, default: false }, // 是否多选
    // railwayRltStation: { type: Object, default: null },//线路和站id
  },
  data() {
    return {
      selectedInstallationSites: [],
      iVisible: false,
    };
  },

  computed: {
    tags() {
      return this.selectedInstallationSites;
    },
  },

  watch: {
    value: {
      handler: function (value) {
        this.selectedInstallationSites = value;
      },
      immediate: true,
    },

    visible: {
      handler: function (value, oldValue) {
        this.iVisible = value;
        this.selectedInstallationSites = this.value;
      },
      immediate: true,
    },
  },

  async created() { },

  methods: {
    onOk() {
      this.$emit('ok', this.selectedInstallationSites);
      this.onClose();
    },
    onClose() {
      this.$emit('change', false);
      this.selectedInstallationSites = [];
    },
  },
  render() {
    return (
      <a-modal
        width={1000}
        title="位置（机房）选择"
        class="sm-basic-selectedInstallationSites-modal"
        visible={this.iVisible}
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        <div class="selected">
          {this.tags && this.tags.length > 0 ? (
            this.tags.map(item => {
              return <div class="selected-item">
                <a-icon style={{ color: '#f4222d' }} type={'environment'} />
                <span class="selected-name"> {item ? item.name : null} </span>
                <span
                  class="btn-close"
                  onClick={() => {
                    this.selectedInstallationSites = this.selectedInstallationSites.filter(_item => _item.id !== item.id);
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
        <div class="selectedInstallationSites-list">
          <SmBasicInstallationSites
            // railwayRltStation={this.railwayRltStation}
            axios={this.axios}
            isSimple={true}
            multiple={this.multiple}
            selected={this.selectedInstallationSites}
            onChange={selected => {
              this.selectedInstallationSites = [];
              this.selectedInstallationSites = selected;
            }}
          />
        </div>
      </a-modal>
    );
  },
};
