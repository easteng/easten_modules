// 文件选择对话框
import SmFileManage from '../sm-file-manage';
import { FileTypes, resourceIcon, fileDownload } from '../sm-file-manage/src/common';
export default {
  name: 'SmFileManageModal',
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    axios: { type: Function, default: null },
    width: { type: Number, default: 1000 }, // 选择框宽度
    height: { type: Number, default: 500 }, // 文件选择组件的高度
    visible: { type: Boolean, default: false }, // 选择框可见性
    selected: { type: [Array, Object], default: () => [] }, // 已选择的内容
    size: { type: String, default: 'default' }, // 选择框的大小，small
    multiple: { type: Boolean, default: true }, //是否多选，默认多选
  },
  data() {
    return {
      iSelected: [],
    };
  },
  computed: {},
  watch: {
    selected: {
      handler(nVal, oVal) {
        if (nVal instanceof Array) {
          this.iValue = nVal;
        } else {
          this.iValue = [nVal];
        }
      },
      immediate: true,
    },
    visible: {
      handler(nVal, oVal) {
        this.visible = nVal;
        this.iSelected = this.selected;
      },
      immediate: true,
    },
  },
  created() { },
  methods: {
    onOk() {
      if (this.multiple) {
        this.$emit('ok', this.iSelected);
      } else {
        this.$emit('ok', this.iSelected[0]);
      }
      this.onClose();
    },
    onClose() {
      // this.visible=false;
      this.$emit('change', false);
    },
    //附件下载
    fileDownload(files) {
      fileDownload(files);
    },
  },
  render() {
    return (
      <a-modal
        width={this.width}
        visible={this.visible}
        title="文件选择"
        class="f-file-select-modal"
        onCancel={this.onClose}
        onChange={value => {
          this.$emit('change', value);
        }}
        onOk={this.onOk}
      >
        {this.multiple ? (
          <div class="f-select-panel">
            {/* 文件选择容器 */}
            {this.iSelected.map(a => {
              // 计算文件类型
              let iconType = a.type.substring(a.type.indexOf('.') + 1);
              return (
                // <a-tag
                //   closable
                //   onClose={() => {
                //     this.iSelected = this.iSelected.filter(c => c.id != a.id);
                //   }}
                // >
                //   <a-icon type={resourceIcon[iconType] || resourceIcon.unknown} />
                //   &nbsp; {a.name}
                // </a-tag>
                <span class="f-tag">
                  <a-icon type={resourceIcon[iconType] || resourceIcon.unknown} />
                  <a-tooltip placement="bottom" title={a.name + a.type}>
                    <span>{a.name.length > 20 ? `${a.name.substring(0, 20)}...` : a.name}{a.type}</span>
                  </a-tooltip>
                  <a-icon
                    type="close"
                    onClick={e => {
                      e.stopPropagation();
                      this.iSelected = this.iSelected.filter(c => c.id != a.id);
                    }}
                  />
                </span>
              );
            })}
          </div>
        ) : (
            ''
          )}
        <div class="f-select-modal">
          <SmFileManage
            ref="SmFileManage"
            axios={this.axios}
            select={true}// 选择模式
            height={this.height}
            multiple={this.multiple}// 多选模式
            value={this.iSelected}
            onSelected={v => {
              this.iSelected = v;
              this.$emit('selected', v);// 向父组件提交
            }}
          />
        </div>
      </a-modal>
    );
  },
};
