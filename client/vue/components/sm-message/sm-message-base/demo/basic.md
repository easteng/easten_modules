<cn>
#### 通知消息
</cn>

<us>
#### 通知消息
</us>

```tpl
<template>
  <div>
    <sm-message :axios="axios"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {axios}
  },
  created(){
  },
  methods: {}
}
</script>
```
