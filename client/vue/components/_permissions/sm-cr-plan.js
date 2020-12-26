import Common from './common';
const {
  Create,
  Update,
  Delete,
  Dot,
  Import,
  Export,
  Release,
  Detail,
  Issue,
  Dispatching,
  Revoke,
} = Common;

const CrPlanGroupName = 'AbpCrPlan'; //年月表管理
const CrPlanPlanGroupName = 'AbpCrPlanPlan'; //计划管理
const CrPlanWorkGroupName = 'AbpCrPlanWork'; //作业管理
const CrPlanStatisticsGroupName = 'AbpCrPlanStatistics'; //报表管理

//年月表管理
const GroupNameYearPlan = CrPlanGroupName + Dot + 'YearPlan';
const YearPlan = {
  Default: GroupNameYearPlan,
  Create: GroupNameYearPlan + Dot + Create,
  Import: GroupNameYearPlan + Dot + Import,
  Export: GroupNameYearPlan + Dot + Export,
  SubmitApproval: GroupNameYearPlan + Dot + 'SubmitApproval',
  Alter: GroupNameYearPlan + Dot + 'Alter',
  Update: GroupNameMonthPlan + Dot + Update,
};

const GroupNameMonthPlan = CrPlanGroupName + Dot + 'MonthPlan';
const MonthPlan = {
  Default: GroupNameMonthPlan,
  Create: GroupNameMonthPlan + Dot + Create,
  Import: GroupNameMonthPlan + Dot + Import,
  Export: GroupNameMonthPlan + Dot + Export,
  Update: GroupNameMonthPlan + Dot + Update,
  SubmitApproval: GroupNameMonthPlan + Dot + 'SubmitApproval',
  Alter: GroupNameMonthPlan + Dot + 'Alter',
};

const GroupNameMonthOfYearPlan = CrPlanGroupName + Dot + 'MonthOfYearPlan';
const MonthOfYearPlan = {
  Default: GroupNameMonthOfYearPlan,
  Create: GroupNameMonthOfYearPlan + Dot + Create,
  Import: GroupNameMonthOfYearPlan + Dot + Import,
  Export: GroupNameMonthOfYearPlan + Dot + Export,
  SubmitApproval: GroupNameMonthOfYearPlan + Dot + 'SubmitApproval',
};

const GroupNamePlanChange = CrPlanGroupName + Dot + 'PlanChange';
const PlanChange = {
  Default: GroupNamePlanChange,
  Create: GroupNamePlanChange + Dot + Create,
  Update: GroupNamePlanChange + Dot + Update,
  Detail: GroupNamePlanChange + Dot + Detail,
  Delete: GroupNamePlanChange + Dot + Delete,
  Export: GroupNamePlanChange + Dot + Export,
};

//计划管理
const GroupNameVerticalSkylightPlan = CrPlanPlanGroupName + Dot + 'VerticalSkylightPlan';
const VerticalSkylightPlan = {
  Default: GroupNameVerticalSkylightPlan,
  Create: GroupNameVerticalSkylightPlan + Dot + Create,
  Release: GroupNameVerticalSkylightPlan + Dot + Release,
  Dispatching: GroupNameVerticalSkylightPlan + Dot + Dispatching,
  Revoke: GroupNameVerticalSkylightPlan + Dot + Revoke,
  Update: GroupNameVerticalSkylightPlan + Dot + Update,
  Detail: GroupNameVerticalSkylightPlan + Dot + Detail,
  Delete: GroupNameVerticalSkylightPlan + Dot + Delete,
};

const GroupNameComprehensiveSkylightPlan = CrPlanPlanGroupName + Dot + 'ComprehensiveSkylightPlan';
const ComprehensiveSkylightPlan = {
  Default: GroupNameComprehensiveSkylightPlan,
  Create: GroupNameComprehensiveSkylightPlan + Dot + Create,
  Release: GroupNameComprehensiveSkylightPlan + Dot + Release,
  Dispatching: GroupNameComprehensiveSkylightPlan + Dot + Dispatching,
  Revoke: GroupNameComprehensiveSkylightPlan + Dot + Revoke,
  Update: GroupNameComprehensiveSkylightPlan + Dot + Update,
  Detail: GroupNameComprehensiveSkylightPlan + Dot + Detail,
  Delete: GroupNameComprehensiveSkylightPlan + Dot + Delete,
};

const GroupNameSkylightOutsidePlan = CrPlanPlanGroupName + Dot + 'SkylightOutsidePlan';
const SkylightOutsidePlan = {
  Default: GroupNameSkylightOutsidePlan,
  Create: GroupNameSkylightOutsidePlan + Dot + Create,
  Release: GroupNameSkylightOutsidePlan + Dot + Release,
  Dispatching: GroupNameSkylightOutsidePlan + Dot + Dispatching,
  Revoke: GroupNameSkylightOutsidePlan + Dot + Revoke,
  Update: GroupNameSkylightOutsidePlan + Dot + Update,
  Detail: GroupNameSkylightOutsidePlan + Dot + Detail,
  Delete: GroupNameSkylightOutsidePlan + Dot + Delete,
};

const GroupNameOtherPlan = CrPlanPlanGroupName + Dot + 'OtherPlan';
const OtherPlan = {
  Default: GroupNameOtherPlan,
  Create: GroupNameOtherPlan + Dot + Create,
  Release: GroupNameOtherPlan + Dot + Release,
  Update: GroupNameOtherPlan + Dot + Update,
  Detail: GroupNameOtherPlan + Dot + Detail,
  Delete: GroupNameOtherPlan + Dot + Delete,
  Issue: GroupNameOtherPlan + Dot + Issue,
};

//作业管理
const GroupNameMaintenanceWork = CrPlanWorkGroupName + Dot + 'MaintenanceWork';
const MaintenanceWork = {
  Default: GroupNameMaintenanceWork,
  Detail: GroupNameMaintenanceWork + Dot + Detail,
  Delete: GroupNameMaintenanceWork + Dot + Delete,
};

const GroupNameSendingWork = CrPlanWorkGroupName + Dot + 'SendingWork';
const SendingWork = {
  Default: GroupNameSendingWork,
  Detail: GroupNameSendingWork + Dot + Detail,
  Dispatching: GroupNameSendingWork + Dot + 'Dispatching',
  Finish: GroupNameSendingWork + Dot + 'Finish',
  Acceptance: GroupNameSendingWork + Dot + 'Acceptance',
  Revoke: GroupNameSendingWork + Dot + 'Revoke',
  DispatchList: GroupNameSendingWork + Dot + 'DispatchList',
};

const GroupNameOtherWorks = CrPlanWorkGroupName + Dot + 'OtherWorks';
const OtherWorks = {
  Default: GroupNameOtherWorks,
  Detail: GroupNameOtherWorks + Dot + Detail,
  Finish: GroupNameOtherWorks + Dot + 'Finish',
  Revoke: GroupNameOtherWorks + Dot + 'Revoke',
};
const GroupNameMaintenanceRecord = CrPlanWorkGroupName + Dot + 'MaintenanceRecord';
const MaintenanceRecord = {
  Default: GroupNameMaintenanceRecord,
  Detail: GroupNameMaintenanceRecord + Dot + 'Detail',
};

//智能报表
const GroupNameStatisticalCharts = CrPlanStatisticsGroupName + Dot + 'StatisticalCharts';
const StatisticalCharts = {
  Default: GroupNameStatisticalCharts,
};

const GroupNamePlanCompletion = CrPlanStatisticsGroupName + Dot + 'PlanCompletion';
const PlanCompletion = {
  Default: GroupNamePlanCompletion,
};

const GroupNamePlanStateTracking = CrPlanStatisticsGroupName + Dot + 'PlanStateTracking';
const PlanStateTracking = {
  Default: GroupNamePlanStateTracking,
};

// const GroupNamePlanTodo = GroupName + Dot + 'PlanTodo';
// const PlanTodo = {
//   Default: GroupNamePlanTodo,
//   Dispatching: GroupNamePlanTodo + Dot + 'Dispatching',
//   Revoke: GroupNamePlanTodo + Dot + 'Revoke',
// };

// const GroupNameSentedWorkOrders = GroupName + Dot + 'SentedWorkOrders';
// const SentedWorkOrders = {
//   Default: GroupNameSentedWorkOrders,
//   Detail: GroupNameSentedWorkOrders + Dot + Detail,
//   Revoke: GroupNameSentedWorkOrders + Dot + 'Revoke',
// };

// const GroupNameSendingWorksFinished = GroupName + Dot + 'SendingWorksFinished';
// const SendingWorksFinished = {
//   Default: GroupNameSendingWorksFinished,
//   Detail: GroupNameSendingWorksFinished + Dot + Detail,
//   Update: GroupNameSendingWorksFinished + Dot + Update,
// };

export default {
  // GroupName,
  CrPlanGroupName,
  CrPlanPlanGroupName,
  CrPlanWorkGroupName,
  CrPlanStatisticsGroupName,
  YearPlan,
  MonthPlan,
  MonthOfYearPlan,
  VerticalSkylightPlan,
  ComprehensiveSkylightPlan,
  SkylightOutsidePlan,
  OtherPlan,
  PlanChange,
  // PlanTodo,
  // SentedWorkOrders,
  MaintenanceWork,
  SendingWork,
  OtherWorks,
  // SendingWorksFinished,
  MaintenanceRecord,
  StatisticalCharts,
  PlanCompletion,
  PlanStateTracking,
};
