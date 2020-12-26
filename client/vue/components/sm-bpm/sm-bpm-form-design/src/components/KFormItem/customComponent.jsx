export default {
  name: 'CustomComponent',
  props: ['record', 'config', 'disabled'],
  computed: {
    customComponent() {
      // 计算需要显示的组件
      let customComponentList = {};
      if (window.$customComponentList) {
        // 将数组映射成json
        window.$customComponentList.forEach(item => {
          customComponentList[item.type] = item.component;
        });
      }
      return customComponentList[this.record.type];
    },
  },
  methods: {
    handleChange(value, key) {
      this.$emit('change', value, key);
    },
  },
  render() {
    return (
      <a-form-item
        label={this.record.label}
        label-col={this.config.layout === 'horizontal' ? this.config.labelCol : {}}
        wrapper-col={this.config.layout === 'horizontal' ? this.config.wrapperCol : {}}
      >
        <component
          is={this.customComponent}
          v-decorator={[
            this.record.model,
            {
              initialValue: this.record.options.defaultValue,
              rules: this.record.rules,
            },
          ]}
          record={this.record}
          style={`width:${this.record.options.width}`}
          disabled={this.disabled}
          height={
            typeof this.record.options.height !== 'undefined' ? this.record.options.height : ''
          }
          onChange={this.handleChange}
        />
      </a-form-item>
    );
  },
};
