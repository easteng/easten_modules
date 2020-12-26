<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <br>
    <span>{{value}}</span>
    <br>
    <br/>
    <sm-basic-scope-select :axios="axios" @change="onChange" :value="value" />
    <br>
    <br/>
    <sm-basic-scope-select style="width:120px" :axios="axios" @change="onChange" :value="value" :type="2"/>

    <br>
    默认选中第一个:{{value2}}
    <br/>
    <sm-basic-scope-select style="width:220px" :axios="axios" @change="onChange2" :value="value2" :type="3" :autoInitial="true"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      value: null,
      value2: null,
      // value:'1@长阳线路所@39f7dfe4-ab67-77c6-32d3-042fe91d2be0.2@京雄线@3c994722-828d-4417-ac7d-34ec5fdbf7cb.3@长阳站@39f7e013-97fe-abf2-550b-6107862773f6.4@原继电器室@39f7e041-b7d2-2afc-c051-acb19419908d',
      // value:'1@长阳线路所@39f7dfe4-ab67-77c6-32d3-042fe91d2be0.2@京雄线@3c994722-828d-4417-ac7d-34ec5fdbf7cb.3@长阳站@39f7e013-97fe-abf2-550b-6107862773f6',
      // value:'1@长阳线路所@39f7dfe4-ab67-77c6-32d3-042fe91d2be0.2@京雄线@3c994722-828d-4417-ac7d-34ec5fdbf7cb',
      // value:'1@长阳线路所@39f7dfe4-ab67-77c6-32d3-042fe91d2be0',
      // value:'1@西安通信车间@39f82399-a428-029c-e680-663c9e593c06',
      type: 2,
      axios,
    }
  },
  created(){
  },
  methods: {
    onClick(value){
      this.value= value;
    },
    onChange(data,d){
      console.log(data)
    },
    onChange2(value){
      this.value2 = value
    }
  }
}
</script>
```
