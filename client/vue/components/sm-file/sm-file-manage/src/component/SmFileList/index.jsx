// 资源组件
import SmResourceToolBar from './SmResourceToolBar';
import SmResourceList from './SmResourceList';
import { ResourceTableType } from '../../../../../_utils/enum';
import { requestIsSuccess } from '../../../../../_utils/utils';
import ApiFileManage from '../../../../../sm-api/sm-file/fileManage';
import ApiTag from '../../../../../sm-api/sm-file/tag';
import ApiFolder from '../../../../../sm-api/sm-file/folder';
import ApiFile from '../../../../../sm-api/sm-file/file';
import { MenuNames, GuidEmpty, ResourceType, CreateUUID } from '../../common';
import { replace } from 'node-emoji';
let apiFileManage = new ApiFileManage();
let apiTag = new ApiTag();
let apiFolder = new ApiFolder();
let apiFile = new ApiFile();
export default {
  name: 'SmFileList',
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    axios: { type: Function, default: null },
    select: { type: Boolean, default: false },// 选择模式
    multiple: { type: Boolean, default: false },// 多选模式
    scrollHeight: { type: Number, default: 450 }, // 表格的滚动条高度
    value: { type: Array, default: null },
  },
  data() {
    return {
      showTable: true, // 以表格的形式显示
      tType: null, // 表格类型
      queryObj: null,
      tagList: [],
      toolbar: MenuNames.filter(a => a.name === 'upload' || a.name === 'uploadD'), // 工具栏的菜单
      tableType: 0, // 当前资源显示类型
      selectValue: 0,
      fileState: {
        // 文件状态，记录传入后台的文件的实际存储状态
        isPublic: false,
        folderId: null,
        organizationId: null,
        folders: null, // 该文件隶属几层文件夹，当上传整个文件夹时需要
        isVersion: false,
        fileId: null,// 文件id，当上传文件版本时有效
      },
      iValue: [],
      selectQueryObj: null,
    };
  },
  computed: {
    tagArray() {
      return this.tagList;
    },
    toolBarMenus() {
      return this.toolbar;
    },
  },
  watch: {
    value: {
      handler(nVal, oVal) {
        this.iValue = nVal;
      },
      immediate: true,
    },
  },
  created() {
    this.initAxios();
  },
  methods: {
    initAxios() {
      apiFileManage = new ApiFileManage(this.axios);
      apiTag = new ApiTag(this.axios);
      apiFolder = new ApiFolder(this.axios);
      apiFile = new ApiFile(this.axios);
    },
    // 菜单点击
    menusClick(item) {
      switch (item.name) {
        case 'newFolder':
          this.createFolder();
          break;
        case 'publish': // 发布资源
          this.$refs.SmResourceList.publish();
          break;
        case 'delete': // 删除资源
          this.$refs.SmResourceList.delete(null);
          break;
        case 'clear': // 清空回收站
          this.$refs.SmResourceList.deleteAll();
          break;
        case 'restore': // 还原
          this.$refs.SmResourceList.restore(null);
          break;
        case 'restoreTo': // 还原到
          this.$refs.SmResourceList.restoreTo(null);
          break;
        case 'tag': // 标签
          this.$refs.SmResourceList.tag(null);
          break;
        case 'downLoad': // 下载文件
          this.$refs.SmResourceList.download(null);
          break;
        default:
          break;
      }
    },
    // 标签选择
    tagChange() { },
    // 关键字搜索
    inputSearch() { },
    // 切换显示视图，列表和矩阵
    viewTaggle() { },
    // 获取指定组织结构下的标签
    async getTagList() {
      if (this.queryObj != null) {
        let organid = '';
        if (this.queryObj.type === 1) organid = this.queryObj.id;
        if (this.queryObj.type === 2) organid = await this.getOrganizationId(this.queryObj.id);
        let response = await apiTag.getList(organid);
        if (requestIsSuccess(response)) this.tagList = response.data;
      }
    },
    // 获取组织结构id
    async getOrganizationId(fid) {
      let response = await apiFolder.get(fid);
      if (requestIsSuccess(response)) return response.data.organizationId;
      else return null;
    },
    // 获取资源数据
    paramChange(params, tableType, treeNodeClick) {
      this.tableType = tableType;
      this.queryObj = params;
      this.$refs.SmResourceList.getResource(params, tableType, treeNodeClick);
      this.getTagList();
      this.getToolBarMenus();
      if (tableType == ResourceTableType.ShareCenter) {
        this.getFolderPermission(params);
      }
    },
    // 创建一个文件夹，调用子组件方法
    async createFolder() {

      // 判断当前的类型，确认时组织机构还是我的
      let obj = {};
      if (this.tableType == ResourceTableType.Organization) {
        if (this.queryObj != null) {
          if (this.queryObj.type === 1) {
            obj = {
              organizationId: this.queryObj.id,
              parentId: null,
            };
          } else if (this.queryObj.type === 2) {
            obj = {
              organizationId: await this.getOrganizationId(this.queryObj.id),
              parentId: this.queryObj.id,
            };
          } else return;
        }
      } else {
        obj = {
          organizationId: null,
          parentId: this.queryObj.id,
        };
      }
      this.$refs.SmResourceList.createFolder(obj);
    },

    // 根据当前组件类型获取工具栏的按钮信息
    async getToolBarMenus() {
      switch (this.tableType) {
        case ResourceTableType.Organization:
          // 我的组织显示的菜单,当时选择模式时，只需要显示新建文件夹，上传 两个功能
          let limitNames = this.queryObj.id === GuidEmpty ? ['upload', 'uploadD'] : [];
          this.toolbar = this.select ? MenuNames.filter
            (a =>
              a.toolBarMenu && (
                a.name == 'newFolder' ||
                a.name == 'upload'),
            ) : MenuNames.filter(
              a => a.toolBarMenu && !['bin', 'private'].includes(a.role) && !limitNames.includes(a.name),
            );
          break;
        case ResourceTableType.Mine:
          this.toolbar = this.select ? MenuNames.filter
            (a =>
              a.toolBarMenu && (
                a.name == 'newFolder' ||
                a.name == 'upload'),
            ) : MenuNames.filter(
              (a => a.toolBarMenu && a.role != 'bin' && a.name != 'tag') || a.name == 'publish',
            );
          break;
        case ResourceTableType.ShareCenter:
          this.toolbar = MenuNames.filter(a => a.toolBarMenu && !['bin', 'private'].includes(a.role));
          this.toolbar = this.toolbar.filter(a => a.toolBarMenu && !['upload', 'uploadD', 'newFolder'].includes(a.name));
          break;
        case ResourceTableType.Delete:
          this.toolbar = MenuNames.filter(a => a.role == 'bin' || a.role == 'delete');
          break;
        default:
          this.toolbar = MenuNames.filter(a => a.name == 'upload');
          break;
      }
    },

    // 获取文件夹的权限信息，用来过滤选中文件后的工具栏菜单
    async getFolderPermission(params) {
      if (params.type === 2) {
        let data = {
          type: 1,
          id: params.id,
        };
        let response = await apiFileManage.getResourceShare(data);
        if (requestIsSuccess(response)) {
          let shareP = response.data;
          if (shareP != null) {
            // 计算处理工具条中的菜单
            this.toolbar = this.toolbar.filter(a => {
              if (shareP[a.role]) return a;
            });
            console.log(this.toolbar);
          }
        }
      }
    },

    // 文件上传前处理
    fileUpload(fileList, fileId) {
      // 判断当前有无选中对应的树节点，若没有，需要提示文件默认上传到了"我的"目录下
      if (this.queryObj == null) {
        this.ConfirmModal('文件将默认上传到“我的”目录', () => {
          this.fileState.isMine = true;
          this.uploadHandler(Array.from(fileList));
        });
      } else if (fileId === undefined || fileId === null) {
        //上传到指定的文件
        if (this.queryObj.isMine) {
          // 上传到“我的”指定的文件夹
          this.fileState.isMine = true;
          this.fileState.folderId = this.queryObj.id;
          this.uploadHandler(Array.from(fileList));
        } else {
          // 上传到我的组织,也有可能是组织下的文件夹
          this.fileState.isMine = false;
          if (this.queryObj.type === 1) {
            this.fileState.organizationId = this.queryObj.id;
            this.fileState.folderId = null;
          }
          if (this.queryObj.type === 2) {
            this.fileState.folderId = this.queryObj.id;
            this.fileState.organizationId = null;
          }
          this.uploadHandler(Array.from(fileList));
        }
      } else {
        // 上传最新的文件版本信息
        this.fileState.isVersion = true;
        this.fileState.fileId = fileId;
        this.fileState.folderId = null;
        this.fileState.organizationId = null;
        this.uploadHandler(Array.from(fileList));
      }
    },
    ConfirmModal(content, onOk, onCancel) {
      this.$confirm({
        title: '温馨提示',
        content,
        okText: '确认',
        cancelText: '取消',
        onOk,
        onCancel,
      });
    },
    // 文件下载
    fileDownload(datas) {
      // 如果选择的是文件夹，则需要将文件夹打包下载，如果选择的是文件，只需要下载单个的文件就可以。
      if (datas.length > 0) {
        datas.forEach(a => {
          let data = {
            name: a.name,
            size: a.size,
            type: a.type,
            id: a.id,
            url: a.url,
            perSignGetUrl: '', // 文件下载地址，通过后台接口获取，暂留
            editTime: a.lastModificationTime,
            progress: 0,
            error: false,
            rtype: a.resourceType,// 资源类型，如果是文件夹，需要调用后台接口处理文件夹的相关问题。
          };
          this.$emit('downloadChange', data);
        });
      }
    },
    // 文件上传前处理，包括文件签名等获取
    uploadHandler(fileList) {
      let _this = this;
      if (fileList.length > 0) {
        // 获取上传签名
        fileList.forEach(a => {
          if (a.webkitRelativePath != null) {
            a.path = a.webkitRelativePath.substring(
              0,
              a.webkitRelativePath.lastIndexOf('/'),
            );
          }
          let sufixx = a.name.substring(a.name.lastIndexOf('.'));
          this.getPersiginUrl(sufixx).then(res => {
            let data = _this.getFileData(res, a, sufixx);
            _this.$emit('uploadChange', data);
          });
        });
      }
    },
    // 获取文件上传的签名地址
    getPersiginUrl(sufixx) {
      let promise = new Promise(async (res, err) => {
        let response = await apiFile.getPresignUrl({ sufixx });
        if (requestIsSuccess(response)) {
          res(response.data);
        }
      });
      return promise;
    },
    // 根据条件获取文件数据实体
    getFileData(res, file, sufixx) {
      let newFile = new File([file], `${res.fileId}${sufixx}`);
      return {
        file: newFile,
        size: file.size,
        name: file.name.substring(0, file.name.lastIndexOf('.')),
        type: sufixx,
        editTime: file.lastModifiedDate,
        id: CreateUUID(),
        progress: 0,
        error: false,
        upload: true,
        path: file.path,
        state: this.fileState,
        presignUrl: res.presignUrl,
        relativeUrl: res.relativePath,
        ossType: res.ossType,
      };
    },
    // 获取文件的下载地址
    getFileDownloadUrl() {
      // TODO  暂留
    },
  },
  render() {
    let tagAndSearchBar = (
      <div>
        <a-input-group compact>
          <a-select
            size={this.select ? 'small' : 'default'}
            placeholder="全部"
            style="width: 30%"
            value={this.selectValue}
            onChange={v => {
              // 过滤查询
              this.selectValue = v;
              let data = {
                id: v === 0 ? GuidEmpty : v,
                type: 3,
              };
              this.selectQueryObj = data;
              this.$refs.SmResourceList.getResource(v === 0 ? this.queryObj : this.selectQueryObj, this.tableType, null, this.selectValue);
            }}
            selectedKeys={[0]}
          >
            <a-select-option value={0}>全部</a-select-option>
            {this.tagArray.map(item => {
              return <a-select-option value={item.id}>{item.name}</a-select-option>;
            })}
          </a-select>
          <a-input-search
            size={this.select ? 'small' : 'default'}
            allow-clear
            style="width: 55%"
            placeholder="输入文件名称"
            onSearch={v => {
              if (v === '') {
                // 查询默认的内容
                let query = this.selectValue === 0 ? this.queryObj : this.selectQueryObj;
                this.$refs.SmResourceList.getResource(query, this.tableType, null, this.selectValue);
              } else {
                // 查询指定的资源
                this.$refs.SmResourceList.queryResource(
                  v,
                  this.selectValue === 0 ? GuidEmpty : this.selectValue,
                  null, true,
                );
              }
            }}
          />
          <div class="f-list-matrix">
            <a-icon
              onClick={() => {
                this.showTable = !this.showTable;
              }}
              type={this.showTable ? 'border-outer' : 'unordered-list'}
            />
          </div>
        </a-input-group>
      </div>
    );
    return (
      <div style="height:100%">
        <div class="f-resource-bar">
          <div class="f-menus">
            <SmResourceToolBar
              select={this.select}
              onFileUpload={this.fileUpload}
              onFolderUpload={this.fileUpload}
              menus={this.toolBarMenus}
              onMenuClick={this.menusClick}

            />
          </div>
          <div class="f-tags-search">{tagAndSearchBar}</div>
        </div>
        <div class="f-resource-list">
          <SmResourceList
            ref="SmResourceList"
            select={this.select}
            multiple={this.multiple}
            scrollHeight={this.scrollHeight}
            onSuccess={() => this.$emit('refresh')} // 编辑或新增文件夹成功事件
            onChangeFolderNode={(id) => {
              this.queryObj.id = id;
              this.$emit('chanageTreeNode', id)
            }} //点击表格中文件夹，同时更新左侧树节点
            axios={this.axios}
            istable={this.showTable}
            value={this.iValue}
            onVersionUpload={this.fileUpload}
            onSelected={v => {
              this.$emit('selected', v);
              this.iValue = v;
            }} //选择的文件信息
            onDownload={v => this.fileDownload(v)}
            onTagChange={() => this.getTagList()}
            onUnableDelete={v => {
              // 禁用删除菜单
              this.toolbar.forEach(a => {
                if (a.name === 'delete') {
                  a.enable = !v;
                  a.tip = v ? '存在无权限删除的文件，请重新选择' : '';
                }
              });
            }}
          />
        </div>
      </div>
    );
  },
};
