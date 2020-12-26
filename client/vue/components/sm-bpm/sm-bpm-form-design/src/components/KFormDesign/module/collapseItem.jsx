/*
 * @Description: 折叠组件
 * @Author: kcz
 * @Date: 2020-01-13 00:37:54
 * @LastEditors: kcz
 * @LastEditTime: 2020-03-28 11:32:39
 */

import draggable from 'vuedraggable';
export default {
  name: 'CollapseItem',
  components: {
    draggable,
  },
  props: ['list'],
  methods: {
    handleStart(e, list) {
      this.$emit('start', list[e.oldIndex].type);
    },
  },
  render() {
    return (
      <draggable
        tag="ul"
        value={this.list}
        group={{ name: 'form-draggable', pull: 'clone', put: false }}
        sort={false}
        animation={180}
        ghostClass="moving"
        onStart={$event => {
          this.handleStart($event, this.list);
        }}
      >
        {this.list.map((val, index) => {
          return (
            <li
              key={index}
              onDragstart={() => {
                this.$emit('generateKey', this.list, index);
              }}
              onClick={() => this.$emit('handleListPush', val)}
            >
              {/* <svg v-if="val.icon" class="icon" aria-hidden="true">
                   <use :xlink:href="`#${val.icon}`" />
                </svg>*/}
              {val.label}
            </li>
          );
        })}
      </draggable>
    );
  },
};
