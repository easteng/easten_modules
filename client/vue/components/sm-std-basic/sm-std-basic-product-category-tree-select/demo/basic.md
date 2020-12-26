<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div style="display:flex; flex-direction: column ;">
    <div>
      <a-button style="margin-bottom:10px;" @click="isValue1">value1</button>
    </div>
    <div>
      <a-button style="margin-bottom:10px;" @click="isValue2">value2</button>
    </div>
    <div>
    <sm-std-basic-product-category-tree-select :axios="axios" v-model="value" :showSearch="true"/>
    </div>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      value: '',
      axios
    }
  },
  created(){
  },
  methods: {
    isValue1(){
      this.value=''
    },
    isValue2(){
      this.value=''
    },
  }
}
</script>
```
