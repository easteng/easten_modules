import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';
import ApiOrganization from '../../sm-api/sm-system/Organization';

let apiInstallationSite = new ApiInstallationSite();
let apiOrganization = new ApiOrganization();

export default {
  name: 'SmBasicInstallationSiteCascader',
  props: {
    axios: { type: Function, default: null },
    value: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    treeCheckable: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
  },
  data() {
    return {
      installationSites: [],
      selectPath: [],
      listData: [],
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function(val, oldVal) {
        // console.log('value Change ' + val);
        if (val && this.installationSites && this.installationSites.length > 0) {
          this.setSelectItem();
        } else if (val == null || val == undefined) this.selectPath = [];
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
      let orgresponse = await apiOrganization.getCurrentUserOrganizations();
      if (requestIsSuccess(orgresponse)) {
        if (orgresponse.data) {
          //用户属于多组织机构情况下 暂时使用第一个机构
          let response = await apiInstallationSite.getCascaderListWithOrg(orgresponse.data);
          if (requestIsSuccess(response)) {
            let _installationSites = treeArrayItemAddProps(response.data, 'children', [
              { sourceProp: 'name', targetProp: 'label' },
              { sourceProp: 'id', targetProp: 'value' },
              { sourceProp: 'id', targestProp: 'key' },
            ]);
            this.installationSites = _installationSites;
            this.listData = treeArrayToFlatArray(_installationSites);
            if (this.value) this.setSelectItem();
          }
        }
      }
    },

    //设置选中项
    setSelectItem() {
      //console.log(this.installationSites);
      this.selectPath = [];
      for (let item of this.installationSites) {
        if (this.findItemInChildren(this.value, item)) {
          this.selectPath.unshift(item.id);
          break;
        }
      }
    },

    findItemInChildren(targetId, data) {
      for (let item of data.children) {
        if (item.id == targetId) {
          this.selectPath.unshift(item.id);
          return true;
        } else if (item.children.length > 0) {
          if (this.findItemInChildren(targetId, item)) {
            this.selectPath.unshift(item.id);
            return true;
          }
        }
      }
      return false;
    },
  },
  render() {
    return (
      <a-cascader
        disabled={this.disabled}
        allowClear
        options={this.installationSites}
        showSearch
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
        value={this.selectPath}
        onChange={value => {
          let res = value.length > 0 ? value[value.length - 1] : null;
          //只允许选择站点
          let isQualify = false;
          if (res != null) {
            for (let i = 0; i < this.listData.length; i++) {
              let item = this.listData[i];
              if (item.id == res && item.type == 3) {
                isQualify = true;
                break;
              }
            }
          }
          if (res == null || isQualify) {
            this.selectPath = value;
            this.$emit('input', res);
            this.$emit('change', res);
          }
        }}
      />
    );
  },
};
