<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-file-text-editor :axios="axios" :value="value"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      value:null,
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
