/*
 * @Description: 对vue-quill-editor封装
 * @Author: kcz
 * @Date: 2020-03-30 12:44:03
 * @LastEditors: kcz
 * @LastEditTime: 2020-03-30 14:02:54
 */

import { quillEditor } from 'vue-quill-editor'; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import './index.less';
export default {
  name: 'Editor',
  components: { quillEditor },
  props: ['value', 'record', 'parentDisabled'],
  data() {
    return {
      editorOption: {
        placeholder: this.record.options.placeholder,
      },
    };
  },
  methods: {
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange(e) {
      this.$emit('change', e.html);
    },
  },
  render() {
    return (
      <quillEditor
        ref="vueQuillEditor"
        style={{ height: `${this.record.options.height+110}px` }}
        value={this.value}
        class="ql-editor-class"
        class={{ chinesization: this.record.options.chinesization }}
        options={this.editorOption}
        disabled={this.record.options.disabled || this.parentDisabled}
        onBlur={$event => {
          this.onEditorBlur($event);
        }}
        onFocus={$event => {
          this.onEditorFocus($event);
        }}
        onChange={$event => {
          this.onEditorChange($event);
        }}
      />
    );
  },
};
