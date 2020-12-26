const deepMix = require('@antv/util/lib/deep-mix');
import editorStyle from '../util/defaultStyle';
import icon_user from '../assets/icons/flow/icon_user.svg';
import icon_script from '../assets/icons/flow/icon_script.svg';
import icon_java from '../assets/icons/flow/icon_java.svg';
import icon_mail from '../assets/icons/flow/icon_mail.svg';
import icon_receive from '../assets/icons/flow/icon_receive.svg';
import icon_timer from '../assets/icons/flow/icon_timer.svg';
import icon_message from '../assets/icons/flow/icon_message.svg';
import icon_signal from '../assets/icons/flow/icon_signal.svg';

import icon_bpm_start from '../assets/icons/flow/icon_bpm_start.svg';
import icon_bpm_approve from '../assets/icons/flow/icon_bpm_approve.svg';
import icon_bpm_cc from '../assets/icons/flow/icon_bpm_cc.svg';
import icon_bpm_end from '../assets/icons/flow/icon_bpm_end.svg';

import icon_bpm_decision from '../assets/flow/bpm_decision.svg';
import icon_bpm_process from '../assets/flow/bpm_process.svg';
import icon_bpm_sub_process from '../assets/flow/bpm_sub_process.svg';

const taskDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#E7F7FE',
    stroke: '#1890FF',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#95D6FB',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const gatewayDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 20,
    height: 20,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#E8FEFA',
    stroke: '#13C2C2',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#8CE8DE',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const startDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke: '#FA8C16',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const endDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#EFF7E8',
    stroke: '#F5222D',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#CFD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const catchDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 20,
    height: 20,
    left: -10,
    top: -8,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke: '#FA8C16',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

// snabp bpm
const bpmStartDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke: '#FA8C16',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const bpmApproveDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#E7F7FE',
    stroke: '#1890FF',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#95D6FB',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const bpmCcDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#F6FFED',
    stroke: '#73D13D',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#D9F7BE',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

const bpmEndDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FFEBEE',
    stroke: '#F5222D',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#F9AFBB',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

// 新增 默认流程
const bpmProcessOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FBEAD9',
    stroke: '#F0B272',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FDC97A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

// 新增，判定流程
const bpmDetermineOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#CAEBEB',
    stroke: '#47B3B3',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#9DD9D9',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

// 新增，子流程
const bpmSubProcessOptions = {
  icon: null,
  iconStyle: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#FBEAD9',
    stroke: '#EB8F04',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FCC470',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

export default function(G6) {
  G6.registerNode(
    'task-node',
    {
      shapeType: 'rect',
      options: {
        ...taskDefaultOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [80, 44];
        const width = cfg.size[0];
        const height = cfg.size[1];
        const style = {
          x: 0 - width / 2,
          y: 0 - height / 2,
          width,
          height,
          ...this.options.style,
        };
        return style;
      },
    },
    'base-node',
  );
  G6.registerNode(
    'gateway-node',
    {
      shapeType: 'path',
      labelPosition: 'bottom',
      options: {
        ...gatewayDefaultOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [40, 40];
        const width = cfg.size[0];
        const height = cfg.size[1];
        const gap = 4;
        const style = {
          path: [
            ['M', 0 - gap, 0 - height / 2 + gap],
            ['Q', 0, 0 - height / 2, gap, 0 - height / 2 + gap],
            ['L', width / 2 - gap, 0 - gap],
            ['Q', width / 2, 0, width / 2 - gap, gap],
            ['L', gap, height / 2 - gap],
            ['Q', 0, height / 2, 0 - gap, height / 2 - gap],
            ['L', -width / 2 + gap, gap],
            ['Q', -width / 2, 0, -width / 2 + gap, 0 - gap],
            ['Z'],
          ],
          ...this.options.style,
        };
        return style;
      },
    },
    'base-node',
  );
  G6.registerNode(
    'exclusive-gateway-node',
    {
      afterDraw(cfg, group) {
        group.icon = group.addShape('path', {
          attrs: {
            path: [['M', -8, -8], ['L', 8, 8], ['Z'], ['M', 8, -8], ['L', -8, 8], ['Z']],
            lineWidth: 2,
            stroke: this.options.style.stroke,
          },
        });
        this.runAnimate(cfg, group);
      },
    },
    'gateway-node',
  );
  G6.registerNode(
    'parallel-gateway-node',
    {
      afterDraw(cfg, group) {
        group.icon = group.addShape('path', {
          attrs: {
            path: [['M', 0, -10], ['L', 0, 10], ['Z'], ['M', -10, 0], ['L', 10, 0], ['Z']],
            lineWidth: 2,
            stroke: this.options.style.stroke,
          },
        });
        this.runAnimate(cfg, group);
      },
    },
    'gateway-node',
  );
  G6.registerNode(
    'inclusive-gateway-node',
    {
      afterDraw(cfg, group) {
        group.icon = group.addShape('circle', {
          attrs: {
            x: 0,
            y: 0,
            r: 10,
            lineWidth: 2,
            stroke: this.options.style.stroke,
          },
        });
        this.runAnimate(cfg, group);
      },
    },
    'gateway-node',
  );
  G6.registerNode(
    'start-node',
    {
      shapeType: 'circle',
      labelPosition: 'bottom',
      options: {
        ...startDefaultOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [30, 30];
        const width = cfg.size[0];
        const style = {
          x: 0,
          y: 0,
          r: width / 2,
          ...this.options.style,
        };
        return style;
      },
      afterDraw(cfg, group) {
        group.icon = group.addShape('path', {
          attrs: {
            path: [
              ['M', -4, -6],
              ['L', 6, 0],
              ['L', -4, 6],
              ['Z'], // close
            ],
            fill: this.options.style.stroke,
            stroke: this.options.style.stroke,
          },
        });
      },
      getAnchorPoints() {
        return [
          [0.5, 0], // top
          [1, 0.5], // right
          [0.5, 1], // bottom
        ];
      },
    },
    'base-node',
  );
  G6.registerNode(
    'end-node',
    {
      shapeType: 'circle',
      labelPosition: 'bottom',
      options: {
        ...endDefaultOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [30, 30];
        const width = cfg.size[0];
        const style = {
          x: 0,
          y: 0,
          r: width / 2,
          ...this.options.style,
        };
        return style;
      },
      afterDraw(cfg, group) {
        group.icon = group.addShape('path', {
          attrs: {
            path: [
              ['M', -4, -4],
              ['L', 4, -4],
              ['L', 4, 4],
              ['L', -4, 4],
              ['Z'], // close
            ],
            fill: this.options.style.stroke,
            stroke: this.options.style.stroke,
          },
        });
      },
      getAnchorPoints() {
        return [
          [0.5, 0], // top
          [0.5, 1], // bottom
          [0, 0.5], // left
        ];
      },
    },
    'base-node',
  );
  G6.registerNode(
    'catch-node',
    {
      shapeType: 'path',
      labelPosition: 'bottom',
      options: {
        ...catchDefaultOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [50, 30];
        const width = cfg.size[0];
        const height = cfg.size[1];
        const style = {
          path: [
            ['M', 0, -height / 3],
            ['L', width / 2, -height / 3],
            ['L', 0, (height / 3) * 2],
            ['L', -width / 2, -height / 3],
            ['Z'], // close
          ],
          ...this.options.style,
        };
        return style;
      },
      getAnchorPoints() {
        return [
          [0.5, 0], // top
          [0.8, 0.38], // right
          [0.5, 1], // bottom
          [0.2, 0.38], // left
        ];
      },
    },
    'base-node',
  );
  G6.registerNode(
    'user-task-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_user,
        style: {
          fill: '#E7F7FE',
          stroke: '#1890FF',
        },
        stateStyles: {
          selected: {
            fill: '#95D6FB',
          },
        },
      }),
    },
    'task-node',
  );
  G6.registerNode(
    'script-task-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_script,
        style: {
          fill: '#FFF7E6',
          stroke: '#FFA940',
        },
        stateStyles: {
          selected: {
            fill: '#FFE7BA',
          },
        },
      }),
    },
    'task-node',
  );
  G6.registerNode(
    'java-task-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_java,
        style: {
          fill: '#FFF1F0',
          stroke: '#FF4D4F',
        },
        stateStyles: {
          selected: {
            fill: '#FFCCC7',
          },
        },
      }),
    },
    'task-node',
  );
  G6.registerNode(
    'mail-task-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_mail,
        style: {
          fill: '#F6FFED',
          stroke: '#73D13D',
        },
        stateStyles: {
          selected: {
            fill: '#D9F7BE',
          },
        },
      }),
    },
    'task-node',
  );
  G6.registerNode(
    'receive-task-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_receive,
        style: {
          fill: '#FFF0F6',
          stroke: '#FF85C0',
        },
        stateStyles: {
          selected: {
            fill: '#FFD6E7',
          },
        },
      }),
    },
    'task-node',
  );
  G6.registerNode(
    'timer-start-node',
    {
      options: deepMix({}, startDefaultOptions, {
        icon: icon_timer,
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      },
    },
    'start-node',
  );
  G6.registerNode(
    'message-start-node',
    {
      options: deepMix({}, startDefaultOptions, {
        icon: icon_message,
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      },
    },
    'start-node',
  );
  G6.registerNode(
    'signal-start-node',
    {
      options: deepMix({}, startDefaultOptions, {
        icon: icon_signal,
      }),
      afterDraw(cfg, group) {
        this.runAnimate(cfg, group);
      },
    },
    'start-node',
  );
  G6.registerNode(
    'timer-catch-node',
    {
      options: deepMix({}, catchDefaultOptions, {
        icon: icon_timer,
      }),
    },
    'catch-node',
  );
  G6.registerNode(
    'signal-catch-node',
    {
      options: deepMix({}, catchDefaultOptions, {
        icon: icon_signal,
      }),
    },
    'catch-node',
  );
  G6.registerNode(
    'message-catch-node',
    {
      options: deepMix({}, catchDefaultOptions, {
        icon: icon_message,
      }),
    },
    'catch-node',
  );

  // SnAbp-bpm 节点
  // 开始节点
  G6.registerNode(
    'bpm-start-node',
    {
      options: deepMix({}, bpmStartDefaultOptions, {
        icon: icon_bpm_start,
      }),
    },
    'task-node',
  );
  // 审批节点
  G6.registerNode(
    'bpm-approve-node',
    {
      options: deepMix({}, bpmApproveDefaultOptions, {
        icon: icon_bpm_approve,
      }),
    },
    'task-node',
  );
  // 抄送节点
  G6.registerNode(
    'bpm-cc-node',
    {
      options: deepMix({}, bpmCcDefaultOptions, {
        icon: icon_bpm_cc,
      }),
    },
    'task-node',
  );
  // 默认节点
  G6.registerNode(
    'bpm-end-node',
    {
      options: deepMix({}, bpmEndDefaultOptions, {
        icon: icon_bpm_end,
      }),
    },
    'task-node',
  );

  // 默认流程

  G6.registerNode(
    'bpm-process-node',
    {
      options: deepMix({}, bpmProcessOptions),
    },
    'task-node',
  );

  // 判定流程
  G6.registerNode(
    'bpm-determine-node',
    {
      shapeType: 'path',
      //labelPosition: 'bottom',
      options: {
        ...bpmDetermineOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [80, 44];
        const width = cfg.size[0];
        const height = cfg.size[1];
        const gap = 2;
        const style = {
          path: [
            ['M', 0 - gap*2, 0 - height / 2 + gap],
            ['Q', 0, 0 - height / 2, gap*2, 0 - height / 2 + gap],
            ['L', width / 2 - gap, 0 - gap],
            ['Q', width / 2, 0, width / 2 - gap, gap],
            ['L', gap*2, height / 2 - gap],
            ['Q', 0, height / 2, 0 - gap*2, height / 2 - gap],
            ['L', -width / 2 + gap, gap],
            ['Q', -width / 2, 0, -width / 2 + gap, 0 - gap],
            ['Z'],
          ],
          ...this.options.style,
        };
        return style;
      },
    },
    'task-node',
  );
  // G6.registerNode(
  //   'bpm-determine-node',
  //   {
  //     options: deepMix({}, bpmDetermineOptions, {
  //       icon: icon_bpm_decision,
  //     }),
  //   },
  //   'task-node',
  // );
  // 子流程
  G6.registerNode(
    'bpm-sub_process-node',
    {
      shapeType: 'path',
      options: deepMix({}, bpmSubProcessOptions),
      getShapeStyle(cfg) {
        cfg.size = [80, 44];
        const w = cfg.size[0];
        const h = cfg.size[1];
        const gap = 4;
        const style = {
          path: [
            ['M',-w * 0.5+gap,-h*0.5],
            ['Q',-w * 0.5,-h*0.5,-w * 0.5,-h*0.5+gap],
            ['L', -w * 0.5, h * 0.5-gap],
            ['Q',-w * 0.5,h*0.5,-w * 0.5+gap,h*0.5],
            ['L', w * 0.5-gap, h * 0.5],
            ['Q',w * 0.5,h*0.5,w * 0.5,h*0.5-gap],
            ['L', w * 0.5, -h * 0.5+gap],
            ['Q', w * 0.5,-h*0.5,w * 0.5-gap,-h*0.5],
            ['Z'],
            //左边竖线
            ['M', -w * 0.5 * 0.7, -h * 0.5],
            ['L', -w * 0.5 * 0.7, h * 0.5],
            // 右边竖线
            ['M', w * 0.5 * 0.7, -h * 0.5],
            ['L', w * 0.5 * 0.7, h * 0.5],
            
          ],
          ...this.options.style,
        };
        return style;
      },
    },
    'task-node',
  );
}
