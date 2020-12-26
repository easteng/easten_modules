// 文件管理模块公共对象及方法
import { requestIsSuccess,getFileUrl } from '../../../_utils/utils';
import ApiFileManage from '../../../sm-api/sm-file/fileManage';
import OssRepository from '../src/ossRepository';
import FileSaver from 'file-saver';
import ZIP from '../src/zip';
import JSZIP from 'jszip';

export let componentType = {
  organization: 'organization', // 我的组织
  mine: 'mine', // 我的
  shareCenter: 'shareCenter', // 共享中心
  restore: 'restore', // 回收站
};

let apiFileManage = new ApiFileManage();
let ossRepository = new OssRepository();
let jsZip=new JSZIP();

export let GuidEmpty = '00000000-0000-0000-0000-000000000000';

/**
 * @description 结构树节点属性处理
 * @author easten
 * @date 2020-07-01
 * @export 处理后的树数据
 * @param {*} nodes 原始数据
 * @returns 数组
 */
export function TreeNodeHandler(nodes, icon) {
  // slots: { icon: 'switcherIcon' },
  let orgIcon = '';
  let folderIcon = '';
  if (nodes != null && nodes.length > 0) {
    loop(nodes);
  }
  function loop(nodes) {
    nodes.forEach(item => {
      if (item.type === 0) {
        // 组织机构节点
        item.slots = {
          icon: icon == null ? 'organ' : icon,
        };
      } else if (item.isShare) {
        item.slots = {
          icon: 'shared',
        };
      } else {
        item.slots = {
          icon: 'folderOpen',
        };
      }
      if (item.children.length > 0) loop(item.children);
    });
  }
  return nodes;
}

export function TreeSelectNodeHandler(nodes) {
  if (nodes != null && nodes.length > 0) {
    loop(nodes);
  }
  function loop(nodes) {
    nodes.forEach(item => {
      if (item.type === 0) {
        // 组织机构节点
        item.scopedSlots = { icon: 'organ' };
      } else if (item.isShare) {
        item.scopedSlots = { icon: 'shared' };
      } else {
        item.scopedSlots = { icon: 'organ-share' };
      }
      if (item.children.length > 0) loop(item.children);
    });
  }
  return nodes;
}

/**
 * @description 获取文件数据流
 * @author easten
 * @date 2020-07-16
 * @export
 * @param {*} files 文件列表
 * @returns 文件数据流对象
 */
export function getFileStream(files) {
  return new Promise(resolve => {
    if (files.length > 0) {
      let data = [];
      files.forEach(item => {
        ossRepository
          .download(getFileUrl(item.url), p => {})
          .then(res => {
            data.push({
              name: `${item.name}${item.type}`,
              blob: res,
            });
            if (data.length == files.length) {
              resolve(data);
            }
          });
      });
    }
  });
}

export function fileDownload(files) {
  if (files instanceof Array) {
    // 多文件打包下载
    getFileStream(files).then(datas => {
      // 拼装压缩包格式
      if (datas.length > 0) {
        SaveMultipleFile(`附件.zip`, datas).then(() => {
          console.log('下载成功');
        });
      }
    });
  } else {
    // 单文件下载
    ossRepository
      .download(getFileUrl(files.url), progress => {})
      .then(blob => {
        SaveSingleFile(`${files.name}${files.type}`, files.size, blob).then(a => {
          console.log('下载成功');
        });
      });
  }
}

/**
 * @description 给树结构节点添加指定的图标
 * @author easten
 * @date 2020-07-02
 * @export
 * @param {*} nodes 元数据
 * @param {*} nodeIcon slot icon 定义
 */
export function TreeNodeAddIcon(nodes, nodeIcon) {
  if (nodes) {
    nodes.forEach(a => {
      a.slots = {
        icon: nodeIcon,
      };
      if (a.children.length > 0) {
        loop(a.children, nodeIcon);
      }
    });
    function loop(nodes, icon) {
      if (nodes) {
        nodes.forEach(a => {
          a.slots = {
            icon: icon,
          };
          if (a.children.length > 0) {
            loop(a.children, icon);
          }
        });
      }
    }
  }
  return nodes;
}

/**
 *获取指定的节点及节点子集
 * @export array
 * @param {*} nodes 数据源
 * @param {*} id 指定的节点id
 */
export function GetTreeNodeById(nodes, id) {
  let node = [];
  if (nodes != null && nodes.length > 0) {
    loop(nodes, id);
  }
  function loop(nodes, id) {
    nodes.forEach(a => {
      if (a.id === id) {
        node.push(a);
        return;
      } else if (a.children.length > 0) {
        loop(a.children, id);
      }
    });
  }
  return node;
}

/**
 * 根据条件获取组织机构id
 * @export
 * @param {*} axios
 * @param {*} type 节点类型，
 * @param {*} id 节点id
 * @returns 组织机构id
 */
export async function GetOraganizationId(axios, type, id) {
  apiFileManage = new ApiFileManage(axios);
  let data = { type, id };
  let response = await apiFileManage.getOragniaztionId(data);
  if (requestIsSuccess(response)) return response.data;
  else return null;
}

/**
 * 删除确认对话框
 * @export function
 * @param {*} content 提示的内容
 * @param {*} onOk 点击确认的function
 * @param {*} onCancel 点击取消的function
 */
export function ConfirmModal(content, onOk, onCancel) {
  this.$confirm({
    title: '温馨提示',
    content,
    okText: '确认',
    cancelText: '取消',
    onOk,
    onCancel,
  });
}
// 文件类型icon
export let resourceIcon = {
  folder: 'folder-open',
  xls: 'file-excel',
  xlsx: 'file-excel',
  md: 'file-markdown',
  pdf: 'file-pdf',
  ppt: 'file-ppt',
  txt: 'file-text',
  doc: 'file-word',
  unknown: 'file-unknown',
  zip: 'file-zip',
  other: 'file',
  jpg: 'file-image',
};

// 定义模态框的类型
export const FileModalType = {
  Move: 1, // 移动
  Copy: 2, // 复制
  Restore: 3, // 还原
  Share: 4, // 共享
  Permission: 5, // 权限
  Publish: 6, // 发布
};

// 资源类型
export const ResourceType = {
  Unknown: 0,
  Folder: 1,
  File: 2,
};

// 文件传输类型
export const TransType = {
  DownLoad: 1, // 正在下载
  Upload: 2, // 正在上传C
  Complete: 3, // 传输完成
};

//
/**
 * @description 文件大小转换
 * @author easten
 * @date 2020-07-08
 * @export
 * @param {*} fileSize
 * @returns kb GB  G
 */
export function FileSizeTrans(fileSize) {
  let size = '';
  if (fileSize < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    size = fileSize.toFixed(2) + 'B';
  } else if (fileSize < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    size = (fileSize / 1024).toFixed(2) + 'KB';
  } else if (fileSize < 0.1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    size = (fileSize / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    //其他转化成GB
    size = (fileSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  let sizestr = size + '';
  let len = sizestr.indexOf('.');
  let dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

/**
 * @descriptio 保存单个文件
 * @author easten
 * @date 2020-07-13
 * @param {*} fileName 需要保存的文件名
 * @param {*} fileSize 文件的大小
 * @param {*} fileStream 文件的数据流
 * @memberof ossRepository
 */
export function SaveSingleFile(fileName, fileSize, blob) {
  return new Promise(resolve => {
    FileSaver.saveAs(blob, fileName);
    resolve();
  });
}

/**
 * @description 批量下载
 * @author easten
 * @date 2020-07-13
 * @export
 * @param {*} zipName 压缩包名称
 * @param {*} files 需要压缩的文件信息
 */
export function SaveMultipleFile(zipName, files) {
  return new Promise((resolve,error) => {
    // 首先定义一个文件夹
    let zip=new JSZIP();
    files.forEach(a=>{
      zip.file(a.name,a.blob);
    });
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, zipName);
        resolve();
    }).catch(()=>{
      error();
    });
  });
}

// 定义本地存储，解决多组件间数据传递问题
export const ComponentModel = {
  size: window.localStorage.getItem('size') || 'default', // 组件尺寸，控制表格的大小和列表的尺寸
  select: toBool(window.localStorage.getItem('select')), // 选择模式，控制全局整体样式
  multiple: toBool(window.localStorage.getItem('multiple')), // 多选模式，控制表格的单选，多选状态
  saveSize(item) {
    window.localStorage.setItem('size', item);
  },
  saveSlect(item) {
    window.localStorage.setItem('select', item);
  },
  saveMultiple(item) {
    window.localStorage.setItem('multiple', item);
  },
};

function toBool(item) {
  return item === 'false' ? false : true;
}

// 通过url地址处理图片大小
/**
 * @description 根据url 读取图片资源信息
 * @author easten
 * @date 2020-07-14
 * @export
 * @param {*} url
 * @returns
 */
export function ImageReady(url) {
  return new Promise((res, err) => {
    let list = [],
      intervalId = null,
      // 用来执行队列
      tick = function() {
        let i = 0;
        for (; i < list.length; i++) {
          list[i].end ? list.splice(i--, 1) : list[i]();
        }
        !list.length && stop();
      },
      // 停止所有定时器队列
      stop = function() {
        clearInterval(intervalId);
        intervalId = null;
      };
    let onready,
      width,
      height,
      newWidth,
      newHeight,
      img = new Image();
    img.url = url;
    if (img.complete) {
      res(img, img.width, img.height); // 图片已被缓存，直接返回
    }
    width = img.width;
    height = img.height;
    img.onerror = e => err(e); // 加载错误
    onready = function() {
      newWidth = img.width;
      newHeight = img.height;
      if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
        // 如果图片已经在其他地方加载可使用面积检测
        res(img, width, height);
        onready.end = true;
      }
    };
    onready();
    //完全加载完成后
    img.onload = function() {
      !onready.end && onready();
      res(img, width, height);
      img = img.onload = img.onerror = null;
    };
    if (!onready.end) {
      list.push(onready);
      // 无论何时只允许出现一个定时器，减少浏览器性能损耗
      if (intervalId === null) intervalId = setInterval(tick, 40);
    }
  });
}

/**
 * @description 前端生成GUID
 * @author easten
 * @date 2020-07-14
 * @export
 * @returns UUID
 */
export function CreateUUID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

// 菜单按钮权限定义，用于下拉菜单或者顶部工具栏
export const MenuRoles = {
  // 分类定义
  edit: {
    newFolder: false, //新建文件夹
    move: false, //移动
    upload: false, //上传
    rename: false, //重命名
    share: false, //共享
    permission: false, //权限
    tag: false, // 标签
    version: false, // 版本
  },
  view: {
    detial: false, // 查看
    download: false, //下载
    copy: false, //复制
  },
  delete: false, //删除
  use: false, // 是否能被某人/组织/角色引用
  publish: false,
};

//  菜单名称定义
export const MenuNames = [
  // 分类定义
  {
    title: '新建文件夹',
    name: 'newFolder',
    role: 'edit',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: 'folder-add',
    enable:true,tip:'',
  },
  {
    title: '上传文件',
    name: 'upload',
    role: 'edit',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: 'vertical-align-top',
    enable:true,tip:'',
  },
  {
    title: '上传目录',
    name: 'uploadD',
    role: 'edit',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: 'folder',
    enable:true,tip:'',
  },
  {
    title: '下载',
    name: 'downLoad',
    role: 'view',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: 'vertical-align-bottom',
    enable:true,tip:'',
  }, //
  {
    title: '重命名',
    name: 'rename',
    role: 'edit',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  },
  {
    title: '复制',
    name: 'copy',
    role: 'view',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  },
  {
    title: '移动',
    name: 'move',
    role: 'edit',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  }, //
  {
    title: '共享',
    name: 'share',
    role: 'edit',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  },
  {
    title: '发布到',
    name: 'publish',
    role: 'private',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: 'cloud-server',
    enable:true,tip:'',
  },
  {
    title: '权限',
    name: 'permission',
    role: 'edit',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  },
  {
    title: '标签',
    name: 'tag',
    role: 'edit',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: 'tags',
    enable:true,tip:'',
  }, //
  {
    title: '版本',
    name: 'version',
    role: 'edit',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  },
  {
    title: '查看',
    name: 'detial',
    role: 'view',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: '',
    enable:true,tip:'',
  },
  {
    title: '还原',
    name: 'restore',
    role: 'bin',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: 'usb',
    enable:true,tip:'',
  }, //
  {
    title: '还原到',
    name: 'restoreTo',
    role: 'bin',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: 'inbox',
    enable:true,tip:'',
  },
  {
    title: '清空回收站',
    name: 'clear',
    role: 'bin',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: 'rest',
    enable:true,
    tip:'',
  }, //
  {
    title: '删除',
    name: 'delete',
    role: 'delete',
    toolBarMenu: true, //是否引用与工具栏
    listMenu: true, // 是否是应用到下拉列表中
    icon: 'delete',
    enable:true,
    tip:'',
  }, //
  {
    title: '引用',
    name: 'use',
    role: 'private',
    toolBarMenu: false, //是否引用与工具栏
    listMenu: false, // 是否是应用到下拉列表中
    icon: '',
    enable:true,
    tip:'',
  }, // 是否能被某人/组织/角色引用
];

// 定义一个数据队列，用来存储文件上传的数据，解决数据上传中数据触发的问题
/**
 * @description 消息队列类，用来处理文件上传逻辑
 * @author easten
 * @date 2020-07-09
 * @export
 * @class MesageQueue
 */
export class MesageQueue {
  constructor() {
    this.items = new WeakMap();
    this.items.set(this, []);
  }
  // 入队
  enqueue(ele) {
    let q = this.items.get(this);
    q.push(ele);
    this.eventListener();
  }
  // 出队
  dequeue() {
    let q = this.items.get(this);
    let res = q.shift();
    return res;
  }
  // 拿出最前面的
  front() {
    let q = this.items.get(this, []);
    return q[0];
  }
  // 队列大小
  size() {
    let q = this.items.get(this, []);
    return q.length;
  }
  // 队列是否 为空
  isEmpty() {
    let q = this.items.get(this, []);
    return q.length === 0;
  }
  eventListener(){

  }
}

// 创建文件格式对应表
export const FileTypes = [
  { k: 'audio/3gpp', v: '3gpp' },
  { k: 'video/3gpp', v: '3gpp' },
  { k: 'audio/ac3', v: 'ac3' },
  { k: 'allpication/vnd.ms-asf', v: 'asf' },
  { k: 'audio/basic', v: 'au' },
  { k: 'text/css', v: 'css' },
  { k: 'text/csv', v: 'csv' },
  { k: 'application/msword ', v: 'dot' },
  { k: 'application/xml-dtd', v: 'dtd' },
  { k: 'image/vnd.dwg', v: 'dwg' },
  { k: 'image/vnd.dxf', v: 'dxf' },
  { k: 'image/gif', v: 'gif' },
  { k: 'text/htm', v: 'htm' },
  { k: 'text/html', v: 'html' },
  { k: 'image/jp2', v: 'jp2' },
  { k: 'image/jpeg', v: 'jpeg' },
  { k: 'text/javascript', v: 'js' },
  { k: 'application/javascript', v: 'js' },
  { k: 'application/json', v: 'json' },
  { k: 'audio/mpeg', v: 'mp2' },
  { k: 'audio/mp4', v: 'mp4' },
  { k: 'video/mpeg', v: 'mpeg' },
  { k: 'application/vnd.ms-project', v: 'mpp' },
  { k: 'application/ogg', v: 'ogg' },
  { k: 'audio/ogg', v: 'ogg' },
  { k: 'application/pdf', v: 'pdf' },
  { k: 'image/png', v: 'png' },
  { k: 'application/vnd.ms-powerpoint', v: 'ppt' },
  { k: 'application/rtf', v: 'rtf' },
  { k: 'text/rtf', v: 'rtf' },
  { k: 'image/vnd.svf', v: 'svf' },
  { k: 'image/tiff', v: 'tif' },
  { k: 'text/plain', v: 'txt' },
  { k: 'application/vnd.ms-works', v: 'wdb' },
  { k: 'text/xml', v: 'xml' },
  { k: 'application/xhtml+xml', v: 'xhtml' },
  { k: 'application/xml', v: 'xml' },
  { k: 'application/vnd.ms-excel', v: 'xls' },
  { k: 'aplication/zip', v: 'zip' },
  { k: 'pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet', v: 'xlsx' },
];

function $findChilds(parentNode, text) {
  //如果不传入父节点的话，默认为body
  if (parentNode == undefined) parentNode = document.body;
  let childNodes = parentNode.childNodes;
  let results = [];
  //子节点大于零才循环
  if (childNodes.length > 0) {
    let length = childNodes.length;
    //循环查找符合text的节点
    for (let i = 0; i < length; ++i) {
      //三种情况，className，id， tagName
      switch (text.substr(0, 1)) {
        case '.':
          //这两种:parentNode.getElementsByClassName,parentNode.all
          //都是后来加上的，如果浏览器这两种方法都不支持，那就只能暴力递归了
          if (parentNode.getElementsByClassName)
            return parentNode.getElementsByClassName(text.substr(1));
          else if (parentNode.all) {
            let finded = [];
            let jlength = parentNode.all.length;
            for (let j = 0; j < jlength; ++j)
              if (parentNode.all[j].className == text.substr(1)) finded.push(parentNode.all[j]);
            return finded;
          }
          //以上两种方法都不支持，直接判断
          if (childNodes[i].className == text.substr(1)) results.push(childNodes[i]);
          break;
        case '#':
          return [document.getElementById(text.substr(1))];
        default:
          return parentNode.getElementsByTagName(text);
      }
      //判断完后，把当前子元素的子元素传入$findChilds进行递归查找，返回的结果直接和现在的结果合并
      results = results.concat($findChilds(childNodes[i], text));
    }
  }
  return results;
}

String.prototype.vtrim = function() {
  return this.replace(/^\s+|\s+$/g, '');
};

/**
 * @description 元素选择器
 * @author easten
 * @date 2020-07-16
 * @export
 * @param {*} text id或者类名
 * @returns
 */
export function documentSelect(text) {
  //按照空格分割参数
  let values = text.vtrim().split(' ');
  let length = values.length;
  //如果只有一个选择参数的话，就直接调用dom方法返回结果。
  if (length == 1)
    switch (values[0].substr(0, 1)) {
      case '#':
        return document.getElementById(values[0].substr(1));
      case '.':
        if (document.getElementsByClassName)
          return document.getElementsByClassName(values[0].substr(1));
      default:
        return document.getElementsByTagName(values[0]);
    }
  //每次迭代都会产生许多符合参数的结果节点,这里结果节点的名称为parentNodes，第一次循环默认为body
  let parentNodes = [document.body];
  //外层循环为迭代每个传入的参数
  for (let i = 0; i < length; ++i) {
    let jlength = parentNodes.length;
    let results = [];
    //这里如果values的长度为零的话，
    //就说明是多出来的空格，
    //例如:$g("      .content");这种情况不执行代码直接跳入下一循环
    let tmpValue = values[i].vtrim();
    if (tmpValue.length <= 0) continue;
    //内层循环为迭代每个结果节点，
    //在结果节点中查找符合选择条件的结果。当然第一次为body
    for (let j = 0; j < jlength; ++j) {
      //$findChilds就是上边的那个函数，就是选择某个节点的子节点的
      let result = $findChilds(parentNodes[j], values[i].vtrim());
      let rlength = result.length;
      //因为返回的有时候是html容器，无法直接和数组concat所以倒入数组，这里有优化空间，但暂不考虑性能先这么做
      for (let k = 0; k < rlength; ++k) results.push(result[k]);
    }
    //没有结果，立即返回undefined
    if (results == undefined || results.length <= 0) return undefined;
    //最后一次循环就直接返回结果数组，但是如果最后一个选择条件是选择id的话，那就不返回数组直接返回dom对象了
    if (i == length - 1) {
      if (values[i].substr(0, 1) == '#') return results[0];
      return results;
    }
    parentNodes = results;
  }
}

// oss 对象存储服务类型
export const OssType={
  amazons3:'amazons3',
  minio:'minio',
  aliyun:'aliyun',
};

