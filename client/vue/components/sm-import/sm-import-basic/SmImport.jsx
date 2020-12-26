// 文件导入公共组件
import './style/index.js';
import ApiFileImport from '../../sm-api/sm-common/import';
import FileSaver from 'file-saver';
let fileImpport = new ApiFileImport();
import { requestIsSuccess, getFileUrl } from '../../_utils/utils';
export default {
  name: 'SmImport',
  components: {},
  props: {
    axios: { type: Function, default: () => null },
    size: { type: String, default: 'default' },
    width: { type: String, default: 'auto' },
    defaultTitle: { type: String, default: '导入' },
    bussinessTitle: { type: String, default: '正在导入...' },
    btnDefaultType: { type: String, default: 'primary' }, // 按钮样式
    btnBussinessType: { type: String, default: 'danger' }, // 正在导入时的按钮样式
    multiple: { type: Boolean, default: false }, // 是否多文件上传
    importKey: { type: String, default: '' }, // 导入查询的唯一key 为了在后台查询正在导入的数据。
    downloadErrorFile: { type: Boolean, default: false }, // 是否下载导入错误后的文件。
    url: { type: String, default: '' }, // 文件导入地址
    isImport: { type: Boolean, default: false },  //是否可以导入
    repairTagKey: { type: String, default: null }, //维修项标签
  },
  data() {
    return {
      progress: 0, // 进度
      isComplete: true, //是否完成
      canImport: true, // 是否可以导入
      directory: '', // 选择的文件夹路径
      accept: '.xls,.xlsx',
      file: null,
      key: null,
      fileName: '',
      fileType: '',
      timeoutCount: 0,// 定义一个超时记录，超过6次后不在请求
      maxTimeoutCount: 15,
    };
  },
  computed: {
    complete() {
      return this.isComplete;
    },
    import() {
      return this.canImport;
    },
    calculationProgress() {
      return this.progress;
    },
    btnType() {
      return this.import ? this.btnDefaultType : this.btnBussinessType;
    },
    importFiles() {
      return [this.file];
    },
  },
  watch: {
  },
  created() {
    // 第一次初始化就需要进项校验
    this.initAxios();
    this.check();
  },
  methods: {
    initAxios() {
      fileImpport = new ApiFileImport(this.axios);
    },
    filesSelected(files) {
      this.file = files[0];
      // 开始改变状态
      this.canImport = false;
      this.isComplete = false;
      this.fileName = this.file.name;
      this.fileType = this.file.type;
      this.$emit('selected', this.file);
      this.getProgress();
    },
    // 暂时保留
    execteImport() {
      // 调用接口，执行导入
      // if(this.canImport){
      //   this.canImport = false;
      //   this.isComplete = false;
      //   this.$emit('selected',this.files);
      //   this.getProgress();
      // }
    },
    async check() {
      let response = await fileImpport.check(this.importKey);
      if (response != null) {
        if (requestIsSuccess(response)) {
          // 检测到有导入的数据
          let res = response.data;
          if (res.progress != undefined) {
            this.progress = (res.progress * 100).toFixed(0);
            this.canImport = false;
            this.isComplete = false;
            // 同时启动进度获取方法
            //this.execteImport();
            this.getProgress();
          }
        }
      }
    },
    getProgress() {
      // 逻辑修改，初次获取进度，需要设置一个访问过期时间，超过指定时间未响应，则结束定时器。
      let _this = this;
      let breakTime = 0;
      let interval = setInterval(async () => {
        let response = await fileImpport.getProgresse(_this.importKey);
        if (response != null && requestIsSuccess(response)) {
          if (response == null) console.log(response);
          if (response.data.success) {
            // 装为完成，判断是否需要下载文件
            if (_this.downloadErrorFile) {
              // 需要等待一下
              setTimeout(() => {
                _this.download();
              }, 1500);
              _this.$emit("success");
            }
            // 结束导入
            _this.canImport = true;
            _this.isComplete = true;
            _this.progress = 0;
            _this.$message.success(`文件导入成功`);
            _this.$emit("isSuccess");
            clearInterval(interval);
          } else {
            if (response.data.progress == undefined) {
              console.log("结束进度，进度为undefined");
              clearInterval(interval);
              _this.canImport = true;
              _this.isComplete = true;
            }
            _this.progress = (response.data.progress * 100).toFixed(0);
            if (_this.progress == 0) {
              _this.timeoutCount++;
            }
            if (_this.timeoutCount == _this.maxTimeoutCount - 1) {
              _this.canImport = true;
              _this.isComplete = true;
              console.log("结束进度，开始进度超过14秒");
              _this.timeoutCount = 0;
              //_this.$message.warning(`导入异常，请重新导入`);
              clearInterval(interval);
            }
            // if (_this.progress == 1) {
            //   _this.canImport = true;
            //   _this.isComplete = true;
            //   console.log("结束定时3");
            //   clearInterval(interval);
            // }
            _this.$emit("success");
          }
        } else {
          breakTime++;
          if (breakTime == 10) {
            console.log("结束进度，获取进度超过10秒");
            clearInterval(interval);
          }
        }
      }, 1000);
    },
    // 下载文件
    async download() {
      if (this.fileType != "application/vnd.ms-excel") {
        this.fileType = "application/vnd.ms-excel";
      }
      let response = await fileImpport.download(this.importKey);
      if (response != null && requestIsSuccess(response)) {
        if (response.data.byteLength != 0)
          FileSaver.saveAs(new Blob([response.data], { type: this.fileType }), `${this.fileName}`);
      }
    },
    // 执行方法
    async exect(data) {
      // 改造data
      const formData = new FormData();
      let keys = Object.keys(data);
      keys.forEach(a => {
        formData.set(a, data[a]);
      });
      if (this.repairTagKey != null)
        formData.repairTagKey = this.repairTagKey;
      return await this.axios({
        url: this.url,
        method: 'post',
        data: formData,
      });
    },
  },
  render() {
    let fileInput = (
      <input
        style="display:none;"
        type="file"
        ref="fileInput"
        onChange={event => {
          this.filesSelected(event.target.files);
          this.$refs.fileInput.value = '';
        }}
        name="file"
        multiple={this.multiple}
        webkitdirectory={false}
        accept={this.accept}
      ></input>
    );

    return (
      <div class="sm-import">
        <a-button
          disabled={this.isImport}
          size={this.size}
          style={`width:${this.width}`}
          type={this.btnType}
          icon="import"
          onClick={() => {
            this.check();
            if (this.canImport) {
              this.$refs.fileInput.click();
            }
          }}
        >
          {this.import ? this.defaultTitle : `${this.bussinessTitle}(${this.calculationProgress}%)`}
          {fileInput}
        </a-button>
        {/* {this.multiple && this.importFiles.length > 0 && this.canImport ? (
          <a-button
            size={this.size}
            style="margin-left:10px"
            onClick={() => {
              this.execteImport();
            }}
          >
            确认导入
          </a-button>
        ) : null} */}
        <div class="sm-import-file-list"></div>
        {/* <div class="sm-import-file-list">
          <ul>
            {this.importFiles.map(a => {
              return (
                <li>
                  {a.name}{' '}
                  {this.import ? (
                    <span>
                      <a-icon
                        type="delete"
                        onClick={() => (this.files = this.files.filter(b => b != a))}
                      />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div> */}
      </div>
    );
  },
};
