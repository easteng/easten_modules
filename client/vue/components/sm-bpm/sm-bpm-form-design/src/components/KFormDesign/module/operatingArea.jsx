/*
 * @Description: 头部
 * @Author: kcz
 * @Date: 2019-12-30 00:37:05
 * @LastEditors: kcz
 * @LastEditTime: 2020-03-26 20:05:57
 */

export default {
  props: {
    toolbars: {
      type: Array,
      default: () => [
        'save',
        'preview',
        'importJson',
        'exportJson',
        'exportCode',
        'reset',
        'close',
      ],
    },
    showToolbarsText: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    return (
      <div class="operating-area">
        {/* 头部操作按钮区域 start  */}
        {/* 操作左侧区域 start  */}
        <div class="operating-area-group">
          <a-tooltip title="保存">
            {this.toolbars.includes('save') ? (
              <div
                class="operating-area-item"
                onClick={() => {
                  this.$emit('handleSave');
                }}
              >
                <a-icon type="save" />
                {this.showToolbarsText ? <span>保存</span> : undefined}
              </div>
            ) : (
              undefined
            )}
          </a-tooltip>

          <a-tooltip title="预览">
            {this.toolbars.includes('preview') ? (
              <div
                class="operating-area-item"
                onClick={() => {
                  this.$emit('handlePreview');
                }}
              >
                <a-icon type="chrome" />
                {this.showToolbarsText ? <span>预览</span> : undefined}
              </div>
            ) : (
              undefined
            )}
          </a-tooltip>

          <a-divider type="vertical" />

          <a-tooltip title="导入">
            {this.toolbars.includes('importJson') ? (
              <div
                class="operating-area-item"
                onClick={() => {
                  this.$emit('handleOpenImportJsonModal');
                }}
              >
                <a-icon type="upload" />
                {this.showToolbarsText ? <span>导入</span> : undefined}
              </div>
            ) : (
              undefined
            )}
          </a-tooltip>
          <a-tooltip title="生成JSON">
            {this.toolbars.includes('exportJson') ? (
              <div
                class="operating-area-item"
                onClick={() => {
                  this.$emit('handleOpenJsonModal');
                }}
              >
                <a-icon type="download" />
                {this.showToolbarsText ? <span>生成JSON</span> : undefined}
              </div>
            ) : (
              undefined
            )}
          </a-tooltip>

          <a-divider type="vertical" />

          <a-tooltip title="生成代码">
            {this.toolbars.includes('exportCode') ? (
              <div
                class="operating-area-item"
                onClick={() => {
                  this.$emit('handleOpenCodeModal');
                }}
              >
                <a-icon type="code" />
                {this.showToolbarsText ? <span>生成代码</span> : undefined}
              </div>
            ) : (
              undefined
            )}
          </a-tooltip>



          <a-tooltip title="清空">
            {this.toolbars.includes('reset') ? (
              <div
                class="operating-area-item"
                onClick={() => {
                  this.$emit('handleReset');
                }}
              >
                <a-icon type="delete" />
                {this.showToolbarsText ? <span>清空</span> : undefined}
              </div>
            ) : (
              undefined
            )}
          </a-tooltip>
          <slot name="left-action" />
        </div>

        <div class="operating-area-group">
          <slot name="right-action" />
        </div>
      </div>
    );
  },
};
