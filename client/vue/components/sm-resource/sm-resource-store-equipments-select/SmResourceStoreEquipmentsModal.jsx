import './style/index.less';
import { requestIsSuccess, getStoreEquipmentState } from '../../_utils/utils';
import ApiStoreEquipment from '../../sm-api/sm-resource/StoreEquipments';
import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import SmResourceStoreEquipments from '../sm-resource-store-equipments/SmResourceStoreEquipments';
let apiStoreEquipment = new ApiStoreEquipment();

export default {
  name: 'SmResourceStoreEquipmentsModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    disabledSatet: { type: Number, default: null }, // 禁用待检设备状态栏
    axios: { type: Function, default: null },
    visible: { type: Boolean, default: false },
    placeholder: { type: String, default: '点击选择库存设备' },
    value: { type: [String, Array], default: null },//已选项
    multiple: { type: Boolean, default: false }, // 是否多选'checkbox'|'radio'
  },
  data() {
    return {
      stateDisabled: false,
      selectedStoreEquipments: [],
      iValue: null,
      totalCount: 0,
      pageIndex: 1,
      iVisible: false,
      storeEquipments: [], //数据存储
      columns: [{
        title: '序号',
        dataIndex: 'index',
        scopedSlots: { customRender: 'index' },
        width: 90,
        ellipsis: true,
      },
      {
        title: '产品分类',
        dataIndex: 'productCategory',
        scopedSlots: { customRender: 'productCategory' },
        width: 200,
        ellipsis: true,
      },
      {
        title: '规格',
        dataIndex: 'model',
        scopedSlots: { customRender: 'model' },
        width: 150,
        ellipsis: true,
      },
      {
        title: '库存编号',
        dataIndex: 'code',
        scopedSlots: { customRender: 'code' },
        width: 150,
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'state',
        scopedSlots: { customRender: 'state' },
        ellipsis: true,
        width: 100,
      },
      {
        title: '厂家名称',
        dataIndex: 'manufacturerName',
        scopedSlots: { customRender: 'manufacturerName' },
        ellipsis: true,
        width: 150,
      }],
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
      },
    };
  },

  computed: {

    tags() {
      return this.selectedStoreEquipments;
    },
  },

  watch: {
    value: {
      handler: function (value) {
        this.iValue = value;
        this.initStoreEquipment();
      },
      immediate: true,
    },

    visible: {
      handler: function (value, oldValue) {
        this.iVisible = value;
      },
      // immediate: true,
    },
    disabledSatet: {
      handler: function (value, oldValue) {
        this.stateDisabled = value;
      },
      immediate: true,
    },

  },

  async created() {
    this.initAxios();
    // this.refresh();
  },

  methods: {
    initAxios() {
      apiStoreEquipment = new ApiStoreEquipment(this.axios);
    },

    //已选库存设备数据初始化
    async initStoreEquipment() {
      let _selectedStoreEquipments = [];
      if (this.iValue && this.iValue.length > 0 && this.multiple) {

        let response = await apiStoreEquipment.getListByIds(this.iValue);
        if (requestIsSuccess(response)) {
          _selectedStoreEquipments = response.data.items.map(item => item);
        }
      } else {
        this.iValue.map(async id => {
          if (id) {
            let response = await apiStoreEquipment.getListByIds(id);
            if (requestIsSuccess(response)) {
              _selectedStoreEquipments.push(response.data.items[0]);
            }
          }
        });
      }
      this.selectedStoreEquipments = _selectedStoreEquipments;
    },

    onRefresh(value) {
      this.storeEquipments = value;
    },

    onOk() {
      this.$emit('ok', this.iValue);
      this.onClose();
    },

    onClose() {
      this.$emit('change', false);
    },

    //更新所选厂家列表
    updateSelected() {
      // 过滤出其他页面已经选中的
      let _selected = [];
      for (let item of this.selectedStoreEquipments) {
        let target = this.storeEquipments.find(subItem => subItem.id === item.id);
        if (!target) {
          _selected.push(item);
        }
      }

      // 把当前页面选中的加入
      for (let id of this.iValue) {
        let storeEquipment = this.storeEquipments.find(item => item.id === id);
        if (!!storeEquipment) {
          _selected.push(JSON.parse(JSON.stringify(storeEquipment)));
        }
      }
      this.selectedStoreEquipments = _selected;
    },
  },

  render() {
    return (
      <a-modal
        width={1300}
        title="库存设备选择"
        class="sm-resource-storeEquipmentsSelect-modal"
        visible={this.visible}
        onOk={this.onOk}
        onCancel={this.onClose}
      >
        {/* 上方选择框 */}
        <div class="selected" flex-direction='column' >
          {this.tags && this.tags.length > 0 ? (
            this.tags.map(item => {
              return <div class="selected-item" width="15%" float="left">
                <a-icon style={{ color: '#B4EEB4' }} type={'project'} />
                <span class="selected-name"> {item ? item.name : null} </span>
                <span
                  class="btn-close"
                  onClick={() => {
                    this.$nextTick(() => {
                      this.iValue = this.iValue.filter(id => id !== item.id);
                      this.$emit('ok', this.iValue);
                      this.selectedStoreEquipments = this.selectedStoreEquipments.filter(_item => _item.id !== item.id);
                    });
                  }}
                >
                  <a-icon type="close" />
                </span>
              </div>;
            })

          ) : (
              <span style="margin-left:10px;">请选择库存设备</span>
            )}
        </div>

        {/* 下方表格显示区域 */}
        <div class="selectedStoreEquipments-list">
          <div>
            <SmResourceStoreEquipments
              ref='SmResourceStoreEquipments'
              axios={this.axios}
              height={450}
              onRefresh={this.onRefresh}
              disabled={this.stateDisabled}
              columns={this.columns}
              rowSelection={{
                type: this.multiple ? 'checkbox' : 'radio',
                columnWidth: 30,
                selectedRowKeys: this.iValue,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.iValue = selectedRowKeys;
                  if (this.multiple) {
                    this.updateSelected();
                  } else {
                    this.selectedStoreEquipments = selectedRows;
                  }
                },
              }}
            />
          </div>
        </div>
      </a-modal>
    );
  },
};
