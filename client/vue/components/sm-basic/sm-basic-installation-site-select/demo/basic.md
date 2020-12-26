<cn>
#### 单选模式
</cn>

<us>
#### 单选模式
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
      value:'02216a7f-0186-44f5-8572-95bc743bc1bc',
      multiple:false,
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
