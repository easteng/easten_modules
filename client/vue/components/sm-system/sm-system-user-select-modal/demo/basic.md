<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <!-- <a-button @click="()=>{visible = true}">打开成员选择</a-button> -->
    <!-- <sm-system-user-select-modal :axios="axios" :selected="selected" @ok="(value)=>{this.selected = value}" /> -->
    <sm-system-user-select-modal :axios="axios" />
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
          id: '09e65662-8ab1-44ed-931e-0c0dd73e0457',
        },
        {
          type: MemberType.Organization,
          id: 'b10d6dee-da8b-40a3-8ee8-197bb2264c16',
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
