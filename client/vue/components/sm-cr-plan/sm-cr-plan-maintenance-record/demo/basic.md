<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <!-- <a-radio-group v-model="pageState" @change="onPageStateChange">
      <a-radio-button value="add">
        Add
      </a-radio-button>
      <a-radio-button value="edit">
        Edit
      </a-radio-button>
      <a-radio-button value="view">
        View
      </a-radio-button>
    </a-radio-group> -->
    <sm-cr-plan-maintenance-record
      :axios="axios"
      :organizationId="organizationId"
      :equipmentId="equipmentId"
      :repairGroupId="repairGroupId"
      :equipType="equipType"
      :equipName="equipName"
      :equipModelNumber="equipModelNumber"
      :equipModelCode="equipModelCode"
      :installationSite="installationSite"
      @ok="onOk"
      @cancel="onCancel"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      organizationId:'39f8411a-ed51-4c4d-b12a-4177c8bba861',//'74e2fdd1-51c8-4bf0-88ca-31f8c37f3a0a',
      equipmentId:'23f49a71-26f4-412c-bb9a-ba7b7a5c10f0',//'e27bd851-6655-4dfd-9e46-20286b2218f9',
      repairGroupId:'4329506b-abb5-90e1-b8eb-39f6d38a18a7',//'2aa88e32-4a99-5ed9-f5d9-39f6d3b1dce3',
      equipType: "通信线路",
      equipName: "通信线路",
      equipModelNumber: "光端机",
      equipModelCode: "EC0800624051",
      // maintenanceOrg: "选择的维护单位",
      installationSite: "西安北郊通信楼机房",
    }
  },
  created(){
  },
  methods:{
    onOk(){
      this.$message.info(`onSuccess`)
    },
    onCancel(){
      this.$message.info(`onCancel`)
    },
  }
}
</script>
```
