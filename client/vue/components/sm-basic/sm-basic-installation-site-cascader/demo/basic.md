<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <button @click="getValue">获取值</button>
    <button @click="changeValue">改变值</button>
    <span>{{value}}</span>
    <sm-basic-installation-site-cascader :axios="axios" v-model="value"/>
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
      value:"",   //选中项id
    }
  },
  created(){
  },
  methods: {
    getValue(){
      console.log(this.value);
    },
    changeValue(){
      this.value="d466a67e-1fc8-471d-a920-7233888b2401";
    }
  },
}
</script>
```
