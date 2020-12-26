/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
const ENV = process.env.NODE_ENV;
if (
  ENV !== 'production' &&
  ENV !== 'test' &&
  typeof console !== 'undefined' &&
  console.warn &&
  typeof window !== 'undefined'
) {
  console.warn(
    'You are using a whole package of SnWebModule, ' +
      'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
  );
}
/* @remove-on-es-build-end */
import { default as version } from './version';

/* components */
import { default as ScTest } from './sn-components/sc-test';

// temp
import { default as SmNamespaceModule } from './sm-namespace/sm-namespace-module';

/* modules */

//module-basic
import { default as SmBasicStations } from './sm-basic/sm-basic-stations';
import { default as SmBasicStationSelect } from './sm-basic/sm-basic-station-select';
import { default as SmBasicRailwayTreeSelect } from './sm-basic/sm-basic-railway-tree-select';
import { default as SmBasicRailways } from './sm-basic/sm-basic-railways';
import { default as SmBasicInstallationSites } from './sm-basic/sm-basic-installation-sites';
import { default as SmBasicInstallationSiteCascader } from './sm-basic/sm-basic-installation-site-cascader';
import { default as SmBasicInstallationSiteSelect } from './sm-basic/sm-basic-installation-site-select';
import { default as SmBasicStationCascader } from './sm-basic/sm-basic-station-cascader';
import { default as SmBasicScopeCascader } from './sm-basic/sm-basic-scope-cascader';
import { default as SmBasicScopeSelect } from './sm-basic/sm-basic-scope-select';

//module-std-basic
import { default as SmStdBasicManufacturers } from './sm-std-basic/sm-std-basic-manufacturers';
import { default as SmStdBasicManufacturerSelect } from './sm-std-basic/sm-std-basic-manufacturer-select';
import { default as SmStdBasicStandardEquipments } from './sm-std-basic/sm-std-basic-standard-equipments';
import { default as SmStdBasicProductCategoryTreeSelect } from './sm-std-basic/sm-std-basic-product-category-tree-select';
import { default as SmStdBasicComponentCategoryTreeSelect } from './sm-std-basic/sm-std-basic-component-category-tree-select';
import { default as SmStdBasicRepairGroupSelect } from './sm-std-basic/sm-std-basic-repair-group-select';
import { default as SmStdBasicRepairItems } from './sm-std-basic/sm-std-basic-repair-items';
import { default as SmStdBasicProductCategory } from './sm-std-basic/sm-std-basic-product-category';
import { default as SmStdBasicComponentCategory } from './sm-std-basic/sm-std-basic-component-category';
import { default as SmStdBasicRepairGroupTreeSelect } from './sm-std-basic/sm-std-basic-repair-group-tree-select';
import { default as SmStdBasicInfluenceRanges } from './sm-std-basic/sm-std-basic-influence-ranges';

/* module-bpm 工作流模块 */
import { default as SmBpmFormDesign } from './sm-bpm/sm-bpm-form-design';
import { default as SmBpmFlowDesign } from './sm-bpm/sm-bpm-flow-design';
import { default as SmBpmWorkflowTemplate } from './sm-bpm/sm-bpm-workflow-template';
import { default as SmBpmWorkflowTemplates } from './sm-bpm/sm-bpm-workflow-templates';
import { default as SmBpmWorkflows } from './sm-bpm/sm-bpm-workflows';

/* module-cms 内容管理系统模块 */
import { default as SmCmsCategories } from './sm-cms/sm-cms-categories';
import { default as SmCmsArticles } from './sm-cms/sm-cms-articles';
import { default as SmCmsCategoryRltArticles } from './sm-cms/sm-cms-category-rlt-articles';

/* module-cr-plan 垂直天窗计划模块 */
import { default as SmCrPlanOtherPlans } from './sm-cr-plan/sm-cr-plan-other-plans';
import { default as SmCrPlanOtherPlan } from './sm-cr-plan/sm-cr-plan-other-plan';
import { default as SmCrPlanSkylightPlans } from './sm-cr-plan/sm-cr-plan-skylight-plans';
import { default as SmCrPlanSkylightPlan } from './sm-cr-plan/sm-cr-plan-skylight-plan';
import { default as SmCrPlanPlanChanges } from './sm-cr-plan/sm-cr-plan-plan-changes';
import { default as SmCrPlanPlanChange } from './sm-cr-plan/sm-cr-plan-plan-change';
import { default as SmCrPlanAddSelectablePlanModal } from './sm-cr-plan/sm-cr-plan-add-selectable-plan-modal';
import { default as SmCrPlanPlanTodos } from './sm-cr-plan/sm-cr-plan-plan-todos';
import { default as SmCrPlanSentedWorkOrders } from './sm-cr-plan/sm-cr-plan-sented-work-orders';
import { default as SmCrPlanSendingWorks } from './sm-cr-plan/sm-cr-plan-sending-works';
import { default as SmCrPlanSendingWork } from './sm-cr-plan/sm-cr-plan-sending-work';
import { default as SmCrPlanSendingWorksFinished } from './sm-cr-plan/sm-cr-plan-sending-works-finished';
import { default as SmCrPlanOtherWorks } from './sm-cr-plan/sm-cr-plan-other-works';
import { default as SmCrPlanMaintenanceRecords } from './sm-cr-plan/sm-cr-plan-maintenance-records';
import { default as SmCrPlanMaintenanceRecord } from './sm-cr-plan/sm-cr-plan-maintenance-record';
import { default as SmCrPlanMaintenanceWork } from './sm-cr-plan/sm-cr-plan-maintenance-work';

/* module-cr-plan 年表计划 */
import { default as SmCrPlanYearPlan } from './sm-cr-plan/sm-cr-plan-year-plan';
/* module-cr-plan 月表计划 */
import { default as SmCrPlanMonthPlan } from './sm-cr-plan/sm-cr-plan-month-plan';
/* module-cr-plan 年表月度计划 */
import { default as SmCrPlanMonthOfYearPlan } from './sm-cr-plan/sm-cr-plan-month-of-year-plan';
/* module-cr-plan 年月表变更单页 */
import { default as SmCrPlanYearMonthChange } from './sm-cr-plan/sm-cr-plan-year-month-change';

/* module-cr-statistics 智能报表    */
import { default as SmCrStatisticsDashboard } from './sm-cr-statistics/sm-cr-statistics-dashboard';
import { default as SmCrStatisticsPlanState } from './sm-cr-statistics/sm-cr-statistics-plan-state';
import { default as SmCrStatisticsPlanTrack } from './sm-cr-statistics/sm-cr-statistics-plan-track';

/* module-file 文件管理模块2 */
import { default as SmFileManage } from './sm-file/sm-file-manage';
import { default as SmFileMigration } from './sm-file/sm-file-migration';
import { default as SmFileOss } from './sm-file/sm-file-oss';
import { default as SmFileManageModal } from './sm-file/sm-file-manage-modal';
import { default as SmFileManageSelect } from './sm-file/sm-file-manage-select';
import { default as SmFileTextEditor } from './sm-file/sm-file-text-editor';

/* module-resource 资源管理模块 */
import { default as SmResourceEquipments } from './sm-resource/sm-resource-equipments';
import { default as SmResourceStoreHouse } from './sm-resource/sm-resource-store-house';
import { default as SmResourceStoreImportAltExport } from './sm-resource/sm-resource-store-import-alt-export';
import { default as SmResourceStoreEquipmentTransfer } from './sm-resource/sm-resource-store-equipment-transfer';
import { default as SmResourceStoreEquipments } from './sm-resource/sm-resource-store-equipments';
import { default as SmResourceStoreEquipmentsTests } from './sm-resource/sm-resource-store-equipments-tests';
import { default as SmResourceCodeGeneration } from './sm-resource/sm-resource-code-generation';
import { default as SmResourceStoreEquipmentsTest } from './sm-resource/sm-resource-store-equipments-test';
import { default as SmResourceStoreEquipmentsSelect } from './sm-resource/sm-resource-store-equipments-select';
import { default as SmResourceStoreEquipmentRecord } from './sm-resource/sm-resource-store-equipment-record';
import { default as SmResourceEquipmentSelect } from './sm-resource/sm-resource-equipment-select';
import { default as SmResourceEquipmentGroup } from './sm-resource/sm-resource-equipment-group';
import { default as SmResourceEquipmentGroupTreeSelect } from './sm-resource/sm-resource-equipment-group-tree-select';
import { default as SmResourceStoreHouseTreeSelect } from './sm-resource/sm-resource-store-house-tree-select';

/* module-system  系统管理模块    */
import { default as SmSystemMemberModal } from './sm-system/sm-system-member-modal';
import { default as SmSystemMemberSelect } from './sm-system/sm-system-member-select';
import { default as SmSystemUsers } from './sm-system/sm-system-users';
import { default as SmSystemUserSelect } from './sm-system/sm-system-user-select';
import { default as SmSystemUserChangePassword } from './sm-system/sm-system-user-change-password';
import { default as SmSystemOrganizationUserSelect } from './sm-system/sm-system-organization-user-select';
import { default as SmSystemRoles } from './sm-system/sm-system-roles';
import { default as SmSystemOrganizations } from './sm-system/sm-system-organizations';
import { default as SmSystemOrganizationTree } from './sm-system/sm-system-organization-tree';
import { default as SmSystemOrganizationTreeSelect } from './sm-system/sm-system-organization-tree-select';
import { default as SmSystemDataDictionaryTreeSelect } from './sm-system/sm-system-data-dictionary-tree-select';
import { default as SmSystemDataDictionaries } from './sm-system/sm-system-data-dictionaries';

/* module-oa   OA 模块  */
import { default as SmOaDutySchedule } from './sm-oa/sm-oa-duty-schedule';

/* module-exam   考试系统管理模块  */
import { default as SmExamQuestion } from './sm-exam/sm-exam-question';
// import { default as SmExamCategories } from './sm-exam/sm-exam-categories'

/*module-exam 考试管理系统*/

import { default as SmExamExamPaperTemplate } from './sm-exam/sm-exam-exam-paper-template';
import { default as SmExamKnowledgePoints } from './sm-exam/sm-exam-knowledge-points';
import { default as SmExamCategories } from './sm-exam/sm-exam-categories';
import { default as SmExamPapers } from './sm-exam/sm-exam-papers';

/*module-emerg 电务故障应急指挥系统*/
import { default as SmEmergFault } from './sm-emerg/sm-emerg-fault';
import { default as SmEmergFaults } from './sm-emerg/sm-emerg-faults';
import { default as SmEmergPlans } from './sm-emerg/sm-emerg-plans';
import { default as SmEmergPlan } from './sm-emerg/sm-emerg-plan';

/*module-area 城市三级联动*/
import { default as SmArea } from './sm-common/sm-area-module';

/*module-import 文件导入组件*/
import { default as SmImport } from './sm-import/sm-import-basic';
import { default as SmImportModal } from './sm-import/sm-import-modal';

/*module-import 文件下载组件 */
import { default as SmImportTemplate } from './sm-common/sm-import-template-module';
import { default as SmMessage } from './sm-message/sm-message-base';
import { default as SmMessageNotice } from './sm-message/sm-message-notice';


/*module-export 文件导出组件 */
import { default as SmExport } from './sm-common/sm-export-module';

// 项目管理
import { default as SmProjectBase } from './sm-project/sm-project-base';


const components = [
  ScTest,

  SmNamespaceModule,

  SmBasicRailways,
  SmBasicRailwayTreeSelect,
  SmBasicStations,
  SmBasicStationSelect,
  SmBasicStationCascader,
  SmBasicInstallationSites,
  SmBasicInstallationSiteCascader,
  SmBasicInstallationSiteSelect,
  SmBasicScopeCascader,
  SmBasicScopeSelect,

  SmStdBasicManufacturers,
  SmStdBasicManufacturerSelect,
  SmStdBasicStandardEquipments,
  SmStdBasicProductCategoryTreeSelect,
  SmStdBasicComponentCategoryTreeSelect,
  SmStdBasicRepairGroupSelect,
  SmStdBasicRepairGroupTreeSelect,
  SmStdBasicInfluenceRanges,
  SmStdBasicRepairItems,
  SmStdBasicProductCategory,
  SmStdBasicComponentCategory,
  SmBpmFormDesign,
  SmBpmFlowDesign,
  SmBpmWorkflowTemplate,
  SmBpmWorkflowTemplates,
  SmBpmWorkflows,

  SmCmsCategories,
  SmCmsArticles,
  SmCmsCategoryRltArticles,

  SmCrPlanOtherPlans,
  SmCrPlanOtherPlan,
  SmCrPlanSkylightPlans,
  SmCrPlanSkylightPlan,
  SmCrPlanYearPlan,
  SmCrPlanMonthPlan,
  SmCrPlanPlanChanges,
  SmCrPlanPlanChange,
  SmCrPlanAddSelectablePlanModal,
  SmCrPlanPlanChanges,
  SmCrPlanPlanChange,
  SmCrPlanPlanTodos,
  SmCrPlanSentedWorkOrders,
  SmCrPlanSendingWorks,
  SmCrPlanSendingWork,
  SmCrPlanSendingWorksFinished,
  SmCrPlanMonthOfYearPlan,
  SmCrPlanYearMonthChange,
  SmCrPlanOtherWorks,
  SmCrPlanMaintenanceRecords,
  SmCrPlanMaintenanceRecord,
  SmCrPlanMaintenanceWork,
  SmCrStatisticsDashboard,
  SmCrStatisticsPlanState,
  SmCrStatisticsPlanTrack,

  SmResourceEquipments,
  SmResourceStoreHouse,
  SmResourceStoreImportAltExport,
  SmResourceStoreEquipmentTransfer,
  SmResourceStoreEquipments,
  SmResourceStoreEquipmentsTests,
  SmResourceCodeGeneration,
  SmResourceStoreEquipmentsTest,
  SmResourceStoreEquipmentsSelect,
  SmResourceStoreEquipmentRecord,
  SmResourceEquipmentSelect,
  SmResourceEquipmentGroup,
  SmResourceEquipmentGroupTreeSelect,
  SmResourceStoreHouseTreeSelect,

  SmSystemMemberModal,
  SmSystemMemberSelect,
  SmSystemUsers,
  SmSystemUserSelect,
  SmSystemUserChangePassword,
  SmSystemOrganizationUserSelect,
  SmSystemRoles,
  SmSystemOrganizations,
  SmSystemOrganizationTree,
  SmSystemOrganizationTreeSelect,
  SmSystemDataDictionaryTreeSelect,
  SmSystemDataDictionaries,
  SmOaDutySchedule,

  SmFileManage,
  SmFileMigration,
  SmFileOss,
  SmFileManageModal,
  SmFileManageSelect,
  SmFileTextEditor,

  SmExamQuestion,
  // SmExamCategories,
  SmExamKnowledgePoints,
  SmExamExamPaperTemplate,
  SmExamCategories,
  SmExamPapers,

  SmEmergFault,
  SmEmergFaults,

  SmEmergPlans,
  SmEmergPlan,
  SmArea,
  SmImport,
  SmImportModal,
  SmImportTemplate,
  SmExport,
  SmMessage,
  SmMessageNotice,
  SmBasicScopeSelect,
  //项目管理
  SmProjectBase,
];

const install = function(Vue) {
  components.map(component => {
    Vue.use(component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  version,
  ScTest,
  SmNamespaceModule,
  //Basic
  SmBasicRailways,
  SmBasicRailwayTreeSelect,
  SmBasicStations,
  SmBasicStationCascader,
  SmBasicStationSelect,
  SmBasicInstallationSites,
  SmBasicInstallationSiteCascader,
  SmBasicInstallationSiteSelect,
  SmBasicScopeCascader,
  SmBasicScopeSelect,
  //StdBasic
  SmStdBasicManufacturers,
  SmStdBasicManufacturerSelect,
  SmStdBasicStandardEquipments,
  SmStdBasicProductCategoryTreeSelect,
  SmStdBasicComponentCategoryTreeSelect,
  SmStdBasicRepairGroupSelect,
  SmStdBasicRepairGroupTreeSelect,
  SmStdBasicInfluenceRanges,
  SmStdBasicRepairItems,
  SmStdBasicProductCategory,
  SmStdBasicComponentCategory,
  SmBpmFormDesign,
  SmBpmFlowDesign,
  SmBpmWorkflowTemplate,
  SmBpmWorkflowTemplates,
  SmBpmWorkflows,
  //Cms
  SmCmsCategories,
  SmCmsArticles,
  SmCmsCategoryRltArticles,
  //CrPlan
  SmCrPlanOtherPlans,
  SmCrPlanOtherPlan,
  SmCrPlanSkylightPlans,
  SmCrPlanSkylightPlan,
  SmCrPlanYearPlan,
  SmCrPlanMonthPlan,
  SmCrPlanPlanChanges,
  SmCrPlanPlanChange,
  SmCrPlanAddSelectablePlanModal,
  SmCrPlanPlanTodos,
  SmCrPlanSentedWorkOrders,
  SmCrPlanSendingWorks,
  SmCrPlanSendingWork,
  SmCrPlanSendingWorksFinished,
  SmCrPlanMonthOfYearPlan,
  SmCrPlanYearMonthChange,
  SmCrPlanOtherWorks,
  SmCrPlanMaintenanceRecords,
  SmCrPlanMaintenanceRecord,
  SmCrPlanMaintenanceWork,
  //Statists
  SmCrStatisticsDashboard,
  SmCrStatisticsPlanState,
  SmCrStatisticsPlanTrack,
  //Resource
  SmResourceEquipments,
  SmResourceStoreHouse,
  SmResourceStoreImportAltExport,
  SmResourceStoreEquipmentTransfer,
  SmResourceStoreEquipments,
  SmResourceStoreEquipmentsTests,
  SmResourceCodeGeneration,
  SmResourceStoreEquipmentsTest,
  SmResourceStoreEquipmentsSelect,
  SmResourceStoreEquipmentRecord,
  SmResourceEquipmentGroup,
  SmResourceEquipmentGroupTreeSelect,
  SmResourceStoreHouseTreeSelect,
  //System
  SmSystemMemberModal,
  SmSystemMemberSelect,
  SmSystemUsers,
  SmSystemUserSelect,
  SmSystemUserChangePassword,
  SmSystemOrganizationUserSelect,
  SmSystemRoles,
  SmSystemOrganizations,
  SmSystemOrganizationTree,
  SmSystemOrganizationTreeSelect,
  SmSystemDataDictionaryTreeSelect,
  SmSystemDataDictionaries,
  SmOaDutySchedule,
  //File
  SmFileManage,
  SmFileMigration,
  SmFileOss,
  SmFileManageModal,
  SmFileManageSelect,
  SmFileTextEditor,
  // SmExamCategories,
  SmExamQuestion,
  SmExamKnowledgePoints,
  SmExamExamPaperTemplate,
  SmExamCategories,
  SmExamPapers,
  SmEmergFault,
  SmEmergFaults,
  SmEmergPlans,
  SmEmergPlan,
  SmResourceEquipmentSelect,
  SmArea,
  SmImport,
  SmImportModal,
  SmImportTemplate,
  SmExport,
  SmMessage,
  SmMessageNotice,

  // project
  SmProjectBase,
};

export default {
  version,
  install,
};
