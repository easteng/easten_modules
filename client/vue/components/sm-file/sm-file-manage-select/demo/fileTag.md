<cn>
#### 标签模式
</cn>

<us>
#### 标签模式
</us>

```tpl
<template>
  <div>
    <div>
      <sm-file-tag
      :url="url"
      :fileName='fileName'
      :fileType='fileType'
      />
    </div>
    <div></div>
  </div>
</template>
<script>
import SmFileTag from '../../sm-file-tag'
export default {
  components:{
    SmFileTag
  },
  data(){
    return {
     url: "http://localhost:9000/public/2020/07/37772156-43c0-faa4-19fe-39f65eecd58e.jpg",
     fileName:"表设计",
     fileType:".jpg"
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
