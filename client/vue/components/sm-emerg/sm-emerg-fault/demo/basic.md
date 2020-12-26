<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
  <!-- <a-radio-group v-model="pageState" @change="onPageStateChange">
        <a-radio-button value="add" >
            Add
        </a-radio-button>
        <a-radio-button value="edit">
            Edit
        </a-radio-button>
        <a-radio-button value="view">
            View
        </a-radio-button>
     </a-radio-group>
     <br/><br/> -->
    <sm-emerg-fault 
      :axios="axios"
      :permissions="getPermissions()"
    />
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js';
export default {
  data(){
    return {
      axios,
    }
  },
  created(){
  },
  methods: {
    getPermissions,
    // onPageStateChange(event){
    //   this.pageState = event.target.value
    //   if(event.target.value!='add'){
    //     this.id='b0139082-6a7a-4c18-ee76-39f6f3902055'
    //   }else{
    //     this.id=null
    //   }
    // },
    // onOk(id){
    //   this.$message.info(`onSuccess: ${id}`)
    // },
    // onCancel(id){
    //   this.$message.info(`onCancel`)
    // },
  }
}
</script>
```
