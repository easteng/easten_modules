<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="()=>{visible = true}">打开文件选择框(多选模式)</a-button>
    <a-button @click="()=>{visible1 = true}">打开文件选择框(单选模式)</a-button>
    <sm-file-manage-modal
    :axios="axios"
    :selected="selected"
    @ok="ok"
    v-model="visible"
    :multiple='multiple'
    :height='height'
    :width="modalWidth"/>

     <sm-file-manage-modal
    :axios="axios"
    :selected="selected"
    @ok="ok"
    v-model="visible1"
    :multiple='multiple1'
    :height='height1'
    :width="modalWidth"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      visible:false,
      visible1:false,
      selected: [],
      modalWidth:1000,
      axios,
      multiple:true,
      multiple1:false,
      height:500,
      height1:500
    }
  },
  created(){
  },
  methods: {
    ok(v){
      console.log(v)
    }
  }
}
</script>
```
