<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <sm-basic-station-cascader :axios="axios" :value="code" :organizationId = "organizationId"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      count: 5,
      show: true,
      code:"",
      organizationId:"39f8757d-ecc8-c796-bc11-29866baf6c11",
      axios
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
