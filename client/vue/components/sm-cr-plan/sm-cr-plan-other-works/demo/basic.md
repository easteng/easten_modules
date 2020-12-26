<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-cr-plan-other-works :axios="axios" :permissions="getPermissions()"/>
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
    }
  },
  created(){
  },
  methods: {decline () {
      let count = this.count - 1
      if (count < 0) {
        count = 0
      }
      this.count = count
    },
    increase () {
      this.count++
    },
    getPermissions,
  }
}
</script>
```
