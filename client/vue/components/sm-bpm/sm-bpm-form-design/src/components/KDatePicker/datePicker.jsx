/*
 * @Description: 日期选择器
 * @Author: kcz
 * @Date: 2020-01-11 15:38:28
 * @LastEditors: kcz
 * @LastEditTime: 2020-03-28 17:37:49
 */
import moment from 'moment';

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['record', 'value', 'parentDisabled'],
  data() {
    return {
      // date: undefined
    };
  },
  computed: {
    date() {
      if (!this.value || (this.record.options.range && this.value.length === 0)) {
        return undefined;
      } else if (this.record.options.range) {
        return this.value.map(item => moment(item, this.record.options.format));
      } else {
        return moment(this.value, this.record.options.format);
      }
    },
  },
  methods: {
    handleSelectChange(val) {
      let date;
      if (!val || (this.record.options.range && val.length === 0)) {
        date = '';
      } else if (this.record.options.range) {
        date = val.map(item => item.format(this.record.options.format));
      } else {
        date = val.format(this.record.options.format);
      }
      this.$emit('change', date);
      this.$emit('input', date);
    },
  },

  render() {
    let dateType;
    if (
      this.record.type === 'date' &&
      this.record.options.format === 'YYYY-MM' &&
      this.record.options.range === false
    ) {
      {
        /* 月份选择  */
      }
      dateType = (
        <a-month-picker
          style={`width:${this.record.options.width}`}
          disabled={this.record.options.disabled || this.parentDisabled}
          allow-clear={this.record.options.clearable}
          placeholder={this.record.options.placeholder}
          format={this.record.options.format}
          value={this.date}
          onChange={this.handleSelectChange}
        />
      );
    } else if (this.record.type === 'date' && this.record.options.range === false) {
      {
        /* 日期选择 */
      }

      dateType = (
        <a-date-picker
          style={`width:${this.record.options.width}`}
          disabled={this.record.options.disabled || this.parentDisabled}
          show-time={this.record.options.showTime}
          allow-clear={this.record.options.clearable}
          placeholder={this.record.options.placeholder}
          format={this.record.options.format}
          value={this.date}
          onChange={this.handleSelectChange}
        />
      );
    } else if (this.record.type === 'date' && this.record.options.range === true) {
      {
        /* 范围日期选择 */
      }
      dateType = (
        <a-range-picker
          style={`width:${this.record.options.width}`}
          show-time={this.record.options.showTime}
          disabled={this.record.options.disabled || this.parentDisabled}
          allow-clear={this.record.options.clearable}
          placeholder={this.record.options.rangePlaceholder}
          format={this.record.options.format}
          value={this.date}
          onChange={this.handleSelectChange}
        />
      );
    }
    return dateType;
  },
};
