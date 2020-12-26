<cn>
#### 预览模式
</cn>

<us>
#### 预览模式
</us>

```tpl
<template>
  <div>
    <sm-system-member-select :disabled="true"  v-model="selected" :axios="axios"/>
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
