export const ModalStatus = {
  Hide: 0,
  Add: 1,
  Edit: 2,
  View: 3,
};

// 单页状态
export const PageState = {
  Add: 'add', // 添加模式
  Edit: 'edit', // 编辑模式
  View: 'view', // 查看模式
};

//车站类型
export const StationsType = {
  Station: 0, //车站
  Section: 1, //区间
};

//线路类型
export const RailwayType = {
  Uniline: 0, //单线
  DoubleLine: 1, //复线
};

//线路方向
export const RailwayDirection = {
  Up: 0, //上行
  Down: 1, //下行
};

//机房状态
export const InstallationSiteState = {
  Using: 1, //在用
  Building: 2, //在建
};

//位置类型
export const InstallationSiteLocationType = {
  RailwayOuter: 1, //非沿线
  SectionInner: 2, //沿线区间
  StationInner: 3, //沿线站内
  Other: 4, //其它
};

//使用类别
export const InstallationSiteUseType = {
  Private: 1, //独用
  Share: 2, //共用
};

//计划完成状态
export const CompleteState = {
  Finish: 0, // 完成
  UnFinish: 1, // 未完成
  Changed: 2, // 已变更
};

// 计划完成状态
export const PlanFinishState = {
  UnFinish: 0, // 未完成
  Complete: 1, // 已完成
  All: 2, // 全部
};

//年月表类型
export const DateReportType = {
  Year: 1, //年表
  Month: 2, //月表
};

//维修类别
export const RepairType = {
  Muster: 1, //集中检修
  Daily: 2, //日常检修
  Key: 3, //重点检修
};

//维修项值类型
export const RepairValType = {
  Number: 1,
  Char: 2,
  Table: 3,
};

//成员类型
export const MemberType = {
  Organization: 1, //组织
  Role: 2, //角色
  User: 3, //用户
  DynamicType: 1000, // 定义一个动态标签，用来记录所以动态组织的类型
  DynamicOrgLevel1: 21, // 动态组织1
  DynamicOrgLevel2: 22, // 动态组织2
  DynamicOrgLevel3: 23, // 动态组织3
  DynamicOrgLevel4: 24, // 动态组织4
  DynamicOrgLevel5: 25, // 动态组织5
  DynamicOrgLevel6: 26, // 动态组织6
  DynamicOrgLevel7: 27, // 动态组织7
  DynamicOrgLevel8: 28, // 动态组织8
  DynamicOrgLevel9: 29, // 动态组织9
};

//年月计划类型
export const YearMonthPlanType = {
  Year: 1, //年表
  Month: 2, //月表
  AnnualMonth: 3, //年度月表
};

//添加待选计划类型
export const SelectablePlanType = {
  Year: 1, //年表
  HalfYaer: 2, //半年表
  QuarterYear: 3, //季度表
  Month: 4, //月表
};

export const YearMonthPlanState = {
  UnCommit: 0, //未提交
  UnCheck: 1, //待审核
  Checking: 2, //审核中
  Passed: 3, //审核通过
  UnPassed: 4, //审核驳回
};

// // 天窗类型
export const PlanType = {
  Vertical: 1, //垂直
  General: 2, //综合
  OutOf: 3, //点外
  All: 4, //全部
};

// 天窗计划状态
export const PlanState = {
  UnDispatching: 0, //未派工
  Dispatching: 1, //已派工
  NotIssued: 2, //未下发
  Issued: 3, //已下发
  Complete: 4, //已完成
};
// 仓库是否启用
export const StoreHouseEnable = {
  All: '', // 所有
  Enable: true, // 是
  Unable: false, // 否
};
//维修级别
export const RepairLevel = {
  LevelI: 1, //天窗点内I级维修
  LevelII: 2, //天窗点内II级维修
  LevelIII: 3, //天窗外I级维修
  LevelIv: 4, //天窗点外II级维修
};

//维修周期单位
export const RepairPeriodUnit = {
  Other: 1, //其他
  Year: 2, //年
  Month: 3, //月
};

// 派工单状态
export const OrderState = {
  UnFinished: 0, //未完成
  Complete: 1, //已完成
  Acceptance: 2, //已验收
};

//天窗类型
export const SkylightType = {
  Vertical: 1, //垂直
  General: 2, //综合
  OutOf: 3, //点外
  All: 4, //全部
  Other: 5, //其他
};

// 工作流状态
export const WorkflowState = {
  All: 0, // 所有
  Waiting: 1, // 待审批
  Finished: 2, // 已完成
  Stopped: 3, // 已终止
  Rejected: 4, // 已退回
};

// 用户工作流群组
export const UserWorkflowGroup = {
  Initial: 1, // 【用户】发起的
  Waiting: 2, // 等等【用户】审批的
  Approved: 3, // 【用户】审批过的
  Cc: 4, // 抄送给【用户】的
};

// 工作流节点状态
export const WorkflowStepState = {
  Approved: 1, // 通过
  Rejected: 2, // 驳回
  Stopped: 3, // 终止
};

// 检验状态
export const CheckoutState = {
  Qualified: 0, // 合格
  UnQualified: 1, // 不合格
};

// 测试项类型
export const StandTestType = {
  Number: 1,
  String: 2,
  Excel: 3,
};

// 派工作业操作类型
export const SendWorkOperatorType = {
  Finish: 1, // 完成
  Acceptance: 2, // 验收
  Edit: 3, // 编辑
  View: 4, // 详情
};

// 栏目是否启用
export const CategoryEnable = {
  All: '', // 所有
  Enable: true, // 是
  Unable: false, // 否
};
// 设备是否出库入库
export const StoreEquipmentTransferTypeEnable = {
  Import: 1, // 入库
  Export: 2, // 出库
};
// oss 服务类型
export const OssServerType = {
  Aliyun: 'aliyun', // 阿里云
  MinIO: 'minio', // minio
  AmazonS3: 'amazons3', // 亚马逊s3
};

// 文件管理-->文件表格的类型
export const ResourceTableType = {
  Organization: 1, //我的组织
  Mine: 2, // 我的
  ShareCenter: 3, // 共享中心
  Delete: 4, // 回收站
};

//设备 安装位置类型
export const InstallationSiteType = {
  Station: 1, //车站
  Section: 2, //区间
  Other: 3, //其他
};

//设备 设备运行状态
export const RunningState = {
  PrimaryUse: 1, //主用
  SealUp: 2, //封存
  Standby: 3, //备用
  Scrap: 4, //报废
};

//题库 题目类型
export const QuestionType = {
  SingleChoice: 1, //单选
  MultipleChoice: 2, //多选
  TrueOrFalseQuestions: 3, //判断
  GapFilling: 4, //填空
  ShortAnswerQuestion: 5, //简答
};

//故障案例 故障状态
export const State = {
  UnSubmitted: 1, //未提交
  Submitted: 2, //已提交
  Pending: 3, //待处理
  UnChecked: 4, //未销记
  CheckedOut: 5, //已销记
};

//故障案例 来源
export const Source = {
  History: 1, //历史记录
  System: 2, //系统登记
};

//应急预案关联人员 处理状态
export const Group = {
  Launched: 1, //由我发起
  Waiting: 2, //待我处理
  Handled: 3, //我已处理
  Cc: 4, //抄送给我
};

//服务年限单位
export const ServiceLifeUnit = {
  Year: 1, //年
  Month: 2, //月
  Day: 3, //天
};

//库存设备 设备状态
export const StoreEquipmentState = {
  UnActived: 1, //未激活
  OnService: 2, //已安装
  WaitForTest: 3, //待检测
  Spare: 4, //备用
  Scrap: 5, //报废
};

//检测单 设备状态
export const StoreEquipmentTestState = {
  All: '', // 所有
  Qualified: true, // 合格
  Unqualified: false, // 不合格
};

// 设备类型
export const EquipmentType = {
  // [Description("默认")]
  Default: 1,
  // [Description("电缆")]
  Cable: 2,
};

/// <summary>
/// 电缆类型 1:电缆芯，2:光缆芯
/// </summary>
export const CableCoreType = {
  // [Description("电缆芯")]
  Electric: 1,

  // [Description("光缆芯")]
  Optical: 2,
};

//设备 设备上下道
export const EquipmentServiceRecordType = {
  Install: 1, // 安装
  UnInstall: 2, // 拆除
};

//设备属性分类
export const EquipmentPropertyType = {
  Default: 1, // 默认
  Extend: 2, // 扩展
  CableProperty: 3, //电缆特性
};
// 范围类型
export const ScopeType = {
  // 组织范围
  Organization: 1,
  // 线路范围
  Railway: 2,
  // 车站范围
  Station: 3,
  // 安装位置范围
  InstallationSite: 4,
};

// 电缆铺设类型
export const CableLayType = {
  // 管道
  Conduit: 1,
  // 架空
  Overhead: 2,
  // 直埋
  Bury: 3,
  // 室内槽道及竖井
  InnerChannelFlow: 4,
  // 室外槽道
  OuterChannelFlow: 5,
};

export const CableLocationDirection = {
  //[Description("水平方向")]
  Horizontal: 1,
  //[Description("垂直方向")]
  Vertical: 2,
  //[Description("直线距离")]
  Straight: 3,
};

export const CameraFlyState = {
  Stoped: 1,
  Pause: 2,
  Flying: 3,
};

export const RepairTags = {
  RailwayWired: 'RailwayWired', //有限科
  RailwayHighSpeed: 'RailwayHighSpeed', //高铁科
};

//数据字典 维修项类型key
export const RepairTagKeys = {
  RailwayWired: 'RepairTag.RailwayWired', //有线科
  RailwayHighSpeed: 'RepairTag.RailwayHighSpeed', //高铁科
};

export const RelateRailwayType = {
  SINGLELINK: 0, //单线
  UPLINK: 1, //上行
  DOWNLINK: 2, //下行
  UPANDDOWN: 3, //上下行
};
