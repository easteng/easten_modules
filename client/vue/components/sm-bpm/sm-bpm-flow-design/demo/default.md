<cn>
#### 常规流程设计
</cn>

<us>
#### 常规流程设计
</us>

```tpl
<template>
    <sm-bpm-flow-design
      :data="demoData1"
      :lang="lang"
      :nodeConfig="nodeConfig"
      :axios="axios"/>
</template>

<script>
import axios from '@/utils/axios.js'

export default {
  data(){
    return {
      axios,
      modalVisible: false,
      lang: 'zh',
      // 节点配置
      nodeConfig:[
        {type:'bpmStart',width:80,height:44,nodeProps:["basic"]},
        {type:'process',width:80,height:44,nodeProps:["basic","member-select","message"]},
        {type:'determine',width:80,height:44,nodeProps:["basic","condition"]},
        {type:'subProcess',width:80,height:44,nodeProps:["basic"]},
        {type:'bpmEnd',width:80,height:44,nodeProps:["basic"]},
      ],
      demoData1: {
        nodes: [
          { id: '1', x: 300, y: 50, label: '开始节点', type: 'bpmStart' },
          { id: '2', x: 300, y: 150, label: '任务流转', type: 'process'},
          { id: '3', x: 300, y: 300, label: '是否开启子流程', type: 'determine' , active: true },
          { id: '4', x: 246, y: 400, label: '一级部门审批', type: 'process'},
          { id: '5', x: 354, y: 400, label: '子任务流转', type: 'subProcess'},
          { id: '6', x: 300, y: 550, label: '结束节点', type: 'bpmEnd' },
        ],
        edges: [
          {
            source: '1',
            target: '2',
            sourceAnchor: 2,
            targetAnchor: 4,
            type: 'flow',
            label:'流程开始',
          },
          {
            source: '2',
            target: '3',
            sourceAnchor: 2,
            targetAnchor: 4,
            type: 'flow',
             label:'判定',
          },
          {
            source: '3',
            target: '4',
            sourceAnchor: 3,
            targetAnchor: 4,
            type: 'flow',
             label:'否',
          },
          {
            source: '3',
            target: '5',
            sourceAnchor: 1,
            targetAnchor: 4,
            type: 'flow',
             label:'是',
          },
           {
            source: '4',
            target: '6',
            sourceAnchor: 2,
            targetAnchor: 3,
            type: 'flow',
             label:'正常流程',
          },
           {
            source: '5',
            target: '6',
            sourceAnchor: 2,
            targetAnchor: 1,
            type: 'flow',
             label:'下级流转',
          },
        ],
      },
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
