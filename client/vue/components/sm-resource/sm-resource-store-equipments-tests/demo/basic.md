<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-resource-store-equipments-tests :permissions="getPermissions()" :axios="axios"/>
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
    getPermissions
  }
}
</script>
```
