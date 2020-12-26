<cn>
#### 基本用法
</cn>

<us>
#### 基本用法
</us>

```tpl
<template>
  <div>
    <a-button @click="onClick(null)">null</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c')">组织机构</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.2@测试001-线路@3e465007-d7af-4bdf-a2ed-c4689ef787f6')">组织机构-线路</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.2@测试001-线路@3e465007-d7af-4bdf-a2ed-c4689ef787f6.3@测试001-站点@39f7c1f2-1839-cc9d-d41b-4261245aaa1c')">组织机构-线路-站点</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.2@测试001-线路@3e465007-d7af-4bdf-a2ed-c4689ef787f6.3@测试001-站点@39f7c1f2-1839-cc9d-d41b-4261245aaa1c.4@测试001-机房@39f7c1ee-dc40-6ea7-ea64-1247e0ff4fb6')">组织机构-线路-站点-机房</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.2@测试001-线路@3e465007-d7af-4bdf-a2ed-c4689ef787f6.3@测试001-站点@39f7c1f2-1839-cc9d-d41b-4261245aaa1c.4@大湾AT所@4dfc0f40-a33a-4e83-bfd6-29b6c9fca032.4@这是添加df@39f7caac-3da3-1bf6-944b-73ac28635379')">组织机构-线路-站点-机房-子机房</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.4@测试003-机房@39f7cbd6-03a9-4131-1bc4-eb0304c4bcaf')">组织机构-机房(非沿线)</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.1@西安铁路局-测试001-组织机构@39f7cffb-7cb7-783c-ce9e-a33f38a373f6')">子级组织机构</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.1@西安铁路局-测试001-组织机构@39f7cffb-7cb7-783c-ce9e-a33f38a373f6.2@测试004-线路@54aa605b-da72-4c14-94cb-117bd0b0172d')">子级组织机构-线路</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.1@西安铁路局-测试001-组织机构@39f7cffb-7cb7-783c-ce9e-a33f38a373f6.2@测试004-线路@54aa605b-da72-4c14-94cb-117bd0b0172d.3@测试002-站点@39f7d00b-97c2-2696-7c22-1fe6e1d57fa6')">子级组织机构-线路-站点</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.1@西安铁路局-测试001-组织机构@39f7cffb-7cb7-783c-ce9e-a33f38a373f6.2@测试004-线路@54aa605b-da72-4c14-94cb-117bd0b0172d.3@测试002-站点@39f7d00b-97c2-2696-7c22-1fe6e1d57fa6.4@测试004-机房@39f7d034-0a7d-697d-4a60-f1a741247bfd')">子级组织机构-线路-站点-机房</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.1@西安铁路局-测试001-组织机构@39f7cffb-7cb7-783c-ce9e-a33f38a373f6.2@测试004-线路@54aa605b-da72-4c14-94cb-117bd0b0172d.3@测试002-站点@39f7d00b-97c2-2696-7c22-1fe6e1d57fa6.4@测试004-机房@39f7d034-0a7d-697d-4a60-f1a741247bfd.4@测试005-机房@39f7d037-9f66-24e5-ed18-eb932da14ef8')">子级组织机构-线路-站点-机房-子机房</a-button>

    <a-button @click="onClick('1@西安铁路局@39f7a8f1-df82-7132-9608-243ca4213e7c.1@西安铁路局-测试001-组织机构@39f7cffb-7cb7-783c-ce9e-a33f38a373f6.4@测试006-机房@39f7d040-cd45-7efc-0ae1-f907173aa957')">子级组织机构-机房</a-button>
    <br>
    <span>{{value}}</span>
    <br/>
    <sm-basic-scope-cascader :axios="axios" :value="value"/>
  </div>
</template>
<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      // value:null,
      value:'1@商洛通信车间@39f7ccc8-c896-0452-60de-ec652cc4e9ba.2@宁西线@be9f0abc-546d-4a86-bff0-b96e2831e868',

      axios,
    }
  },
  created(){
  },
  methods: {
    onClick(value){
      this.value= value;
      console.log(this.value);
    }
  }
}
</script>
```
