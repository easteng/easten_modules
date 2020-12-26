<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-resource-store-house-tree-select :axios="axios" v-model="value" />
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      value: '',
      axios
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
