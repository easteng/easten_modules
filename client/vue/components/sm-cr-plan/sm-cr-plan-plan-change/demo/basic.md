<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-radio-group :value="pageState" @change="onPageStateChange">
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
    <sm-cr-plan-plan-change :axios="axios" :pageState ="pageState" :id="id"  @ok="onOk" @cancel="onCancel" :organizationId="orgID"/>
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
      id: '1afff796-bc69-42e1-924e-043f2553b446',
      pageState: 'add',
      orgID: '39f8757d-ecc8-3b60-9d9a-1cf5d1e41d6c',
    }
  },
  created(){
  },
  methods: {
    onPageStateChange(event){
      this.pageState = event.target.value
    },
    onOk(id){
      console.log('onSuccess',id)
      this.$message.info(`onSuccess: ${id}`)
    },
    onCancel(id){
      console.log('onCancel',id)
      this.$message.info(`onCancel: ${id}`)
    },
  }
}
</script>
```
