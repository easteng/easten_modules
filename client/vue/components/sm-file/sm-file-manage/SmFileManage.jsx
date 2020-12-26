import './style';
import { filetrans } from './src/icon';
import SmFileTree from './src/component/SmFileTree';
import SmFileTransfer from './src/component/SmFileTransfer';
import SmFileList from './src/component/SmFileList';
import SmFileTransferList from './src/component/SmFileTransferList';
import { requestIsSuccess, getFileUrl } from '../../_utils/utils';
import { ResourceTableType } from '../../_utils/enum';
import ApiFileManage from '../../sm-api/sm-file/fileManage';
import ApiFile from '../../sm-api/sm-file/file';
import ApiFolder from '../../sm-api/sm-file/folder';
import OssRepository from './src/ossRepository';
import {
  TreeNodeHandler,
  TreeNodeAddIcon,
  GuidEmpty,
  TransType,
  MesageQueue,
  ComponentModel,
  SaveSingleFile,
  SaveMultipleFile,
  ResourceType,
  getFileStream,
  OssType,
} from './src/common';
let ossRepository = new OssRepository();
let apiFileManage = new ApiFileManage();
let apiFile = new ApiFile();
let apiFolder = new ApiFolder();
let messageQueue = new MesageQueue(); // 文件上传队列
let downloadQueue = new MesageQueue(); // 文件下载队列
let saveQueue = new MesageQueue(); // 文件保存队列
export default {
  name: 'SmFileManage',
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    axios: { type: Function, default: null },
    select: { type: Boolean, default: false }, // 选择模式
    multiple: { type: Boolean, default: true }, // 是否多选
    height: { type: Number, default: 650 }, // 组件的绝对高
    value: { type: Array, default: null }, // 选中的值，进行绑定
  },
  data() {
    return {
      organizationData: [
        {
          name: '我的组织',
          nodeId: '0-1',
          slots: { icon: 'organ' },
          children: [],
        },
      ],
      mineData: [
        {
          name: '我的',
          nodeId: '0-1',
          slots: { icon: 'mine' },
          children: [],
        },
      ],
      shareData: [
        {
          name: '共享中心',
          nodeId: '0-3',
          children: [],
          slots: { icon: 'shareCenter' },
        },
      ],
      // 图标对象
      iconObj: {
        folder: 'folder',
        folderShare: 'folder-share',
        organization: 'organization',
      },
      panelIndex: 1, // 左侧面板切换
      transferTableType: 0, // 传输列表时给子组件传递的表格类型，runting,complete
      tableType: ResourceTableType.organization, //表格的类型
      queryObj: {}, // 查询对象，包含节点id和节点类型
      selectedTreeNodes: [], // 选中状态的树节点id，不同的树结构绑定同一个数据源
      selectedType: 0, // 选中的树节点类型
      uploadList: [], // 需要上传的文件列表
      downloadList: [], // 需要下载的文件列表
      completeList: [],
      currentParams: null,
      iValue: [], // 文件列表中选中的值
      spin: false, // 数据刷新按钮旋转状态
    };
  },

  computed: {
    organizationDataArray() {
      return this.organizationData;
    },
    mineDataArray() {
      return this.mineData;
    },
    shareDataArray() {
      return this.shareData;
    },
    uploads() {
      return this.uploadList;
    },
    downloads() {
      return this.downloadList;
    },
    components() {
      return this.completeList;
    },
    // 文件的状态，绑定左侧不同状态的文件数量
    fileState() {
      return {
        download: this.downloadList.length,
        upload: this.uploadList.length,
        complete: this.completeList.length,
      };
    },
    // 传输不同状态的文件列表，在子组件中进行文件的上传及处理
    fileList() {
      return {
        uploadList: this.uploadList,
        downloadList: this.downloadList,
        completeList: this.completeList,
      };
    },
    // 计算总进度条
    percent() {
      // 所有上传和下载的文件的进度综合除以上传和下载的总数
      let uploadProgress = 0;
      let downloadProgress = 0;
      let allcount = this.downloadList.length + this.uploadList.length;
      if (allcount == 0 && this.completeList.length != 0) {
        return 100;
      } else if (allcount == 0 && this.completeList == 0) {
        return 0;
      }
      this.downloadList.forEach(item => {
        downloadProgress += item.progress;
      });
      this.uploadList.forEach(item => {
        uploadProgress += item.progress;
      });
      return (uploadProgress + downloadProgress) / allcount;
    },
  },
  watch: {
    uploadList: {
      handler(nVal, oVal) {
        this.uploadList = nVal;
        this.fileUpload();
      },
      immediate: true,
    },
    downloadList: {
      handler(nVal, oVal) {
        this.downloadList = nVal;
        this.fileDownload();
      },
      immediate: true,
    },
    value: {
      handler(nVal, oVal) {
        this.iValue = nVal;
      },
      immediate: true,
    },
  },
  async created() {
    this.initAxios();
    await this.getOrganiztionData();
    await this.getMineDate();
    await this.getShareData();
    this.startSaveThread();

    // 刷新页面或关闭当前界面时进行提示
    let _this = this;
    window.addEventListener('beforeunload', e => {
      if (_this.uploadList.length != 0 || _this.downloadList.length != 0) {
        // 兼容IE8和Firefox 4之前的版本
        let ee = window.event || e;
        if (ee) {
          ee.returnValue = '当前有文件在上传，确定要关闭当前页面吗?';
        }
        return '当前有文件在上传，确定要关闭当前页面吗?';
      }
    });
  },
  methods: {
    closeTip() { },
    // 初始化axios
    initAxios() {
      apiFileManage = new ApiFileManage(this.axios);
      apiFile = new ApiFile(this.axios);
      apiFolder = new ApiFolder(this.axios);
    },
    // 面板切换
    panelTagger(index) {
      // 状态切换
      this.panelIndex = index;
    },
    // 树结构选择
    treeSelect(data) {
      console.log(data);
    },
    // 回收站点击
    deleteClick() {
      this.$refs.SmFileTree.cancleSlectedState();
      this.$refs.ShareTree.cancleSlectedState();
      this.$refs.MineTree.cancleSlectedState();
      // 调用回收站相关接口信息
      let params = {
        id: '00000000-0000-0000-0000-000000000000',
        type: 1,
        isDelete: true,
      };
      this.$refs.SmFileList.paramChange(params, ResourceTableType.Delete, true);
      this.currentParams = params;
      this.selectedType = ResourceTableType.Delete;
    },
    // 传输列表菜单切换事件
    transferMenusClick(type) {
      console.log(type);
      switch (type) {
        case 'download':
          this.transferTableType = TransType.DownLoad;
          break;
        case 'upload':
          this.transferTableType = TransType.Upload;
          break;
        case 'complete':
          this.transferTableType = TransType.Complete;
          break;
        default:
          break;
      }
    },
    // 获取我的组织
    async getOrganiztionData() {
      let response = await apiFileManage.getOrganizationTreeList();
      if (requestIsSuccess(response)) {
        this.organizationData[0].children = TreeNodeHandler(response.data);
      }
    },
    //获取“我的”
    async getMineDate() {
      let response = await apiFileManage.getMineTreeList();
      if (requestIsSuccess(response)) {
        this.mineData[0].children = TreeNodeAddIcon(response.data, 'folder');
      }
    },
    //获取共享中心数据
    async getShareData() {
      let response = await apiFileManage.getShareCenterTreeList();
      if (requestIsSuccess(response)) {
        this.shareData[0].children = TreeNodeHandler(response.data);
      }
    },

    // 我的组织树选中事件
    organizationTreeSelect(node) {
      this.$refs.ShareTree.cancleSlectedState();
      this.$refs.MineTree.cancleSlectedState();
      let params = {};
      if (node.type == 0) {
        params = {
          id: node.id,
          type: 1,
        };
      } else if (node.type == 1) {
        params = {
          id: node.id,
          type: 2,
        };
      } else {
        params = {
          id: GuidEmpty,
          type: 1,
        };
      }
      this.$refs.SmFileList.paramChange(params, ResourceTableType.Organization, true);
      this.selectedType = ResourceTableType.Organization;
      this.currentParams = params;
    },
    // "我的"树节点选中事件
    mineTreeSelect(node) {
      this.$refs.SmFileTree.cancleSlectedState();
      this.$refs.ShareTree.cancleSlectedState();
      // IsMine 状态为true
      let params = {
        id: node.id,
        type: 2,
        isMine: true,
      };
      this.$refs.SmFileList.paramChange(params, ResourceTableType.Mine, true);
      this.selectedType = ResourceTableType.Mine;
      this.currentParams = params;
    },
    // 共享中心树节点选中事件
    shareCenterTreeSelect(node) {
      this.$refs.SmFileTree.cancleSlectedState();
      this.$refs.MineTree.cancleSlectedState();
      let params = {};
      if (node.type == 0) {
        params = {
          id: node.id,
          type: 1,
          isShare: true,
        };
      } else if (node.type == 1) {
        params = {
          id: node.id,
          type: 2,
          isShare: true,
        };
      } else {
        params = {
          id: GuidEmpty,
          type: 1,
          isShare: true,
        };
      }
      this.$refs.SmFileList.paramChange(params, ResourceTableType.ShareCenter, true);
      this.selectedType = ResourceTableType.ShareCenter;
      this.currentParams = params;
    },
    // 选中指定的树节点
    selectedNode(id) {
      //TODO 树节点反选
    },
    // 上传文件方法
    fileUpload() {
      let _this = this;
      while (messageQueue.size() > 0) {
        // 获取数据，进行文件上传
        let item = messageQueue.dequeue();
        if (item != null) {
          if (item.ossType == OssType.aliyun) {
            ossRepository
              .aliyunUpload(item, progress => (item.progress = progress))
              .then(async response => {
                _this.completeList.push(item);
                _this.uploadList = _this.uploadList.filter(a => a.id != item.id);
                // 保存文件
                // await _this.saveFile(item);
                saveQueue.enqueue(item);
              })
              .catch(err => console.log(err));
          } else if (item.ossType === OssType.minio || item.ossType == OssType.amazons3) {
            ossRepository
              .upload(item, progress => (item.progress = progress))
              .then(async response => {
                _this.completeList.push(item);
                _this.uploadList = _this.uploadList.filter(a => a.id != item.id);
                // 保存文件
                saveQueue.enqueue(item);
              })
              .catch(err => console.log(err));
          }
        }
      }
    },
    // 下载文件方法
    async fileDownload() {
      while (downloadQueue.size() > 0) {
        let _this = this;
        let item = downloadQueue.dequeue();
        if (item.rtype === ResourceType.File) {
          // 下载单个文件
          ossRepository
            .download(getFileUrl(item.url), progress => {
              item.progress = progress; // 进度数据
            })
            .then(blob => {
              SaveSingleFile(`${item.name}${item.type}`, item.size, blob).then(a => {
                _this.completeList.push(item);
                _this.downloadList = _this.downloadList.filter(a => a.id != item.id);
                _this.$notification['success']({
                  message: '温馨提示',
                  description: `${item.name}下载成功`,
                  duration: 2,
                });
              });
            });
        } else if (item.rtype === ResourceType.Folder) {
          let response = await apiFolder.getFiles(item.id);
          if (requestIsSuccess(response)) {
            let files = response.data;
            debugger;
            // 判断当前文件夹中是否包含文件，没有文件就返回
            if (files.length == 0) {
              _this.downloadList = this.downloadList.filter(a => a.id !== item.id);
              _this.$message.warning(`${item.name}文件夹为空，无法下载!`);
              return;
            } else {
              // 下载整个文件夹中的文件,开启计时器，控制进度条
              let step = 0;
              let interval = setInterval(() => {
                step++;
                item.progress = step;
                if (step == 90) {
                  clearInterval(interval);
                }
              }, 100);
              // 获取文件流
              getFileStream(files).then(datas => {
                // 拼装压缩包格式
                if (datas.length > 0) {
                  SaveMultipleFile(`${item.name}.zip`, datas).then(() => {
                    item.progress = 100;
                    _this.completeList.push(item);
                    _this.downloadList = _this.downloadList.filter(a => a.id != item.id);
                    _this.$notification['success']({
                      message: '温馨提示',
                      description: `${item.name}下载成功`,
                      duration: 2,
                    });
                  });
                }
              });
            }
          }
        }
      }
    },
    // 保存文件
    async saveFile(data) {
      return new Promise(async (res, rej) => {
        let file = {};
        let response = null;
        if (data.state.isVersion) {
          // 只上传文件版本
          file = {
            fileId: data.state.fileId,
            name: data.name,
            type: data.type,
            size: data.size,
            ossFileName: data.ossFileName,
            url: data.relativeUrl,
          };
          response = await apiFile.createFileVersion(file);
        } else {
          file = {
            fileId: data.id,
            name: data.name,
            type: data.type,
            size: data.size,
            isPublic: !data.state.isMine,
            organizationId: data.state.organizationId,
            folderId: data.state.folderId,
            folderPath: data.path,
            ossFileName: data.ossFileName,
            url: data.relativeUrl,
          };
          response = await apiFile.create(file);
        }
        if (requestIsSuccess(response)) {
          res();
        }
      });
    },
    // 启动一个文件保存定时器
    startSaveThread() {
      let saveInterval = setInterval(() => {
        if (saveQueue.size() > 0) {
          let file = saveQueue.dequeue();
          if (file != null) {
            // 暂定一会
            clearInterval(saveInterval);
            this.saveFile(file).then(res => {
              // 友情提示，文件添加成功
              this.$notification['success']({
                message: '温馨提示',
                description: `${file.name}上传成功`,
                duration: 2,
              });
              this.getOrganiztionData();
              this.getMineDate();
              this.getShareData();
              // 刷新当前查询的数据,当前方法存在时才刷新
              if (this.$refs.SmFileList.paramChange != undefined) {
                this.$refs.SmFileList.paramChange(this.currentParams, this.selectedType);
              }
              // 重启定时器
              this.startSaveThread();
            });
          }
        }
      }, 100);
    },
  },
  render() {
    // 文件管理内容
    let fileManageContent = (
      <div class="f-left-content">
        <div class="f-org-content" style={{ maxHeight: this.height * 0.9 + 'px' }}>
          <div>
            {/* 我的组织 */}
            <SmFileTree
              class="f-org-tree"
              ref="SmFileTree"
              selectedKeys={this.selectedTreeNodes}
              onSelect={this.organizationTreeSelect}
              treeData={this.organizationDataArray}
              onChange={v => {
                this.selectedTreeNodes == v;
              }}
            />
            {/* 我的 */}
            <SmFileTree
              ref="MineTree"
              onSelect={this.mineTreeSelect}
              selectedKeys={this.selectedTreeNodes}
              treeData={this.mineDataArray}
              onChange={v => {
                this.selectedTreeNodes == v;
              }}
            />
          </div>
        </div>
        <div class="f-share-content" style={{ maxHeight: this.height * 0.3 + 'px' }}>
          {/* 共享中心 */}
          <SmFileTree
            ref="ShareTree"
            onSelect={this.shareCenterTreeSelect}
            treeData={this.shareDataArray}
            selectedKeys={this.selectedTreeNodes}
            onChange={v => {
              this.selectedTreeNodes == v;
            }}
          />
        </div>
      </div>
    );

    return (
      //  定义基本骨架
      <div
        class="f-container"
        style={{ maxHeight: this.height + 'px', minHeight: this.height + 'px' }}
      >
        {/* 左侧内容 */}
        <div class="f-left">
          <div class="f-panel">
            <div class="f-panel-head">
              <a-button
                type="link"
                onClick={() => {
                  this.panelTagger(1);
                }}
                icon="folder-open"
                style={{ color: this.panelIndex == 1 ? '#1890ff' : 'unset' }}
              >
                文件列表
              </a-button>
              <a-badge class="f-upload-badge" count={this.uploads.length + this.downloads.length}>
                {this.uploads.length > 0 ? <div class="f-upload-animation"></div> : ''}
                <a-button
                  type="link"
                  class="f-btn-trans"
                  onClick={() => {
                    this.panelTagger(2);
                  }}
                  icon="cloud-download"
                  style={{ color: this.panelIndex == 2 ? '#1890ff' : 'unset' }}
                >
                  传输列表
                </a-button>
              </a-badge>
              {this.select ? null : (
                <a-tooltip placement="top" title="刷新数据" arrow-point-at-center>
                  <a-button
                    type="link"
                    onClick={() => {
                      this.spin = true;
                      this.getOrganiztionData();
                      this.getMineDate();
                      this.getShareData();
                      setTimeout(() => {
                        this.spin = false;
                      }, 1000);
                    }}
                    style={{ color: '#1890ff', position: 'absolute', right: '10px' }}
                  >
                    <a-icon type="sync" spin={this.spin} />
                  </a-button>
                </a-tooltip>
              )}
            </div>
            {this.panelIndex == 1 ? (
              <div class="f-panel-item" style={{ display: this.panelIndex == 1 }}>
                {fileManageContent}
                <div class={`f-delete ${this.selectedType === ResourceTableType.Delete ? 'f-delete-selected' : ''}`} >
                  <a-icon type="delete" />
                  <span onClick={this.deleteClick}>回收站</span>
                </div>
              </div>
            ) : (
                <div class="f-panel-item" style={{ display: this.panelIndex == 2 }}>
                  <div class="f-trans-state">
                    <SmFileTransfer
                      state={this.fileState}
                      onClick={type => this.transferMenusClick(type)}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
        {/* 右侧内容 */}
        <div class="f-right">
          {/*表格及传输列表状态   */}
          {this.panelIndex == 1 ? (
            <SmFileList
              select={this.select}
              multiple={this.multiple}
              ref="SmFileList"
              scrollHeight={this.select ? this.height - 87 : this.height - 100}
              query={this.queryObj}
              tableType={this.tableType}
              axios={this.axios}
              onRefresh={() => {
                this.getOrganiztionData();
                this.getMineDate();
                this.getShareData();
              }}
              onUploadChange={v => {
                //已获取到签名的文件信息
                this.uploadList.push(v);
                messageQueue.enqueue(v);
              }}
              onDownloadChange={v => {
                downloadQueue.enqueue(v);
                this.downloadList.push(v);
              }}
              onChanageTreeNode={id => this.selectedNode(id)}
              onSelected={v => {
                this.iValue = v;
                this.$emit('selected', v);
              }}
              value={this.iValue}
            />
          ) : (
              <SmFileTransferList
                value={this.fileList}
                onChange={v => (this.fileList = v)}
                type={this.transferTableType}
                percent={this.percent}
              />
            )}
        </div>
      </div>
    );
  },
};
