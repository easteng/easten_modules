<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <a-radio-group :value="planType" @change="onPageStateChange">
    <a-radio-button value="1">
      年表
    </a-radio-button>
    <a-radio-button value="2">
      月表
    </a-radio-button>
  </a-radio-group>
  <a-tag style="margin-left:40px;height:32px;line-height:30px" color='green'>{{this.orgName}}</a-tag>
  <br><br>
  <div style="width: 100%; height: 600px;">
    <sm-cr-plan-year-month-change
    :axios="axios"
    :planType="planType"
    :orgId="orgId"
    :orgName="orgName"
    @change="onChange"
    @cancel="onCancel"
    repairTagKey="RepairTag.RailwayWired"
    />
  </div>

</template>
<script>
import axios from '@/utils/axios.js'
import {YearMonthPlanType} from '@/components/_utils/enum.js';

export default {
  data(){
    return {
      axios,
      planType:2,
      orgId:'39f8757d-ecc8-ceb2-da5c-45d78bb6f523',
      orgName:'西安通信车间',
    }
  },
  created(){
  },
  methods: {
     onPageStateChange(event){
      this.planType = event.target.value
    },
    onChange(type,id,name){
      console.log('type:'+type);
      this.planType=type;
      this.orgId=id;
      this.orgName=name;
    },
    onCancel(){
      console.log('onCancel')
      this.$message.info(`onCancel`)
    },
  }
}
</script>
```
