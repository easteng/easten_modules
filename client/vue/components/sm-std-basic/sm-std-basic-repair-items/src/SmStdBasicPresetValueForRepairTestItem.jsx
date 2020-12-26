export default {
  name: 'SmStdBasicPresetValueForRepairTestItem',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }, // 编辑模式和查看模式
    placeholder: { type: String, default: '请输入' }, // 输入框默认文字
  },
  data() {
    return {
      iValue: [],
    };
  },
  computed: {},
  watch: {
    value: {
      handler: async function (nValue, oValue) {
        this.iValue = nValue;
      },
      immediate: true,
    },
  },

  created() { },

  methods: {
    add() {
      this.iValue.push({
        index: this.iValue.length,
        value: '',
      });
    },

    remove(item) {
      this.iValue = this.iValue.filter(_item => _item.index !== item.index);
      this.$emit('change', this.iValue);
    },
  },
  render() {
    let preValueList = <div>
      {this.iValue.map((item, index) => {
        return <div style="display: inline-flex; justify-content: space-between; width:100%;">
          <a-input
            value={item.value}
            placeholder={this.placeholder}
            disabled={this.disabled}
            onChange={event => {
              item.value = event.target.value;
              this.$emit('change', this.iValue);
            }} />
          <a-button
            style="margin-left:10px;"
            onClick={() => {
              this.remove(item);
            }}>删除</a-button>


        </div>;
      })}
    </div>;
    return (
      <div class="preset-value-for-repair-test-item">
        {preValueList}
        {!this.disabled ? <a-button type="primary" onClick={() => {
          this.add();
        }}>添加</a-button> : undefined}

      </div>
    );
  },
};
