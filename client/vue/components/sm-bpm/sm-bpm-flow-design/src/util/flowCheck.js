import Vue from 'vue';
// 开始、结束节点唯一性判断；重复线判断 2、不能只存在开始节点与结束节点
let vm = new Vue({});
export function basicCheck(flowData) {
  if (flowData !== null) {
    //开始节点与结束节点判断
    if (
      flowData.nodes.filter(item => item.type === 'bpmStart').length > 1 ||
      flowData.nodes.filter(item => item.type === 'bpmEnd').length > 1
    ) {
      vm.$message.error('只允许存在一个开始或结束节点');
      return false;
    }
    if (
      flowData.nodes.filter(item => item.type === 'bpmStart').length < 1 ||
      flowData.nodes.filter(item => item.type === 'bpmEnd').length < 1
    ) {
      vm.$message.error('请选择开始或者结束节点');
      return false;
    }

    //开始节点不能直接连接结束节点
    let endNodeId;
    let startNextNodeIds = []; //开始节点的下一节点id

    for (let node of flowData.nodes) {
      //除开始与结束节点需要添加人员
      if (node.type == "bpmApprove" || node.type == "bpmCc") {
        if (node.members == undefined || node.members.length < 1) {
          vm.$message.error('审批与抄送节点需要添加处理人员');
          return false;
        }
      }
      //结束节点不能作为源
      if (node.type === 'bpmEnd') {
        endNodeId = node.id;
        let edges = flowData.edges.filter(edge => edge.source === node.id);
        if (edges.length > 0) {
          vm.$message.error('结束节点不能作为源');
          return false;
        }
      }
      if (node.type === 'bpmStart') {
        let edges = flowData.edges.filter(edge => edge.source === node.id);
        edges.forEach(element => {
          startNextNodeIds.push(element.target);
        });
      }
      let arry = [];
      let source = flowData.edges.filter(edge => edge.target === node.id);
      let target = flowData.edges.filter(edge => edge.source === node.id);
      //单独节点判断
      if (source.length === 0 && target.length === 0) {
        vm.$message.error('存在单独节点');
        return false;
      }
      //重复线判断
      arry.push(source.map(item => item.source));
      let falg = false;
      for (let i = 0; i < arry.length; i++) {
        for (let j = 0; j < arry[i].length; j++) {
          if (arry[i][j] === arry[i][j + 1]) {
            falg = true;
            break;
          }
        }
      }
      if (falg) {
        vm.$message.error('不能存在重复连线');
        return false;
      }
    }

    for (let startNextNodeId of startNextNodeIds) {
      if (startNextNodeId == endNodeId) {
        vm.$message.error('请勿将开始节点与结束节点相连');
        return false;
      }
    }
    return true;
  }
}
//工作流：审批、抄送节点判断
export function bpmCheck(flowData) {
  if (flowData !== null) {
    //获取所有审批节点id
    let approve = flowData.nodes.filter(item => item.type === 'bpmApprove');
    for (let node of flowData.nodes) {
      let source = flowData.edges.filter(edge => edge.target === node.id);
      let target = flowData.edges.filter(edge => edge.source === node.id);
      //抄送节点判断
      if (node.type === 'bpmCc') {
        let edgeSourceIds = [];
        let edgeTargetIds = [];
        for (let edge of flowData.edges) {
          if (edge.target === node.id) {
            edgeSourceIds.push(edge.source);
          }
          if (edge.source === node.id) {
            edgeTargetIds.push(edge.target);
          }
        }
        if (edgeSourceIds.length === 0) {
          vm.$message.error('抄送节点没有关联审批节点');
          return false;
        } else if (edgeSourceIds.length > 1) {
          vm.$message.error('抄送节点不能关联多个节点');
          return false;
        } else {
          let ret = approve.find(item => {
            return item.id === edgeSourceIds[0];
          });
          if (!ret) {
            vm.$message.error('抄送节点源点不能为其他节点');
            return false;
          }
        }
        if (edgeTargetIds.length > 0) {
          vm.$message.error('抄送节点不能作为源节点');
          return false;
        }
      }
      //审批节点判断
      //审批节点判断
      if (node.type === 'bpmApprove') {
        //判断审批节点是否关联其他节点
        if (source.length < 1 || target.length < 1) {
          vm.$message.error('审批节点没有选择源或目标');
          return false;
        }
      }
    }
  }
  return true;
}

//应急预案流: 是否为激活状态
export function clickNodeCheck(flowData, nodeData) {
  for (let node of flowData.nodes) {
    //判断是否为下级节点

    if (node.id === nodeData.nodeId) {
      if (node.active === false && node.processed === false) {
        vm.$message.error('该流程未激活');
        return false;
      }
      if (node.active === false && node.processed === true) {
        vm.$message.error('该流程已处理');
        return false;
      }
    }
  }
  return true;
}
//应急预案流:1、 一个节点下是否存在多个判断节点 2、判断是否为判断节点添加条件 3 所有节点必须添加成员
export function emergPlanFlowCheck(flowData) {
  if (flowData) {
    let determineNodes = []; //判断节点集合
    let determineTargetEdgeIds = []; //目标为判断节点的节点集合
    for (let node of flowData.nodes) {
      if (node.type !== 'bpmEnd' && node.type !== 'determine') {
        if (node.members == undefined || node.members.length < 1) {
          vm.$message.error('除结束与判断节点所有节点需添加处理人员');
          return false;
        }
      }

      if (node.type == 'subProcess' || node.type == 'process') {
        let edgesScoure = flowData.edges.filter(item => item.source == node.id);
        let edgesTarget = flowData.edges.filter(item => item.target == node.id);
        
        if (edgesTarget < 1 || edgesScoure <1) {
          vm.$message.error('流程节点连接线有误');
          return false;
        }
      }
      if (node.type === 'determine') {
        determineNodes.push(node);
      }
    }
    for (let determineNode of determineNodes) {
      if (determineNode.condition == undefined) {
        vm.$message.error('请为判断节点添加条件为是否判断');
        return false;
      } else {
        if (determineNode.condition.type !== 'boolean') {
          vm.$message.error('请选择条件判断节点为是否判断');
          return false;
        }
      }
      for (let edge of flowData.edges) {
        if (edge.target === determineNode.id) {
          determineTargetEdgeIds.push(edge.source);
        }
        if (edge.source === determineNode.id) {
          if (edge.condition === undefined) {
            vm.$message.error('判断节点连接线未配置条件');
            return false;
          }
        }
      }
    }
    //一个节点下是否存在多个判断节点
    for (let determineTargetEdgeId of determineTargetEdgeIds) {
      let index = determineTargetEdgeIds.indexOf(determineTargetEdgeId);
      let lastIndex = determineTargetEdgeIds.lastIndexOf(determineTargetEdgeId);
      if (index !== lastIndex) {
        vm.$message.error('一个节点只允许存在一个判断节点');
        return false;
      }
    }

    //判断是否添加判断条件

    return true;
  }
}
