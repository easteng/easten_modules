/*
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: kcz
 * @Date: 2020-01-02 22:41:48
 * @LastEditors: kcz
 * @LastEditTime: 2020-04-03 13:27:44
 */

/*
 * author kcz
 * date 2019-11-20
 */
// import moment from "moment";
import customComponent from './customComponent';

import KBatch from '../KBatch/';
import KEditor from '../KEditor';
import UploadFile from '../UploadFile';
import UploadImg from '../UploadImg';
import KDatePicker from '../KDatePicker';
import KTimePicker from '../KTimePicker';
import FileManageSelect from '../../../../../sm-file/sm-file-manage-select';
export default {
  name: 'KFormItem',
  components: {
    KBatch,
    KEditor,
    UploadImg,
    UploadFile,
    KDatePicker,
    KTimePicker,
    customComponent,
    FileManageSelect,
  },
  props: {
    axios: {
      type: Function,
      required: null,
    },
    // 表单数组
    record: {
      type: Object,
      default: () => { },
    },
    // form-item 宽度配置
    config: {
      type: Object,
      required: true,
    },
    dynamicData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    customList() {
      if (window.$customComponentList) {
        return window.$customComponentList.map(item => item.type);
      } else {
        return [];
      }
    },
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      if (!this.$refs.KBatch) return true;
      return this.$refs.KBatch.validationSubform();
    },
    handleChange(value, key) {
      // change事件
      this.$emit('change', value, key);
    },
  },
  render() {
    let result;

    // 用于填写表单是，是否显示
    if (this.record.options.visible !== undefined && !this.record.options.visible) {
      return null;
    }

    if (
      [
        'input',
        'textarea',
        'date',
        'time',
        'number',
        'radio',
        'checkbox',
        'select',
        'rate',
        'switch',
        'slider',
        'uploadImg',
        'uploadFile',
      ].includes(this.record.type)
    ) {
      let item;
      if (this.record.type === 'input') {
        {
          /* 单行文本 */
        }
        item = (
          <a-input
            v-decorator={[
              this.record.model, // input 的 name
              {
                initialValue: this.record.options.defaultValue, // 默认值
                rules: this.record.rules, // 验证规则
              },
            ]}
            style={`width:${this.record.options.width}`}
            disabled={this.disabled || this.record.options.disabled}
            placeholder={this.record.options.placeholder}
            type={this.record.options.type}
            allow-clear={this.record.options.clearable}
            max-length={this.record.options.maxLength}
            onChange={$event => {
              this.handleChange($event.target.value, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'textarea') {
        {
          /* 多行文本 */
        }
        item = (
          <a-textarea
            v-decorator={[
              this.record.model, // input 的 name
              {
                initialValue: this.record.options.defaultValue, // 默认值
                rules: this.record.rules, // 验证规则
              },
            ]}
            style={`width:${this.record.options.width}`}
            auto-size={{
              minRows: this.record.options.minRows,
              maxRows: this.record.options.maxRows,
            }}
            disabled={this.disabled || this.record.options.disabled}
            placeholder={this.record.options.placeholder}
            allow-clear={this.record.options.clearable}
            max-length={this.record.options.maxLength}
            rows={4}
            onChange={$event => {
              this.handleChange($event.target.value, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'date') {
        {
          /* 日期选择 */
        }
        item = (
          <KDatePicker
            v-decorator={[
              this.record.model, // input 的 name
              {
                initialValue: this.record.options.range
                  ? this.record.options.rangeDefaultValue
                  : this.record.options.defaultValue, // 默认值
                rules: this.record.rules, // 验证规则
              },
            ]}
            record={this.record}
            parent-disabled={this.disabled}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'time') {
        {
          /* 时间选择  */
        }
        item = (
          <KTimePicker
            v-decorator={[
              this.record.model, // input 的 name
              {
                initialValue: this.record.options.defaultValue, // 默认值
                rules: this.record.rules, // 验证规则
              },
            ]}
            record={this.record}
            parent-disabled={this.disabled}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'number') {
        {
          /* 计数器  */
        }
        item = (
          <a-input-number
            v-decorator={[
              this.record.model,
              {
                initialValue: this.record.options.defaultValue,
                rules: this.record.rules,
              },
            ]}
            style={`width:${this.record.options.width}`}
            min={this.record.options.min}
            max={this.record.options.max}
            disabled={this.disabled || this.record.options.disabled}
            step={this.record.options.step}
            placeholder={this.record.options.placeholder}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'radio') {
        {
          /* 单选框  */
        }
        item = (
          <a-radio-group
            v-decorator={[
              this.record.model,
              {
                initialValue: this.record.options.defaultValue,
                rules: this.record.rules,
              },
            ]}
            options={
              !this.record.options.dynamic
                ? this.record.options.options
                : this.dynamicData[this.record.options.dynamicKey]
                  ? this.dynamicData[this.record.options.dynamicKey]
                  : []
            }
            disabled={this.disabled || this.record.options.disabled}
            placeholder={this.record.options.placeholder}
            onChange={$event => {
              this.handleChange($event.target.value, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'checkbox') {
        {
          /* 多选框  */
        }
        item = (
          <a-checkbox-group
            v-decorator={[
              this.record.model,
              {
                initialValue: this.record.options.defaultValue,
                rules: this.record.rules,
              },
            ]}
            options={
              !this.record.options.dynamic
                ? this.record.options.options
                : this.dynamicData[this.record.options.dynamicKey]
                  ? this.dynamicData[this.record.options.dynamicKey]
                  : []
            }
            disabled={this.disabled || this.record.options.disabled}
            placeholder={this.record.options.placeholder}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'rate') {
        {
          /* 评分  */
        }
        item = (
          <a-rate
            v-decorator={[
              this.record.model,
              {
                initialValue: this.record.options.defaultValue,
                rules: this.record.rules,
              },
            ]}
            count={this.record.options.max}
            disabled={this.disabled || this.record.options.disabled}
            placeholder={this.record.options.placeholder}
            allow-half={this.record.options.allowHalf}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'select') {
        {
          /* 下拉选框  */
        }
        item = (
          <a-select
            v-decorator={[
              this.record.model,
              {
                initialValue: this.record.options.defaultValue,
                rules: this.record.rules,
              },
            ]}
            style={`width:${this.record.options.width}`}
            placeholder={this.record.options.placeholder}
            show-search={this.record.options.filterable}
            options={
              !this.record.options.dynamic
                ? this.record.options.options
                : this.dynamicData[this.record.options.dynamicKey]
                  ? this.dynamicData[this.record.options.dynamicKey]
                  : []
            }
            disabled={this.disabled || this.record.options.disabled}
            allow-clear={this.record.options.clearable}
            mode={this.record.options.multiple ? 'multiple' : ''}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'switch') {
        {
          /* 开关  */
        }
        item = (
          <a-switch
            v-decorator={[
              this.record.model,
              {
                initialValue: this.record.options.defaultValue,
                valuePropName: 'checked',
                rules: this.record.rules,
              },
            ]}
            disabled={this.disabled || this.record.options.disabled}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      } else if (this.record.type === 'slider') {
        {
          /* 滑块  */
        }
        item = (
          <div style={`width:${this.record.options.width}`} class="slider-box">
            <div class="slider">
              <a-slider
                v-decorator={[
                  this.record.model,
                  {
                    initialValue: this.record.options.defaultValue,
                    rules: this.record.rules,
                  },
                ]}
                disabled={this.disabled || this.record.options.disabled}
                min={this.record.options.min}
                max={this.record.options.max}
                step={this.record.options.step}
                onChange={$event => {
                  this.handleChange($event, this.record.model);
                }}
              />
            </div>
            {this.record.options.showInput ? (
              <div class="number">
                <a-input-number
                  v-decorator={[
                    this.record.model,
                    {
                      initialValue: this.record.options.defaultValue,
                    },
                  ]}
                  style="width:100%"
                  disabled={this.disabled || this.record.options.disabled}
                  min={this.record.options.min}
                  max={this.record.options.max}
                  step={this.record.options.step}
                  onChange={$event => {
                    this.handleChange($event, this.record.model);
                  }}
                />
              </div>
            ) : (
              undefined
            )}
          </div>
        );
      }
      else if (this.record.type === 'uploadFile') {
        {
          /* 上传文件  */
        }
        item = (
          <FileManageSelect
            v-decorator={[
              this.record.model,
              {
                initialValue: [],
                rules: this.record.rules,
              },
            ]}
            axios={this.axios}
            disabled={this.disabled || this.record.options.disabled}
            height={60}
            enableDownload={true}
            onChange={$event => {
              this.handleChange($event, this.record.model);
            }}
          />
        );
      }
      result = (
        <a-form-item
          label={this.record.label}
          label-col={this.config.layout === 'horizontal' ? this.config.labelCol : {}}
          wrapper-col={this.config.layout === 'horizontal' ? this.config.wrapperCol : {}}
        >
          {' '}
          {item}
        </a-form-item>
      );
    } else if (this.record.type === 'batch' || this.record.type === 'editor') {
      {
        /* 可隐藏label  */
      }
      result = (
        <a-form-item
          label={!this.record.options.showLabel ? '' : this.record.label}
          label-col={
            this.config.layout === 'horizontal' && this.record.options.showLabel
              ? this.config.labelCol
              : {}
          }
          wrapper-col={
            this.config.layout === 'horizontal' && this.record.options.showLabel
              ? this.config.wrapperCol
              : {}
          }
          height={this.record.options.height+120}
        >
          {/* 动态表格 */} {/* 富文本编辑器  */}
          {this.record.type === 'batch' ? (
            <KBatch
              ref="KBatch"
              v-decorator={[
                this.record.model,
                {
                  initialValue: this.record.options.defaultValue,
                  rules: this.record.rules,
                },
              ]}
              style={`width:${this.record.options.width}`}
              record={this.record}
              parent-disabled={this.disabled}
              dynamic-data={this.dynamicData}
              onChange={$event => {
                this.handleChange($event, this.record.model);
              }}
            />
          ) : (
            <KEditor
              // ref="KEditor"
              v-decorator={[
                this.record.model,
                {
                  initialValue: this.record.options.defaultValue,
                  rules: this.record.rules,
                },
              ]}
              style={`width:${this.record.options.width}`}
              record={this.record}
              parent-disabled={this.disabled}
              dynamic-data={this.dynamicData}
              onChange={$event => {
                this.handleChange($event, this.record.model);
              }}
            />
          )}
        </a-form-item>
      );
    } else if (this.record.type === 'button') {
      {
        /* utton按钮  */
      }
      result = (
        <a-form-item
          wrapper-col={
            this.config.layout === 'horizontal'
              ? { ...this.config.wrapperCol, offset: this.config.labelCol.span }
              : {}
          }
        >
          <a-button
            disabled={this.disabled || this.record.options.disabled}
            type={this.record.options.type}
            html-type={this.record.options.handle === 'submit' ? 'submit' : undefined}
            onClick={
              this.record.options.handle === 'submit'
                ? false
                : this.record.options.handle === 'reset'
                  ? this.$emit('handleReset')
                  : this.dynamicData[this.record.options.dynamicFun]
                    ? this.dynamicData[this.record.options.dynamicFun]()
                    : false
            }
          >
            {this.record.label}
          </a-button>
        </a-form-item>
      );
    } else if (this.record.type === 'alert') {
      {
        /* alert提示  */
      }
      result = (
        <a-form-item>
          <a-alert
            message={this.record.label}
            description={this.record.options.description}
            type={this.record.options.type}
            show-icon={this.record.options.showIcon}
            closable={this.record.options.closable}
            banner={this.record.options.banner}
          />
        </a-form-item>
      );
    } else if (this.record.type === 'text') {
      {
        /* 文本  */
      }
      result = (
        <a-form-item>
          <div style={{ textAlign: this.record.options.textAlign }}>
            <label class={{ 'ant-form-item-required': this.record.options.showRequiredMark }}>
              {this.record.label}
            </label>
          </div>
        </a-form-item>
      );
    } else if (this.record.type === 'html') {
      {
        /* html */
      }
      result = <div domPropsInnerHTML={this.record.options.defaultValue}></div>;
    } else if (this.customList.includes(this.record.type)) {
      // 自定义组件
      result = (
        <customComponent
          record={this.record}
          disabled={this.disabled}
          config={this.config}
          onChange={$event => {
            this.handleChange($event, this.record.model);
          }}
        />
      );
    } else {
      let item;
      if (
        this.record.type === 'divider' &&
        this.record.label !== '' &&
        this.record.options.orientation
      ) {
        item = (
          <a-divider orientation={this.record.options.orientation}>{this.record.label}</a-divider>
        );
      } else if (this.record.type === 'divider' && this.record.label !== '') {
        item = <a-divider>{this.record.label}</a-divider>;
      } else if (this.record.type === 'divider' && this.record.label === '') {
        item = <a-divider />;
      }
      result = (
        <div>
          {/* 分割线  */}
          {item}
        </div>
      );
    }
    return <div style={{ 'height': this.record.type === 'editor' ? `${this.record.options.height + 120}px` : '' }}>{result}</div>;
  },
};
