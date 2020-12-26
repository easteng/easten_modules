/*
 * author kcz
 * date 2019-11-20
 */
import KFormItem from '../KFormItem/index';
export default {
  name: 'BuildBlocks',
  components: {
    KFormItem,
  },
  props: {
    axios: {
      type: Function,
      required: null,
    },
    record: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    dynamicData: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      if (
        typeof this.$refs.nestedComponents === 'undefined' ||
        typeof this.$refs.nestedComponents.validationSubform === 'undefined'
      )
        return true;

      return this.$refs.nestedComponents.validationSubform();
    },
    handleChange(value, key) {
      this.$emit('change', value, key);
    },
  },

  render() {
    let result;
    if (this.record.type === 'grid') {
      {
        /* 栅格布局  */
      }
      result = (
        <a-row class="grid-row" gutter={this.record.options.gutter}>
          {this.record.columns.map((colItem, idnex) => {
            return (
              <a-col key={idnex} class="grid-col" span={colItem.span || 0}>
                {colItem.list.map(item => {
                  return (
                    <buildBlocks
                      ref="nestedComponents"
                      key={item.key}
                      disabled={this.disabled}
                      dynamic-data={this.dynamicData}
                      record={item}
                      config={this.config}
                      onHandleReset={() => {
                        this.$emit('handleReset');
                      }}
                      onChange={this.handleChange}
                    />
                  );
                })}
              </a-col>
            );
          })}
        </a-row>
      );
    } else if (this.record.type === 'card') {
      {
        /* 卡片布局  */
      }
      result = (
        <a-card class="grid-row" title={this.record.label}>
          {this.record.list.map(item => {
            return (
              <KFormItem
              axios={this.axios}
              ref="subnestedComponents"
              key={item.key}
              disabled={item.options.disabled}
              dynamic-data={item.dynamicData}
              record={item}
              config={this.config}
              onHandleReset={() => {
                this.$emit('handleReset');
              }}
              onChange={this.handleChange}
            />
            //   <buildBlocks
            //     ref="nestedComponents"
            //     key={item.key}
            //     disabled={this.disabled}
            //     dynamic-data={this.dynamicData}
            //     record={item}
            //     config={this.config}
            //     onHandleReset={() => {
            //       this.$emit('handleReset');
            //     }}
            //     onChange={this.handleChange}
            //   />
             );
          })}
        </a-card>
      );
    } else if (this.record.type === 'table') {
      {
        /* 表格布局  */
      }
      result = (
        <table
          class="kk-table-9136076486841527"
          class={{
            bright: this.record.options.bright,
            small: this.record.options.small,
            bordered: this.record.options.bordered,
          }}
          width={this.record.options.width}
          style={this.record.options.customStyle}
        >
          {this.record.trs.map((trItem, trIndex) => {
            return (
              <tr key={trIndex}>
                {trItem.tds.map((tdItem, tdIndex) => {
                  return (
                    <td
                      key={tdIndex}
                      class="table-td"
                      colspan={tdItem.colspan}
                      rowspan={tdItem.rowspan}
                    >
                      {tdItem.list.map(item => {
                        return (
                          <buildBlocks
                            ref="nestedComponents"
                            key={item.key}
                            disabled={this.disabled}
                            dynamic-data={this.dynamicData}
                            record={item}
                            config={this.config}
                            onHandleReset={() => {
                              this.$emit('handleReset');
                            }}
                            onChange={this.handleChange}
                          />
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </table>
      );
    } else {
      result = (
        <KFormItem
          axios={this.axios}
          ref="nestedComponents"
          key={this.record.key}
          disabled={this.disabled}
          dynamic-data={this.dynamicData}
          record={this.record}
          config={this.config}
          onHandleReset={() => {
            this.$emit('handleReset');
          }}
          onChange={this.handleChange}
        />
      );
    }
    return <div>{result}</div>;
  },
};
