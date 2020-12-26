import './ToolbarPanel.less';

export default {
  name: 'ToolbarPanel',
  inject: ['i18n'],
  data() {
    return {
      ctrlIsPressed: false,
    };
  },
  mounted() {
    this.installEvents();
  },
  methods: {
    installEvents() {
      // document.onkeydown = function(event) {
      //   //获取键值
      //   let keyCode = event.keyCode;
      //   let keyValue = String.fromCharCode(event.keyCode);
      //   console.log(keyCode);
      //   console.log(keyValue);
      //   switch (keyCode) {
      //     case 17:
      //       this.ctrlIsPressed = true;
      //       break;
      //     case 67:
      //       if (this.ctrlIsPressed) {
      //         console.log('ctrl + c');
      //       }
      //       break;
      //   }
      // };
      // document.onkeyup = function(event) {
      //   //获取键值
      //   let keyCode = event.keyCode;
      //   switch (keyCode) {
      //     case 17:
      //       this.ctrlIsPressed = false;
      //       break;
      //   }
      // };
    },
  },
  render() {
    return (
      <div class="toolbar panel-header">
        <div class="toolbar-item-group">
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.undo']}</template>
            <div class="command toolbar-item" data-command="undo">
              <a-icon type="undo" />
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.redo']}</template>
            <div class="command toolbar-item" data-command="redo">
              <a-icon type="redo" />
            </div>
          </a-tooltip>

          <a-divider type="vertical" />

          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.copy']}</template>
            <div class="command toolbar-item" data-command="copy">
              <a-icon type="copy" />
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.paste']}</template>
            <div class="command toolbar-item" data-command="paste">
              <a-icon type="snippets" />
            </div>
          </a-tooltip>

          <a-divider type="vertical" />

          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.zoomIn']}</template>
            <div class="command toolbar-item" data-command="zoomIn">
              <a-icon type="zoom-in" />
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.resetZoom']}</template>
            <div class="command toolbar-item" data-command="resetZoom">
              1:1
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.zoomOut']}</template>
            <div class="command toolbar-item" data-command="zoomOut">
              <a-icon type="zoom-out" />
            </div>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.autoFit']}</template>
            <div class="command toolbar-item" data-command="autoFit">
              <a-icon type="fullscreen" />
            </div>
          </a-tooltip>

          <a-divider type="vertical" />
          <a-tooltip>
            <span slot="title">{this.i18n['tooltip.toFront']}</span>
            <div class="command toolbar-item" data-command="toFront">
              <a-icon type="vertical-align-top" />
            </div>
          </a-tooltip>
          <a-tooltip>
            <span slot="title">{this.i18n['tooltip.toBack']}</span>
            <div class="command toolbar-item" data-command="toBack">
              <a-icon type="vertical-align-bottom" />
            </div>
          </a-tooltip>

          <a-divider type="vertical" />
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.delete']}</template>
            <div class="command toolbar-item" data-command="delete">
              <a-icon type="delete" />
            </div>
          </a-tooltip>
        </div>

        {/* <div style="toolbar-item-group">
          <a-tooltip>
            <template slot="title">{this.i18n['tooltip.toBack']}</template>
            <div class="command toolbar-item" data-command="toBack">
              <a-icon type="vertical-align-bottom" />
            </div>
          </a-tooltip>
        </div> */}
      </div>
    );
  },
};
