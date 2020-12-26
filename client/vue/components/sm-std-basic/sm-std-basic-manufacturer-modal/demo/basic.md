<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="()=>{visible = true}">打开厂家选择</a-button>
    <sm-std-basic-manufacturer-modal :selected="selected" @ok="(value)=>{this.selected = value}" v-model="visible" :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      visible: false,
      selected: 'b2b2e8ce-ebbc-4ceb-ad1a-a6b200bf3c07',
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
