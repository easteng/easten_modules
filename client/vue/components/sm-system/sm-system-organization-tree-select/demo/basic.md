<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    {{value}}
    <sm-system-organization-tree-select 
    :axios="axios"  
    :showSearch="true"
    v-model="value" 
    />
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
      isAutoDisable:true,
      value:''
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
