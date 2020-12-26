/**
 * 单选模式、多选模式
 * 获取当前用户的组织机构
 * 自动初始化
 * 根据Value值返回父级及父级姊妹元素
 * 按需加载（获取当前用户的组织机构除外）
 */

import { requestIsSuccess } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray, treeArrayLoop } from '../../_utils/tree_array_tools';
import ApiOrganization from '../../sm-api/sm-system/Organization';
import { dropdownStyle } from '../../_utils/config';

let apiOrganization = new ApiOrganization();

export default {
  name: 'SmSystemOrganizationTreeSelect',
  props: {
    axios: { type: Function, default: null },
    value: { type: [Array, String], default: () => [] }, //返回值
    disabled: { type: Boolean, default: false }, //是否禁用
    placeholder: { type: String, default: '请选择' },
    multiple: { type: Boolean, default: false }, //是否多选
    maxTagCount: { type: Number, default: 2 }, //多选状态下最多显示tag数
    allowClear: { type: Boolean, default: true }, //是否清除
    showSearch: { type: Boolean, default: false }, //是否显示搜索
    onlyCurrentUserOrganizations: { type: Boolean, default: false }, // 只显示当前用户的组织机构
    autoInitial: { type: Boolean, default: false }, //是否初始化数据
    size: { type: String, default: 'default' },
  },
  data() {
    return {
      organizations: [], // 列表数据源
      organizationsFlat: [], //平状数据源
      iValue: null,
      isChange: false,
      isSearch: false,//树选择框是否处于搜索状态

    };
  },
  computed: {},
  watch: {
    value: {
      handler: async function () {
        if (!this.isSearch) {
          this.initAxios();
          await this.refresh();
          this.setValue();
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiOrganization = new ApiOrganization(this.axios);
    },
    // 当选择框已经有值的时候，判断需不需要重新加载数据
    isValueLoading() {
      let refresh = false;
      // 当是多选的时候
      if (this.value instanceof Array) {
        if (this.value.length > 0) {
          // 保证数组里面的所有数据已经加载
          if (this.value.some(id => this.organizationsFlat.find(x => x.id == id) == null)) {
            refresh = true;
          }
        } else {
          if (this.value.length == 0 && this.organizationsFlat.length == 0) {
            refresh = true;
          }
        }
      }
      // 当是单选的时候
      else {
        if (this.value) {
          if (this.organizationsFlat.find(x => x.id === this.value) == null) {
            refresh = true;
          }
        } else {
          if (!this.value && this.organizationsFlat.length == 0) {
            refresh = true;
          }
        }
      }
      return refresh;
    },
    //初始化页面加载数据
    async refresh(keyWords, isReset) {
      if (keyWords) {
        this.iValue = null || [];
      }
      let isValueLoading = keyWords || isReset ? true : await this.isValueLoading();
      //是否刷新
      if (isValueLoading) {
        let ids = !keyWords ? this.value instanceof Array ? this.value : this.value ? [this.value] : [] : [];
        let params = {
          isTreeSearch: true,
          isAll: true,
          keyWords: keyWords,
          ids,
        };
        let response = null;
        let _organizations = [];

        if (this.onlyCurrentUserOrganizations) {
          response = await apiOrganization.getCurrentUserOrganizations({ ids });
          if (requestIsSuccess(response)) {
            _organizations = response.data;
          }
        } else {
          response = await apiOrganization.getList(params);
          if (requestIsSuccess(response)) {
            _organizations = response.data.items;
          }
        }
        this.organizationsFlat = [];
        this.organizations = [];
        // 遍历结构树
        treeArrayLoop(_organizations, (item) => {
          item.title = item.name;
          item.value = item.id;
          item.key = item.id;
          item.isLeaf = item.children === null;
          this.organizationsFlat.push(item);
        });
        this.organizations = _organizations;
        // });
        // 自动初始化(单选模式有)
        if (this.autoInitial && !this.multiple && !this.value) {
          let _organizations = this.onlyCurrentUserOrganizations ? this.organizationsFlat.filter(x => x.isGranted) : this.organizations;
          let value = _organizations.length > 0 ? _organizations[0].id : null;
          let name = _organizations.length > 0 ? _organizations[0].name : null;
          this.$emit('input', value, name);
          this.$emit('change', value, name);
        }
      }
      // this.setValue();
    },
    //搜索功能
    onSearch(value) {
      if (!value) {
        this.isSearch = false;
      } else {
        this.refresh(value, true);
        this.isSearch = true;
      }
    },
    // 多选模式下，value 值格式为：{value,label}格式
    async setValue() {
      let result = await this.processData(this.organizationsFlat, this.value);
      if (result) {
        if (this.multiple) {
          this.iValue = this.value
            ? this.organizationsFlat
              .filter(item => {
                if (this.value.indexOf(item.id) > -1) {
                  return true;
                }
              })
              .map(item => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })
            : [];
        } else {
          this.iValue = this.value;
        }
      } else {
        this.iValue = null;
      }



      // console.log('设置Value', this.value, this.iValue);
    },
    // 判断传过来的id是否在数据中
    processData(array, value) {
      let data = false;
      try {
        array.forEach((item, index, arr) => {
          //当是多选的情况，value是数组，单选是字符串
          if (this.multiple && (value.some(values => item.id == values))) {
            data = true;
            throw new Error("error");
          } else {
            if (item.id == value) {
              data = true;
              throw new Error("error");
            }
          }
          if (item.children != null && item.children.length > 0) {
            this.processData(item.children, value);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      };
      return data;
    },
    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiOrganization.getList({
          parentId: treeNode.dataRef.value,
          isAll: true,
          isCurrent: this.onlyCurrentUserOrganizations ? true : false,
        });

        if (requestIsSuccess(response)) {
          let children = response.data.items;
          // 遍历结构树
          treeArrayLoop(children, (item) => {
            item.title = item.name;
            item.value = item.id;
            item.key = item.id;
            item.isLeaf = item.children === null;
            if (this.organizationsFlat.find(x => x.id == item.id) == null) {
              this.organizationsFlat.push(item);
            }
          });
          treeNode.dataRef.children = children;
        }
      }
    },
  },

  render() {
    return (
      <a-tree-select
        size={this.size}
        dropdownStyle={dropdownStyle}
        disabled={this.disabled}
        allowClear={this.allowClear}
        treeData={this.organizations}
        value={this.iValue}
        maxTagCount={this.maxTagCount}
        treeCheckStrictly={this.multiple}
        treeCheckable={this.multiple}
        showSearch={this.showSearch}
        multiple={this.multiple}
        treeNodeFilterProp="title"
        loadData={this.onLoadData}
        onSearch={value => {
          if (value) {
            this.onSearch(value);
          }
        }}
        onChange={value => {
          if (value === undefined || value.length === 0) {
            this.organizations = [];
            this.organizationsFlat = [];
            this.refresh('', true);
          }
          this.iValue = value;
          let rst = this.multiple ? value.map(item => item.value) : value;
          let name = null;
          if (!this.multiple) {
            let item = this.organizationsFlat.find(x => x.id == value);
            name = item ? item.name : null;

          }
          this.$emit('input', rst, name);
          this.$emit('change', rst, name);
        }}
        placeholder={this.disabled ? '' : this.placeholder}
        style="width: 100%"
      ></a-tree-select>
    );
  },
};
