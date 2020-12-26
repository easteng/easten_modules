import moment from 'moment';
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['record', 'value', 'parentDisabled'],
  computed: {
    time() {
      if (!this.value) {
        return undefined;
      } else {
        return moment(this.value, this.record.options.format);
      }
    },
  },
  methods: {
    handleSelectChange(val) {
      let time;
      if (!val) {
        time = '';
      } else {
        time = val.format(this.record.options.format);
      }
      this.$emit('change', time);
      this.$emit('input', time);
    },
  },
  render() {
    return (
      <a-time-picker
        style={`width:${this.record.options.width}`}
        disabled={this.record.options.disabled || this.parentDisabled}
        allow-clear={this.record.options.clearable}
        placeholder={this.record.options.placeholder}
        format={this.record.options.format}
        value={this.time}
        onChange={this.handleSelectChange}
      />
    );
  },
};
