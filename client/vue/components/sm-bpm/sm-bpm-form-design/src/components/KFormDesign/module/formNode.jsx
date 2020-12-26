/*
 * @Author: kcz
 * @Date: 2019-12-30 00:37:05
 * @LastEditTime: 2020-03-27 19:19:11
 * @LastEditors: kcz
 * @Description: 将数据通过k-form-item组件解析，生成控件
 * @FilePath: \k-form-design\packages\KFormDesign\module\formNode.vue
 */

/*
 * author kcz
 * date 2019-11-20
 * description 通过json生成的单个表单节点
 */
import kFormItem from '../../KFormItem/index';
export default {
  components: {
    kFormItem,
  },
  props: {
    record: {
      type: Object,
      required: true,
    },
    selectItem: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      required: true,
    },
  },
  render() {
    return (
      <div
        class={{ active: this.record.key === this.selectItem.key, 'drag-move-box': true }}
        onClick={event => {
          event.stopPropagation();
          this.$emit('handleSelectItem', this.record);
        }}
      >
        <div class="form-item-box">
          <kFormItem config={this.config} record={this.record} />
        </div>
        <div class="show-key-box">{this.record.model}</div>
        <div
          class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'copy')}
          onClick={event => {
            event.stopPropagation();
            this.$emit('handleCopy');
          }}
        >
          <a-icon type="copy" />
        </div>
        <div
          class={(this.record.key === this.selectItem.key ? 'active' : 'unactivated', 'delete')}
          onClick={event => {
            event.stopPropagation();
            this.$emit('handleDetele');
          }}
        >
          <a-icon type="delete" />
        </div>
      </div>
    );
  },
};
