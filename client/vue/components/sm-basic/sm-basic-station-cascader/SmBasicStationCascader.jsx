import { requestIsSuccess } from '../../_utils/utils';
import { RelateRailwayType } from '../../_utils/enum';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiStation from '../../sm-api/sm-basic/Station';
import { dropdownStyle } from '../../_utils/config';
let apiStation = new ApiStation();

export default {
  name: 'SmBasicStationCascader',
  props: {
    axios: { type: Function, default: null },
    value: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    treeCheckable: { type: Boolean, default: false },
    organizationId: { type: String, default: null },
    placeholder: { type: String, default: '请选择' },
    railwayId: { type: String, default: null },
    isShowUpAndDown: { type: Boolean, default: false },   //是否展示上下行
    staRelateType: { type: Number, default: RelateRailwayType.SINGLELINK }, //选中的站点的关联类型
  },
  data() {
    return {
      stationOrgs: [],
      selectPath: [],
      listData: [],
      iOrganization: null,
      iRailwayId: null,
    };
  },
  computed: {},
  watch: {
    value: {
      handler: function (val, oldVal) {
        // console.log('value Change ' + val);
        if (val && this.stationOrgs && this.stationOrgs.length > 0) {
          this.setSelectItem();
        } else if (val == null || val == undefined) this.selectPath = [];
      },
      immediate: true,
    },
    organizationId: {
      handler: function (val, oldVal) {
        this.iOrganization = val;
      },
      immediate: true,
    },
    railwayId: {
      handler: function (val, oldVal) {
        this.iRailwayId = val;
        this.refresh();
      },
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
  },
  methods: {
    initAxios() {
      apiStation = new ApiStation(this.axios);
    },
    async refresh() {
      let response = await apiStation.getCascaderList({ organizationId: this.iOrganization, railwayId: this.iRailwayId, isShowUpAndDown: this.isShowUpAndDown });
      if (requestIsSuccess(response)) {
        let _installationSites = treeArrayItemAddProps(response.data, 'children', [
          { sourceProp: 'name', targetProp: 'label' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targestProp: 'key' },
        ]);
        this.stationOrgs = _installationSites;
        this.listData = treeArrayToFlatArray(_installationSites);
        if (this.value) this.setSelectItem();
      }
    },

    //设置选中项
    setSelectItem() {
      //console.log(this.stationOrgs);
      this.selectPath = [];
      for (let item of this.stationOrgs) {
        if (this.findItemInChildren(this.value, item)) {
          this.selectPath.unshift(item.id);
          break;
        }
      }
    },

    findItemInChildren(targetId, data) {
      for (let item of data.children) {
        //单线站点特殊处理 为11 其他类型与枚举相同
        let relateType = 11;
        if (this.staRelateType != RelateRailwayType.SINGLELINK) relateType = this.staRelateType;
        if (item.staId == targetId && item.type == relateType && item.type != RelateRailwayType.UPANDDOWN) {
          this.selectPath.unshift(item.id);
          return true;
        } else if (item.type == RelateRailwayType.UPANDDOWN && item.staId == targetId) {
          this.selectPath.unshift(item.id);
          return true;
        }
        else if (item.children.length > 0) {
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
        options={this.stationOrgs}
        showSearch
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
        value={this.selectPath}
        onChange={value => {
          let res = "";     //站点id
          let relateId = '';  //关联关系id
          let resId = value.length > 0 ? value[value.length - 1] : null;
          let selectedStaRelateType = RelateRailwayType.SINGLELINK;
          // console.log(value);
          //只允许选择站点
          let isQualify = false;
          if (resId != null) {
            for (let i = 0; i < this.listData.length; i++) {
              let item = this.listData[i];
              if (item.id == resId && (item.type == 1 || item.type == 2 || item.type == 3 || item.type == 11)) {
                switch (item.type) {
                case 1:
                  selectedStaRelateType = RelateRailwayType.UPLINK;
                  break;
                case 2:
                  selectedStaRelateType = RelateRailwayType.DOWNLINK;
                  break;
                case 3:
                  selectedStaRelateType = RelateRailwayType.UPANDDOWN;
                  break;
                case 11:
                  selectedStaRelateType = RelateRailwayType.SINGLELINK;
                  break;
                }
                res = item.staId;
                relateId = item.id;
                isQualify = true;
                break;
              }
            }
          }
          if (isQualify) {
            this.selectPath = value;
            //返回值 ：站点id，线路站点关联关系id ，关联类型枚举
            this.$emit('input', res, relateId, selectedStaRelateType);
            this.$emit('change', res, relateId, selectedStaRelateType);
          }
        }}
      />
    );
  },
};
