<cn>
#### 基本用法-添加模式
</cn>

<us>
#### 基本用法-添加模式
</us>

```tpl
<template>
  <div >
    <a-radio-group v-model="pageState">
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
    <div style="width: 100%; height: 700px;">
      <sm-bpm-workflow-template :axios="axios" :id="id" :pageState="pageState" @ok="onOk" @cancel="onCancel"  :permissions="getPermissions()"/>
    </div>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import { getPermissions } from '@/utils/utils.js'

export default {
  data(){
    return {
      axios,
      pageState:'edit',
      id:'d6dbfd1b-744f-443f-85b4-8f46b9a2b800'
    }
  },
  created(){
  },
  methods: {
    getPermissions,
    onOk(){
      console.log('onOk')
      this.$message.info(`onOk`)
    },
    onCancel(){
      console.log('onCancel')
      this.$message.info(`onCancel`)
    },
  }
}
</script>
```
