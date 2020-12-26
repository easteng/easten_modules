import './style/index';
import moment from 'moment';
import { getUpTreeParents } from '../../_utils/tree_array_tools';

import { pagination as paginationConfig, tips as tipsConfig } from '../../_utils/config';
import { ModalStatus } from '../../_utils/enum';
export default {
  name: 'SmResourceStoreEquipmentTransferModel',
  props: {
    axios: { type: Function, default: null },
  },
  data() {
    return {
      status: ModalStatus.Hide, // 模态框状态
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      dataSource: [],
      productCategoryName: '',
    };
  },
  computed: {
    visible() {
      // 计算模态框的显示变量k
      return this.status !== ModalStatus.Hide;
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '产品分类',
          ellipsis: true,
          dataIndex: 'productCategory',
          scopedSlots: { customRender: 'productCategory' },
        },
        {
          title: '规格',
          ellipsis: true,
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '库存编号',
          dataIndex: 'code',
          ellipsis: true,
          scopedSlots: { customRender: 'code' },
        },
        {
          title: '厂家名称',
          dataIndex: 'factory',
          ellipsis: true,
          scopedSlots: { customRender: 'factory' },
        },
        {
          title: '出厂日期',
          ellipsis: true,
          dataIndex: 'creationTime',
          scopedSlots: { customRender: 'creationTime' },
        },
      ];
    },
  },
  async created() {
  },
  methods: {
    // 关闭模态框
    close() {
      this.status = ModalStatus.Hide;
      this.loading = false;
    },
    // 详情
    async view(record) {
      this.status = ModalStatus.View;
      this.dataSource = record.storeEquipmentTransferRltEquipments;
    },
    // 数据提交
    ok() {
      this.close();
      this.loading = false;
    },
    getProductCategory(data) {
      //  console.log(data);

      let productCategoryName = '';
      if (data && data.parent) {
        this.getProductCategory(data.parent);
      }
      else {
        productCategoryName = data.name;
        console.log(productCategoryName);
      }
      return productCategoryName;
    },
    //切换页码
    async onPageChange(page, pageSize) {
      this.pageIndex = page;
      this.pageSize = pageSize;
    },
  },
  render() {
    return (
      <a-modal
        title={`设备列表`}
        visible={this.visible}
        onCancel={this.close}
        confirmLoading={this.loading}
        okText="确定"
        onOk={
          this.ok
        }
        width={1000}
      >
        <a-form form={this.form}>

          <a-form-item class="a-form-item-labe"  >
            <a-table
              columns={this.columns}
              rowKey={record => record.id}
              dataSource={this.dataSource}
              bordered={false}

              loading={this.loading}
              pagination={{
                showTotal: paginationConfig.showTotal,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: this.pageSize,
                current: this.pageIndex,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageChange,
              }}
              {...{
                scopedSlots: {
                  index: (text, record, index) => {

                    let result = index + 1 + this.pageSize * (this.pageIndex - 1);
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                  productCategory: (text, record, index) => {
                    let parents = getUpTreeParents(record.storeEquipment.productCategory);
                    let names = record.storeEquipment.productCategory.parent ? parents.map(item => item.name).reverse().join(' / ') : record.storeEquipment.productCategory.name;
                    return <a-tooltip title={names}>{names}</a-tooltip>;
                  },
                  specification: (text, record, index) => {
                    let result = record.storeEquipment.productCategory ? record.storeEquipment.productCategory.name : '';
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                  code: (text, record, index) => {
                    let result = record.storeEquipment ? record.storeEquipment.code : '';
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                  factory: (text, record, index) => {

                    let result = record.storeEquipment.manufacturer ? record.storeEquipment.manufacturer.name : '';
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                  creationTime: (text, record, index) => {
                    let result = record.storeEquipment.creationTime ? moment(record.storeEquipment.creationTime).format('YYYY-MM-DD') : '';
                    return <a-tooltip title={result}>{result}</a-tooltip>;
                  },
                },
              }}
            ></a-table>
          </a-form-item>

        </a-form>
      </a-modal>
    );
  },
};
