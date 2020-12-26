<cn>
#### 根据id获取子项
</cn>

<us>
#### 根据id获取子项
</us>

```tpl
<template>
  <div>
    <sm-std-basic-repair-group-select parentId="a5d171c2-b1cb-8bc7-408b-39f6d3afdb04" :axios="axios" :value="value" />
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
      value: 'a5d171c2-b1cb-8bc7-408b-39f6d3afdb04'
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
