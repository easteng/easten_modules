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
    <h4>预案等级</h4>  <br/>
    <sm-system-data-dictionary-tree-select groupCode='EmergPlanLevel' :multiple='multiple' v-model="value" :disabled='disabled' :axios="axios"/>
  </div>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      multiple:true,
      axios,
      value:[],
      disabled:null,
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
