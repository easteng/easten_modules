<cn>
#### 入库信息
</cn>

<us>
#### 入库信息
</us>

```tpl
<template>
  <div>
    <sm-resource-store-import-alt-export :permissions="getPermissions()"  :axios="axios" type="import"/>
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
