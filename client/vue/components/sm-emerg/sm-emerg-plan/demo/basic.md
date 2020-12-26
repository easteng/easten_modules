<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
     <a-radio-group v-model="pageState" @change="onPageStateChange">
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
     <br/><br/>
    <sm-emerg-plan
        :axios="axios"
        :id="id"
        :pageState="pageState"
        :faultId="faultId"
        @ok="onOk"
        @cancel="onCancel"
    />
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      id:'39f9147f-f7e2-f400-2504-b08fa451dee8',
      faultId:'39f85cc6-9452-b777-b0e0-51356a8a8f53',
      pageState:'View'
    }
  },
  created(){
  },
  methods: {
    onPageStateChange(event){
      this.pageState = event.target.value;
      if(event.target.value!='add'){
        this.id='39f88921-762d-525f-20af-ef5d703b3875';
        this.faultId='39f85cc6-9452-b777-b0e0-51356a8a8f53';//39f7b18a-e174-ef1e-6718-cd9908009207
      }else{
        this.id=null
      }
    },
    onOk(id){
      this.$message.info(`onSuccess: ${id}`)
    },
    onCancel(id){
      this.$message.info(`onCancel`)
    },
  }
}
</script>
```
