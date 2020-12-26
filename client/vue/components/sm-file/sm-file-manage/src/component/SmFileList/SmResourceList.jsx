// 资源显示组织，包括列表显示和矩阵显示
import {
  pagination as paginationConfig,
  tips as tipsConfig,
} from '../../../../../_utils/config';
import moment from 'moment';
import SmEditInput from '../SmEditInput';
import SmFileMoveCopyModal from '../SmFileMoveCopyModal';
import SmFileSharePromissionModal from '../SmFileSharePromissionModal';
import SmFileTagSelectModal from './SmFileTagSelectModal';
import SmFileVersionModal from './SmFileVersionModal';
import SmFileImageView from '../SmFileImageView';
import SmFileDocumentView from '../SmFileDocumentView';
import { requestIsSuccess, getFileUrl } from '../../../../../_utils/utils';
import ApiFileManage from '../../../../../sm-api/sm-file/fileManage';
import ApiFolder from '../../../../../sm-api/sm-file/folder';
import ApiFile from '../../../../../sm-api/sm-file/file';
import ApiTag from '../../../../../sm-api/sm-file/tag';
import { ResourceTableType } from '../../../../../_utils/enum';
import OssRepository from '../../ossRepository';
import SmFileUpload from '../SmFileUpload';
import '../../../style/index';
import {
  resourceIcon,
  FileModalType,
  ResourceType,
  GetOraganizationId,
  MenuRoles,
  MenuNames,
  FileSizeTrans,
  FileTypes,
  ComponentModel,
  documentSelect,
  GuidEmpty,
} from '../../common';
import { identity } from 'lodash';
let apiFileManage = new ApiFileManage();
let apiFolder = new ApiFolder();
let apiFile = new ApiFile();
let apiTag = new ApiTag();
let ossRepository = new OssRepository();
export default {
  name: 'SmResourceList',
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    multiple: { type: Boolean, default: false }, // 多选模式
    select: { type: Boolean, default: false }, // 选择模式
    data: { type: Array, default: null }, // 需要绑定的数据对象
    istable: { type: Boolean, default: true }, // 是否以表格的形式显示
    bordered: { type: Boolean, default: false }, // 是否显示表格边框
    axios: { type: Function, default: null },
    query: { type: Object, default: null }, // 默认查询对象，和data 只能使用一个
    scrollHeight: { type: Number, default: 450 }, // 表格的滚动条高度
    value: { type: Array, default: null },
  },
  data() {
    return {
      dataSource: [], // 资源数据
      showTable: true, //是否显示表格
      totalCount: 0,
      pageIndex: 1,
      pageSize: paginationConfig.defaultPageSize,
      queryParams: {
        maxResultCount: paginationConfig.defaultPageSize,
      },
      dateRange: [moment(moment()).startOf('month'), moment(moment()).endOf('month')],
      loading: false,
      currentType: ResourceTableType.Organization, // 当前数据源表格类型
      selectedList: [], //  复选的内容
      selectedRowKeys: [], // 表格选中的行
      currentParams: null, // 记录当前查询数据的参数，用于刷新数据使用
      currentRow: null, //当前的行
      newFolderParams: null, // 新建文件夹时的参数
      modalTitle: '', // 模态框的标题
      // 编辑行使用对象
      editStateObj: {
        rowid: null, //需要重命名的row id
        right: true, // 状态是否正确，不为空验证或者字符超标验证，默认是true
        name: null, // 当前行的原始值，在取消保存时使用
      },
      // 共享，权限数据传递对象
      sharePromissObj: {
        title: '',
        type: '',
        data: null,
      },
      showVersionRowIds: [], // 需要显示历史版本的行
      expandedRowKeys: [], // 表格扩展-展开的行记录
      pdfSrc: '',
      tagId: null, // 标签id，表示是否通过标签id查询过数据
    };
  },
  computed: {
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          //width: 200,
          ellipsis: true,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '大小',
          width: 100,
          dataIndex: 'size',
          scopedSlots: { customRender: 'size' },
        },
        {
          title: '修改时间',
          width: 200,
          dataIndex: 'editTime',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
    innerColumns() {
      return [
        {
          title: '文件版本',
          dataIndex: 'version',
          // width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'version' },
        },
        {
          title: '文件大小',
          dataIndex: 'size',
          // width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'size' },
        },
        {
          title: '上传时间',
          width: 200,
          dataIndex: 'editTime',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: '操作',
          dataIndex: 'operations',
          width: 140,
          scopedSlots: { customRender: 'operations' },
        },
      ];
    },
    //下拉菜单列表及权限
    menus() {
      return this.getMenusState();
    },
    rowSelection() {
      let selection = {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: a => {
          return {
            props: {
              defaultChecked: this.selectedRowKeys.includes(a),
              disabled: this.select ? a.resourceType == ResourceType.Folder : false,
            },
          };
        },
      };
      if (!this.multiple) {
        selection.type = 'radio';
        selection.columnTitle = '选择';
      }
      return selection;
    },
    thumList() {
      if (this.select) {
        return this.dataSource.filter(a => a.resourceType == 2);
      } else {
        return this.dataSource;
      }
    },
    datas() {
      return this.filterDataSrouce();
    },
  },
  watch: {
    istable: {
      handler: function (a, b) {
        this.showTable = a;
        this.getTableScroll();
      },
    },
    value: {
      handler(nVal, oVal) {
        this.selectedList = nVal || [];
        this.selectedRowKeys = this.selectedList.map(a => a.id);
      },
      immediate: true,
    },
  },
  getSnapshotBeforeUpdate(a, b, c) { },
  async created() {
    // 初始入口
    this.initAxios();
    this.showTable = this.istable;
  },
  methods: {
    initAxios() {
      apiFileManage = new ApiFileManage(this.axios);
      apiFolder = new ApiFolder(this.axios);
      apiFile = new ApiFile(this.axios);
      apiTag = new ApiTag(this.axios);
    },
    // 获取资源数据
    /**
     * @description 获取资源数据
     * @author easten
     * @date 2020-07-27
     * @param {*} params 查询参数
     * @param {*} type 节点类型，文件或者组织结构
     * @param {*} treeNodeClick 左侧树结构点击
     * @param {*} useTag 是否是tag 查询
     */
    async getResource(params, type, treeNodeClick, useTag) {
      this.$emit('unableDelete', false);
      if (useTag) {
        this.tagId = params.id;
      } else {
        this.tagId = null;
      }
      this.loading = true;
      if (treeNodeClick != undefined && treeNodeClick) {
        // 点击树节点查询数据，每次查询将页面的起始页重置成1
        this.pageIndex = 1;
      }
      if (params != null) {
        this.currentParams = params;
        this.currentType = type;
        params.size = this.queryParams.maxResultCount;
        params.page = (this.pageIndex - 1) * this.queryParams.maxResultCount;
        let response = await apiFileManage.getResourceList(params);
        if (requestIsSuccess(response)) {
          this.dataSource = response.data.items;
          this.totalCount = response.data.totalCount;
          this.loading = false;
        }
        this.recovery();
        this.getTableScroll();
      }
    },
    // 过滤数据源
    filterDataSrouce() {
      // 当资源中的文件或者文件夹，在共享数据状态下，共享权限不可查看时，需要过滤掉
      // 在我的组织模式中，资源中的权限状态view 为不可查看时，需要过滤掉。
      // 回收站中，如果资源时不可删除的，需要进行处理。

      switch (this.currentType) {
      case ResourceTableType.ShareCenter:
        this.dataSource = this.dataSource.filter(a => {
          if (a.resourceType === ResourceType.File) {
            if (a.fileShares != null && a.fileShares.length === 0) return a;
            let shareP = this.getPermission(a.fileShares);
            if (shareP.view) {
              return a;
            }
          } else if (a.resourceType === ResourceType.Folder) {
            if (a.folderShares != null && a.folderShares.length === 0) return a;
            let shareP = this.getPermission(a.folderShares);
            if (shareP.view) {
              return a;
            }
          }
        });
        break;
      case ResourceTableType.Organization:
        this.dataSource = this.dataSource.filter(a => {
          if (a.resourceType === ResourceType.File) {
            let shareP = this.getPermission(a.filePermissions);
            if (shareP.view) {
              return a;
            }
          } else if (a.resourceType === ResourceType.Folder) {
            let shareP = this.getPermission(a.folderPermissions);
            if (shareP.view) {
              return a;
            }
          }
        });
        break;
      default:
        break;
      }

      return this.dataSource;
    },
    // 控制表格的滚动条
    getTableScroll() {
      let tableBody = documentSelect('#resource-table .ant-table-body');
      if (tableBody != null && tableBody.length > 0) {
        tableBody[0].style.maxHeight = this.scrollHeight + 'px';
      }
    },
    // 根据关键字查询
    async queryResource(keyWords, tagId) {
      this.tagId = tagId;
      if (this.currentParams != null) {
        let data = {
          name: keyWords,
          nodeId: this.currentParams.id,
          nodeType: this.currentParams.id === undefined ? 3 : this.currentParams.type - 1, // 默认参数中的类型时为了查询资源，查询文件需要修改类型
          size: this.queryParams.maxResultCount,
          page: (this.pageIndex - 1) * this.queryParams.maxResultCount,
          tagId,
        };
        let response = await apiFileManage.get(data);
        if (requestIsSuccess(response)) {
          this.dataSource = response.data.items;
          this.totalCount = response.data.totalCount;
        }
        this.recovery();
      }
    },
    // 计算当前资源类型状态下下拉菜单的显示状态
    getMenusState() {
      let menus = [];
      switch (this.currentType) {
      case ResourceTableType.Organization:
        menus = MenuNames.filter(a => a.listMenu && a.name != 'publish');
        break;
      case ResourceTableType.Mine:
        menus = MenuNames.filter(a => ['publish', 'permission', 'delete'].includes(a.name));
        break;
      case ResourceTableType.Delete:
        menus = MenuNames.filter(a => ['restore', 'restoreTo', 'delete'].includes(a.name));
        break;
      case ResourceTableType.ShareCenter:
        menus = MenuNames.filter(
          a =>
            a.listMenu &&
              !['bin', 'private'].includes(a.role) &&
              !['upload', 'uploadD', 'newFolder'].includes(a.name),
        );
        break;
      }
      return menus;
    },
    // 根据数据信息获取各自的菜单内容
    getMenuItems(row) {
      //思路：当列表为组织机构列表，获取permission
      //     当列表为共享中心，获取sharePermission权限绑定
      //     当列表为”我的“
      //     当列表为回收站，菜单只显示回收站的
      let menus = this.getMenusState();
      let permission = null;
      switch (this.currentType) {
      case ResourceTableType.Organization:
        if (row.resourceType === ResourceType.Folder) {
          permission = this.getPermission(row.folderPermissions);
          menus = menus.filter(a => a.name != 'version'); //文件夹不显示版本按钮
        } else {
          permission = this.getPermission(row.filePermissions);
        }
        break;
      case ResourceTableType.ShareCenter:
        if (row.resourceType === ResourceType.Folder) {
          permission = this.getPermission(row.folderShares);
          menus = menus.filter(a => a.name != 'version'); //文件夹不显示版本按钮
        } else {
          permission = this.getPermission(row.fileShares);
        }
        // 共享中的文件菜单不管是权限控制与否，都不能显示版本，标签，和权限
        break;
      }
      menus =
        permission == null
          ? menus
          : menus.filter(a => {
            if (permission[a.role]) {
              return a;
            }
          });
      if (this.currentType === ResourceTableType.ShareCenter) {
        let limit = ['tag', 'version', 'permission', 'share', 'move'];
        menus = menus.filter(a => !limit.includes(a.name));
      }
      return menus.map(item => {
        return (
          <a-menu-item>
            <a
              onClick={() => {
                this.operationEvent(item, row);
              }}
            >
              {item.title}
            </a>
          </a-menu-item>
        );
      });
    },

    // 获取资源的权限信息，
    getPermission(datas) {
      let state = {
        edit: [],
        view: [],
        delete: [],
        use: [],
      };
      if (datas != undefined || datas != null) {
        datas.forEach(a => {
          state.edit.push(a.edit);
          state.view.push(a.view);
          state.delete.push(a.delete);
          state.use.push(a.use);
        });
      }
      return {
        edit: !state.edit.includes(false),
        view: !state.view.includes(false),
        delete: !state.delete.includes(false),
        use: !state.use.includes(false),
      };
    },
    // 新建文件夹
    createFolder(params) {
      if (params.organizationId === GuidEmpty) {
        this.$message.warning('当前节点不允许创建文件夹');
        return;
      }
      this.newFolderParams = params;
      let newData = {
        id: '0-0-0-0',
        name: '',
        resourceType: 1,
        size: 0,
      };
      this.dataSource.push(newData);
      this.newFolder = true;

      // 启动编辑输入框
      this.editStateObj.rowid = newData.id;
      this.editStateObj.name = newData.name;
    },
    // 根据是否显示历史版本过滤表格的列
    computedColumns() {
      if (this.showVersionRowIds.length > 0) {
        if (this.tableColumns.length == 6) {
          this.tableColumns.splice(2, 0, this.versionColumn);
        } else {
          this.tableColumns.splice(2, 1, this.versionColumn);
        }
      } else {
        this.tableColumns = this.tableColumns.filter(
          a => a.dataIndex != this.versionColumn.dataIndex,
        );
      }
      return this.tableColumns;
    },
    // 操作区下拉按钮事件
    operationEvent(item, row) {
      switch (item.name) {
      case 'rename':
        // 重命名
        this.rename(row);
        break;
      case 'move':
        // 重命名
        this.move(row);
        break;
      case 'copy':
        // 复制
        this.copy(row);
        break;
      case 'downLoad':
        // 下载
        this.download(row);
        break;
      case 'version':
        // 版本
        this.version(row);
        break;
      case 'tag':
        // 标签
        this.tag(row);
        break;
      case 'share':
        // 共享
        this.share(row);
        break;
      case 'permission':
        // 权限
        this.permission(row);
        break;
      case 'delete':
        // 权限
        this.delete(row);
        break;
      case 'publish':
        // 发布
        this.publish(row);
        break;
      case 'restoreTo':
        // 还原到
        this.restoreTo(row);
        break;
      case 'restore':
        // 还原
        this.restore(row);
        break;
      default:
        break;
      }
    },
    // 重命名
    rename(row) {
      this.editStateObj.rowid = row.id;
      this.editStateObj.name = row.name;
      this.newFolderParams = null;
    },
    // 移动到
    move(row) {
      this.modalTitle = row.name;
      this.$refs.SmFileMoveCopyModal.active(FileModalType.Move, row.resourceType, row.id); //激活组件
    },
    // 复制
    copy(row) {
      this.modalTitle = row.name;
      this.$refs.SmFileMoveCopyModal.active(FileModalType.Copy, row.resourceType, row.id); //激活组件
    },
    // 标签
    async tag(row) {
      let oId = ''; // 组织机构id
      let data = {
        resources: [],
        tagIds: [],
      };
      let tags = null;
      if (this.selectedList.length > 0) {
        tags = [];
      } else if (row != null) {
        if (row.tags == null) {
          identity;
          let response = await apiTag.getTagIds({ type: row.resourceType, id: row.id });
          if (requestIsSuccess(response)) {
            tags = response.data;
          }
        } else {
          tags = row.tags.map(a => {
            return a.id;
          });
        }

      } else {
        this.$message.warning('请选择资源');
        return;
      }
      oId =
        this.currentParams.type == 1
          ? this.currentParams.id
          : await GetOraganizationId(
            this.axios,
            row.resourceType,
            row.id,
          ); // 获取组织机构id

      this.$refs.SmFileTagSelectModal.active(oId, tags); // 激活组件
      this.currentRow = row;
    },
    // 标签选择确认后回调
    async tagSelectCallback(tagIds) {
      let resources = [];
      if (this.selectedList.length > 0) {
        // 多选的内容
        this.selectedList.forEach(a => {
          resources.push({
            type: a.resourceType,
            id: a.id,
          });
        });
      } else {
        resources.push({
          type: this.currentRow.resourceType,
          id: this.currentRow.id,
        });
      }
      let data = {
        resources,
        tagIds,
      };

      let response = await apiFileManage.createResourceTag(data);
      if (requestIsSuccess(response)) {
        this.$message.success('操作成功');
        // 刷新当前数据
        this.getResource(this.currentParams, this.currentType); //重新加载一次数据
      }
    },
    // 下载
    download(row) {
      if (row != null) {
        this.$emit('download', [row]);
        // this.$message.success('文件已添加到下载列表');
      } else if (this.selectedList.length > 0) {
        this.$emit('download', this.selectedList);
        // this.$message.success('文件已添加到下载列表');
      } else {
        this.$message.warning('请选择需要下载的资源');
        return;
      }
    },
    // 版本
    version(row) {
      // 存储row id
      this.expandedRowKeys = this.expandedRowKeys.includes(row.id)
        ? this.expandedRowKeys.filter(a => a != row.id)
        : [...this.expandedRowKeys, row.id];
      console.log(this.expandedRowKeys);
    },
    // 共享
    share(row) {
      //共享文件
      this.$refs.SmFileSharePromissionModal.active(row, FileModalType.Share);
    },
    // 发布
    publish(row) {
      // 发布文件或者文件夹
      //this.modalTitle = row.name;
      let publishObj = {
        folderIds: [],
        fileIds: [],
      };
      if (this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.resourceType === 1) publishObj.folderIds.push(item.id);
          if (item.resourceType === 2) publishObj.fileIds.push(item.id);
        });
      } else if (row != null) {
        if (row.resourceType == ResourceType.File) publishObj.fileIds.push(row.id);
        if (row.resourceType == ResourceType.Folder) publishObj.folderIds.push(row.id);
      } else {
        this.$message.warning('请选择需要发布的资源');
        return;
      }
      console.log(publishObj);
      this.$refs.SmFileMoveCopyModal.active(FileModalType.Publish, null, null, publishObj); //激活组件
    },
    //权限
    permission(row) {
      this.$refs.SmFileSharePromissionModal.active(row, FileModalType.Permission);
    },
    // 还原到
    restoreTo(row) {
      let publishObj = {
        folderIds: [],
        fileIds: [],
      };
      if (this.selectedList.length > 0) {
        // 还原选中资源资源或者指定资源
        this.selectedList.forEach(item => {
          if (item.resourceType === ResourceType.Folder) publishObj.folderIds.push(item.id);
          if (item.resourceType === ResourceType.File) publishObj.fileIds.push(item.id);
        });
      } else if (row != null) {
        // 还原指定的资源
        if (row.resourceType == ResourceType.File) {
          publishObj.fileIds.push(row.id);
        }
        if (row.resourceType == ResourceType.Folder) {
          publishObj.folderIds.push(row.id);
        }
      } else {
        this.$message.warning('请选择需要还原的数据！');
        return;
      }
      this.$refs.SmFileMoveCopyModal.active(FileModalType.Restore, null, null, publishObj); //激活组件
    },
    // 还原
    restore(row) {
      // 只修改状态，所以只传递参数即可
      let _this = this;
      let data = {
        folderIds: [],
        fileIds: [],
      };
      if (this.selectedList.length > 0) {
        // 还原选中资源资源或者指定资源
        this.selectedList.forEach(item => {
          if (item.resourceType === 1) data.folderIds.push(item.id);
          if (item.resourceType === 2) data.fileIds.push(item.id);
        });
      } else if (row != null) {
        // 还原指定的资源
        if (row.resourceType == ResourceType.File) {
          data.fileIds.push(row.id);
        }
        if (row.resourceType == ResourceType.Folder) {
          data.folderIds.push(row.id);
        }
      } else {
        this.$message.warning('请选择需要还原的数据！');
        return;
      }
      this.ConfirmModal('确定还原选中资源吗？', async () => {
        let response = await apiFileManage.restore(data);
        if (requestIsSuccess(response)) {
          _this.$message.success('资源已还原到原始目录');
          _this.getResource(this.currentParams, this.currentType);
          // 提交父组件更新
          _this.$emit('success');
        }
      });
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
    // 删除
    delete(row) {
      let canDelete = true; // 用于确认是否可以删除
      let _this = this;
      let param = {
        folders: [],
        files: [],
      };
      if (this.selectedList.length > 0) {
        // 删除多条记录，需要分类
        param.folders = this.selectedList.map(item => {
          if (item.resourceType === 1) return item.id;
        });
        param.files = this.selectedList.map(item => {
          if (item.resourceType === 2) return item.id;
        });
      } else if (row != null) {
        if (row.resourceType === 1) param.folders.push(row.id);
        if (row.resourceType === 2) param.files.push(row.id);
      } else {
        this.$message.warning('请选择需要删除的资源！');
        return;
      }
      if (this.currentType == ResourceTableType.Delete) param.isTure = true; //是否真实删除，回收站中删除为真实删除。
      if (canDelete) this.deleteConfirm(param);
    },
    // 清空回收站
    async deleteAll() {
      let _this = this;
      if (this.dataSource.length == 0) {
        this.methods.warning('回收站已为空!');
        return;
      }
      this.ConfirmModal('确定要清空回收站中的内容吗？', async () => {
        let response = await apiFileManage.deleteAll();
        if (requestIsSuccess(response)) {
          // 已清空
          _this.$message.success('回收站已清空');
          _this.getResource(this.currentParams);
          _this.selectedList = [];
        }
      });
    },
    // 编辑保存
    async editSave(row) {
      // 新建文件夹时也调用这个方法
      if (this.newFolderParams != null) {
        // 保存新的文件夹信息
        let param = {
          organizationId: this.newFolderParams.organizationId,
          parentId: this.newFolderParams.parentId,
          name: row.name,
        };
        let response = await apiFolder.create(param);
        if (requestIsSuccess(response)) {
          this.editStateObj.rowid = null;
          this.$message.success('创建成功', 1);
          this.getResource(this.currentParams, this.currentType); //重新加载一次数据
          // 创建成功，还需要刷新左侧目录树结构
          this.$emit('success');
        }
      } else {
        let param = {
          id: row.id,
          name: row.name,
        };
        let response = null;
        if (row.resourceType === ResourceType.Folder) response = await apiFolder.update(param);
        else response = await apiFile.update(param);
        if (requestIsSuccess(response)) {
          this.$message.success('重命名成功', 1);
          this.editStateObj.rowid = null;
          this.$emit('success');
        }
      }
    },
    // 编辑取消
    editCanale(row) {
      if (this.newFolderParams != null) {
        this.dataSource = this.dataSource.filter(a => a.id != this.editStateObj.rowid);
        this.newFolderParams = null;
      }
      this.editStateObj.rowid = null;
      row.name = this.editStateObj.name;
    },
    // 关闭文件版本
    closeVersion(id) {
      this.showVersionRowIds = this.showVersionRowIds.filter(a => a != id);
      // 同时刷新一次资源
      this.getResource(this.currentParams);
    },
    onPageChange(page, pageSize) {
      this.queryParams.maxResultCount = pageSize;
      this.pageIndex = page;
      this.getResource(this.currentParams, this.currentType);
    },
    onShowSizeChange(page, pageSize) {
      this.queryParams.maxResultCount = pageSize;
      this.pageIndex = page;
      this.getResource(this.currentParams, this.currentType);
    },
    // 图标状态文件选择
    selectCheck(row) {
      let item = {
        id: row.id,
        name: row.name,
        url: row.url,
        type: row.type,
        size: row.size,
        resourceType: row.resourceType,
      };
      if (this.multiple) {
        // 多选状态
        this.selectedList =
          this.selectedList.find(a => a.id === item.id) == undefined
            ? [...this.selectedList, item]
            : this.selectedList.filter(a => a.id != item.id);
      } else {
        // 单选状态
        this.selectedList = [item];
      }
      this.selectedRowKeys = this.selectedList.filter(a => {
        return a.id;
      });
    },
    // 表格复选框选中事件
    onSelectChange(key, items) {
      this.selectedRowKeys = key;
      this.selectedList = items;
      // 向父组件提交选中的内容
      // 提交items 时只需提交：id,name,url,type,
      let result = [];
      let notDeleteCount = 0;
      items.forEach(a => {
        let permission = {};
        if (this.currentType === ResourceTableType.Organization) {
          permission = this.getPermission(
            a.resourceType === ResourceType.File ? a.filePermissions : a.folderPermissions,
          );
        } else if (this.currentType === ResourceTableType.ShareCenter) {
          permission = this.getPermission(
            a.resourceType === ResourceType.File ? a.fileShares : a.folderShares,
          );
        }
        result.push({
          id: a.id,
          name: a.name,
          url: a.url,
          type: a.type,
          size: a.size,
          permission, // 需要权限信息
          resourceType: a.resourceType,
        });
        if (permission.delete != undefined && !permission.delete) {
          notDeleteCount++;
        }
      });
      if (notDeleteCount == 0) {
        this.$emit('unableDelete', false);
      } else {
        this.$emit('unableDelete', true);
      }
      this.$emit('selected', result);
    },
    // 删除确认
    deleteConfirm(data) {
      let _this = this;
      let content = '';
      //data.length == 1 ? (content = `确定要删除${data[0].name} 吗?`) : '确定要删除这些数据吗?';
      this.$confirm({
        title: '温馨提示',
        content: '确定要删除数据吗？',
        okText: '确认',
        cancelText: '取消',
        async onOk() {
          console.log(data);
          let response = await apiFileManage.delete(data);
          if (requestIsSuccess(response)) {
            if (_this.currentType === ResourceTableType.Delete) {
              _this.$message.success('文件已彻底删除');
            } else {
              _this.$message.success('文件已删除，可在回收站找回');
            }

            // 删除成功，刷新当前列表
            _this.getResource(_this.currentParams, _this.currentType); //重新加载一次数据
            _this.$emit('success');
            _this.selectedRowKeys = [];
          }
        },
      });
    },
    // 文件夹行点击事件,点击查询新的数据
    folderSelect(row) {
      // 执行查询
      let params = {};
      if (this.currentType == ResourceTableType.Delete) {
        // params = {
        //   id: row.id,
        //   type: 2,
        //   isDelete: true,
        // };
        // 回收站列表中不让已删除文件夹中的文件
        this.$message.warning('无法查看已删除的内容');
        return;
      } else if (this.currentType == ResourceTableType.Mine) {
        params = {
          id: row.id,
          type: 2,
          isMine: true,
        };
      } else {
        params = {
          id: row.id,
          type: 2,
        };
      }
      this.getResource(params, this.currentType);
      // 点击选中的同时需要向父组件提交树节点选中事件
      this.$emit('changeFolderNode', row.id);
    },
    // 上传新版本
    upload(row, files) {
      if (files.length > 0) {
        let type = files[0].name.substring(files[0].name.lastIndexOf('.'));
        if (type !== row.type) {
          this.$message.error('上传版本与原文件格式不一致，请重新选择');
          return;
        } else {
          // 上传新版
          this.$emit('versionUpload', files, row.id);
        }
      }
    },
    // 选择新版本
    selectNew(row) {
      this.$refs.SmFileVersionModal.active(this.dataSource, row);
      // this.$message.success('该文件已是最新版本');
    },
    // 删除版本
    deleteVersion(row) {
      let _this = this;
      this.ConfirmModal('确定删除此文件版本吗?', async () => {
        // 执行删除
        let response = await apiFile.deleteFileVersion(row.id);
        if (requestIsSuccess(response)) {
          _this.$message.success('删除成功');
          _this.getResource(_this.currentParams, _this.currentType);
        }
      });
    },
    // 查看版本 (新增了文件名称)
    viewVersion(row, type, name) {
      row.type = type;
      row.url = row.ossUrl;
      row.name = name;
      this.view(row);
    },
    // 恢复表格状态
    recovery() {
      this.selectedList = [];
      this.selectedRowKeys = [];
    },
    // 查看文件，只支持pdf 和图片
    view(row) {
      let imgtypes = ['.jpg', '.png', '.tif', 'gif', '.JPG', '.PNG', '.GIF', '.jpeg', '.JPEG'];
      if (row.type === '.pdf') {
        this.$refs.SmFileDocumentView.view(row);
      } else if (imgtypes.includes(row.type)) {
        this.$refs.SmFileImageView.view(row);
      } else {
        this.$message.warning('当前文件不支持预览');
      }
    },
  },
  render() {
    let tableContent = (
      <div class="f-table" style={{ maxHeight: this.scrollHeight + 'px' }}>
        <a-table
          id="resource-table"
          ref="resourceTable"
          columns={this.columns}
          style="color:red"
          dataSource={this.datas}
          rowKey={a => a.id}
          bordered={this.bordered}
          loading={this.loading}
          tableLayout={this.select ? 'auto' : 'fixed'}
          size={this.select ? 'small' : 'large'}
          //scroll={{ y: 400 }}
          rowSelection={this.rowSelection}
          pagination={false}
          {...{
            scopedSlots: {
              index: (text, record, index) => {
                return index + 1 + this.queryParams.maxResultCount * (this.pageIndex - 1);
              },
              name: (t, r, i) => {
                // 编辑重命名组件
                return (
                  <SmEditInput
                    select={this.select}
                    value={r.name}
                    type={r.resourceType === 1 ? 'folder' : r.type.substring(1)}
                    state={this.editStateObj.rowid == r.id}
                    onChange={a => {
                      r.name = a;
                    }}
                    onVerify={v => {
                      this.editStateObj.right = v;
                    }}
                    onSelect={() => this.folderSelect(r)}
                  />
                );
              },
              date: (text, record, index) => {
                return (
                  <a-tooltip
                    placement="topLeft"
                    title={moment(record.editTime).format('YYYY-MM-DD HH:mm')}
                  >
                    <span>{moment(record.editTime).format('YYYY-MM-DD HH:mm')}</span>
                  </a-tooltip>
                );
              },
              type: (text, record, index) => {
                return record.resourceType === ResourceType.Folder ? text : record.type;
              },
              size: (text, record, index) => {
                return record.resourceType === ResourceType.Folder ? "" : FileSizeTrans(record.size);
              },
              // 操作
              operations: (t, row) => {
                return this.editStateObj.rowid == row.id
                  ? [
                    // 行编辑状态下按钮
                    <span>
                      <a
                        onClick={() => {
                          this.editSave(row);
                        }}
                        disabled={!this.editStateObj.right}
                      >
                        保存&nbsp;&nbsp;&nbsp;&nbsp;
                      </a>
                      <a
                        onClick={() => {
                          this.editCanale(row);
                        }}
                      >
                        取消&nbsp;&nbsp;&nbsp;&nbsp;
                      </a>
                    </span>,
                  ]
                  : [
                    // 正常状态下按钮
                    <span>
                      {this.currentType == ResourceTableType.Delete ? null : (
                        <a
                          onClick={() => this.view(row)}
                          disabled={
                            (this.editStateObj.rowid != null &&
                              this.editStateObj.rowid != row.id) ||
                            row.resourceType == 1
                          }
                        >
                          查看&nbsp;&nbsp;&nbsp;&nbsp;
                        </a>
                      )}
                      {!this.expandedRowKeys.includes(row.id) ? (
                        <a-dropdown
                          trigger={['click']}
                          disabled={
                            this.editStateObj.rowid != null && this.editStateObj.rowid != row.id
                          }
                        >
                          <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            更多 <a-icon type="down" />
                          </a>
                          {/* TODO 下拉菜单，根据文件的不同权限去过滤 */}
                          <a-menu slot="overlay">{this.getMenuItems(row)}</a-menu>
                        </a-dropdown>
                      ) : (
                        <a-dropdown trigger={['click']}>
                          <a-menu slot="overlay" class="f-version-menu-item">
                            <a-menu-item>
                              <SmFileUpload
                                showIcon={false}
                                multiple={false}
                                title="上传新版"
                                accept={row.type}
                                onBeforeUpload={(e, v) => {
                                  // console.log(v);
                                  // this.$emit('fileUpload', v);
                                  this.upload(row, v);
                                }}
                              />
                              {/* <a onClick={this.(row)}> 上传新版</a> */}
                            </a-menu-item>
                            <a-menu-item>
                              <a-button type="link" onClick={() => this.selectNew(row)}>
                                  选择新版
                              </a-button>
                            </a-menu-item>
                            <a-menu-item>
                              <a-button
                                type="link"
                                onClick={() => {
                                  this.expandedRowKeys = this.expandedRowKeys.filter(
                                    a => a != row.id,
                                  );
                                }}
                              >
                                  关闭当前
                              </a-button>
                            </a-menu-item>
                          </a-menu>
                          <a class="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {' '}
                              版本
                            <a-icon type="down" />
                          </a>
                        </a-dropdown>
                      )}
                    </span>,
                  ];
              },
            },
          }}
          expandIcon={null}
          expandIconAsCell={false}
          expandedRowKeys={this.expandedRowKeys}
          expandIconColumnIndex={-1}
          expandedRowRender={(record, index) => {
            return (
              <a-table
                columns={this.innerColumns}
                dataSource={record.versions || []}
                bordered={this.bordered}
                rowKey={a => a.id}
                size={this.select ? 'small' : 'large'}
                pagination={false}
                {...{
                  scopedSlots: {
                    version: (text, row, index) => {
                      return `v${text}`;
                    },
                    date: (text, row, index) => {
                      return moment(record.editTime).format('YYYY-MM-DD HH:mm');
                    },
                    size: (text, record, index) => {
                      return record.resourceType === ResourceType.Folder ? "111" : FileSizeTrans(record.size);
                    },
                    operations: (text, row) => {
                      return (
                        <span>
                          <a
                            onClick={() => this.viewVersion(row, record.type, `${record.name}-版本(${row.version})`)}
                          >
                            查看&nbsp;&nbsp;&nbsp;&nbsp;
                          </a>
                          <a
                            onClick={() => this.deleteVersion(row)}
                            disabled={record.versions.length === 1}
                          >
                            删除
                          </a>
                        </span>
                      );
                    },
                  },
                }}
              ></a-table>
            );
          }}
        ></a-table>
      </div>
    );

    // 选中状态

    let thumContent = (
      <div class={this.select ? 'f-thum-content f-thum-mini' : 'f-thum-content'}>
        {this.thumList.map(item => {
          return (
            <div
              key={item.id}
              onClick={() => {
                this.selectCheck(item);
              }}
              class={`f-thum-item ${this.selectedList.find(a => a.id == item.id) != undefined ? 'selected' : ''
              }`}
            >
              <div
                class="f-thum-selected"
                style={{
                  display:
                    this.selectedList.find(a => a.id == item.id) != undefined ? 'unset' : 'none',
                }}
              >
                <label class="f-thum-selected-label"></label>
              </div>
              {item.resourceType == 1 ? (
                <div class="f-thum f-thum-folder">
                  <a-icon type={resourceIcon.folder} theme="filled" />
                  <p>{item.name}</p>
                </div>
              ) : (
                <div style="width:100%; height:70%; font-size:10px">
                  <div class="f-thum f-thum-file">
                    {item.type == null ? (
                      <a-icon type={resourceIcon.unknown} />
                    ) : ['.png', '.jpg', '.img', '.gif', '.tif'].includes(item.type) ? (
                      <img width="100%" height="100%" src={getFileUrl(item.url)} alt="图片" />
                    ) : (
                      <a-icon
                        type={
                          resourceIcon[item.type.substring(item.type.indexOf('.') + 1)] ||
                                resourceIcon.unknown
                        }
                      />
                    )}
                  </div>
                  <p style="width:100%; position:absolute; left:0px">
                    <a-tooltip placement="bottom">
                      <template slot="title">
                        <span>
                          {item.name}
                          {item.type}
                        </span>
                      </template>
                      {item.name.substring(0, 5)}...
                      {item.type}
                    </a-tooltip>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
    return (
      <div class="f-resource-content">
        {/* 表格模式/矩阵模式 */}
        {this.showTable ? tableContent : thumContent}
        {/* 分页组件 */}
        <div class="f-resource-footer">
          <div class="f-resource-selected">
            已选择&nbsp;&nbsp;<span>{this.selectedList.length}</span>&nbsp;&nbsp;项
          </div>
          <div class="f-pagination">
            <a-pagination
              style="float:right; margin-top:10px"
              total={this.totalCount}
              pageSize={this.queryParams.maxResultCount}
              current={this.pageIndex}
              onChange={this.onPageChange}
              size={this.select ? 'small' : ''}
              onShowSizeChange={this.onShowSizeChange}
              showSizeChanger
              showQuickJumper
              showTotal={paginationConfig.showTotal}
            />
          </div>
        </div>

        {/* 复制移动选择框 */}
        <SmFileMoveCopyModal
          ref="SmFileMoveCopyModal"
          axios={this.axios}
          title={this.modalTitle}
          onSuccess={() => {
            // 刷新左侧树结构，刷新当前列表
            this.getResource(this.currentParams, this.currentType); //重新加载一次数据
            this.$emit('success');
          }}
        />

        {/* 文件权限，共享模态框 */}
        <SmFileSharePromissionModal
          ref="SmFileSharePromissionModal"
          onSuccess={() => {
            //数据保存成，需要刷新数据,同时还需要提交状态，更新左侧树结构
            this.getResource(this.currentParams, this.currentType);
            this.$emit('success');
          }}
          axios={this.axios}
        />

        {/* 资源标签选择模态框 */}
        <SmFileTagSelectModal
          ref="SmFileTagSelectModal"
          title="标签"
          axios={this.axios}
          onSuccess={this.tagSelectCallback}
          onTagChange={() => this.$emit('tagChange')}
        />

        {/* 选择文件版本（关联最新文件） */}
        <SmFileVersionModal
          ref="SmFileVersionModal"
          axios={this.axios}
          onSuccess={() => {
            this.getResource(this.currentParams, this.currentType);
          }}
        />
        {/* 图片类预览组件 */}
        <SmFileImageView ref="SmFileImageView" />
        {/* 文档浏览组件 */}
        <SmFileDocumentView ref="SmFileDocumentView" />
      </div>
    );
  },
};
