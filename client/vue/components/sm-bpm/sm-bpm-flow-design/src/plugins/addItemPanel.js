const deepMix = require('@antv/util/lib/deep-mix');
const each = require('@antv/util/lib/each');
const createDOM = require('@antv/util/lib/dom/create-dom');
class AddItemPanel {
  constructor(cfgs) {
    this._cfgs = deepMix(this.getDefaultCfg(), cfgs);
  }
  getDefaultCfg() {
    return { container: null };
  }

  get(key) {
    return this._cfgs[key];
  }
  set(key, val) {
    this._cfgs[key] = val;
  }

  initPlugin(graph) {
    const parentNode = this.get('container');
    const ghost = createDOM(
      '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"' +
        ' style="opacity:0"/>',
    );
    const children = parentNode.querySelectorAll('div > img[item-data]');
    each(children, (child, i) => {
      const addModel = JSON.parse(child.getAttribute('item-data'));
      child.addEventListener('dragstart', e => {
        console.log('addItemPanel-dragstart');
        e.dataTransfer.setDragImage(ghost, 0, 0);
        graph.set('onDragAddNode', true);
        graph.set('addModel', addModel);
      });
      child.addEventListener('dragend', e => {
        graph.emit('canvas:mouseup', e);
        graph.set('onDragAddNode', false);
        graph.set('addModel', null);
      });
    });
  }

  destroy() {
    this.get('canvas').destroy();
    const container = this.get('container');
    container.parentNode.removeChild(container);
  }
}

export default AddItemPanel;
