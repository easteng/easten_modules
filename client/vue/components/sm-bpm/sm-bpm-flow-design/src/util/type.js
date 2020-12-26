export function getShapeName(type) {
  switch (type) {
    case 'start': return 'start-node';
    case 'end': return 'end-node';
    case 'gateway': return 'gateway-node';
    case 'exclusiveGateway': return 'exclusive-gateway-node';
    case 'parallelGateway': return 'parallel-gateway-node';
    case 'inclusiveGateway': return 'inclusive-gateway-node';
    case 'timerStart': return 'timer-start-node';
    case 'messageStart': return 'message-start-node';
    case 'signalStart': return 'signal-start-node';
    case 'userTask': return 'user-task-node';
    case 'scriptTask': return 'script-task-node';
    case 'mailTask': return 'mail-task-node';
    case 'javaTask': return 'java-task-node';
    case 'receiveTask': return 'receive-task-node';
    case 'timerCatch': return 'timer-catch-node';
    case 'messageCatch': return 'message-catch-node';
    case 'signalCatch': return 'signal-catch-node';
    case 'bpmStart': return 'bpm-start-node';
    case 'bpmApprove': return 'bpm-approve-node';
    case 'bpmCc': return 'bpm-cc-node';
    case 'bpmEnd': return 'bpm-end-node';
    case 'process': return 'bpm-process-node';
    case 'subProcess': return 'bpm-sub_process-node';
    case 'determine': return 'bpm-determine-node';
    default: return 'task-node';
  }
}
