<cn>
#### 只有用户选择功能
</cn>

<us>
#### 只有用户选择功能
</us>

```tpl
<template>
  <div>
    <sm-system-member-select @change="change" v-model="selected" :axios="axios" :bordered="true" :showUserTab="true"/>
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
          type: MemberType.User,
          id: 'e4a84315-755a-17fd-dd38-39f6a658ca0a',
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
