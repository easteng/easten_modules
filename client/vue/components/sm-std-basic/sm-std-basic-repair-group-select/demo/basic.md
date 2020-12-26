<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-std-basic-repair-group-select placeholder="请选择设备" :axios="axios" :value="value" @change="selected"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      count: 5,
      show: true,
      axios,
      value: 'a5d171c2-b1cb-8bc7-408b-39f6d3afdb04'
    }
  },
  created(){
  },
  methods: {
     selected(v){
       console.log(v);
     }
  }
}
</script>
```
