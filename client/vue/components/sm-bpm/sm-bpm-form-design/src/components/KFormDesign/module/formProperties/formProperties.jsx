/*
 * author kcz
 * date 2019-11-20
 * description 表单属性设置面板组件
 */
import './index.less';
import kCheckbox from '../../../KCheckbox/';
export default {
  name: 'FormProperties',
  components: {
    kCheckbox,
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
    previewOptions: {
      type: Object,
      required: true,
    },
  },
  render() {
    return (
      <a-form>
        {typeof this.config.layout !== 'undefined' ? (
          <a-form-item label="表单布局">
            <a-radio-group
              value={this.config.layout}
              onChange={event => {
                this.config.layout = event.target.value;
              }}
              button-style="solid"
            >
              <a-radio-button value="horizontal">水平</a-radio-button>
              <a-radio-button value="vertical">垂直</a-radio-button>
              <a-radio-button value="inline">行内</a-radio-button>
            </a-radio-group>
          </a-form-item>
        ) : (
          undefined
        )}

        <a-form-item label="labelCol（水平布局生效）">
          <div class="change-col-box">
            <a-slider
              id="test"
              value={this.config.labelCol.span}
              onChange={value => {
                this.config.labelCol.span = value;
                this.config.wrapperCol.span = 24 - this.config.labelCol.span;
              }}
              max={24}
              min={0}
            />
          </div>
        </a-form-item>
        <a-form-item label="wrapperCol（水平布局生效）">
          <div class="change-col-box">
            <div>
              <label>span:</label>
              <a-input-number
                style="width:100%"
                value={this.config.wrapperCol.span}
                onInput={event => {
                  this.config.wrapperCol.span = event.target.value;
                }}
              />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="预览模态框宽度">
          <a-input-number
            value={this.previewOptions.width}
            onChange={value => {
              this.previewOptions.width = value;
            }}
            style="width:100%;"
          />
        </a-form-item>
        <a-form-item label="表单CSS">
          <a-input
            value={this.config.customStyle}
            onInput={event => {
              this.config.customStyle = event.target.value;
            }}
          />
        </a-form-item>
        <a-form-item label="表单属性">
          {typeof this.config.hideRequiredMark !== 'undefined' ? (
            <kCheckbox
              value={this.config.hideRequiredMark}
              onInput={value => {
                this.config.hideRequiredMark = value;
              }}
              label="隐藏必选标记"
            />
          ) : (
            undefined
          )}
        </a-form-item>
        <a-form-item label="提示">实际预览效果请点击预览查看</a-form-item>
      </a-form>
    );
  },
};
