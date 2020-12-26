<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-cr-plan-month-plan :axios="axios" repairTagKey="RepairTag.RailwayHighSpeed" :permissions="getPermissions()" @change="onChange"/>
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
      axios
    }
  },
  created(){
  },
  methods: {
    getPermissions,
    onChange(type,orgId,orgName){
      console.log('onView',type)
      this.$message.info(`onView: ${type},${orgId},${orgName}`)
    }
  }
}
</script>
```
