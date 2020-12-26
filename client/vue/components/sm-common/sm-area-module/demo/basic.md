<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="onClick(null)">null</a-button>
    <a-button @click="onClick([])">[]</a-button>
    <a-button @click="onClick(['11'])">['11']</a-button>
    <a-button @click="onClick(['110101001'])">['110101001']</a-button>
    <a-button @click="onClick('110101001')">'110101001'</a-button>
    <a-button @click="onClick(['11','1101','110101','110101001'])">['11','1101','110101','110101001']</a-button>
    <span>{{value}}</span>
    <br/>
    <sm-area :axios="axios" v-model="value" />
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      value:[],
      axios,
    }
  },
  created(){
  },
  methods: {
    onClick(value){
      this.value= value;
    }
  }
}
</script>
```
