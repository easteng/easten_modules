import { requestIsSuccess, getStoreEquipmentState } from '../../_utils/utils';
import { StoreEquipmentState } from '../../_utils/enum';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import './style/index.less';
import StoreHouseTreeSelect from '../sm-resource-store-house-tree-select';//仓库的树结构
import moment from 'moment';
import StoreEquipmentsModal from './SmResourceStoreEquipmentsModal';
import ApiStoreEquipment from '../../sm-api/sm-resource/StoreEquipments';
import OrganizationTreeSelect from '../../sm-system/sm-system-organization-tree-select';
import { getUpTreeParents, treeArrayItemAddProps, treeArrayToFlatArray } from '../../_utils/tree_array_tools';
import ApiProductCategory from '../../sm-api/sm-std-basic/ProductCategory';
let apiStoreEquipment = new ApiStoreEquipment();
let apiProductCategory = new ApiProductCategory();

export default {
  name: 'SmResourceStoreEquipments',
  props: {
    axios: { type: Function, default: null },
    height: { type: Number, default: 515 },
    // dataSource: {type:Array,default:null},
    columns: { type: Array, default: null },
    rowSelection: { type: Object, default: null },
    disabled: { type: Number, default: null }, // 禁用待检设备状态栏
    modalState: { type: Boolean, default: false },//禁用模态框

    isSpareParts: { type: Boolean, default: false },//是否是备品信息
  },
  data() {
    return {
      storeEquipments: [], //数据存储
      expandedKeys: [],
      iValue: null,
      iProductCategoryValue: null,
      iModalState: false,
      storeEquipmentsState: null,
      loading: false,
      tableColumns: [],
      tableRowSelection: null,
      totalCount: 0,
      productCategories: null,
      pageIndex: 1,
      questionConfigue: [],
      queryParams: {
        code: undefined, // 库存编号搜索
        productCategoryId: null,//产品分类的Id
        organizationId: null,//组织机构id
        storeHouseId: null,//仓库的id
        state: null,//状态
        maxResultCount: paginationConfig.defaultPageSize,
      },
    };
  },
  computed: {

  },
  watch: {
    columns: {
      handler(nVal, oVal) {
        this.tableColumns = nVal;
      },
      immediate: true,
    },
    height: {
      handler(nVal, oVal) {
        this.iHeight = nVal;
      },
      immediate: true,
    },
    rowSelection: {
      handler(nVal, oVal) {
        this.tableRowSelection = nVal;
      },
      immediate: true,
    },
    disabled: {
      handler(nVal, oVal) {
        this.storeEquipmentsState = nVal !== null ? getStoreEquipmentState(nVal) : null;
        this.queryParams.state = this.storeEquipmentsState !== null ? nVal : null;
      },
      immediate: true,
    },
    modalState: {
      handler(nVal, oVal) {
        this.iModalState = nVal;
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    this.refresh();
    this.setValue();
    this.loadByParentId();
    console.log(this.isSpareParts);
  },

  methods: {

    initAxios() {
      apiStoreEquipment = new ApiStoreEquipment(this.axios);
      apiProductCategory = new ApiProductCategory(this.axios);
    },
    async refresh(resetPage = true) {
      this.loading = true;
      if (resetPage) {
        this.pageIndex = 1;
        this.queryParams.maxResultCount = paginationConfig.defaultPageSize;
      }

      let response = await apiStoreEquipment.getList({
        skipCount: (this.pageIndex - 1) * this.queryParams.maxResultCount,
        ...this.queryParams,
      });
      if (requestIsSuccess(response) && response.data) {
        this.totalCount = response.data.totalCount;
        this.storeEquipments = response.data.items;

        this.$emit('refresh', this.storeEquipments);
      }

      this.loading = false;
    },

    view(record) {
      this.initAxios();
      this.$refs.StoreEquipmentsModal.view(record);
    },
    //初始化页面加载数据
    async loadByParentId() {
      let response = await apiProductCategory.getList({
        parentId: null,
        ids: this.value instanceof Array ? this.value : this.value ? [this.value] : [],
        isAll: true,
      });

      if (requestIsSuccess(response) && response.data.items) {
        let _productCategories = treeArrayItemAddProps(response.data.items, 'children', [
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
        this.productCategoriesFlat = treeArrayToFlatArray(_productCategories);

        this.productCategories = _productCategories;
        if (this.value) {
          this.setValue();
        }
      }
    },

    // 树展开事件
    onExpand(expandedKeys, { expanded, node }) {
      this.expandedKeys = expandedKeys;
      this.onLoadData(node);
    },

    //异步加载数据
    async onLoadData(treeNode) {
      if (treeNode.dataRef.children && treeNode.dataRef.children.length == 0) {
        let response = await apiProductCategory.getList({ parentId: treeNode.dataRef.value, ids: [], isAll: true });
        if (requestIsSuccess(response) && response.data.items) {
          this.productCategoriesFlat = this.productCategoriesFlat.concat(response.data.items);

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

    setValue() {
      if (this.treeCheckable) {
        this.iProductCategoryValue = this.value
          ? this.productCategoriesFlat
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
        this.iProductCategoryValue = this.value;
      }
    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.queryParams.maxResultCount = pageSize;
      if (page !== 0) {
        this.refresh(false);
      }
    },
  },
  render() {
    //库存设备状态枚举
    let Options = [];
    for (let item in StoreEquipmentState) {
      Options.push(
        <a-select-option key={`${StoreEquipmentState[item]}`}>
          {getStoreEquipmentState(StoreEquipmentState[item])}
        </a-select-option>,
      );
    }
    return (
      <div class="sm-resource-store-equipments" >
        {/* 操作区 */}
        <sc-table-operator
          onSearch={() => {
            this.refresh();
          }}
          onReset={() => {
            this.queryParams.code = undefined;
            this.queryParams.organizationId = null;
            this.queryParams.storeHouseId = null;
            this.queryParams.state = this.disabled ? this.disabled : null;
            this.storeEquipmentsState = null;
            this.queryParams.productCategoryId = null;
            this.expandedKeys = [];
            this.loadByParentId();
            this.refresh();
          }}
        >
          <a-form-item label="组织机构">
            <OrganizationTreeSelect
              axios={this.axios}
              treeCheckable={false}
              treeCheckStrictly={true}
              value={this.queryParams.organizationId}
              onInput={value => {
                this.queryParams.organizationId = value;
                this.queryParams.storeHouseId = this.mode === 'default' ? null : [];
                this.$emit('orgInput', value);
                this.$emit('orgChange', value);
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="仓库">
            <StoreHouseTreeSelect
              placeholder="请选择仓库"
              axios={this.axios}
              organizationId={this.queryParams.organizationId}
              value={this.queryParams.storeHouseId}
              onChange={value => {
                this.queryParams.storeHouseId = value;
                this.refresh();
              }}
            />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              placeholder="请选择状态"
              allowClear={true}
              disabled={this.disabled ? true : false}
              onChange={value => {
                this.queryParams.state = value;
                this.storeEquipmentsState = value;
                this.refresh();
              }}
            >
              {Options}
            </a-select>
          </a-form-item>

          <a-form-item label="库存编号">
            <a-input
              placeholder="请输入"
              allowClear={true}
              value={this.queryParams.code}
              onInput={event => {
                this.queryParams.code = event.target.value;
                this.refresh();
              }}
            ></a-input>
          </a-form-item>
        </sc-table-operator>
        {/* 展示区 */}
        <div class="store-equipment-tree-table">
          {!this.isSpareParts ?
            <div class="store-equipment-tree">
              <a-card class="treeCard" title={"产品分类"}>
                <a-tree
                  style={{ maxHeight: this.iHeight + 'px' }}
                  expandedKeys={this.expandedKeys}
                  onExpand={this.onExpand}
                  treeData={this.productCategories}
                  loadData={this.onLoadData}
                  {...{
                    scopedSlots: {
                      title: (record) => {
                        return (<div onClick={() => {
                          this.queryParams.productCategoryId = record.id;
                          this.iProductCategoryValue = record.id;
                          this.refresh();
                          this.setValue();
                        }}>
                          { record.name}
                        </div>);
                      },
                    },
                  }}
                />
              </a-card>

            </div> : undefined}
          <div class="store-equipment-table">
            <a-card class="equipment-card-body">
              <a-table
                columns={this.tableColumns}
                dataSource={this.storeEquipments}
                rowKey={record => record.id}
                loading={this.loading}
                pagination={false}
                rowSelection={this.tableRowSelection}
                {...{
                  scopedSlots: {
                    index: (text, record, index) => {
                      let str = index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
                      return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>;
                    },
                    productCategory: (text, record) => {
                      let parents = getUpTreeParents(record.productCategory);
                      let names = record.productCategory.parent ? parents.map(item => item.name).reverse().join(' / ') : record.productCategory.name;
                      return <a-tooltip placement="topLeft" title={names}>{names}</a-tooltip>;
                    },
                    model: (text, record) => {
                      let str = record.productCategory ? record.productCategory.name : '';
                      return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>;
                    },
                    code: (text, record) => {
                      let str = text;
                      return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>;
                    },
                    state: (text, record) => {
                      return getStoreEquipmentState(record.state);
                    },
                    manufacturerName: (text, record) => {
                      let str = record.manufacturer ? record.manufacturer.name : '';
                      return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>;
                    },

                    manufactureDate: (text, record) => {
                      let str = text ? moment(text).format('YYYY-MM-DD') : '';
                      return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>;
                    },
                    inboundDate: (text, record) => {
                      let date = record.storeEquipmentTransfer.length > 0 ? record.storeEquipmentTransfer[0].creationTime : "";
                      let str = date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
                      return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>;
                    },
                    userName: (text, record) => {
                      let userName = '';
                      if (record.storeEquipmentTransfer.length > 0) {
                        if (record.storeEquipmentTransfer[0].userName) {
                          userName = record.storeEquipmentTransfer[0].userName;
                        } else {
                          userName = record.storeEquipmentTransfer[0].user ? record.storeEquipmentTransfer[0].user.name : '';
                        }
                      }
                      return <a-tooltip placement="topLeft" title={userName}>{userName}</a-tooltip>;
                    },
                    operations: (text, record) => {
                      return [
                        <span>
                          <a
                            onClick={() => {
                              this.view(record);
                            }}
                          >
                            履历
                          </a>
                        </span>,
                      ];
                    },
                  },
                }}
              ></a-table>
              {/* <a-card class="table-card"> */}
              {/* 分页器 */}

              <a-pagination
                style="float:right; margin-top:10px"
                total={this.totalCount}
                pageSize={this.queryParams.maxResultCount}
                current={this.pageIndex}
                onChange={this.onPageChange}
                onShowSizeChange={this.onPageChange}
                showSizeChanger
                showQuickJumper
                showTotal={paginationConfig.showTotal}
              />

              {/* </a-card> */}
            </a-card>
          </div>
        </div >


        {
          this.iModalState ?
            (<StoreEquipmentsModal
              ref='StoreEquipmentsModal'
              axios={this.axios}
              visible={this.visible}
              isInvoke={this.visible}
              value={this.iValue}
              onSuccess={() => {
                this.refresh(false);
              }}
              onChange={v => (this.iVisible = v)}
            />) : (undefined)
        }

      </div >
    );
  },
};
