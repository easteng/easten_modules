<cn>
#### 文件导出多选框
</cn>

<us>
#### 文件导出多选框
</us>

```tpl
<template>
  <div>
    <sm-export  :axios="axios" :exportComponents="exportComponents"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  components:{},
  data(){
    return {
      axios,
      exportComponents:[
        {
          templateName:"engineeringEquipment",
          rowIndex:1,
          title:"工程设备数据",
          icon:"setting",
        },
        {
          templateName:"cabinetWiring",
          rowIndex:1,
          title:"机柜配线数据",
          icon:"border-verticle",
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
