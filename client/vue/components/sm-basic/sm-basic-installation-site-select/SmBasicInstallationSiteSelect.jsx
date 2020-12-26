// 文件选择对话框
import SmBasicInstallatonsiteModel from '../sm-basic-installation-site-modal';
import { requestIsSuccess } from '../../_utils/utils';
import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';
import './style/index.less';

let apiInstallationSite = new ApiInstallationSite();

export default {
  name: 'SmBasicInstallationSiteSelect',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    axios: { type: Function, default: null }, //异步请求方法
    height: { type: Number, default: 80 }, // 当前选择框的大小
    disabled: { type: Boolean, default: false }, // 编辑模式和查看模式
    value: { type: [Array, String] }, // 已选择的内容
    multiple: { type: Boolean, default: false }, //是否多选，默认单选
    placeholder: { type: String, default: '请点击选择' },
    bordered: { type: Boolean, default: true }, // 边框模式
    // railwayRltStation: { type: Object, default: null },//线路和站id
  },

  data() {
    return {
      iValue: [],
      iVisible: false,
      selectedInstallationSites: [], //已选择机房
    };
  },

  computed: {
    visible() {
      return this.iVisible;
    },
    tags() {
      return this.selectedInstallationSites;
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
        this.initData();
      },
      immediate: true,
    },
  },

  created() {
    this.initAxios();
    this.initData();
  },

  methods: {
    initAxios() {
      apiInstallationSite = new ApiInstallationSite(this.axios);
    },

    installationSiteSelect() {
      if (!this.disabled) {
        this.iVisible = true;
      }
    },

    //已选机房数据初始化
    initData() {
      let _selectedInstallationSites = [];
      if (this.iValue && this.iValue.length > 0) {
        this.iValue.map(async id => {
          if (id) {
            let response = await apiInstallationSite.get(id);
            if (requestIsSuccess(response)) {
              _selectedInstallationSites.push(response.data);
            }
          }
        });
      }
      this.selectedInstallationSites = _selectedInstallationSites;
    },

    selected(value) {
      this.selectedInstallationSites = value;
      if (this.multiple) {
        this.$emit(
          'change',
          this.selectedInstallationSites && this.selectedInstallationSites.length > 0
            ? this.selectedInstallationSites.map(item => item.id)
            : [],
        );
      } else {
        this.$emit(
          'change',
          this.selectedInstallationSites[0] ? this.selectedInstallationSites[0].id : null,
        );
      }
    },
  },
  render() {
    let manufacturers = this.tags.map(item => {
      return (
        <div class="selected-item">
          <div class="selected-name"> {item ? item.name : null} </div>
          {!this.disabled ? (
            <span
              class="btn-close"
              onClick={e => {
                e.stopPropagation();
                this.iValue = this.iValue.filter(id => id !== item.id);
                if (this.multiple) {
                  this.$emit('change', this.iValue);
                } else {
                  this.$emit('change', this.iValue[0]);
                }
                this.selectedInstallationSites = this.selectedInstallationSites.filter(
                  _item => _item.id !== item.id,
                );
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
          'installation-site-select-panel': true,
          disabled: this.disabled,
          bordered: this.bordered,
        }}
        style={{
          height: this.bordered ? this.height + 'px' : 'auto',
        }}
        onClick={() => this.installationSiteSelect()}
      >
        {this.tags.length == 0 ? (
          <span class="tip">{this.placeholder}</span>
        ) : (
          <div class="selected-box">{manufacturers}</div>
        )}

        {/* 机房选择模态框 */}
        <SmBasicInstallatonsiteModel
          // railwayRltStation={this.railwayRltStation}
          ref="SmBasicInstallatonsiteModel"
          axios={this.axios}
          visible={this.iVisible}
          value={this.selectedInstallationSites}
          multiple={this.multiple}
          onOk={this.selected}
          onChange={visible => (this.iVisible = visible)}
        />
      </div>
    );
  },
};
