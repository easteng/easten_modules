<cn>
#### 多选模式
</cn>

<us>
#### 多选模式
</us>

```tpl
<template>
  <div>
    {{value}}
    <sm-system-organization-tree-select
    :axios="axios"
    multiple
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
      isAutoDisable:false,
      value:[]
      // value:[]
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
