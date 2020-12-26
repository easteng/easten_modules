<cn>
#### 多文件导入
</cn>

<us>
#### 多文件导入
</us>

```tpl
<template>
  <div>
    <sm-import-modal  btnType="primary" :subComponents="subComponents"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  components:{},
  data(){
    return {
      axios,
      subComponents:[
        {
          url:"/api/app/resourceEquipment/engineeringDataImport",
          importKey:"engineringEquipment",
          title:"工程设备导入",
        },
        {
          url:"http:///123123",
          importKey:"222",
          title:"机柜配线导入",
        }
      ]
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
