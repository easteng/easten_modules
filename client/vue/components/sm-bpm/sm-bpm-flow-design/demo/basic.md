<cn>
#### 工作流流程设计
</cn>

<us>
#### 工作流流程设计
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
        {type:'bpmStart',width:80,height:44,nodeProps:["basic","field-permission"]},
        {type:'bpmApprove',width:80,height:44,nodeProps:["basic","member-select","field-permission"]},
        {type:'bpmCc',width:80,height:44,nodeProps:["basic","member-select","field-permission"]},
        {type:'bpmEnd',width:80,height:44,nodeProps:["basic","field-permission"]},
      ],
      demoData: {
        nodes: [
          { id: 'startNode1', x: 50, y: 200, label: '', type: 'start' },
          { id: 'startNode2', x: 50, y: 320, label: '', type: 'timerStart' },
          { id: 'taskNode1', x: 200, y: 200, label: '主任审批', type: 'userTask' },
          { id: 'taskNode2', x: 400, y: 200, label: '经理审批', type: 'scriptTask' },
          { id: 'gatewayNode', x: 400, y: 320, label: '金额大于1000', type: 'inclusiveGateway' },
          { id: 'taskNode3', x: 400, y: 450, label: '董事长审批', type: 'receiveTask' },
          { id: 'catchNode1', x: 600, y: 200, label: '等待结束', type: 'signalCatch' },
          { id: 'endNode', x: 600, y: 320, label: '', type: 'end' },
        ],
        edges: [
          {
            source: 'startNode1',
            target: 'taskNode1',
            sourceAnchor: 1,
            targetAnchor: 3,
            type: 'flow',
          },
          {
            source: 'startNode2',
            target: 'gatewayNode',
            sourceAnchor: 1,
            targetAnchor: 3,
            type: 'flow',
          },
          {
            source: 'taskNode1',
            target: 'catchNode1',
            sourceAnchor: 0,
            targetAnchor: 0,
            type: 'flow',
          },
          {
            source: 'taskNode1',
            target: 'taskNode2',
            sourceAnchor: 1,
            targetAnchor: 3,
            type: 'flow',
          },
          {
            source: 'taskNode2',
            target: 'gatewayNode',
            sourceAnchor: 1,
            targetAnchor: 0,
            type: 'flow',
          },
          {
            source: 'taskNode2',
            target: 'taskNode1',
            sourceAnchor: 2,
            targetAnchor: 2,
            type: 'flow',
          },
          {
            source: 'gatewayNode',
            target: 'taskNode3',
            sourceAnchor: 2,
            targetAnchor: 0,
            type: 'flow',
          },
          {
            source: 'gatewayNode',
            target: 'endNode',
            sourceAnchor: 1,
            targetAnchor: 2,
            type: 'flow',
          },
          {
            source: 'taskNode3',
            target: 'endNode',
            sourceAnchor: 1,
            targetAnchor: 1,
            type: 'flow',
          },
          {
            source: 'catchNode1',
            target: 'endNode',
            sourceAnchor: 1,
            targetAnchor: 0,
            type: 'flow',
          },
        ],
      },
      demoData1: {
        nodes: [
          { id: '1', x: 300, y: 50, label: '开始节点', type: 'bpmStart' },
          { id: '2', x: 300, y: 250, label: '审批节点', type: 'bpmApprove'},
          { id: '3', x: 500, y: 250, label: '抄送节点', type: 'bpmCc' , active: true },
          { id: '4', x: 300, y: 450, label: '结束节点', type: 'bpmEnd' },
        ],
        edges: [
          {
            source: '1',
            target: '2',
            sourceAnchor: 2,
            targetAnchor: 4,
            type: 'flow',
          },
          {
            source: '2',
            target: '3',
            sourceAnchor: 1,
            targetAnchor: 3,
            type: 'flow',
          },
          {
            source: '2',
            target: '4',
            sourceAnchor: 2,
            targetAnchor: 4,
            type: 'flow',
          },
        ],
      },
      candidateUsers: [
        { id: '1', name: 'Tom' },
        { id: '2', name: 'Steven' },
        { id: '3', name: 'Andy' },
      ],
      candidateGroups: [
        { id: '1', name: 'Manager' },
        { id: '2', name: 'Security' },
        { id: '3', name: 'OA' },
      ],
    }
  },
  created(){
  },
  methods: {
  }
}
</script>
```
