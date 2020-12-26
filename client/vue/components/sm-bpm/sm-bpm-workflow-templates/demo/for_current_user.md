<cn>
#### 待我发起
</cn>

<us>
#### 待我发起
</us>

```tpl
<template>
  <div>
    <sm-bpm-workflow-templates :axios="axios" @view="onView" @edit="onEdit" :forCurrentUser="true"  @success="onSuccess"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios
    }
  },
  created(){
  },
  methods: {
    onView(id){
      console.log('onView',id)
      this.$message.info(`onView: ${id}`)
    },
    onEdit(id){
      console.log('onEdit',id)
      this.$message.info(`onEdit: ${id}`)
    },
    onSuccess(isInitial){
      console.log('onSuccess',isInitial)
      this.$message.info(`onSuccess: ${isInitial}`)
    },
  }
}
</script>
```
