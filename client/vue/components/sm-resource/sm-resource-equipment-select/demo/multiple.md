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
      <sm-resource-equipment-select
      :axios="axios"
      v-model="value"
      :disabled='disabled'
      :multiple='multiple'
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
      axios,
      disabled:false,
      multiple:true
    }
  },
  created(){
  },
  methods: {
  },
}
</script>
```
