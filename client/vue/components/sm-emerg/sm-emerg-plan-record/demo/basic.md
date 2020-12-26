<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-emerg-plan-record 
    :axios="axios"
    :idFault="idFault"
    />
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      idFault:'b0139082-6a7a-4c18-ee76-39f6f3902055',
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
