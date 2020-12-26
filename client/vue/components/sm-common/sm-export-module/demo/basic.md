<cn>
#### 单文件导出
</cn>

<us>
#### 单文件导出
</us>

```tpl
<template>
  <div>
    <sm-export ref="smExport" :axios="axios" :templateName="templateName" :url="url" :rowIndex="rowIndex" :downloadFileName="downloadFileName" @success="success"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'
export default {
  data(){
    return {
      axios,
      templateName : 'organizations',
      url:'api/app/appOrganization/export',
      rowIndex:5,
      downloadFileName:'组织机构导出'
    }
  },
  created(){
  },
  methods: {
    success(){
      // 下载完成提示
      console.log("文件导出完成");
    }
  }
}
</script>
```
