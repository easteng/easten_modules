/*
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: kcz
 * @Date: 2020-01-02 22:41:48
 * @LastEditors: kcz
 * @LastEditTime: 2020-04-02 20:39:42
 */

/*
 * author kcz
 * date 2019-11-20
 */
// import moment from "moment";
import './index.less';
// import './index.less';
import UploadFile from '../../UploadFile';
import UploadImg from '../../UploadImg';
import KDatePicker from '../../KDatePicker';
import KTimePicker from '../../KTimePicker';
export default {
  name: 'KFormItem',
  components: {
    UploadImg,
    UploadFile,
    KDatePicker,
    KTimePicker,
  },
  props: ['record', 'domains', 'index', 'value', 'parentDisabled', 'dynamicData'],
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
    handleChange(e) {
      this.$emit('input', e);
    },
  },

  render() {
    let result;
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
            style={`width:${this.record.options.width}`}
            disabled={this.record.options.disabled || this.parentDisabled}
            placeholder={this.record.options.placeholder}
            type={this.record.options.type}
            allow-clear={this.record.options.clearable}
            max-length={this.record.options.maxLength}
            value={this.value}
            onChange={$event => {
              this.handleChange($event.target.value);
            }}
          />
        );
      } else if (this.record.type === 'textarea') {
        {
          /* 多行文本 */
        }
        item = (
          <a-textarea
            style={`width:${this.record.options.width}`}
            auto-size={{
              minRows: this.record.options.minRows,
              maxRows: this.record.options.maxRows,
            }}
            disabled={this.record.options.disabled || this.parentDisabled}
            placeholder={this.record.options.placeholder}
            allow-clear={this.record.options.clearable}
            max-length={this.record.options.maxLength}
            rows={4}
            value={this.value}
            onChange={$event => {
              this.handleChange($event.target.value);
            }}
          />
        );
      } else if (this.record.type === 'date') {
        {
          /* 日期选择 */
        }
        item = (
          <KDatePicker
            parent-disabled={this.parentDisabled}
            record={this.record}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'time') {
        {
          /* 时间选择 */
        }
        item = (
          <KTimePicker
            parent-disabled={this.parentDisabled}
            record={this.record}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'number') {
        {
          /* 计数器 */
        }
        item = (
          <a-input-number
            style={`width:${this.record.options.width}`}
            min={this.record.options.min}
            max={this.record.options.max}
            disabled={this.record.options.disabled || this.parentDisabled}
            step={this.record.options.step}
            placeholder={this.record.options.placeholder}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'radio') {
        {
          /* 单选框 */
        }
        item = (
          <a-radio-group
            options={
              !this.record.options.dynamic
                ? this.record.options.options
                : this.dynamicData[this.record.options.dynamicKey]
                  ? this.dynamicData[this.record.options.dynamicKey]
                  : []
            }
            disabled={this.record.options.disabled || this.parentDisabled}
            placeholder={this.record.options.placeholder}
            value={this.value}
            onChange={$event => {
              this.handleChange($event.target.value);
            }}
          />
        );
      } else if (this.record.type === 'checkbox') {
        {
          /* 多选框 */
        }
        item = (
          <a-checkbox-group
            options={
              !this.record.options.dynamic
                ? this.record.options.options
                : this.dynamicData[this.record.options.dynamicKey]
                  ? this.dynamicData[this.record.options.dynamicKey]
                  : []
            }
            disabled={this.record.options.disabled || this.parentDisabled}
            placeholder={this.record.options.placeholder}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'rate') {
        {
          /* 评分 */
        }
        item = (
          <a-rate
            count={this.record.options.max}
            disabled={this.record.options.disabled || this.parentDisabled}
            placeholder={this.record.options.placeholder}
            allow-half={this.record.options.allowHalf}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'select') {
        {
          /* 下拉选框 */
        }
        item = (
          <a-select
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
            disabled={this.record.options.disabled || this.parentDisabled}
            allow-clear={this.record.options.clearable}
            mode={this.record.options.multiple ? 'multiple' : ''}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'switch') {
        {
          /* 开关 */
        }
        item = (
          <a-switch
            disabled={this.record.options.disabled || this.parentDisabled}
            checked={this.value}
            onChange={this.handleChange}
          />
        );
      } else if (this.record.type === 'slider') {
        {
          /* 滑块 */
        }
        item = (
          <div style={`width:${this.record.options.width}`} class="slider-box">
            <div class="slider">
              <a-slider
                disabled={this.record.options.disabled || this.parentDisabled}
                min={this.record.options.min}
                max={this.record.options.max}
                step={this.record.options.step}
                value={this.value}
                onChange={this.handleChange}
              />
            </div>
            {this.record.options.showInput ? (
              <div class="number">
                <a-input-number
                  style="width:100%"
                  disabled={this.record.options.disabled || this.parentDisabled}
                  min={this.record.options.min}
                  max={this.record.options.max}
                  step={this.record.options.step}
                  value={this.value}
                  onChange={this.handleChange}
                />
              </div>
            ) : (
              undefined
            )}
          </div>
        );
      }
      //  else if (this.record.type === 'uploadImg') {
      //   {
      //     /* 上传图片 */
      //   }
      //   item = (
      //     <UploadImg
      //       style={`width:${this.record.options.width}`}
      //       parent-disabled="parentDisabled"
      //       record={this.record}
      //       value={this.value}
      //       onChange={this.handleChange}
      //     />
      //   );
      // } 
      else if (this.record.type === 'uploadFile') {
        {
          /* 上传文件 */
        }
        item = (
          <UploadFile
            style={`width:${this.record.options.width}`}
            parent-disabled={this.parentDisabled}
            record={this.record}
            value={this.value}
            onChange={this.handleChange}
          />
        );
      }
      result = (
        <a-form-model-item
          prop={`domains.${this.index}.${this.record.model}`}
          rules={this.record.rules}
        >
          {item}
        </a-form-model-item>
      );
    } else if (this.record.type === 'text') {
      // html
      result = (
        <a-form-model-item>
          <div style={{ textAlign: this.record.options.textAlign }}>
            <label
              class={{ 'ant-form-item-required': this.record.options.showRequiredMark }}
              v-text={this.record.label}
            />
          </div>
        </a-form-model-item>
      );
    } else if (this.record.type === 'html') {
      //  文本
      result = <div v-html={this.record.options.defaultValue} />;
    } else {
      result = <div>{/* 空 */}</div>;
    }
    return result;
  },
};
