<cn>
#### 多选模式
</cn>

<us>
#### 多选模式
</us>

```tpl
<template>
  <div>
    <div>
      <sm-resource-store-equipments-select
      :axios="axios"
      v-model="value"
      :multiple='multiple'
      :disabled='disabled'
      />
    </div>
    <div></div>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      value:[],
      multiple:true,
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
