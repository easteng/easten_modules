import { upload } from './src/icon/upload.svg';
import FileModal from '../sm-file-manage-modal/SmFileManageModal';
import * as utils from '../../_utils/utils';

export default {
  name: 'SmFileTextEditor',
  props: {
    axios: { type: Function, default: null },
    height: { type: Number, default: 450 }, //富文本高度
    value: { type: String, default: '请输入一些内容' }, //内容
    disabled: { type: Boolean, default: false }, //禁用状态
    multiple: { type: Boolean, default: false }, //是否多选，默认单选
  },
  data() {
    return {
      iValue: null,
      extraButtons: [
        {
          name: 'insertFile',
          iconURL: upload,
          tooltip: '上传文件',
          exec: editor => {
            this.uploadFile(editor);
          },
        },
      ], //按钮
      fileModalIsShow: false, // 文件管理弹框是否弹出
      editor: null,
    };
  },

  watch: {
    value: {
      handler: function (value, oldValue) {
        this.iValue = value;
      },
      immediate: true,
    },
  },

  methods: {
    initAxios() { },
    uploadFile(editor) {
      this.editor = editor;
      this.fileModalIsShow = true;
    },

    //富文本文件上传内容处理
    onSelected(files) {
      if (this.multiple) {
        files.map(item => {
          if (['.jpg', '.jpeg', '.png', 'bmp', 'gif', 'psd', 'dxf'].indexOf(item.type) > -1) {
            this.editor.selection.insertHTML(
              `<img
            src="${utils.getFileUrl(item.url)}"
            alt="${item.name}"
          ></img>`,
            );
          } else if (['.WAV', '.wav', '.MP3', '.mp3', '.WMA', '.wma'].indexOf(item.type) > -1) {
            this.editor.selection.insertHTML(`<embed src="${item.url}"/>`);
          } else if (['.MP4', '.mp4', '.WebM', '.Ogg', '.webm', '.ogg'].indexOf(item.type) > -1) {
            this.editor.selection.insertHTML(
              `<video controls src="${utils.getFileUrl(item.url)}"/>`,
            );
          } else {
            this.editor.selection.insertHTML(
              `<a-tooltip placement="topLeft" title="请点击下载">
              <a href="${utils.getFileUrl(item.url)}" download=${item.name}>${item.name}</a>
        </a-tooltip>`,
            );
          }
        });
      } else {
        if (['.jpg', '.jpeg', '.png', 'bmp', 'gif', 'psd', 'dxf'].indexOf(files.type) > -1) {
          this.editor.selection.insertHTML(
            `<img
            src="${utils.getFileUrl(files.url)}"
            alt="${files.name}"
          ></img>`,
          );
        } else if (['.WAV', '.wav', '.MP3', '.mp3', '.WMA', '.wma'].indexOf(files.type) > -1) {
          this.editor.selection.insertHTML(`<embed src="${files.url}"/>`);
        } else if (['.MP4', '.mp4', '.WebM', '.Ogg', '.webm', '.ogg'].indexOf(files.type) > -1) {
          this.editor.selection.insertHTML(
            `<video controls src="${utils.getFileUrl(files.url)}"/>`,
          );
        } else {
          this.editor.selection.insertHTML(
            `<a-tooltip placement="topLeft" title="请点击下载">
              <a href="${utils.getFileUrl(files.url)}" download=${files.name}>${files.name}</a>
        </a-tooltip>`,
          );
        }
      }
    },
    content() {
      return this.$refs['sc-rich-text-editor'].editor.value;
    },
  },

  render() {
    return (
      <div class="SmFileTextEditor">
        <sc-rich-text-editor
          ref="sc-rich-text-editor"
          height={this.height}
          value={this.iValue}
          disabled={this.disabled}
          extraButtons={this.extraButtons}
        />
        {/* 文件上传 */}
        <FileModal
          ref="FileModal"
          axios={this.axios}
          visible={this.fileModalIsShow}
          multiple={this.multiple}
          selected={this.multiple ? [] : {}}
          onChange={visible => {
            this.fileModalIsShow = visible;
          }}
          onOk={value => {
            this.onSelected(value);
          }}
        />
      </div>
    );
  },
};
