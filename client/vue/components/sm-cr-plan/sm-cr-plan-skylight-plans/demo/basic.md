<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-cr-plan-skylight-plans
    :axios="axios"
    :permissions="getPermissions()"
    :planType="planType"
    repairTagKey="RepairTag.RailwayWired"
     @add="onAdd"
     @view="onView"
     @edit="onEdit"
     />
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js'

export default {
  data(){
    return {
      count: 5,
      show: true,
      axios,
      planType: 1
    }
  },
  created(){
  },
  methods: {
    getPermissions,
    onAdd(planTime,organizationId){
      console.log('onAdd',planTime)
      console.log('onAdd',organizationId)
      this.$message.info(`onAdd: ${planTime}`)
      this.$message.info(`onAdd: ${organizationId}`)
    },
   onView(id){
      console.log('onView',id)
      this.$message.info(`onView: ${id}`)
    },
    onEdit(id){
      console.log('onEdit',id)
      this.$message.info(`onEdit: ${id}`)
    }
  }
}
</script>
```
