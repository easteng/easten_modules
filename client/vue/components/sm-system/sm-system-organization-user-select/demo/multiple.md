<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-system-organization-user-select mode="multiple" :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      count: 5,
      show: true,
      axios,
      value:[]
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
