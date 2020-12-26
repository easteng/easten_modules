<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-std-basic-repair-group-tree-select :axios="axios" :value="value" @change="selected"/>
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
      value: ''
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
