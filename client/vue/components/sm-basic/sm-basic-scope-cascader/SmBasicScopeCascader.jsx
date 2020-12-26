import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import { ScopeType } from '../../_utils/enum';
import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';
import ApiOrganization from '../../sm-api/sm-system/Organization';

let apiInstallationSite = new ApiInstallationSite();
let apiOrganization = new ApiOrganization();

export default {
  name: 'SmBasicScopeCascader',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    value: { type: String, default: null },//返回值
    disabled: { type: Boolean, default: false },//禁用状态
    placeholder: { type: String, default: '请选择' },
    railway: { type: Boolean, default: false },//是否为铁路模式,默认为false:铁路模式
    simple: { type: Boolean, default: false },//是否显示父级信息,默认为true:省略父级
    seperator: { type: String, default: '-' },//分隔符设置
  },
  data() {
    return {
      scopeCode: null,
      options: [],
      iValue: [],
      installationSites: [],
      scope: null,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        this.scopeCode = val;
        this.initAxios();
        this.refresh();
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiInstallationSite = new ApiInstallationSite(this.axios);
      apiOrganization = new ApiOrganization(this.axios);
    },

    async refresh() {
      let response = null;
      if (this.scopeCode && this.scopeCode.length > 0) {
        let arr = this.scopeCode.split('.');
        let code = arr[arr.length - 1].split('@');
        let scope = {
          id: code[2],
          scopeCode: this.scopeCode,
          type: code[0],
        };
        response = await apiInstallationSite.getListByScope({ id: scope.id, initialScopeCode: this.scopeCode, type: scope.type });
        if (requestIsSuccess(response)) {
          let value = [];
          let deep = arr[arr.length - 1].split('@')[0];
          let hint = false;
          let installationSiteIds = [];
          let organizationId = [];
          arr.map(item => {
            let temp = item.split('@');
            if (temp[0] == ScopeType.InstallationSite) {
              installationSiteIds.push(temp[2]);
            } else if (temp[0] == ScopeType.Organization) {
              organizationId.push(temp[2]);
            }
            else if (temp[0] == ScopeType.Railway) {
              hint = true;
              value.push(temp[2]);
            } else {
              value.push(temp[2]);
            }

          });
          value.unshift(organizationId[organizationId.length - 1]);
          if (installationSiteIds !== []) {
            value.push(installationSiteIds[installationSiteIds.length - 1]);
          }
          this.iValue = value;
          console.log(deep);
          console.log(hint);
          this.options = this.setData(response.data, deep, hint);
        }
      } else {
        response = await apiInstallationSite.getListByScope();
        if (requestIsSuccess(response)) {
          let _installationSites = [];
          response.data.map(item =>
            _installationSites.push(this.getInstallationSiteArr(this.returnLabel(item.type) + item.name, item.id, item.children == null ? true : false, item.type)),
          );
          this.iValue = this.scopeCode;
          this.options = _installationSites;
        }
      }

    },

    setData(data, deep, temp) {
      let _data = data;
      let option = [];
      this.installationSites = data;
      _data.forEach(item => {
        //终止组织机构子级的孩子
        if (item.parentId != null && item.type == ScopeType.Organization) {
          let show = false;
          this.iValue.forEach(e => {
            if (e == item.id) {
              show = true;
            }
          });
          //展示的数据是组织机构子级
          if (show) {
            option.push({
              label: this.returnLabel(item.type) + item.name,
              value: item.id,
              isLeaf: item.children == null ? true : false,
              type: item.type,
              children: item.children == null ? null : this.setData(item.children, deep, temp),
            });
          } else {
            option.push({
              label: this.returnLabel(item.type) + item.name,
              value: item.id,
              isLeaf: item.children == null ? true : false,
              type: item.type,
              children: null,
            });
          }
        } else {

          //展示数据的层级到组织机构
          if (deep == ScopeType.Organization) {
            option.push({
              label: this.returnLabel(item.type) + item.name,
              value: item.id,
              isLeaf: item.children == null ? true : false,
              type: item.type,
              children: item.children == null || item.type == ScopeType.Railway ? null : this.setData(item.children, deep, temp),
            });
          }
          //展示数据的层级到线路
          else if (deep == ScopeType.Railway) {
            option.push({
              label: this.returnLabel(item.type) + item.name,
              value: item.id,
              isLeaf: item.children == null ? true : false,
              type: item.type,
              children: item.children == null || item.type == ScopeType.Railway ? null : this.setData(item.children, deep, temp),
            });

          }
          //展示数据的层级到站点
          else if (deep == ScopeType.Station) {
            option.push({
              label: this.returnLabel(item.type) + item.name,
              value: item.id,
              isLeaf: item.children == null ? true : false,
              type: item.type,
              children: item.children == null || item.type == ScopeType.Station ? null : this.setData(item.children, deep, temp),
            });
          }
          //展示数据的层级到安装位置
          else {
            if (temp) {
              option.push({
                label: this.returnLabel(item.type) + item.name,
                value: item.id,
                isLeaf: item.children == null ? true : false,
                type: item.type,
                children: item.children == null || item.type == ScopeType.InstallationSite ? null : this.setData(item.children, deep, temp),
              });
            } else {
              option.push({
                label: this.returnLabel(item.type) + item.name,
                value: item.id,
                isLeaf: item.children == null ? true : false,
                type: item.type,
                children: item.children == null || item.type == ScopeType.Railway ? null : this.setData(item.children, deep, temp),
              });

            }
          }
        }
      });
      return option;
    },

    getInstallationSiteArr(label, value, isLeaf, type) {
      let installationSiteArr = {
        label: label,
        value: value,
        isLeaf: isLeaf,
        type: type,
      };
      return installationSiteArr;
    },

    returnLabel(type) {
      let label = null;
      if (type == ScopeType.Organization) {
        label = '[部] ';
      } else if (type == ScopeType.Railway) {
        label = '[线] ';
      } else if (type == ScopeType.Station) {
        label = '[站] ';
      } else {
        label = '[位] ';
      }
      return label;
    },

    //根据上一级的id来获取该级的下属节点
    async getRailway(id, selectedOptions) {
      let _installationSites = [];
      selectedOptions.children = null;
      let response = await apiInstallationSite.getListByScope({ id: id, ParentScopeCode: this.scope, type: selectedOptions[selectedOptions.length - 1].type });
      if (requestIsSuccess(response)) {
        response.data.map(item =>
          _installationSites.push(this.getInstallationSiteArr(this.returnLabel(item.type) + item.name, item.id, (item.children == null) ? true : false, item.type)),
        );
      }
      return _installationSites;
    },

    //异步加载数据
    async getInstallationSiteLoadData(selectedOptions) {
      if (selectedOptions != undefined) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        let _installationSites = [];
        _installationSites = (await this.getRailway(this.iValue[this.iValue.length - 1], selectedOptions));
        // load options lazily
        setTimeout(() => {
          targetOption.loading = false;
          targetOption.children = _installationSites;
          this.options = [...this.options];
        }, 500);
      }
    },
  },

  render() {
    return (
      <div>
        {/* <span>
                    {{ text }}
                </span> */}
        <a-cascader
          disabled={this.disabled}
          allowClear
          options={this.options}
          loadData={this.getInstallationSiteLoadData}
          showSearch
          placeholder={this.disabled ? '' : this.placeholder}
          style="width: 100%"
          change-on-select
          value={this.iValue}
          onChange={(value, selectedOptions) => {
            this.iValue = value;
            let val = null;
            if (selectedOptions != undefined) {
              for (let i = 0; i < selectedOptions.length; i++) {
                val = val + selectedOptions[i].type + '@' + selectedOptions[i].label + '@' + selectedOptions[i].value + '.';
              }
              val = val.substring(0, val.length - 1);
            }
            this.scope = val;
            this.$emit('input', val);
            this.$emit('change', val);
          }}
        >

        </a-cascader>
      </div>

    );
  },
};
