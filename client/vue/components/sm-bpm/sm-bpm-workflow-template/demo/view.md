<cn>
#### 预览模式
</cn>

<us>
#### 预览模式
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
      <sm-bpm-workflow-template :axios="axios" :id="id" :pageState="pageState" @ok="onOk" @cancel="onCancel"/>
    </div>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      pageState:'view',
      id:"b4f72776-255e-4dd1-8053-b0ae55f09364"
    }
  },
  created(){
  },
  methods: {

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
