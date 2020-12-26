<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-resource-store-equipments-select :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      disabled:null,
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
