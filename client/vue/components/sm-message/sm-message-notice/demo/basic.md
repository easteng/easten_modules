<cn>
#### 通知消息
</cn>

<us>
#### 通知消息
</us>

```tpl
<template>
  <div>
    <sm-message-notice :signalr="signalr"/>
  </div>
</template>
<script>
import signalr from '@/utils/signalr.js'

export default {
  data(){
    return {signalr}
  },
  created(){
  },
  methods: {}
}
</script>
```
