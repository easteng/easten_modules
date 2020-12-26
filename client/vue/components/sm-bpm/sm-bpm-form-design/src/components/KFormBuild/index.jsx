/*
 * author kcz
 * date 2019-11-20
 * description 将json数据构建成表单
 */
import buildBlocks from './buildBlocks';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
// import { rename } from 'fs-extra';
// import moment from "moment";
export default {
  name: 'KFormBuild',
  components: {
    buildBlocks,
  },
  // props: ["value", "dynamicData"],
  props: {
    axios: {
      type: Function,
      required: null,
    },
    value: {
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
    outputString: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      locale: zhCN,
      form: this.$form.createForm(this),
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setData(this.defaultValue);
    });
  },
  methods: {
    // moment,
    handleSubmit(e) {
      // 提交按钮触发，并触发submit函数，返回getData函数
      e.preventDefault();
      this.$emit('submit', this.getData);
    },
    reset() {
      // 重置表单
      this.form.resetFields();
    },
    getData() {
      // 提交函数，提供父级组件调用
      return new Promise((resolve, reject) => {
        try {
          this.form.validateFields((err, values) => {
            if (err) {
              reject(err);
            }
            for (let item in this.$refs) {
              if (item.indexOf('buildBlock-') > -1) {
                if (!this.$refs[item].validationSubform()) {
                  reject(err);
                }
              }
            }

            if (this.outputString) {             
              // 需要所有value转成字符串
              for (let key in values) {
                let type = typeof values[key];
                if (type === 'string' || type === 'undefined') {
                  continue;
                } else if (type === 'object') {
                  values[key] = `k-form-design#${type}#${JSON.stringify(values[key])}`;
                } else {
                  values[key] = `k-form-design#${type}#${String(values[key])}`;
                }
              }
              resolve(values);
            } else {
              resolve(values);
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    setData(json) {
      return new Promise((resolve, reject) => {
        try {
          if (this.outputString) {
            // 将非string数据还原
            for (let key in json) {
              if (!json[key].startsWith('k-form-design#')) {
                continue;
              }
              let array = json[key].split('#');
              if (array[1] === 'object') {
                json[key] = JSON.parse(array[2]);
              } else if (array[1] === 'number') {
                json[key] = Number(array[2]);
              } else if (array[1] === 'boolean') {
                json[key] = Boolean(array[2]);
              }
            }
            this.form.setFieldsValue(json);
          } else {
            this.form.setFieldsValue(json);
          }
        } catch (err) {
          reject(err);
        }
      });
    },
    handleChange(value, key) {
      // 触发change事件
      this.$emit('change', value, key);
    },
  },

  render() {
    return (
      <div>
        <a-config-provider locale={this.locale}>
          {typeof this.value.list !== 'undefined' && typeof this.value.config !== 'undefined' ? (
            <a-form
              class="k-form-build-9136076486841527"
              layout={this.value.config.layout}
              hide-required-mark={this.value.config.hideRequiredMark}
              form={this.form}
              style={this.value.config.customStyle}
              onSubmit={this.handleSubmit}
            >
              {this.value.list.map((record, index) => {
                return (
                  <buildBlocks
                    axios={this.axios}
                    ref={'buildBlock-' + index}
                    key={index}
                    record={record}
                    dynamic-data={this.dynamicData}
                    disabled={this.disabled}
                    config={this.value.config}
                    onHandleReset={this.reset}
                    onChange={this.handleChange}
                  />
                );
              })}
            </a-form>
          ) : (
            undefined
          )}
        </a-config-provider>
      </div>
    );
  },
};
