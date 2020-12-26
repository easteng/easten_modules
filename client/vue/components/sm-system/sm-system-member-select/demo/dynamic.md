<cn>
#### 动态选择模块
</cn>

<us>
#### 动态选择模块
</us>

```tpl
<template>
  <div>
    <sm-system-member-select @change="change" :showDynamicTab="true" v-model="selected" :axios="axios"/>
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
          type: MemberType.DynamicOrgLevel1,
          id: '09e65662-8ab1-44ed-931e-0c0dd73e0457',
        },
        {
          type: MemberType.DynamicOrgLevel2,
          id: 'b10d6dee-da8b-40a3-8ee8-197bb2264c16',
        },
      ]
    }
  },
  created(){
  },
  methods: {
    change(v){
      console.log(v)
    }
  }
}
</script>
```
