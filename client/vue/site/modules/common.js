const SmArea = {
  category: 'Modules',
  type: 'Common',
  title: 'SmArea',
  subtitle: '城市级联',
  demos: [
    {
      path: 'sm-area',
      component: () => import('@/components/sm-common/sm-area-module/demo/index.vue'),
    },
    {
      path: 'sm-area-cn',
      component: () => import('@/components/sm-common/sm-area-module/demo/index.vue'),
    },
  ],
};
const SmImport = {
  category: 'Modules',
  type: 'Common',
  title: 'SmImport',
  subtitle: '文件导入',
  demos: [
    {
      path: 'sm-import',
      component: () => import('@/components/sm-import/sm-import-basic/demo/index.vue'),
    },
    {
      path: 'sm-import-cn',
      component: () => import('@/components/sm-import/sm-import-basic/demo/index.vue'),
    },
  ],
};
const SmImportTemplate = {
  category: 'Modules',
  type: 'Common',
  title: 'SmImportTemplate',
  subtitle: '导入模板下载',
  demos: [
    {
      path: 'sm-import-template',
      component: () => import('@/components/sm-common/sm-import-template-module/demo/index.vue'),
    },
    {
      path: 'sm-import-template-cn',
      component: () => import('@/components/sm-common/sm-import-template-module/demo/index.vue'),
    },
  ],
};
const SmExport = {
  category: 'Modules',
  type: 'Common',
  title: 'SmExport',
  subtitle: '文件导出',
  demos: [
    {
      path: 'sm-export',
      component: () => import('@/components/sm-common/sm-export-module/demo/index.vue'),
    },
    {
      path: 'sm-export-cn',
      component: () => import('@/components/sm-common/sm-export-module/demo/index.vue'),
    },
  ],
};
const SmMessage = {
  category: 'Modules',
  type: 'Common',
  title: 'SmMessage',
  subtitle: '消息模块',
  demos: [
    {
      path: 'sm-message',
      component: () => import('@/components/sm-message/sm-message-base/demo/index.vue'),
    },
    {
      path: 'sm-message-cn',
      component: () => import('@/components/sm-message/sm-message-base/demo/index.vue'),
    },
  ],
};
const SmMessageNotice={
  category: 'Modules',
  type: 'Common',
  title: 'SmMessageNotice',
  subtitle: '消息通知',
  demos: [
    {
      path: 'sm-message-notice',
      component: () => import('@/components/sm-message/sm-message-notice/demo/index.vue'),
    },
    {
      path: 'sm-message-notice-cn',
      component: () => import('@/components/sm-message/sm-message-notice/demo/index.vue'),
    },
  ],
}
export const modules = {
  SmArea,
  SmImport,
  SmImportTemplate,
  SmExport,
  SmMessage,
  SmMessageNotice
};
export const demo = [
  ...SmArea.demos,
  ...SmImport.demos,
  ...SmImportTemplate.demos,
  ...SmExport.demos,
  ...SmMessage.demos,
  ...SmMessageNotice.demos
];