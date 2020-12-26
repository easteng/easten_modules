<cn>
#### 自动初始化
</cn>

<us>
#### 自动初始化
</us>

```tpl
<template>
  <div>
    {{value}}
    <sm-system-organization-tree-select :axios="axios"    v-model="value" autoInitial />
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
      value:null
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
