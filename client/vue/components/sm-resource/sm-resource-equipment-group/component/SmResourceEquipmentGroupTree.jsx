import { pagination as paginationConfig, tips as tipsConfig } from '../../../_utils/config';
import ApiEquipmentGroup from '../../../sm-api/sm-resource/EquipmentGroup';
import SmResourceEquipmentGroupModel from './SmResourceEquipmentGroupModel';
import { requestIsSuccess, vIf, vP } from '../../../_utils/utils';
import permissionsSmResource from '../../../_permissions/sm-resource';
import SmImport from '../../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../../sm-common/sm-import-template-module';
import SmExport from '../../../sm-common/sm-export-module';
import { dropdownStyle } from '../../../_utils/config';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../../_utils/tree_array_tools';
import '../style/index';

let apiEquipmentGroup = new ApiEquipmentGroup();
export default {
  name: 'SmResourceEquipmentGroupTree',

  props: {
    axios: { type: Function, default: null },
    placeholder: { type: String, default: '请选择' },
    allowClear: { type: Boolean, default: true }, //是否清除
    transferData: { type: Object, default: null },//下级分类中传过来的数据
    editData: { type: Object, default: null },//基本信息表传过来的数据
    permissions: { type: Array, default: () => [] },
  },
  data() {
    return {
      equipmentGroups: [], // 列表数据源
      equipmentGroupsFlat: [], //平状数据源
      searchValue: '',
      autoExpandParent: true,
      record: null,//当前树节点的记录
      parentId: null,//当前记录的父节点
      fileList: [],
      expandedKeys: [],//展开的树节点
      loading: false,
    };
  },

  computed: {
  },
  watch: {
    transferData: {
      handler: function (val, oldVal) {
        this.refreshByParentId(this.transferData);
      },
      deep: true,
    },
    editData: {
      handler: function (val, oldVal) {
        this.refresh(this.editData);
      },
      deep: true,
    },
  },
  async created() {
    this.initAxios();
    this.loadByParentId();
  },

  methods: {
    initAxios() {
      apiEquipmentGroup = new ApiEquipmentGroup(this.axios);
    },
    //初始化页面加载数据
    async loadByParentId(data) {
      let response = await apiEquipmentGroup.getList({
        parentId: null,
        name: data ? data.name : '',
        isAll: true,
      });
      if (requestIsSuccess(response) && response.data && response.data.items) {
        let _equipmentGroups = treeArrayItemAddProps(response.data.items, 'children', [
          { sourceProp: 'name', targetProp: 'title' },
          { sourceProp: 'id', targetProp: 'value' },
          { sourceProp: 'id', targetProp: 'key' },
          { sourceProp: 'id', targetProp: 'key' },
          {
            targetProp: 'isLeaf', handler: item => {
              return item.children === null ? true : false;
            },
          },
          {
            targetProp: 'scopedSlots', handler: item => {
              return { title: 'title' };
            },
          },
        ]);
        this.equipmentGroupsFlat = treeArrayToFlatArray(_equipmentGroups);
        this.equipmentGroups = _equipmentGroups;
      }
    },

    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode && treeNode.dataRef && treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiEquipmentGroup.getList({ parentId: treeNode.dataRef.value, name: null, isAll: true });
        if (requestIsSuccess(response) && response.data && response.data.items) {
          this.equipmentGroupsFlat = this.equipmentGroupsFlat.concat(response.data.items);
          treeNode.dataRef.children = treeArrayItemAddProps(response.data.items, 'children', [
            { sourceProp: 'name', targetProp: 'title' },
            { sourceProp: 'id', targetProp: 'value' },
            { sourceProp: 'id', targetProp: 'key' },
            {
              targetProp: 'isLeaf', handler: item => {
                return item.children === null ? true : false;
              },
            },
            {
              targetProp: 'scopedSlots', handler: item => {
                return { title: 'title' };
              },
            },
          ]);
        }
      }
    },
    // 添加
    add(record) {
      this.record = record;
      this.$refs.SmResourceEquipmentGroupModel.add(record);
    },
    // 查看
    view(record) {
      this.$emit('record', record);
    },
    //编辑
    edit(record) {
      this.record = record;
      this.$refs.SmResourceEquipmentGroupModel.edit(record);
    },
    // 删除
    remove(record) {
      this.record = record;
      let _this = this;
      this.$confirm({
        title: tipsConfig.remove.title,
        content: h => <div style="color:red;">{tipsConfig.remove.content}</div>,
        okType: 'danger',
        onOk() {
          return new Promise(async (resolve, reject) => {
            let response = await apiEquipmentGroup.delete(record.id);
            if (requestIsSuccess(response)) {
              _this.refresh();
              setTimeout(resolve, 100);
            } else {
              setTimeout(reject, 100);
            }
          });
        },
        onCancel() { },
      });
    },
    // 树展开事件
    onExpand(expandedKeys, { expanded, node }) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
      this.onLoadData(node);
    },
    // 页面刷新
    async refresh(data) {
      //修改数据时候的页面刷新
      if (data != undefined) {
        if (data == 'Add') {
          // 给树的根节点添加子节点
          if (this.record != null) {
            //分两种情况：1、当前树已经存在子级。
            if (this.record && this.record.dataRef && this.record.dataRef.children) {
              this.record.dataRef.children = [];
            }
            // 2、当前树不存在子级
            if (this.record && this.record.children == null) {
              this.putEquipmentGroupsChildren(this.equipmentGroups);
              this.putEquipmentGroupsChildren(this.equipmentGroupsFlat);
            }
            this.onLoadData(this.record);
          } else {
            this.expandedKeys = [];
            this.loadByParentId();
          }
        } else {
          if (this.equipmentGroupsFlat.some(item => item.id == data.id)) {
            this.equipmentGroupsFlat.map(item => {
              if (item.id == data.id) {
                item.name = data.name;
                item.order = data.order;
                item.organizationId = data.organizationId;
                item.parentId = data.parentId;
              }
            });
          }
        }
      }
      //删除数据之后的页面刷新
      if (data == undefined) {

        this.getEquipmentGroups(this.equipmentGroups);
        this.getEquipmentGroups(this.equipmentGroupsFlat);
        this.delateEquipmentGroupsChildren(this.equipmentGroups, this.parentId);
        this.delateEquipmentGroupsChildren(this.equipmentGroupsFlat, this.parentId);
        this.$emit('record', null);
      }
    },
    async refreshByParentId(data) {
      this.getRecordByParentId(this.equipmentGroups, data);
      let valueSourse = {};
      if (this.getRecord) {
        valueSourse.dataRef = this.getRecord;
        this.onLoadData(valueSourse);
      }

    },
    //根据传过来的parentId找到当前记录
    getRecordByParentId(array, data) {
      try {
        array.forEach((item, index, arr) => {
          if (item && data && item.id == data.parentId) {
            this.getRecord = item;
            //判断下面是否有子节点
            if (data && data.length == 0) {
              item.children = null;
              item.isLeaf = true;
            } else {
              item.children = [];
              item.isLeaf = false;
            }
            throw new Error("error");
          }
          if (item && item.children != null) {
            this.getRecordByParentId(item.children, data);
          }
        });
      }
      catch (e) {
        if (e.message != "error") throw e;
      }
    },
    // 删除当前记录（循环数组中的数组）
    getEquipmentGroups(array) {
      try {
        array.forEach((item, index, arr) => {
          if (item.key == this.record.key) {
            arr.splice(index, 1);
            this.parentId = item.parentId;
            throw new Error("error");
          }
          if (item.children != null) {
            this.getEquipmentGroups(item.children);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      }
    },
    // 给添加的根节点的树添加一个孩子节点
    putEquipmentGroupsChildren(array) {
      try {
        array.forEach((item, index, arr) => {
          if (item.key == this.record.key) {
            item.children = [];
            item.isLeaf = false;
            throw new Error("error");
          }
          if (item.children != null) {
            this.putEquipmentGroupsChildren(item.children);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      };
    },
    //当删除数据后。若无孩子节点，需要删除children和isleaf状态
    delateEquipmentGroupsChildren(array, id) {
      try {
        array.forEach((item, index, arr) => {
          if (item.id == id) {
            if (item.children != null && item.children.length < 1) {
              item.children = null;
              item.isLeaf = true;
            }
            throw new Error("error");
          }
          if (item.children != null) {
            this.delateEquipmentGroupsChildren(item.children, id);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      };
    },

    async fileSelected(file) {
      // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter = {
        'file.file': file,
        'importKey': 'equipmentGroup',
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
    },

    async upload() {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.fileList[0]);
      let response = await apiEquipmentGroup.upLoad(formData);
      this.fileList = [];
      this.isLoading = false;
      if (requestIsSuccess(response)) {
        if (response.data) {
          this.$info({
            title: '用户数据导入结果',
            width: 600,
            content: (
              <a-row>
                <a-col span="22">
                  <a-textarea readOnly rows="14" value={response.data} />
                </a-col>
                <a-col span="2"></a-col>
              </a-row>
            ),
          });
        }
        this.refresh();
      }
    },
    // 搜索事件
    async onSearch(value) {
      this.loading = true;
      this.expandedKeys = [];
      if (!value) {
        await this.loadByParentId();
      } else {
        let data = {
          name: value,
        };
        await this.loadByParentId(data);
      }
      this.$emit('record', null);
      this.loading = false;

    },
  },


  render() {
    return (
      <div class="sm-resouce-equipment-group-tree">
        <a-card title="分类列表" class="tree-card">
          <a slot="extra"
            onClick={() => { this.expandedKeys = []; }} style="margin-right:20px">
            <a-tooltip placement="top" title="收起"><si-top size={26} /> </a-tooltip>
          </a>
          {vIf(
            <a slot="extra"
              onClick={() => { this.add(); }}>
              <a-tooltip placement="top" title="添加"><si-add-select size={22} /> </a-tooltip>
            </a>,
            vP(this.permissions, permissionsSmResource.EquipmentGroups.Create),
          )}

          <div class="tree-body">
            <div class="std-tree" >
              <div class="std-tree-body">
                <a-tree
                  expandedKeys={this.expandedKeys}
                  // blockNode
                  autoExpandParent={this.autoExpandParent}
                  treeData={this.equipmentGroups}
                  onExpand={this.onExpand}
                  loadData={this.onLoadData}
                  {...{
                    scopedSlots: {
                      title: (record) => {
                        let title = record.name;
                        return [
                          <div class="categoryIcon" onClick={() => { this.view(record); }}>
                            <span class='title'  >
                              {title}
                            </span>
                            <span class="icons">
                              {vIf(
                                <span class="icon" onClick={() => { this.add(record); }}>
                                  <a-tooltip placement="top" title="添加">
                                    <si-add-select />
                                  </a-tooltip>
                                </span>,
                                vP(this.permissions, permissionsSmResource.EquipmentGroups.Create),
                              )}

                              {vIf(
                                <span class="icon" onClick={() => { this.edit(record); }}>
                                  <a-tooltip placement="top" title="修改">
                                    <si-editor />
                                  </a-tooltip>
                                </span>,
                                vP(this.permissions, permissionsSmResource.EquipmentGroups.Update),
                              )}

                              {vIf(
                                <span class="icon" onClick={() => { this.remove(record); }}>
                                  <a-tooltip placement="top" title="删除">
                                    <si-ashbin />
                                  </a-tooltip>
                                </span>,
                                vP(this.permissions, permissionsSmResource.EquipmentGroups.Delete),
                              )}
                            </span>
                          </div>,
                        ];
                      },
                    },
                  }}
                >
                </a-tree>
              </div>
              <div class="std-tree-search">
                <a-input-search placeholder="请输入设备分组名" loading={this.loading} enter-button  onSearch={item => this.onSearch(item)} />
              </div>
              <div class="importOrExport">
                {vIf(
                  <div class="import">
                    <SmImport
                      ref="smImport"
                      url='api/app/resourceEquipmentGroup/upload'
                      axios={this.axios}
                      downloadErrorFile={true}
                      importKey="equipmentGroup"
                      onSelected={file => this.fileSelected(file)}
                      onIsSuccess={() => this.loadByParentId()}
                    />
                  </div>,
                  vP(this.permissions, permissionsSmResource.EquipmentGroups.Import),
                )}
                {vIf(
                  <SmExport
                    url='api/app/resourceEquipmentGroup/export'
                    defaultTitle="导出"
                    axios={this.axios}
                    templateName="equipmentGroups"
                    downloadFileName="设备分组"
                    rowIndex={2}
                  />,
                  vP(this.permissions, permissionsSmResource.EquipmentGroups.Export),
                )}
              </div>
              {vIf(
                <SmTemplateDownload
                  axios={this.axios}
                  width="290px"
                  downloadKey="equipmentGroups"
                  downloadFileName="设备分组"
                >
                </SmTemplateDownload>,
                vP(this.permissions,permissionsSmResource.EquipmentGroups.Import),
              )}
            </div>
          </div>
        </a-card>

        {/* 添加/编辑模板 */}
        <SmResourceEquipmentGroupModel
          ref="SmResourceEquipmentGroupModel"
          axios={this.axios}
          onSuccess={data => {
            this.refresh(data);
          }}
        />
      </div >
    );
  },
};