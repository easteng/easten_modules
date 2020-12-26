/*
 * author kcz
 * date 2019-11-20
 * description 多选框组件,改成v-model Boolean值
 */
export default {
  name: 'KCheckbox',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chackboxVal: false,
    };
  },
  computed: {
    _val() {
      this.handleSetChackboxVal(this.value);
      return this.value;
    },
  },
  methods: {
    handleChange(e) {
      this.$emit('input', e.target.checked);
    },
    handleSetChackboxVal(val) {
      this.chackboxVal = val;
    },
  },

  render() {
    return (
      <a-checkbox val={this._val} checked={this.chackboxVal} onChange={this.handleChange}>
        {this.label}
      </a-checkbox>
    );
  },
};
