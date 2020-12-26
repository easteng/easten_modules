<cn>
#### 单导入模板下载
</cn>

<us>
#### 单导入模板下载
</us>

```tpl
<template>
  <div>
    <sm-import-template ref="smTemplateDownload" :axios="axios" :downloadKey="downloadKey" @success="success"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'
export default {
  data(){
    return {
      axios,
      downloadKey : 'users',
    }
  },
  created(){
  },
  methods: {
    success(){
      // 下载完成提示
      console.log("模板下载完成");
    }
  }
}
</script>
```
