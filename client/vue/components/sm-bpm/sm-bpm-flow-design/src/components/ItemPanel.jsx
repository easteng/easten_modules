import start from '../assets/flow/start.svg';
import timerStart from '../assets/flow/timer-start.svg';
import messageStart from '../assets/flow/message-start.svg';
import signalStart from '../assets/flow/signal-start.svg';
import userTask from '../assets/flow/user-task.svg';
import scriptTask from '../assets/flow/script-task.svg';
import javaTask from '../assets/flow/java-task.svg';
import mailTask from '../assets/flow/mail-task.svg';
import receiveTask from '../assets/flow/receive-task.svg';
import exclusiveGateway from '../assets/flow/exclusive-gateway.svg';
import parallelGateway from '../assets/flow/parallel-gateway.svg';
import inclusiveGateway from '../assets/flow/inclusive-gateway.svg';
import timerCatch from '../assets/flow/timer-catch.svg';
import messageCatch from '../assets/flow/message-catch.svg';
import signalCatch from '../assets/flow/signal-catch.svg';

import icon_bpm_start from '../assets/flow/bpm_start.svg';
import icon_bpm_approve from '../assets/flow/bpm_approve.svg';
import icon_bpm_cc from '../assets/flow/bpm_cc.svg';
import icon_bpm_end from '../assets/flow/bpm_end.svg';
import icon_bpm_decision from '../assets/flow/bpm_decision.svg';
import icon_bpm_process from '../assets/flow/bpm_process.svg';
import icon_bpm_sub_process from '../assets/flow/bpm_sub_process.svg';
import './ItemPanel.less';

// 流程节点图标定义
let NodeIcon={

  // 信号，工程专用
  start:start,
  yimerStart:timerStart,
  messageStart:messageStart,
  signalStart:signalStart,
  userTask:userTask,
  scriptTask:scriptTask,
  javaTask:javaTask,
  mailTask:mailTask,
  receiveTask:receiveTask,
  exclusiveGateway:exclusiveGateway,
  parallelGateway:parallelGateway,
  inclusiveGateway:inclusiveGateway,
  timerCatch:timerCatch,
  messageCatch:messageCatch,
  signalCatch:signalCatch,

  // 工作流定义节点
  bpmStart:icon_bpm_start,
  bpmApprove:icon_bpm_approve,
  bpmCc:icon_bpm_cc,
  bpmEnd:icon_bpm_end,

  // 流程常用节点
  process:icon_bpm_process,
  subProcess:icon_bpm_sub_process,
  preProcess:start,
  determine:icon_bpm_decision,
};

export default {
  inject: ['i18n'],
  props: {
    nodeConfig: { type: Array, default: () => [] },
  },
  data() {
    return {
      groups: [
        // {
        //   title: this.i18n['start'],
        //   children: [
        //     {
        //       type: 'start',
        //       nodeSize: '40*40',
        //       title: this.i18n['startEvent'],
        //       iconWidth: '42px',
        //       iconHeight: '42px',
        //       icon: start,
        //     },
        //     {
        //       type: 'timerStart',
        //       nodeSize: '40*40',
        //       title: this.i18n['timerEvent'],
        //       iconWidth: '42px',
        //       iconHeight: '42px',
        //       icon: timerStart,
        //     },
        //     {
        //       type: 'messageStart',
        //       nodeSize: '40*40',
        //       title: this.i18n['messageEvent'],
        //       iconWidth: '42px',
        //       iconHeight: '42px',
        //       icon: messageStart,
        //     },
        //     {
        //       type: 'signalStart',
        //       nodeSize: '40*40',
        //       title: this.i18n['signalEvent'],
        //       iconWidth: '42px',
        //       iconHeight: '42px',
        //       icon: signalStart,
        //     },
        //   ],
        // },
        // {
        //   title: this.i18n['task'],
        //   children: [
        //     {
        //       type: 'userTask',
        //       nodeSize: '80*44',
        //       title: this.i18n['userTask'],
        //       iconWidth: '80px',
        //       iconHeight: '44px',
        //       icon: userTask,
        //     },
        //     {
        //       type: 'scriptTask',
        //       nodeSize: '80*44',
        //       title: this.i18n['scriptTask'],
        //       iconWidth: '80px',
        //       iconHeight: '44px',
        //       icon: scriptTask,
        //     },
        //     {
        //       type: 'javaTask',
        //       nodeSize: '80*44',
        //       title: this.i18n['javaTask'],
        //       iconWidth: '80px',
        //       iconHeight: '44px',
        //       icon: javaTask,
        //     },
        //     {
        //       type: 'mailTask',
        //       nodeSize: '80*44',
        //       title: this.i18n['mailTask'],
        //       iconWidth: '80px',
        //       iconHeight: '44px',
        //       icon: mailTask,
        //     },
        //     {
        //       type: 'receiveTask',
        //       nodeSize: '80*44',
        //       title: this.i18n['receiveTask'],
        //       iconWidth: '80px',
        //       iconHeight: '44px',
        //       icon: receiveTask,
        //     },
        //   ],
        // },
        // {
        //   title: this.i18n['gateway'],
        //   children: [
        //     {
        //       type: 'exclusiveGateway',
        //       nodeSize: '40*40',
        //       title: this.i18n['exclusiveGateway'],
        //       iconWidth: '48px',
        //       iconHeight: '48px',
        //       icon: exclusiveGateway,
        //     },
        //     {
        //       type: 'parallelGateway',
        //       nodeSize: '40*40',
        //       title: this.i18n['parallelGateway'],
        //       iconWidth: '48px',
        //       iconHeight: '48px',
        //       icon: parallelGateway,
        //     },
        //     {
        //       type: 'inclusiveGateway',
        //       nodeSize: '40*40',
        //       title: this.i18n['inclusiveGateway'],
        //       iconWidth: '48px',
        //       iconHeight: '48px',
        //       icon: inclusiveGateway,
        //     },
        //     {
        //       type: 'signalStart',
        //       nodeSize: '40*40',
        //       title: this.i18n['signalEvent'],
        //       iconWidth: '48px',
        //       iconHeight: '48px',
        //       icon: signalStart,
        //     },
        //   ],
        // },
        // {
        //   title: this.i18n['catch'],
        //   children: [
        //     {
        //       type: 'timerCatch',
        //       nodeSize: '50*30',
        //       title: this.i18n['timerEvent'],
        //       iconWidth: '58px',
        //       iconHeight: '38px',
        //       icon: timerCatch,
        //     },
        //     {
        //       type: 'messageCatch',
        //       nodeSize: '50*30',
        //       title: this.i18n['messageEvent'],
        //       iconWidth: '58px',
        //       iconHeight: '38px',
        //       icon: messageCatch,
        //     },
        //     {
        //       type: 'signalCatch',
        //       nodeSize: '50*30',
        //       title: this.i18n['signalEvent'],
        //       iconWidth: '58px',
        //       iconHeight: '38px',
        //       icon: signalCatch,
        //     },
        //   ],
        // },
        {
          title: this.i18n['bpm'],
          children: [
            // {
            //   type: 'bpmStart',
            //   nodeSize: '80*44',
            //   title: this.i18n['bpm.start'],
            //   iconWidth: '80px',
            //   iconHeight: '44px',
            //   icon: icon_bpm_start,
            // },
            // {
            //   type: 'bpmApprove',
            //   nodeSize: '80*44',
            //   title: this.i18n['bpm.approve'],
            //   iconWidth: '80px',
            //   iconHeight: '44px',
            //   icon: icon_bpm_approve,
            // },
            // {
            //   type: 'bpmCc',
            //   nodeSize: '80*44',
            //   title: this.i18n['bpm.cc'],
            //   iconWidth: '80px',
            //   iconHeight: '44px',
            //   icon: icon_bpm_cc,
            // },
            // {
            //   type: 'bpmEnd',
            //   nodeSize: '80*44',
            //   title: this.i18n['bpm.end'],
            //   iconWidth: '80px',
            //   iconHeight: '44px',
            //   icon: icon_bpm_end,
            // },
          ],
        },
      ],
    };
  },
  created() {
    // 根据配置节点组装数据信息
    if (this.nodeConfig.length > 0) {
      this.nodeConfig.forEach(node => {
        let config = {
          type: node.type,
          nodeSize: `${node.width}*${node.height}`,
          title: this.i18n[node.type],
          iconWidth: `${node.width}px`,
          iconHeight: `${node.height}px`,
          icon: NodeIcon[node.type],
        };
        this.groups[0].children.push(config);
      });
    }
  },
  methods: {
    dataItem(subItem) {
      return JSON.stringify({
        type: subItem.type,
        size: subItem.nodeSize || '40*40',
        label: subItem.title,
      });
    },
  },
  render() {
    let result;
    if (this.groups.length > 1) {
      result = (
        <a-collapse bordered={false}>
          {this.groups.map((item, index) => {
            return (
              <a-collapse-panel key={index} header={item.title} force-render>
                {item.children.map((subItem, subIndex) => {
                  return (
                    <div key={subIndex} class="item">
                      <img
                        item-data={this.dataItem(subItem)}
                        src={subItem.icon}
                        style={{ width: subItem.iconWidth, height: subItem.iconHeight }}
                      />
                      <div>{subItem.title}</div>
                    </div>
                  );
                })}
              </a-collapse-panel>
            );
          })}
        </a-collapse>
      );
    } else if (this.groups.length === 1) {
      result = [
        this.groups[0].children.map((subItem, subIndex) => {
          return (
            <div key={subIndex} class="item">
              <img
                item-data={this.dataItem(subItem)}
                src={subItem.icon}
                style={{ width: subItem.iconWidth, height: subItem.iconHeight }}
              />
              <div>{subItem.title}</div>
            </div>
          );
        }),
      ];
    }
    return (
      <div class="itemPanel panel">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="流程节点" force-render>
            <div class="panel-body" style={{ paddingTop: this.groups.length === 1 ? '20px' : 0 }}>
              {result}
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    );
  },
};
