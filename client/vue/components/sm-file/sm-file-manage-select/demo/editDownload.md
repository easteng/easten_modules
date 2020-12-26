<cn>
#### 编辑状态启用下载
</cn>

<us>
#### 编辑状态启用下载
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
      :enableDownload="enableDownload"
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
      id: "109bcd59-412c-265a-50ea-bdcdd2335b7f",
      name: "表设计",
      type: ".jpg",
      url: "http://172.16.1.22:9000/public/2020/07/2adc05fc-ceec-9f74-fcca-39f66463e6f9.jpg"
     }],
     multiple:true,
     axios,
     disabled:false,
     enableDownload:true,
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
