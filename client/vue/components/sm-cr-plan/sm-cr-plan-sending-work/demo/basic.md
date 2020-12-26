<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-cr-plan-sending-work :axios="axios" :permissions="getPermissions()" :operatorType="2" :sendingWorkId="sendingWorkId" @cancel="onCancel"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js'

export default {
  data(){
    return {
      count: 5,
      show: true,
      axios,
      sendingWorkId:'a7265e7c-25cf-4e34-9b03-c517c5fed206'
    }
  },
  created(){
  },
  methods: {
    getPermissions,
    decline () {
      let count = this.count - 1
      if (count < 0) {
        count = 0
      }
      this.count = count
    },
    onCancel(id){
      this.$message.info(`onCancel`)
    },
  }
}
</script>
```
