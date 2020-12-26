/*
 * author kcz
 * date 2019-11-20
 * description 修改多选、下拉、单选等控件options的组件，添加移除校验规制的组件
 */
import './index.less';
export default {
  name: 'KChangeOption',
  props: {
    value: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: 'option',
    },
  },
  methods: {
    handleAdd() {
      // 添加
      let addData = [
        ...this.value,
        {
          value: '',
          label: '',
        },
      ];
      this.$emit('input', addData);
    },
    handleAddCol() {
      // 添加栅格Col
      let addData = [
        ...this.value,
        {
          span: 12,
          list: [],
        },
      ];
      this.$emit('input', addData);
    },
    handleAddRules() {
      let addData = [
        ...this.value,
        {
          pattern: '',
          message: '',
        },
      ];
      this.$emit('input', addData);
    },
    handleDelete(deleteIndex) {
      // 删除
      this.$emit(
        'input',
        this.value.filter((val, index) => index !== deleteIndex),
      );
    },
  },
  render() {
    let result;
    if (this.type === 'option') {
      result = (
        <a-row gutter={8}>
          {this.value.map((val, index) => {
            return (
              <div key={index} class="option-change-box">
                <a-col span={9}>
                  <a-input
                    value={val.label}
                    onInput={event => {
                      val.label = event.target.value;
                    }}
                    placeholder="名称"
                  />
                </a-col>
                <a-col span={9}>
                  <a-input
                    value={val.value}
                    onInput={event => {
                      val.value = event.target.value;
                    }}
                    placeholder="值"
                  />
                </a-col>
                <a-col span={6}>
                  <div
                    class="option-delete-box"
                    onClick={() => {
                      this.handleDelete(index);
                    }}
                  >
                    <a-icon type="delete" />
                  </div>
                </a-col>
              </div>
            );
          })}

          <a-col span={24}>
            <a onClick={this.handleAdd}>添加</a>
          </a-col>
        </a-row>
      );
    } else if (this.type === 'rules') {
      result = (
        <a-row gutter={8}>
          {this.value.map((val, index) => {
            return (
              <span key={index}>
                {index !== 0 ? (
                  <div class="option-change-box">
                    <a-col span={18}>
                      <a-input
                        value={val.message}
                        onInput={event => {
                          val.message = event.target.value;
                        }}
                        placeholder="提示信息"
                      />
                    </a-col>
                    <a-col span={18}>
                      <a-input
                        value={val.pattern}
                        onInput={event => {
                          val.pattern = event.target.value;
                        }}
                        placeholder="正则表达式,省略 “/”"
                      />
                    </a-col>
                    <a-col span={6}>
                      <div
                        class="option-delete-box"
                        onClick={() => {
                          this.handleDelete(index);
                        }}
                      >
                        <a-icon type="delete" />
                      </div>
                    </a-col>
                  </div>
                ) : (
                  undefined
                )}
              </span>
            );
          })}

          <a-col span={24}>
            <a onClick={this.handleAddRules}>增加校验</a>
          </a-col>
        </a-row>
      );
    } else if (this.type === 'colspan') {
      result = (
        <a-row gutter={8}>
          {this.value.map((val, index) => {
            return (
              <div key={index} class="option-change-box">
                <a-col span={18}>
                  <a-input-number
                    value={val.span}
                    onChange={value => {
                      val.span = value;
                    }}
                    style="width:100%"
                    max={24}
                    placeholder="名称"
                  />
                </a-col>
                <a-col span={6}>
                  <div
                    class="option-delete-box"
                    onClick={() => {
                      this.handleDelete(index);
                    }}
                  >
                    <a-icon type="delete" />
                  </div>
                </a-col>
              </div>
            );
          })}

          <a-col span={24}>
            <a onClick={this.handleAddCol}>添加</a>
          </a-col>
        </a-row>
      );
    }
    return <div class="option-change-container">{result}</div>;
  },
};
