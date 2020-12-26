// 文件导入公共组件
import './style/index.js';
import { tips as tipsConfig } from '../../_utils/config';
import FileSaver from 'file-saver';
import { requestIsSuccess } from '../../_utils/utils';
export default {
  name: 'SmExport',
  components: {},
  props: {
    axios: { type: Function, default: () => null },
    size: { type: String, default: 'default' },
    defaultTitle: { type: String, default: '文件导出' },
    btnDefaultType: { type: String, default: 'primary' }, // 按钮样式
    templateName: { type: String, default: null }, // 导出文件唯一对应标识（将数据导入对应模板）
    downloadFileName: { type: String, default: null}, // 下载文件的名称
    exportComponents:{type:Array,default:()=>[]},//文件导入模板下载按钮集合
    url: { type: String, default: '' }, // 文件导出地址
    rowIndex: { type: Number, default: 0}, //导入的数据对应模板的有效数据起始行
  },
  data() {
    return {
      fileType: 'application/vnd.ms-excel',
    };
  },

  watch: {
  },
  created() {
  },
  methods: {
    isCanDownload(parameter){
      let _this = this;
      this.$confirm({
        title: tipsConfig.export.title,
        content: h => <div style="color:red;">{parameter ? `确认要导出${parameter.item.title}吗？` : tipsConfig.export.content}</div>,
        okType: 'warning',
        onOk() {
          _this.export(parameter);
        },
        onCancel() { },
      });
    },

    // 文件导出
    async export(parameter) {
      //根据key去设置rowIndex。待做
      //let response;
      return await this.axios(
        parameter ? {
          url: this.url,
          method: 'post',
          responseType:'arraybuffer',
          data:{
            'templateName':parameter.key,
            'rowIndex':parameter.rowIndex,
          },
        }
          :{
            url: this.url,
            method: 'post',
            responseType:'arraybuffer',
            data:{
              'templateKey':this.templateName,
              'rowIndex':this.rowIndex,
            },
          },
      ).then(response=>{
        if (response != null && requestIsSuccess(response)) {
          if (response.data.byteLength != 0){
            FileSaver.saveAs(new Blob([response.data], { type: this.fileType }), parameter ? parameter.item.title : (`${this.downloadFileName}` ? `${this.downloadFileName}` : `${this.templateName}`));
            this.$message.success(`文件导出成功`);
          }
        }
      });
    },
  },
  render() {
    return (
      <div class="sm-import-template-download">
        {this.exportComponents.length == 0 ? 
          <a-button
            ghost
            size={this.size}
            type={this.btnDefaultType}
            onClick={() => this.isCanDownload()}
          >
            <a-icon type="export" />
            {this.defaultTitle}
          </a-button>
          :<a-dropdown>
            <a-menu slot="overlay" onClick={e => this.isCanDownload(e)}>
              {this.exportComponents.map((component,index) =>{
                return <a-menu-item 
                  key={component.templateName}
                  title={component.title}
                >
                  <a-icon type={component.icon} />{component.title}
                </a-menu-item>;
              })}
            </a-menu>
            <a-button
              ghost
              size={this.size} 
              type={this.btnDefaultType}> 
              <a-icon type="export" />
              {this.defaultTitle}
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        }
      </div>
    );
  },
};
