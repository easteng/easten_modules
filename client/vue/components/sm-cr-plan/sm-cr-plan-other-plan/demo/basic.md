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
      <a-radio-button value="add">
        Add
      </a-radio-button>
      <a-radio-button value="edit">
        Edit
      </a-radio-button>
      <a-radio-button value="view">
        View
      </a-radio-button>
    </a-radio-group>
    <br><br>
    <sm-cr-plan-other-plan
      :axios="axios" :id="id"
      :organizationId="organizationId"
      :planDate="planDate"
      :pageState="pageState"
      @ok="onOk"
      @cancel="onCancel"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
export default {
  data(){
    return {
      id:null,
      axios,
      pageState:'add',
      planDate: '2020-11',
      organizationId:'39f8757d-ecc8-3b60-9d9a-1cf5d1e41d6c'
    }
  },
  created(){
  },
  methods: {
    onPageStateChange(event){
      this.pageState = event.target.value
      if(event.target.value!='add'){
        this.id='0e8b2d09-e275-469e-b7f1-f9d9fd3767da'
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
