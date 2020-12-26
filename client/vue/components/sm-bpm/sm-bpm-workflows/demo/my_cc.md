<cn>
#### 抄送我的
</cn>

<us>
#### 抄送我的
</us>

```tpl
<template>
  <div>
    <sm-bpm-workflows :axios="axios" @view="onView" :group="4"/>
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
  }
}
</script>
```
