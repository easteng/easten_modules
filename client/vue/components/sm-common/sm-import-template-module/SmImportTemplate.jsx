// 文件导入模板下载公共组件
import './style/index.js';
import { tips as tipsConfig } from '../../_utils/config';
import ApiFileImport from '../../sm-api/sm-common/import';
import FileSaver from 'file-saver';
let fileImport = new ApiFileImport();
import { requestIsSuccess } from '../../_utils/utils';
export default {
  name: 'SmImportTemplate',
  components: {},
  props: {
    axios: { type: Function, default: () => null },
    size: { type: String, default: 'default' },
    width: { type: String, default: 'auto' },
    defaultTitle: { type: String, default: '导入模板下载' },
    btnDefaultType: { type: String, default: '' }, // 按钮样式
    downloadKey: { type: String, default: null }, // 下载指定文件的标识，唯一
    downloadFileName: { type: String, default: null}, // 下载指定文件的标识，唯一
    downComponents:{type:Array,default:()=>[]},//文件导入模板下载按钮集合
  },
  data() {
    return {
      fileType: 'application/vnd.ms-excel',
    };
  },

  watch: {
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      fileImport = new ApiFileImport(this.axios);
    },

    isCanDownload(parameter){
      let _this = this;
      this.$confirm({
        title: tipsConfig.download.title,
        content: h => <div style="color:red;">{parameter ? `确认要下载${parameter.item.title}吗？` : tipsConfig.download.content}</div>,
        okType: 'warning',
        onOk() {
          _this.download(parameter);
        },
        onCancel() { },
      });
    },
    // 下载文件模板
    async download(parameter) {
      let response;
      parameter ? response = await fileImport.downloadTemplate(parameter.key) : response = await fileImport.downloadTemplate(this.downloadKey);
      if (response != null && requestIsSuccess(response)) {
        if (response.data.byteLength != 0){
          FileSaver.saveAs(new Blob([response.data], { type: this.fileType }), parameter ? parameter.item.title : (`${this.downloadFileName}` ? `${this.downloadFileName}` : `${this.downloadKey}`));
        }
      }
    },
  },
  render() {
    return (
      <div class="sm-import-template-download">
        {this.downComponents.length == 0 ? 
          <a-button
            size={this.size}
            style={`width:${this.width}`}
            type={this.btnDefaultType}
            icon="download"
            onClick={() => this.isCanDownload()}
          >
            {this.defaultTitle}
          </a-button>
          :<a-dropdown>
            <a-menu slot="overlay" onClick={e => this.isCanDownload(e)}>
              {this.downComponents.map((component,index) =>{
                return <a-menu-item 
                  key={component.downloadKey}
                  title={component.title}
                >
                  <a-icon type={component.icon} />{component.title}
                </a-menu-item>;
              })}
            </a-menu>
            <a-button 
              size={this.size} 
              type={this.btnDefaultType} 
              icon="download"> 工程数据文件下载 
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        }
      </div>
    );
  },
};
