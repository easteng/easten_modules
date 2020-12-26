<cn>
#### 多文件导出
</cn>

<us>
#### 多文件导出
</us>

```tpl
<template>
  <div>
    <sm-export :axios="axios" importKey="test" :downloadErrorFile="true"/>
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
