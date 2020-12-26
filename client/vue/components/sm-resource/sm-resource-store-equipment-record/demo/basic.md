<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-resource-store-equipment-record :axios="axios" :value='value' size="small"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      value:'',
    }
  },
   computed: {
  },

  created(){
  },
  methods: {
  }
}
</script>
```
