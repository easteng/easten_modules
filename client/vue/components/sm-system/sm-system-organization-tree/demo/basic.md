<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-system-organization-tree v-model="selected" :axios="axios"/>
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
      selected: ['39f778c8-ad29-baf6-7bef-dd98902a1ba3']
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
