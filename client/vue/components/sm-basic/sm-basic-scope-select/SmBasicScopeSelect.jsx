import './style/index';
import SmBasicScopeSelectModal from './SmBasicScopeSelectModal';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import { requestIsSuccess, parseScope } from '../../_utils/utils';
import { ScopeType } from '../../_utils/enum';
import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';

let apiInstallationSite = new ApiInstallationSite();

export default {
  name: 'SmBasicScopeSelect',

  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    value: { type: String, default: null },// scope Code  1@name@id; 或者 只有 Id 如果只有Id需要和 type拼接为 完整的 code
    type: { type: Number, default: null }, // 类型：组织、线路、车站、安装位置
    seperator: { type: String, default: '-' },//分隔符设置
    disabled: { type: Boolean, default: false },//是否禁用
    size: { type: String, default: 'default' },//大小：small、default
    round: { type: Boolean, default: false },//大小：small、default
    placeholder: { type: String, default: '请选择' },
    autoInitial: { type: Boolean, default: false }, // 如果value为null时，自动初始化第一个值
  },

  data() {
    return {
      stateDisabled: null,
      flatData: [],
      iValue: null,
      iVisible: false,
      iAutoInitial: false,
    };
  },

  computed: {
    visible() {
      return this.iVisible;
    },
  },

  watch: {

    value: {
      handler(nVal, oVal) {
        this.iValue = nVal;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
    autoInitial: {
      handler(nVal, oVal) {
        this.iAutoInitial = nVal;
      },
      immediate: true,
    },
  },

  created() {
    this.initAxios();
    this.refresh();
  },

  methods: {
    initAxios() {
      apiInstallationSite = new ApiInstallationSite(this.axios);
    },

    scopeSelect() {
      if (!this.disabled) {
        this.iVisible = true;
      }
    },

    async refresh() {
      let response = null;
      if (this.iValue && this.iValue.length > 0) {
        let scope = parseScope(this.iValue);
        response = await apiInstallationSite.getListByScope({ id: scope.id, initialScopeCode: this.iValue, type: scope.type });
        if (requestIsSuccess(response)) {
          this.flatData = treeArrayToFlatArray(response.data);
        }
      } else {
        response = await apiInstallationSite.getListByScope();
        if (requestIsSuccess(response)) {
          this.flatData = treeArrayToFlatArray(response.data);
        }
      }
      if (this.iAutoInitial && this.iValue == null) {
        this.iValue = this.flatData && this.flatData.length > 0 ? this.flatData[0].scopeCode : null;
        let id = this.flatData && this.flatData.length > 0 ? this.flatData[0].id : null;
        this.$emit('change', this.iValue, id);
      }
    },

    getIcon(type) {
      let icon;
      let _type = type;
      switch (_type) {
      case ScopeType.Organization:
        icon = <a-icon type="apartment" />;
        break;

      case ScopeType.Railway:
        icon = <a-icon type="branches" />;
        break;

      case ScopeType.Station:
        icon = <a-icon type="deployment-unit" />;
        break;

      case ScopeType.InstallationSite:
        icon = <a-icon type="environment" />;
        break;
      }
      return <span class="label-icon" >{icon}</span>;
    },

    selected(scopeCode, id, autoInitial) {
      this.$emit('change', scopeCode, id);
      this.iValue = scopeCode;
      this.iAutoInitial = autoInitial;
      this.refresh();
    },

  },
  render() {

    let label = [];
    if (this.iValue && this.flatData.length > 0) {
      this.iValue.split('.').map((item, index) => {
        let scope = parseScope(item);
        if (index != 0) {
          label.push(<span class="seperator"> {this.seperator} </span>);
        }
        label.push(this.getIcon(parseInt(scope.type)));
        label.push(<span class="name">{this.flatData.find(x => x.id == scope.id) == null ? null : this.flatData.find(x => x.id == scope.id).name}</span>);
      });
    }

    return (
      <div
        class={{
          'sm-basic-scope-select': true,
          disabled: this.disabled,
          "label": true,
          "ant-input": true,
          "ant-input-sm": this.size === 'small',
          empty: !this.iValue,
          round: this.round,
        }}
        onClick={() => this.scopeSelect()}
      >

        {this.iValue ? label : this.placeholder}

        {/* 安装位置选择模态框 */}
        <SmBasicScopeSelectModal
          ref="SmBasicScopeSelectModal"
          seperator={this.seperator}
          axios={this.axios}
          visible={this.iVisible}
          value={this.iValue}
          type={this.type}
          onOk={this.selected}
          onChange={visible => (this.iVisible = visible)}
        />
      </div>
    );
  },
};