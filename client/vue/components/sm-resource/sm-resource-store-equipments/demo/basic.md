<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-resource-store-equipments :axios="axios" :columns='columns' :modalState='modalState' :isSpareParts='isSpareParts'/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  props: {
    isSpareParts: {type:Boolean, default: false},//是否是备品信息
  },
  data(){
    return {
      axios,
      columns:[{
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: '产品分类',
          dataIndex: 'productCategory',
          scopedSlots: { customRender: 'productCategory' },
          ellipsis: true,
        },
        {
          title: '规格',
          dataIndex: 'model',
          scopedSlots: { customRender: 'model' },
          ellipsis: true,
        },
        {
          title: '库存编号',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' },
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          ellipsis: true,
          width: 80,
        },
        {
          title: '厂家名称',
          dataIndex: 'manufacturerName',
          scopedSlots: { customRender: 'manufacturerName' },
          ellipsis: true,
        },
        {
          title: '出厂日期',
          dataIndex: 'manufactureDate',
          scopedSlots: { customRender: 'manufactureDate' },
          ellipsis: true,
        },
        {
          title: '入库日期',
          dataIndex: 'inboundDate',
          scopedSlots: { customRender: 'inboundDate' },
          ellipsis: true,
        },
        {
          title: '入库人员',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operations',
          scopedSlots: { customRender: 'operations' },
          ellipsis: true,
          width: 60,
          fixed: 'right',
        },],
        modalState:true,
    }
  },
   computed: {
  },

  created(){
  },
  methods: {
  }
}
</script>
```
