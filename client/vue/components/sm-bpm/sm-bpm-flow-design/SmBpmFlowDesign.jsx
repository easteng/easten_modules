import './style';

import G6 from '@antv/g6/src';
import { getShapeName } from './src/util/type';
import Command from './src/plugins/command';
import Toolbar from './src/plugins/toolbar';
import AddItemPanel from './src/plugins/addItemPanel';
import CanvasPanel from './src/plugins/canvasPanel';
import ToolbarPanel from './src/components/ToolbarPanel';
import ItemPanel from './src/components/ItemPanel';
import NodeProperty from './src/components/NodeProperty/index';
import i18n from './src/locales';
import { exportXML } from './src/util/bpmn';
import registerShape from './src/shape';
import registerBehavior from './src/behavior';
import FlowProperty from './src/components/FlowProperty/index';

registerShape(G6);
registerBehavior(G6);
export default {
  name: 'SmBpmFlowDesign',
  components: {
    ToolbarPanel,
    ItemPanel,
    NodeProperty,
    FlowProperty,
  },
  provide() {
    return {
      i18n: i18n[this.lang],
      axios: this.axios,
    };
  },
  props: {
    axios: { type: Function, default: null },
    mode: { type: String, default: 'edit' },
    lang: { type: String, default: 'zh' },
    data: { type: Object, default: () => ({ nodes: [], edges: [] }) },
    users: { type: Array, default: () => [] },
    groups: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: true },
    formItems: { type: Array, default: () => [] },
    fixPadding: { type: Number, default: 5 },
    nodeConfig: { type: Array, default: () => [] }, // 新增属性节点配置，显示左侧流程节点显示内容。
    audit: { type: Boolean, default: false }, // 审计状态，查看模式下是否使用审计
  },
  data() {
    return {
      activeKey: '1',
      resizeFunc: () => { },
      selectedModel: {},
      processModel: {
        id: '',
        name: '',
        type: 'process',
        dataObjs: [],
        signalDefs: [],
        messageDefs: [],
      },
      graph: null,
      cmdPlugin: null,
      container: null,
      height: 0,
      width: 0,
    };
  },
  computed: {
    isView: function () {
      return this.mode === 'view';
    },
  },
  watch: {
    mode: {
      handler(nVal, oVal) {
        if (this.graph) {
          this.graph.setMode(nVal);
        }
      },
      immediate: true,
    },
    data(newData, oldData) {
      if (oldData !== newData) {
        if (this.graph) {
          this.graph.changeData(this.initShape(newData));
          this.graph.setMode(this.mode);
          this.graph.emit('canvas:click');
          if (this.cmdPlugin) {
            this.cmdPlugin.initPlugin(this.graph);
            this.graph.fitView(this.fixPadding || 30);
          }
          if (this.isView) {
            this.graph.fitView(this.fixPadding || 30);
          }
        }
      }
    },
    selectedModel: {
      handler: function (value, oldValue) {
        //this.activeKey = value.type === 'process' ? '1' : '2';
      },
      immediate: true,
    },
    formItems: {
      handler: function (value, oldValue) {
        this.selectedModel = this.processModel;

        // 更新拥有表单项权限的节点
        const nodes = this.graph.findAll('node', node => {
          let model = node.get('model');
          return model.type === 'bpmApprove' || model.type === 'bpmCc' || model.type === 'bpmStart';
        });

        for (let node of nodes) {
          let model = node.get('model');

          let _oldPermisstions = model.formItemPermisstions || [];

          let _newPermissiotns = this.formItems.map(item => {
            return {
              key: item.key,
              label: item.label,
              view: true,
              edit: model.type === 'bpmStart',
              info: true,
            };
          });

          _newPermissiotns.map(_item => {
            let target = _oldPermisstions.find(item => item.key === _item.key);
            if (target) {
              _item.view = target.view;
              _item.edit = target.edit;
              _item.info = target.info;
            }
          });

          this.graph.updateItem(node, { formItemPermisstions: _newPermissiotns });
        }

        this.onChange();
      },
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeFunc);
    this.graph.getNodes().forEach(node => {
      node.getKeyShape().stopAnimate();
    });
  },
  mounted() {
    this.container = this.$refs['container'];
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // 初始插件
    let plugins = [];
    if (!this.isView) {
      this.cmdPlugin = new Command();
      const toolbar = new Toolbar({ container: this.$refs['toolbar'].$el });
      const addItemPanel = new AddItemPanel({ container: this.$refs['addItemPanel'].$el });
      const canvasPanel = new CanvasPanel({ container: this.container });
      plugins = [this.cmdPlugin, toolbar, addItemPanel, canvasPanel];
    }

    // 初始画板
    this.graph = new G6.Graph({
      plugins: plugins,
      container: this.container,
      height: this.height,
      width: this.width,
      modes: {
        default: ['drag-canvas', 'clickSelected'],
        view: [],
        edit: [
          'drag-canvas',
          'hoverNodeActived',
          'hoverAnchorActived',
          'dragNode',
          'dragEdge',
          'dragPanelItemAddNode',
          'clickSelected',
          'deleteItem',
          'itemAlign',
        ],
      },
      defaultEdge: {
        shape: 'flow-polyline-round',
        style: {
          stroke: 'red',
          lineWidth: 5,
        },
      },
    });

    this.graph.saveXML = (createFile = true) =>
      exportXML(this.graph.save(), this.processModel, createFile);
    if (this.isView) {
      this.graph.setMode('view');
    } else {
      this.graph.setMode(this.mode);
    }

    // 载入数据
    this.graph.data(this.initShape(this.data));
    this.graph.render();
    if (this.isView && this.data && this.data.nodes) {
      this.graph.fitView(this.fixPadding || 5);
    }

    // 初始事件
    this.initEvents();
  },
  methods: {
    initShape(data) {
      if (data && data.nodes) {
        return {
          nodes: data.nodes.map(node => {
            return {
              shape: getShapeName(node.type),
              ...node,
            };
          }),
          edges: data.edges,
        };
      }
      return data;
    },
    initEvents() {
      this.graph.on('afteritemselected', items => {
        if (items && items.length > 0) {
          const item = this.graph.findById(items[0]);
          this.selectedModel = { ...item.getModel() };
          this.activeKey = '2';
        } else {
          //this.selectedModel = this.processModel;
        }
      });

      this.graph.on('afteradditem', data => {
        // 条目添加后的事件,对判定节点为source 的edge默认不超过三条,如果时bool类型,则提示只能添加两条
        // 若为其他条件,则根据其他条件进行判断的条数进行判断
        if (data.item.getType() == 'edge') {
          let edgeModel = data.item.getModel();
          let node = data.item.getSource();
          let nodeModel = node.getModel();
          if (nodeModel.type === 'determine') {
            let edge = this.graph.findById(edgeModel.id);
            let outEdges = node.getOutEdges();
            if (nodeModel.condition) {
              let type = nodeModel.condition.type;
              if (type === 'boolean') {
                if (outEdges.length > 2) {
                  this.graph.removeItem(edgeModel.id);
                  this.graph.set('selectedItems', []);
                  this.graph.emit('afteritemselected', []);
                  this.$message.error('当前判定节点只允许两个条件');
                }
              } else if (type === 'range' || type === 'groups') {
                if (outEdges.length > nodeModel.condition.items.length) {
                  this.$message.error('流程数不能超过节点的条件数');
                  this.graph.removeItem(edgeModel.id);
                  this.graph.set('selectedItems', []);
                  this.graph.emit('afteritemselected', []);
                }
              }
            } else {
              if (outEdges.length > 2) {
                this.$message.error('默认条件下判定节点只允许两个流程');
                this.graph.removeItem(edgeModel.id);
                this.graph.set('selectedItems', []);
                this.graph.emit('afteritemselected', []);
              }
            }
          }
        }
        // 添加完节点后新增属性字段
        if (data.item.getType() === "node") {
          let nodeModel = data.item.getModel();
          if (nodeModel.type != "bpmCc") {
            if (this.graph.executeCommand) {
              this.graph.executeCommand('update', {
                itemId: nodeModel.id,
                updateModel: { ["processed"]: false, ["prcessTime"]: null },
              });
            }

          }
        }
        this.onChange();
      });

      this.graph.on('beforeadditem', data => {
        let model = data.model;
        if (
          (!model.formItemPermisstions && model.type === 'bpmApprove') ||
          model.type === 'bpmCc' ||
          model.type === 'bpmStart'
        ) {
          let _newPermissiotns = this.formItems.map(formItem => {
            return {
              key: formItem.key,
              label: formItem.label,
              view: true,
              edit: model.type === 'bpmStart',
              info: true,
            };
          });

          model.formItemPermisstions = _newPermissiotns;
        }

        this.onChange();
      });

      this.graph.on('afterremoveitem', data => {
        this.onChange();
      });

      const page = this.$refs['container'];
      const graph = this.graph;
      const height = this.height - 1;
      this.resizeFunc = () => {
        graph.changeSize(page.offsetWidth, height);
      };
      window.addEventListener('resize', this.resizeFunc);

      // 新增事件， 流程线点击事件  easten
      this.graph.on('edge:click', event => {
        // 业务实现： 通过点击流程线，进行流程属性绑定，需要判断上一节点是否为判断节点。
        // 进行颜色得变换。
        this.activeKey = '1';
        let edgeitem = event.item.getModel();
        let node = event.item.getSource();
        this.processModel = { ...this.processModel, ...edgeitem, node };
      });
      // 新增事件，查看模式下点击节点 easten
      this.graph.on('node:click', data => {
        if (this.isView && this.audit) {
          let result = {
            nodeId: data.item._cfg.model.id,
            label: data.item._cfg.model.label,
            type: data.item._cfg.model.type,
            message: data.item._cfg.model.message,
            processed: data.item._cfg.model.processed,
            active: data.item._cfg.model.active,
            members:data.item._cfg.model.members,
            steps: [],
          };
          if (data.item._cfg.edges.length > 0) {
            let edges = data.item._cfg.edges;
            let steps = [];
            edges.forEach(edge => {
              steps.push({
                sourceId: edge._cfg.source._cfg.id,
                targetId: edge._cfg.target._cfg.id,
              });
            });
            result.steps = steps;
          }
          // 提交事件
          this.$emit('nodeClick', result);
        }
      });
      // //新增事件，查看模式下鼠标悬浮至节点 easten
      // this.graph.on('node:mouseenter', data => {
      //   if (this.isView && this.audit) {
      //     let result = {
      //       members: data.item._cfg.model.members,
      //       x: data.x,
      //       y: data.y,
      //     };
      //     let modal = data.item.getModel();
      //     console.log(modal);
      //     this.$emit('nodeMouseenter',result);
      //   }
      // });
      // //新增事件，查看模式下鼠标离开节点 easten
      // this.graph.on('node:mouseleave', eve => {
      //   if (this.isView && this.audit) {
      //     this.$emit('nodeMouseleave');
      //   }
      // });
    },

    onChange() {
      this.$emit('change');
    },

    onItemCfgChange(key, value) {
      const items = this.graph.get('selectedItems');
      if (items && items.length > 0) {
        const item = this.graph.findById(items[0]);
        if (this.graph.executeCommand) {
          this.graph.executeCommand('update', {
            itemId: items[0],
            updateModel: { [key]: value },
          });
        } else {
          this.graph.updateItem(item, { [key]: value });
        }
        this.selectedModel = { ...item.getModel() };
      } else {
        this.processModel = { ...this.processModel, [key]: value };
      }
      this.onChange();
    },
  },
  render() {
    return (
      <div class={{ 'sm-bpm-flow-design': true, bordered: this.bordered }}>
        {/* 工具栏 */}
        {!this.isView ? (
          <ItemPanel nodeConfig={this.nodeConfig} ref="addItemPanel" height={this.height} />
        ) : null}
        <div class="center panel">
          {/* 标题栏 */}
          {!this.isView ? <ToolbarPanel ref="toolbar" /> : null}

          {/* 绘图区 */}
          <div ref="container" class="panel-body" />
        </div>

        {/* {detailPanel}
        {detailPanel2} */}

        {/* 属性栏 */}
        {!this.isView ? (
          [<div class="detailPanel panel">
            <a-tabs
              activeKey={this.activeKey}
              onChange={value => {
                this.activeKey = value;
              }}
              animated={true}
            >
              <a-tab-pane key="1" tab="流程属性" force-render>
                <div class="panel-body">
                  <FlowProperty
                    model={this.processModel}
                    FlowProperty
                    changeHandle={this.onItemCfgChange}
                    read-only={this.mode !== 'edit'}
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="节点属性" force-render>
                <NodeProperty
                  ref="detailPanel"
                  height={this.height}
                  model={this.selectedModel}
                  read-only={this.mode !== 'edit'}
                  users={this.users}
                  groups={this.groups}
                  signal-defs={this.processModel.signalDefs}
                  message-defs={this.processModel.messageDefs}
                  changeHandle={this.onItemCfgChange}
                  nodeConfig={this.nodeConfig}
                />
              </a-tab-pane>
            </a-tabs>
          </div>, <span></span>]
        ) : null}
      </div>
    );
  },
};
