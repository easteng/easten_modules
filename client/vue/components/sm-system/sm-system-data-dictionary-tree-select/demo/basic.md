<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <h4>预案等级</h4>  <br/>
    <sm-system-data-dictionary-tree-select groupCode='EmergPlanLevel' :axios="axios"/>
    <br/>  <br/>
    <h4>安装位置类型</h4>  <br/>
    <sm-system-data-dictionary-tree-select groupCode='InstallationSiteType' :axios="axios"/>
  </div>

</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      count: 5,
      show: true,
      axios
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
