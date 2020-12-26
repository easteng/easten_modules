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
      <sm-std-basic-manufacturer-select
      :axios="axios"
      v-model="value"
      @change="change"
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
      value:'64cfc3e1-bbc4-04fe-b1d7-39f70d4093bf',
      multiple:false,
      axios,
      disabled:false
    }
  },
  created(){
  },
  methods: {
    change(value){
      console.log(value);
    }
  }
}
</script>
```
