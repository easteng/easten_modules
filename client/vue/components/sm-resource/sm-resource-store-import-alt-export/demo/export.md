<cn>
#### 出库信息
</cn>

<us>
#### 出库信息
</us>

```tpl
<template>
  <div>
    <sm-resource-store-import-alt-export :permissions="getPermissions()"  :axios="axios" type="export"/>
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
