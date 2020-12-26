<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-resource-store-equipments-test :permissions="getPermissions()" :axios="axios" :id="id"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js'

export default {
  data(){
    return {
      axios,
        // id:'39f9157f-e768-10c1-a2ce-8df392494e35',
        id:null,
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
