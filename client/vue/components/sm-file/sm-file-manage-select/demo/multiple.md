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
      <sm-file-manage-select
      :axios="axios"
      :value="value"
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
      value:{
      id: "109bcd59-412c-265a-50ea-bdcdd2335b7f",
      name: "表设计",
      type: ".jpg",
      url: "http://localhost:9000/public/2020/07/37772156-43c0-faa4-19fe-39f65eecd58e.jpg"
     },
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
