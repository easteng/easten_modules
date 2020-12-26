import './style/index.less';
import { requestIsSuccess, getFileUrl } from '../../_utils/utils';
import {
  SaveSingleFile,
  getFileStream,
  resourceIcon,
  fileDownload,
} from '../sm-file-manage/src/common';
export default {
  name: 'SmFileTag',
  props: {
    url: { type: String, default: "" }, // 选中的值，进行绑定
    fileName: { type: String, default: "" },
    fileType: { type: String,default: ""},
    enableDownload: { type: Boolean, default: true },
  },
  data() {
    return { };
  },

  computed: {},
  watch: {},
  async created() {
  },
  methods: {
    // 初始化axios
    initAxios() { },
    // 下载文件方法
    download() {
      fileDownload({ url: this.url, name: this.fileName, type: this.fileType });
    },
  },
  render() {
    return (
      this.fileName != null && this.fileType != null?
        <div class="f-tag">
          <a-icon type={resourceIcon[this.fileType] || resourceIcon.unknown} />
          <a-tooltip placement="bottom" title={this.fileName + this.fileType}>
            <span class="title">
              {this.fileName !== null ? this.fileName.length > 8 ? `${this.fileName.substring(0, 8)}...` :this.fileName:''}
              {this.fileType}
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
                  this.download();
                }}
                type="cloud-download"
              />
            ) : null}
          </a-tooltip>
        </div>:''
    );
  },
};
