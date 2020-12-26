<cn>
#### 多导入模板下载
</cn>

<us>
#### 多导入模板下载
</us>

```tpl
<template>
  <div>
    <sm-import-template :axios="axios" importKey="test" :downloadErrorFile="true" @selected="fileSelected"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios
    }
  },
  created(){
  },
  methods: {
    async fileSelected(file){
      const formData = new FormData();
      formData.set('file', file);
      formData.set('importKey', 'test');
      formData.set('type', 0);
      var resp= await this.upload(formData);
    },
    async upload(data){
      return await this.axios({
      url: `/api/app/resourceEquipment/engineeringDataImport`,
      method: 'post',
      data,
    });
  }
  }
}
</script>
```
