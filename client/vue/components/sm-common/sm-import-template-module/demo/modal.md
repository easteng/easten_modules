<cn>
#### 文件下载模态框
</cn>

<us>
#### 文件下载模态框
</us>

```tpl
<template>
  <div>
    <sm-import-template  :axios="axios" btnType="primary" :downComponents="downComponents"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  components:{},
  data(){
    return {
      axios,
      downComponents:[
        {
          downloadKey:"engineeringEquipments",
          title:"工程设备导入模板下载",
          icon:"setting",
        },
        {
          downloadKey:"cabinetWiring",
          title:"机柜配线导入模板下载",
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
