<cn>
#### 我发起的
</cn>

<us>
#### 我发起的
</us>

```tpl
<template>
  <div>
    <sm-bpm-workflows :axios="axios" @view="onView" :group="1"/>
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
