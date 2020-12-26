<cn>
#### 单文件导入
</cn>

<us>
#### 单文件导入
</us>

```tpl
<template>
  <div>
    <sm-import ref="smImport" :url="url" :axios="axios" importKey="test" :downloadErrorFile="true" @selected="fileSelected" @success="success"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      url:'/api/app/resourceEquipment/engineeringDataImport' // 测试地址为设备导入地址
    }
  },
  created(){
  },
  methods: {
    async fileSelected(file){
       // 构造导入参数（根据自己后台方法的实际参数进行构造）
      let importParamter={
        'file.file':file,
        'importKey':'engineringEquipment',
        'type': 0
      } 
      // 执行文件上传    
      await this.$refs.smImport.exect(importParamter);
    },
    success(){
      // 上传完成提示
      console.log("文件上传完成");
    }
  }
}
</script>
```
