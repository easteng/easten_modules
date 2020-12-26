<cn>
#### 单选模式
</cn>

<us>
#### 单选模式
</us>

```tpl
<template>
  <div>
    <div>
      <sm-resource-equipment-select
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
      value:'',
      multiple:false,
      axios,
      disabled:false
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
