<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-cr-statistics-plan-state :axios="axios" @track="onTrack"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

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
    onTrack(a,b,c,d){
      console.log(a,b,c,d)
    }
  }
}
</script>
```
