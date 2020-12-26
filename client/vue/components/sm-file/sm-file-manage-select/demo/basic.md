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
      value:[{
      id: "9b497f90-d17b-f847-1ad6-e6a054e8f515",
      name: "测试文件",
      permission: Object,
      resourceType: 2,
      size: 20,
      type: ".txt",
      url: "/2020/08/155e9d08-8bab-d1dd-f550-39f6e885d990.txt"
     }],
     multiple:true,
     axios,
     disabled:false
    }
  },
  created(){
  },
  methods: {
    change(value){
      console.log(value)
    this.value=value;
    }
  }
}
</script>
```
