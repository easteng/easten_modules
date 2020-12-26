<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-system-roles :axios="axios" :permissionBlackList="permissionBlackList" :permissions="getPermissions()"/>
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
      permissionBlackList:[]
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
