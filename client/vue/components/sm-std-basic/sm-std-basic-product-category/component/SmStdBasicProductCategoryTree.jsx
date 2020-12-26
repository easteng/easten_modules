import { tips as tipsConfig } from '../../../_utils/config';
import ApiProductCategory from '../../../sm-api/sm-std-basic/ProductCategory';
import SmStdBasicProductCategoryModel from './SmStdBasicProductCategoryModel';
import { requestIsSuccess, vP, vIf } from '../../../_utils/utils';
import { treeArrayItemAddProps, treeArrayToFlatArray } from '../../../_utils/tree_array_tools';
import permissionsSmStdBasic from '../../../_permissions/sm-std-basic';
import SmImport from '../../../sm-import/sm-import-basic';
import SmTemplateDownload from '../../../sm-common/sm-import-template-module';
import SmExport from '../../../sm-common/sm-export-module';
import '../style/index';

let apiProductCategory = new ApiProductCategory();
export default {

  name: 'SmStdBasicProductCategoryTree',
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
      productCategories: [], // 列表数据源
      searchValue: '',
      autoExpandParent: true,
      record: null,//当前树节点的记录
      parentId: null,//当前记录的父节点
      fileList: [],
      expandedKeys: [],//展开的树节点
      loading:false,
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
      apiProductCategory = new ApiProductCategory(this.axios);
    },
    //初始化页面加载数据
    async loadByParentId(data) {
      let response = await apiProductCategory.getList({
        parentId: null,
        ids: [],
        keyWords: data ? data.keyWords ? data.keyWords : '' : '',
        isAll: true,
      });
      if (requestIsSuccess(response) && response.data && response.data.items) {
        let _productCategories = treeArrayItemAddProps(response.data.items, 'children', [
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
        this.productCategories = _productCategories;
      }
    },

    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode && treeNode.dataRef && treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiProductCategory.getList({ parentId: treeNode.dataRef.value, ids: [], isAll: true });
        if (requestIsSuccess(response) && response.data && response.data.items) {
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
      this.$refs.SmStdBasicProductCategoryModel.add(record);
    },
    // 查看
    view(record) {
      this.$emit('record', record);
    },
    //编辑
    edit(record) {
      this.record = record;
      this.$refs.SmStdBasicProductCategoryModel.edit(record);
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
            let response = await apiProductCategory.delete(record.id);
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
              this.putProductCategoriesChildren(this.productCategories);
            }
            this.onLoadData(this.record);
          } else {
            this.expandedKeys = [];
            this.loadByParentId();
          }
        } else {
          // 查询当前记录,进行修改
          let response = await apiProductCategory.get(data.id);
          if (requestIsSuccess(response) && response.data) {
            let dataResult=response.data;
            await this.editTreeData(this.productCategories,dataResult);
          }
        }
      }
      //删除数据之后的页面刷新
      if (data == undefined) {
        this.getProductCategories(this.productCategories);
        this.delateProductCategoriesChildren(this.productCategories, this.parentId);
        this.$emit('record', null);
      }
    },
    async refreshByParentId(data) {
      this.getRecordByParentId(this.productCategories, data);
      let valueSourse = {};
      if (this.getRecord) {
        valueSourse.dataRef = this.getRecord;
        this.onLoadData(valueSourse);
      }

    },
    //修改树结构的数据
    editTreeData(array, data) {
      try {
        array.forEach((item, index, arr) => {
          if (array.some(item => item.id == data.id)) {
            array.map(item => {
              if (item.id == data.id) {
                item.code = data.code;
                item.name = data.name;
                item.extendCode = data.extendCode;
                item.extendName = data.extendName;
                item.levelName = data.levelName;
                item.parentId = data.parentId;
                item.remark = data.remark;
                item.unit = data.unit;
              }
            });
            throw new Error("error");
          }

          if (item && item.children != null) {
            this.editTreeData(item.children, data);
          }
        });
      }
      catch (e) {
        if (e.message != "error") throw e;
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
    getProductCategories(array) {
      try {
        array.forEach((item, index, arr) => {
          if (item.key == this.record.key) {
            arr.splice(index, 1);
            this.parentId = item.parentId;
            throw new Error("error");
          }
          if (item.children != null) {
            this.getProductCategories(item.children);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      }
    },
    // 给添加的根节点的树添加一个孩子节点
    putProductCategoriesChildren(array) {
      try {
        array.forEach((item, index, arr) => {
          if (item.key == this.record.key) {
            item.children = [];
            item.isLeaf = false;
            throw new Error("error");
          }
          if (item.children != null) {
            this.putProductCategoriesChildren(item.children);
          }
        });
      } catch (e) {
        if (e.message != "error") throw e;
      };
    },
    //当删除数据后。若无孩子节点，需要删除children和isleaf状态
    delateProductCategoriesChildren(array, id) {
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
            this.delateProductCategoriesChildren(item.children, id);
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
        'importKey': 'productCategories',
      };
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
    },

    // 搜索事件
    async onSearch(value) {
      this.loading=true;
      this.expandedKeys = [];
      if (!value) {
        await this.loadByParentId();
      } else {
        let data = {
          keyWords: value,
        };
        await this.loadByParentId(data);
      }
      this.$emit('record', null);
      this.loading=false;
    },
  },
  render() {
    return (
      <div class="sm-std-basic-product-category-tree">
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
            vP(this.permissions, permissionsSmStdBasic.ProductCategories.Create) ,
          )}

          <div class="tree-body">
            <div class="std-tree" >
              <div class="std-tree-body">
                <a-tree
                  expandedKeys={this.expandedKeys}
                  // blockNode
                  autoExpandParent={this.autoExpandParent}
                  treeData={this.productCategories}
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
                                vP(this.permissions, permissionsSmStdBasic.ProductCategories.Create) ,
                              )}

                              {vIf(
                                <span class="icon" onClick={() => { this.edit(record); }}>
                                  <a-tooltip placement="top" title="修改">
                                    <si-editor />
                                  </a-tooltip>
                                </span>,
                                vP(this.permissions, permissionsSmStdBasic.ProductCategories.Update) ,
                              )}

                              {vIf(
                                <span class="icon" onClick={() => { this.remove(record); }}>
                                  <a-tooltip placement="top" title="删除">
                                    <si-ashbin />
                                  </a-tooltip>
                                </span>,
                                vP(this.permissions, permissionsSmStdBasic.ProductCategories.Delete) ,
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
                <a-input-search placeholder="请输入产品名称或产品编码" loading={this.loading} enter-button  onSearch={item => this.onSearch(item)} />
              </div>
                
              <div class="importOrExport">
                {vIf(
                  <div class="import">
                    <SmImport
                      ref="smImport"
                      url='api/app/stdBasicProductCategory/upload'
                      axios={this.axios}
                      downloadErrorFile={true}
                      importKey="productCategories"
                      onSelected={file => this.fileSelected(file)}
                      onIsSuccess={() => this.loadByParentId()}
                    />
                  </div>,
                  vP(this.permissions, permissionsSmStdBasic.ProductCategories.Import),
                )}
                {vIf(
                  <SmExport
                    url='api/app/stdBasicProductCategory/export'
                    defaultTitle="导出"
                    axios={this.axios}
                    templateName="productCategory"
                    downloadFileName="产品分类"
                    rowIndex={2}
                  >
                  </SmExport>,
                  vP(this.permissions,permissionsSmStdBasic.ProductCategories.Export),
                )}
              </div>
              {vIf(
                <div class="import">
                  <SmTemplateDownload
                    axios={this.axios}
                    width="290px"
                    downloadKey="productCategory"
                    downloadFileName="产品分类"
                  >
                  </SmTemplateDownload>,
                </div>,
                vP(this.permissions,permissionsSmStdBasic.ProductCategories.Import),
              )}
            </div>
          </div>
        </a-card>

        {/* 添加/编辑模板 */}
        <SmStdBasicProductCategoryModel
          ref="SmStdBasicProductCategoryModel"
          axios={this.axios}
          onSuccess={data => {
            this.refresh(data);
          }}
        />
      </div >
    );
  },
};