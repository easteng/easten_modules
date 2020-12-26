<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="()=>{visible = true}">打开成员选择</a-button>
    <sm-system-member-modal :selected="selected" @ok="(value)=>{this.selected = value}" v-model="visible" :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { MemberType } from '../../../_utils/enum';

export default {
  data(){
    return {
      axios,
      visible: true,
      selected: [
        {
          type: MemberType.Organization,
          id: '39f778c8-b66f-8ade-89c3-058580aee965',
        },
        {
          type: MemberType.Organization,
          id: '39f778c8-b1ac-eea8-29cf-45bf46532543',
        },
      ]
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
