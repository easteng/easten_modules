<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="()=>{visible = true}">打开机房选择</a-button>
    <sm-basic-installation-site-modal :selected="selected" @ok="(value)=>{this.selected = value}" v-model="visible" :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      visible: false,
      selected: '',
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
