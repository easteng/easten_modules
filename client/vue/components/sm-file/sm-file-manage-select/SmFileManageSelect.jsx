// 文件选择对话框
import SmFileManageModal from '../sm-file-manage-modal';
import { FileTypes, resourceIcon } from '../sm-file-manage/src/common';
import './style/index.less';
export default {
  name: 'SmFileManageSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    modalHeight: { type: Number, default: 500 }, // 文件选择组件的高度
    height: { type: Number, default: 100 }, // 当前选择框的大小
    disabled: { type: Boolean, default: false }, // 编辑模式和查看模式
    value: { type: [Array, Object] }, // 已选择的内容
    multiple: { type: Boolean, default: true }, //是否多选，默认多选
    enableDownload: { type: Boolean, default: false }, // 启用下载
    placeholder: { type: String, default: '请点击选择文件' },
    bordered: { type: Boolean, default: true }, // 边框模式
    simple: { type: Boolean, default: false }, // 极简模式，只能下载
  },
  data() {
    return {
      iValue: [],
      iVisible: false,
    };
  },
  computed: {
    visible() {
      return this.iVisible;
    },
  },
  watch: {
    value: {
      handler(nVal, oVal) {
        if (nVal instanceof Array) {
          this.iValue = nVal;
        } else {
          this.iValue = !!nVal ? [nVal] : [];
        }
      },
      immediate: true,
    },
  },
  created() { },
  methods: {
    fileSelect() {
      if (!this.disabled) {
        this.iVisible = true;
      }
    },
    onModalBtnOk(selected) {
      if (selected instanceof Array) {
        this.iValue = Array.from(selected);
        this.$emit('change', this.iValue);
      } else {
        this.iValue = [selected];
        this.$emit('change', selected);
      }
    },
    // 下载附件
    download(file) {
      this.$refs.SmFileManageModal.fileDownload(file);
    },
    // 获取tag
    createTag() {
    },
  },
  render() {
    let files = this.iValue.map((a, index) => {
      // 计算文件类型
      if (a && (a.type != null || a.type != undefined)) {
        let iconType = a.type.substring(a.type.indexOf('.') + 1) || 'close';
        return this.simple ?
          <a-icon
            onClick={e => {
              e.stopPropagation();
              this.download(a);
            }}
            type="vertical-align-bottom"
          /> : <div class="f-tag">
            <a-icon type={resourceIcon[iconType] || resourceIcon.unknown} />
            <a-tooltip placement="bottom" title={a.name + a.type}>
              <span class="title">
                {a.name.length > 8 ? `${a.name.substring(0, 8)}...` : a.name}
                {a.type}
              </span>
            </a-tooltip>
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>点击下载</span>
              </template>
              {this.enableDownload ? (
                <a-icon
                  onClick={e => {
                    e.stopPropagation();
                    this.download(a);
                  }}
                  type="cloud-download"
                />
              ) : null}

            </a-tooltip>
            {this.disabled ? null : (
              <a-icon
                type="close"
                onClick={e => {
                  e.stopPropagation();
                  this.iValue = this.iValue.filter(v => v.id != a.id);
                  this.$emit('change', this.iValue);
                }}
              />
            )}
          </div>;
      }
    });
    return (
      <div
        class={{
          'f-select-panel': true,
          disabled: this.disabled,
          bordered: this.bordered,
        }}
        onClick={() => this.fileSelect()}
        style={{
          minHeight: this.bordered ? this.height + 'px' : 'auto',
        }}
      >
        {this.iValue.length == 0 ? <label class="tip">{this.placeholder}</label> : ''}
        {files}
        {/* 处理dom 只渲染一次的问题 TODO 未找到原因 */}
        {files.map(a => {
          return <span></span>;
        })}
        {/* 文件选择模态框 */}
        <SmFileManageModal
          ref="SmFileManageModal"
          axios={this.axios}
          visible={this.visible}
          height={this.modalHeight}
          selected={this.iValue}
          multiple={this.multiple}
          onOk={this.onModalBtnOk}
          onChange={v => (this.iVisible = v)}
        />
      </div>
    );
  },
};
