import {
  ModalStatus,
  StationsType,
  DateReportType,
  RepairType,
  StoreHouseEnable,
  RepairValType,
  RepairPeriodUnit,
  SelectablePlanType,
  YearMonthPlanState,
  PlanType,
  PlanState,
  RepairLevel,
  OrderState,
  StoreEquipmentTransferTypeEnable,
  WorkflowState,
  WorkflowStepState,
  UserWorkflowGroup,
  SkylightType,
  CategoryEnable,
  InstallationSiteType,
  RunningState,
  RailwayType,
  QuestionType,
  State,
  Source,
  ServiceLifeUnit,
  Group,
  StoreEquipmentState,
  RailwayDirection,
  InstallationSiteState,
  InstallationSiteLocationType,
  InstallationSiteUseType,
  StoreEquipmentTestState,
  EquipmentServiceRecordType,
  ScopeType,
  CableLayType,
  CableCoreType,
} from './enum';

/**
 * 获取模态框标题
 * @param {状态} status
 */
export function getModalTitle(status) {
  let title = '';
  switch (status) {
  case ModalStatus.Add:
    title = '添加';
    break;
  case ModalStatus.Edit:
    title = '编辑';
    break;
  case ModalStatus.View:
    title = '查看';
    // case ModalStatus.Detail:
    //     title = '详情';
    break;
  }
  return title;
}

export function getStationTypeTitle(status) {
  let title = '';
  switch (status) {
  case StationsType.Station:
    title = '车站';
    break;
  case StationsType.Section:
    title = '区间';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//线路类型
export function getRailwayTypeTitle(status) {
  let title = '';
  switch (status) {
  case RailwayType.Uniline:
    title = '单线';
    break;
  case RailwayType.DoubleLine:
    title = '复线';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//线路方向
export function getRailwayDirectionTitle(status) {
  let title = '';
  switch (status) {
  case RailwayDirection.Up:
    title = '上行';
    break;
  case RailwayDirection.Down:
    title = '下行';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//机房状态
export function getInstallationSiteStateTitle(status) {
  let title = '';
  switch (status) {
  case InstallationSiteState.Using:
    title = '在用';
    break;
  case InstallationSiteState.Building:
    title = '在建';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//位置类型
export function getInstallationSiteLocationTypeTitle(status) {
  let title = '';
  switch (status) {
  case InstallationSiteLocationType.RailwayOuter:
    title = '非沿线';
    break;
  case InstallationSiteLocationType.SectionInner:
    title = '沿线区间';
    break;
  case InstallationSiteLocationType.StationInner:
    title = '沿线站内';
    break;
  case InstallationSiteLocationType.Other:
    title = '其它';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//使用类别
export function getInstallationSiteUseTypeTitle(status) {
  let title = '';
  switch (status) {
  case InstallationSiteUseType.Private:
    title = '独用';
    break;
  case InstallationSiteUseType.Share:
    title = '共用';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//年月表类型
export function getDateReportTypeTitle(status) {
  let title = '';
  switch (status) {
  case DateReportType.Year:
    title = '年表';
    break;
  case DateReportType.Month:
    title = '月表';
    break;
  default:
    title = '未定义';
  }
  return title;
}
//仓库状态类型
export function getStoreHouseEnableOption(status) {
  let title = '';
  switch (status) {
  case StoreHouseEnable.All:
    title = '所有';
    break;
  case StoreHouseEnable.Enable:
    title = '启用';
    break;
  case StoreHouseEnable.Unable:
    title = '停用';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//维修类别
export function getRepairTypeTitle(status) {
  let title = '';
  switch (status) {
  case RepairType.Daily:
    title = '日常检修';
    break;
  case RepairType.Muster:
    title = '集中检修';
    break;
  case RepairType.Key:
    title = '重点检修';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//维修类别
export function getRepairValTypeTitle(status) {
  let title = '';
  switch (status) {
  case RepairValType.Number:
    title = '数字';
    break;
  case RepairValType.Char:
    title = '字符';
    break;
  case RepairValType.Table:
    title = '表格';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//维修周期单位
export function getRepairPeriodUnit(unit) {
  let title = '';
  switch (unit) {
  case RepairPeriodUnit.Other:
    title = '其他';
    break;
  case RepairPeriodUnit.Year:
    title = '年';
    break;
  case RepairPeriodUnit.Month:
    title = '月';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//添加待选计划类型
export function getSelectablePlanType(status) {
  let title = '';
  switch (status) {
  case SelectablePlanType.Year:
    title = '年';
    break;
  case SelectablePlanType.HalfYaer:
    title = '半年';
    break;
  case SelectablePlanType.QuarterYear:
    title = '季度';
    break;
  case SelectablePlanType.Month:
    title = '月';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//年月表状态
export function getYearMonthPlanStateType(status) {
  let title = '';
  switch (status) {
  case YearMonthPlanState.UnCommit:
    title = '未提交';
    break;
  case YearMonthPlanState.UnCheck:
    title = '待审核';
    break;
  case YearMonthPlanState.Checking:
    title = '审核中';
    break;
  case YearMonthPlanState.Passed:
    title = '审核通过';
    break;
  case YearMonthPlanState.UnPassed:
    title = '审核驳回';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//计划类型
export function getPlanTypeTitle(status) {
  let title = '';
  switch (status) {
  case PlanType.Vertical:
    title = '垂直天窗';
    break;
  case PlanType.General:
    title = '综合天窗';
    break;
  case PlanType.OutOf:
    title = '天窗点外';
    break;
  case PlanType.All:
    title = '全部';
    break;
  default:
    title = '';
  }
  return title;
}

//天窗类型
export function getSkyligetTypeTitle(status) {
  let title = '';
  switch (status) {
  case SkylightType.Vertical:
    title = '垂直天窗';
    break;
  case SkylightType.General:
    title = '综合天窗';
    break;
  case SkylightType.OutOf:
    title = '天窗点外';
    break;
  case SkylightType.All:
    title = '全部';
    break;
  case SkylightType.Other:
    title = '其他';
    break;
  default:
    title = '';
  }
  return title;
}

//计划状态
export function getPlanState(status) {
  let title = '';
  switch (status) {
  case PlanState.UnDispatching:
    title = '未派工';
    break;
  case PlanState.Dispatching:
    title = '已派工';
    break;
  case PlanState.NotIssued:
    title = '未下发';
    break;
  case PlanState.Issued:
    title = '已下发';
    break;
  case PlanState.Complete:
    title = '已完成';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//维修级别
export function getRepairLevelTitle(status) {
  let title = '';
  switch (status) {
  case RepairLevel.LevelI:
    title = '天窗点内I级维修';
    break;
  case RepairLevel.LevelII:
    title = '天窗点内II级维修';
    break;
  case RepairLevel.LevelIII:
    title = '天窗点外I级维修';
    break;
  case RepairLevel.LevelIv:
    title = '天窗点外II级维修';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//派工单状态
export function getOrderStateTitle(status) {
  let title = '';
  switch (status) {
  case OrderState.UnFinished:
    title = '未完成';
    break;
  case OrderState.Complete:
    title = '已完成';
    break;
  case OrderState.Acceptance:
    title = '已验收';
    break;
  default:
    title = '未定义';
  }
  return title;
}

// 工作流状态
export function getWorkflowState(state) {
  let title = '';
  switch (state) {
  case WorkflowState.All:
    title = '全部';
    break;
  case WorkflowState.Finished:
    title = '已完成';
    break;
  case WorkflowState.Waiting:
    title = '待审批';
    break;
  case WorkflowState.Rejected:
    title = '已退回';
    break;
  case WorkflowState.Stopped:
    title = '已终止';
    break;
  default:
    title = '未定义';
  }
  return title;
}
//工作流节点状态
export function getWorkflowStepState(state) {
  let title = '';
  switch (state) {
  case WorkflowStepState.Approved:
    title = '通过';
    break;
  case WorkflowStepState.Rejected:
    title = '退回';
    break;
  case WorkflowStepState.Stopped:
    title = '终止';
    break;
  default:
    title = '发起';
  }
  return title;
}

// 用户工作流群组
export function getUserWorkflowGroup(group) {
  let title = '';
  switch (group) {
  case UserWorkflowGroup.All:
    title = '所有';
    break;
  case UserWorkflowGroup.Initial:
    title = '我发起的';
    break;
  case UserWorkflowGroup.Waiting:
    title = '待我审批';
    break;
  case UserWorkflowGroup.Approved:
    title = '我已审批';
    break;
  case UserWorkflowGroup.Cc:
    title = '抄送我的';
    break;
  default:
    title = '未定义';
  }
  return title;
}

// 栏目是否启用
export function getCategoryEnable(status) {
  let title = '';
  switch (status) {
  case CategoryEnable.All:
    title = '所有';
    break;
  case CategoryEnable.Enable:
    title = '是';
    break;
  case CategoryEnable.Unable:
    title = '否';
    break;
  default:
    title = '未定义';
  }
  return title;
}
// 设备是否出库
export function getStoreEquipmentTransferTypeEnable(status) {
  let title = '';
  switch (status) {
  case StoreEquipmentTransferTypeEnable.Import:
    title = '入库';
    break;
  case StoreEquipmentTransferTypeEnable.Export:
    title = '出库';
    break;
  default:
    title = '未定义';
  }
  return title;
}
// 设备安装位置类型
export function getInstallationSiteType(status) {
  let title = '';
  switch (status) {
  case InstallationSiteType.Station:
    title = '车站';
    break;
  case InstallationSiteType.Section:
    title = '区间';
    break;
  case InstallationSiteType.Other:
    title = '其他';
    break;
  default:
    title = '未定义';
  }
  return title;
}

// 设备 运行状态类型
export function getRunningState(status) {
  let title = '';
  switch (status) {
  case RunningState.PrimaryUse:
    title = '主用';
    break;
  case RunningState.SealUp:
    title = '封存';
    break;
  case RunningState.Standby:
    title = '备用';
    break;
  case RunningState.Scrap:
    title = '报废';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//题库 题目类型
export function getQuestionType(status) {
  let title = '';
  switch (status) {
  case QuestionType.SingleChoice:
    title = '单选';
    break;
  case QuestionType.MultipleChoice:
    title = '多选';
    break;
  case QuestionType.TrueOrFalseQuestions:
    title = '判断';
    break;
  case QuestionType.GapFilling:
    title = '填空';
    break;
  case QuestionType.ShortAnswerQuestion:
    title = '简答';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//故障案例 故障状态
export function getState(status) {
  let title = '';
  switch (status) {
  case State.UnSubmitted:
    title = '待提交';
    break;
  case State.Submitted:
    title = '已提交';
    break;
  case State.Pending:
    title = '待处理';
    break;
  case State.UnChecked:
    title = '未销记';
    break;
  case State.CheckedOut:
    title = '已销记';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//故障案例 来源
export function getSource(status) {
  let title = '';
  switch (status) {
  case Source.History:
    title = '历史记录';
    break;
  case Source.System:
    title = '系统登记';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//故障案例 来源
export function getServiceLifeUnit(status) {
  let title = '';
  switch (status) {
  case ServiceLifeUnit.Year:
    title = '年';
    break;
  case ServiceLifeUnit.Month:
    title = '月';
    break;
  case ServiceLifeUnit.Day:
    title = '天';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//应急预案关联人员 处理状态
export function getGroup(status) {
  let title = '';
  switch (status) {
  case Group.Launched:
    title = '由我发起';
    break;
  case Group.Waiting:
    title = '待我处理';
    break;
  case Group.Handled:
    title = '我已处理';
    break;
  case Group.Cc:
    title = '抄送给我';
    break;
  default:
    title = '未定义';
  }
  return title;
}
//库存设备 设备状态
export function getStoreEquipmentState(status) {
  let title = '';
  switch (status) {
  case StoreEquipmentState.UnActived:
    title = '未激活';
    break;
  case StoreEquipmentState.OnService:
    title = '已安装';
    break;
  case StoreEquipmentState.WaitForTest:
    title = '待检测';
    break;
  case StoreEquipmentState.Spare:
    title = '备用';
    break;
  case StoreEquipmentState.Scrap:
    title = '报废';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//检测单 设备状态
export function getStoreEquipmentTestPassed(status) {
  let title = '';
  switch (status) {
  case StoreEquipmentTestState.Unqualified:
    title = '不合格';
    break;
  case StoreEquipmentTestState.Qualified:
    title = '合格';
    break;
  case StoreEquipmentTestState.All:
    title = '所有';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//设备 设备上下道
export function getEquipmentServiceRecordType(status) {
  let title = '';
  switch (status) {
  case EquipmentServiceRecordType.Install:
    title = '安装';
    break;
  case EquipmentServiceRecordType.UnInstall:
    title = '拆除';
    break;
  default:
    title = '未定义';
  }
  return title;
}

//电缆铺设类型
export function getCableLayTypeTile(status) {
  let title = '';
  switch (status) {
  case CableLayType.Conduit:
    title = '管道';
    break;
  case CableLayType.Overhead:
    title = '架空';
    break;
  case CableLayType.Bury:
    title = '直埋';
    break;
  case CableLayType.InnerChannelFlow:
    title = '室内槽道及竖井';
    break;
  case CableLayType.OuterChannelFlow:
    title = '室外槽道';
    break;
  default:
    title = '未定义';
  }
  return title;
}

// 电缆类型
export function getCableCoreType(type) {
  let name = '';
  switch (type) {
  case CableCoreType.Electric:
    name = '电缆芯';
    break;
  case CableCoreType.Optical:
    name = '光缆芯';
    break;
  default:
    name = '未定义';
  }
  return name;
}

/**
 * 过滤一个 Object 的特定属性
 * @param {*} object
 * @param {*} props ['name', 'age',...]
 * @param {*} deep
 */
export function objFilterProps(object, props, deep = false) {
  let _obj = {};
  for (let prop of props) {
    if (object.hasOwnProperty(prop)) {
      _obj[prop] = object[prop];
    }
  }
  return _obj;
}

/**
 * 判断一个请求是否成功
 * @param {*} response
 */
export function requestIsSuccess(response) {
  if (response.request.responseURL.indexOf('ReturnUrl') >= 0) {
    return false;
  }

  return (
    response && (response.status === 200 || response.status === 201 || response.status === 204)
  );
}

/**
 * 浮点数加法
 * @param {*} arg1
 * @param {*} arg2
 */
export function addNum(arg1, arg2) {
  let r1, r2, m, c;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    let cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }
  return (arg1 + arg2) / m;
}

/**
 * 浮点数减法
 * @param {*} arg1
 * @param {*} arg2
 */
export function subNum(arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
}

/**
 * 浮点数乘法
 * @param {*} arg1
 * @param {*} arg2
 */
export function mulNum(arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}

/**
 * 浮点数除法
 * @param {*} arg1
 * @param {*} arg2
 */
export function divNum(arg1, arg2) {
  let t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * pow(10, t2 - t1);
}

export function getFileUrl(url) {
  let fileServerEndPoint = localStorage.getItem('fileServerEndPoint');
  return url.indexOf('http') > -1 ? url : fileServerEndPoint + url;
}

export function dateFormat(date, fmt) {
  let nowDate;
  if (typeof date == 'string') {
    date = date.replace(/-/g, '/');
  }
  if (!fmt) {
    fmt = 'yyyy-MM-dd HH:mm:ss';
  }
  if (date) {
    nowDate = new Date(date);
  } else {
    nowDate = new Date();
  }

  if (nowDate.getFullYear() == 1) return null;

  let o = {
    'M+': nowDate.getMonth() + 1, //月份
    'd+': nowDate.getDate(), //日
    'H+': nowDate.getHours(), //小时
    'm+': nowDate.getMinutes(), //分
    's+': nowDate.getSeconds(), //秒
    'q+': Math.floor((nowDate.getMonth() + 3) / 3), //季度
    S: nowDate.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (nowDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
  return fmt;
}

// 生产 Guid
export function CreateGuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

// 获取设备范围类型 1@name1@id1.2@name2@id2
export function parseScope(scopeString) {
  if (!scopeString) return null;

  let scopes = scopeString.split('.');
  let last = scopes[scopes.length - 1];
  let lastArray = last.split('@');

  let organizationScopeCode = scopes.length ? scopes[0] : null;
  let organizationScope = null;
  if (organizationScopeCode) {
    let [type, name, id] = organizationScopeCode.split('@');
    organizationScope = {
      type,
      name,
      id,
    };
  }

  return {
    _scopes: scopeString,
    type: lastArray[0],
    name: lastArray[1],
    id: lastArray[2],
    scope: last,
    scopeCode: last,
    organizationScope,
  };
}

/**
 * 获取范围编码
 * @param {Guid} id id
 * @param {ScopeType} type 范围类型
 * @param {String} name 名称
 */
export function stringfyScope(id, type, name) {
  if (!id || !type) {
    return null;
  }
  return `${type}@${name || ''}@${id}`;
}

/**
 * A 是否包含 B Scope
 * @param {string} scopeCodeA A
 * @param {string} scopeCodeB B
 */
export function scopeIsContains(scopeCodeA, scopeCodeB) {
  // scopeCodes:[
  //   '1@长阳线路所@39f7a383-e548-826a-cd73-f93a621e4023',
  //   '1@长阳线路所@39f7a383-e548-826a-cd73-f93a621e4023.2@长阳-北京@b424f56a-b5b9-4b33-819e-e07a677c3760',
  //   '1@长阳线路所@39f7a383-e548-826a-cd73-f93a621e4023.2@长阳-北京@b424f56a-b5b9-4b33-819e-e07a677c3760.3@长阳站@99074cc2-3d6e-445d-b45c-5e4ee887bbe3',
  //   '1@长阳线路所@39f7a383-e548-826a-cd73-f93a621e4023.2@长阳-北京@b424f56a-b5b9-4b33-819e-e07a677c3760.3@长阳站@99074cc2-3d6e-445d-b45c-5e4ee887bbe3.4@原继电器室@5a0abe2f-06dc-482a-883e-b26b12154e2c',
  // ]

  let a = parseScope(scopeCodeA);
  let b = parseScope(scopeCodeB);

  if (a.scope === b.scope || a.id === b.id) {
    return true;
  }

  if (scopeCodeB.indexOf(scopeCodeA) > -1) {
    return true;
  }

  return false;
}

/**
 *
 * @param {VNode} component vue 组件或者 dom
 * @param {Array} allPermissions 所有权限数组
 * @param {String} permission 当前权限组
 */
export function vPermission(component, allPermissions, permission) {
  if (permission instanceof Array) {
    for (let item of permission) {
      if (allPermissions.find(x => x === item) != null) {
        return component;
      }
    }
  } else if (typeof permission === 'string') {
    return allPermissions.find(x => x === permission) ? component : undefined;
  }
  return undefined;
}

/**
 * 是否拥有全新
 * @param {Array} allPermissions 所有权限数组
 * @param {String} permission 当前权限组
 */
export function vP(allPermissions, permission) {
  if (permission instanceof Array) {
    for (let item of permission) {
      if (allPermissions.find(x => x === item) != null) {
        return true;
      }
    }
  } else if (typeof permission === 'string') {
    if (allPermissions.find(x => x === permission) != null) {
      return true;
    }
  }
  return false;
}

/**
 * 条件是否成立
 * @param {*} component 组件
 * @param {*} bool 条件
 */
export function vIf(component, bool) {
  return bool ? component : undefined;
}

export function isArray(value) {
  return value instanceof Array;
}

export function isString(value) {
  return typeof value === 'string';
}
