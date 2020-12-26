<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="onClick">修改密码</a-button>
    <sm-system-user-change-password  v-model="visible" :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      visible: false,
      axios
    }
  },
  created(){
  },
  methods: {
    onClick(){
      this.visible = true
    }
  }
}
</script>
```
