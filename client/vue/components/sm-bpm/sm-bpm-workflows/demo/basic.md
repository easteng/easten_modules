<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-bpm-workflows :axios="axios" @view="onView" @success="onSuccess"/>
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
    onSuccess(isInitial){
      console.log('onSuccess',isInitial)
      this.$message.info(`onSuccess: ${isInitial}`)
    },
  }
}
</script>
```
