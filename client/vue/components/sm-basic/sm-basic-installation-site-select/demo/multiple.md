<cn>
#### 多选模式
</cn>

<us>
#### 多选模式
</us>

```tpl
<template>
  <div>
    <div>
      <sm-basic-installation-site-select
      :axios="axios"
      v-model="value"
      @change="change"
      :multiple='multiple'
      :disabled='disabled'
      />
    </div>
    <div></div>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      value:['e94b54f8-2082-40e3-b02a-80ed347d2f16','02216a7f-0186-44f5-8572-95bc743bc1bc'],
      multiple:true,
      axios,
      disabled:false
    }
  },
  created(){
  },
  methods: {
    change(value){
      console.log(value);
    }
  }
}
</script>
```
