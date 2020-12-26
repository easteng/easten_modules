<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-emerg-plans :axios="axios" :permissions="getPermissions()"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js'

export default {
  data(){
    return {
      axios
    }
  },
  created(){
  },
  methods: {
    getPermissions,
  }
}
</script>
```
