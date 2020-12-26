
import './style/index';
import { requestIsSuccess, parseScope } from '../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import { getLinkArray, toTreeArray } from 'tree-array-tools';
import { ScopeType } from '../../_utils/enum';
import ApiInstallationSite from '../../sm-api/sm-basic/InstallationSite';
import { data } from 'autoprefixer';

let apiInstallationSite = new ApiInstallationSite();

export default {
  name: 'SmBasicScopeSelectModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false },
    value: { type: String, default: null },// scope Code  1@name@id; 或者 只有 Id 如果只有Id需要和 type拼接为 完整的 code
    type: { type: Number, default: null }, // 类型：组织、线路、车站、安装位置
    disabled: { type: Boolean, default: false },//禁用状态
    placeholder: { type: String, default: '请选择' },
    simple: { type: Boolean, default: false },//是否显示父级信息,默认为true:省略父级
    seperator: { type: String, default: '-' },//分隔符设置
  },
  data() {
    return {
      iValue: null,
      treeData: [],
      flatData: [],
      expandedKeys: [],//树展开的节点
      id: null,
      tempId: null,
      dropdownExpand: false,
      loading: true,
    };
  },

  watch: {
    value: {
      handler: function (val, oldVal) {
        this.iValue = val;
      },
      immediate: true,
    },
    visible: {
      handler: function (val, oldVal) {
        if (val) {
          this.refresh();
        } else {
        }
      },
    },
  },
  async created() {
    this.initAxios();
    // this.refresh();
  },
  methods: {
    initAxios() {
      apiInstallationSite = new ApiInstallationSite(this.axios);
    },

    async refresh() {
      this.loading = true;
      let response = null;
      let data = [];
      let scope = parseScope(this.iValue);
      if (this.iValue && this.iValue.length > 0) {
        response = await apiInstallationSite.getListByScope({ id: scope.id, initialScopeCode: this.iValue, type: scope.type });
        if (requestIsSuccess(response)) {
          data = response.data;
          if (data == []) {
            this.iValue = null;
            response = await apiInstallationSite.getListByScope();
            this.$message.warning('传入的数据有误，已转换到当前登录的组织机构');
          }
          data = response.data;
        }
      } else {
        response = await apiInstallationSite.getListByScope();
        if (requestIsSuccess(response)) {
          data = response.data;
        }
      }

      this.treeData = treeArrayItemAddProps(data, 'children', [
        { sourceProp: 'name', targetProp: 'title' },
        { sourceProp: 'id', targetProp: 'value' },
        { sourceProp: 'scopeCode', targetProp: 'key' },
        { sourceProp: 'scopeCode', targetProp: 'scopeCode' },
        { sourceProp: 'scope-tree-node', targetProp: 'class' },
        {
          targetProp: 'disabled', handler: item => {
            if (this.type == null) {
              // return item.children === null ? true : false;
              return false;
            } else {
              return item.type != this.type;
            }

          },
        },
        {
          targetProp: 'isLeaf', handler: item => {
            if (this.type != null) {
              let temp = false;
              if (item.children != null) {
                for (let i = 0; i < item.children.length; i++) {
                  if (item.children[i].type <= this.type) {
                    temp = false;
                    break;
                  } else {
                    temp = true;
                  }
                }
              } else {
                temp = true;
              }
              return temp;
            } else {
              return item.children == null ? true : false;
            }
          },
        },
        {
          targetProp: 'scopedSlots', handler: item => {
            return { icon: 'icon' };
          },
        },
      ]);
      this.flatData = treeArrayToFlatArray(this.treeData);
      this.expandedKeys = [];
      if (this.iValue && this.iValue.length > 0 && data != []) {
        this.setExpandedKeys(this.iValue);
        this.expandedKeys.shift();
      }
      this.loading = false;
    },

    //查找并设置展开的节点
    setExpandedKeys(scopeCode) {
      let data = null;
      let arr = scopeCode.split('.');
      if (arr.length > 1) {
        while (arr.length > 1) {
          let expandedKey = '';
          for (let i = 0; i < arr.length; i++) {
            expandedKey = expandedKey + arr[i] + '.';
          }
          this.expandedKeys.push(expandedKey.substring(0, expandedKey.length - 1));
          arr.pop();
        }
        this.setExpandedKeys(arr[0]);
      } else {
        let data = this.flatData.find(x => x.scopeCode == scopeCode && x.scopeCode != null);

        if (data.parentId == null) {
          this.expandedKeys.push(data.scopeCode);
        } else {
          this.expandedKeys.push(data.scopeCode);
          data = this.flatData.find(x => x.id == data.parentId && x.scopeCode != null);
          this.setExpandedKeys(data.scopeCode);
        }
      }
    },


    //异步加载数据
    async getInstallationSiteLoadData(treeNode) {
      treeNode.dataRef.children = [];
      if (treeNode != undefined) {
        let data = [];
        let response = await apiInstallationSite.getListByScope({ id: treeNode.value, ParentScopeCode: treeNode.dataRef.scopeCode, type: treeNode.dataRef.type });
        if (requestIsSuccess(response) && response.data) {
          if (this.type != null) {
            response.data.forEach(item => {
              if (item.type <= this.type) {
                data.push(item);
              }
            });
          } else {
            data = response.data;
          }
          treeNode.dataRef.children = treeArrayItemAddProps(data, 'children', [
            { sourceProp: 'name', targetProp: 'title' },
            { sourceProp: 'id', targetProp: 'value' },
            { sourceProp: 'scopeCode', targetProp: 'key' },
            { sourceProp: 'scopeCode', targetProp: 'scopeCode' },
            { sourceProp: 'scope-tree-node', targetProp: 'class' },
            {
              targetProp: 'isLeaf', handler: item => {
                if (this.type != null) {
                  let temp = false;
                  if (item.children != null) {
                    for (let i = 0; i < item.children.length; i++) {
                      if (item.children[i].type <= this.type) {
                        temp = false;
                        break;
                      } else {
                        temp = true;
                      }
                    }
                  } else {
                    temp = true;
                  }
                  return temp;
                } else {
                  return item.children == null ? true : false;
                }

              },
            },
            {
              targetProp: 'scopedSlots', handler: item => {
                return { icon: 'icon' };
              },
            },
            {
              targetProp: 'disabled', handler: item => {
                if (this.type == null) {
                  // return item.children === null ? true : false;
                  return false;
                } else {
                  return item.type != this.type;
                }
              },
            },
          ]);
        }
        this.flatData = this.flatData.concat(treeArrayToFlatArray(data));
      }
    },

    //添加图标
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

    // 树展开事件
    onExpand(expandedKeys, { expanded, node }) {

      //展开被点击的节点及该节点的父级节点
      let temp = this.expandedKeys.find(x => x == node.eventKey);
      if (temp && temp.length > 0) {
        this.expandedKeys = [];
        this.setExpandedKeys(node.eventKey);
        this.expandedKeys.shift();
      } else {
        this.getInstallationSiteLoadData(node);
        this.expandedKeys = expandedKeys;
      }

    },

    onOk() {
      this.$emit('ok', this.iValue, this.id, false);
      this.onClose();
    },

    onClose() {
      if (this.iValue == null) {
        this.treeData = null;
      }
      this.$emit('change', false);
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
      <a-modal
        title="安装位置选择"
        class="sm-basic-scope-select-modal"
        visible={this.visible}
        onChange={value => {
          this.$emit('change', value);
        }}
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        <div class="selected">
          {this.iValue == null ? (
            <span class="empty">{this.placeholder}</span>
          ) : (
              <div class="label">
                {label}
                <span
                  class="btn-close"
                  onClick={() => {
                    this.iValue = null;
                    this.id = null;
                  }}
                >
                  <a-icon type="close" />
                </span>
              </div>
            )}

        </div>
        <div class="panel modal-list">
          <a-spin spinning={this.loading} />
          <a-tree
            blockNode
            expandedKeys={this.expandedKeys}
            treeData={this.treeData}
            showIcon
            loadData={this.getInstallationSiteLoadData}
            onExpand={this.onExpand}
            defaultSelectedKeys={[this.iValue]}//将iValue的值放入默认选中的数组中
            onSelect={e => {
              let target;
              if (e.length) {
                target = this.flatData.find(x => x.scopeCode == e[0]);
              }
              this.iValue = target ? target.scopeCode : null;
              this.id = target ? target.id : null;
            }}

            {...{
              scopedSlots: {
                icon: node => {
                  return this.getIcon(node.type);
                },
              },
            }}
          >
          </a-tree>
        </div>
      </a-modal>
    );
  },
};
