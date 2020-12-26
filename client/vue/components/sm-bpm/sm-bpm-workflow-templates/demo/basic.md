<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-bpm-workflow-templates :axios="axios" @view="onView" @edit="onEdit" :permissions="getPermissions()"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js'

export default {
  data(){
    return {
      axios
    }
  },
  created(){
  },
  methods: {
    getPermissions,
    onView(id){
      console.log('onView',id)
      this.$message.info(`onView: ${id}`)
    },
    onEdit(id){
      console.log('onEdit',id)
      this.$message.info(`onEdit: ${id}`)
    },
  }
}
</script>
```
