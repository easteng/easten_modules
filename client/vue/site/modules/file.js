const SmFileManage = {
  category: 'Modules',
  type: 'File',
  title: 'SmFileManage',
  subtitle: '文件管理',
  demos: [
    {
      path: 'sm-file-manage',
      component: () => import('@/components/sm-file/sm-file-manage/demo/index.vue'),
    },
    {
      path: 'sm-file-manage-cn',
      component: () => import('@/components/sm-file/sm-file-manage/demo/index.vue'),
    },
  ],
};

const SmFileOss = {
  category: 'Modules',
  type: 'File',
  title: 'SmFileOss',
  subtitle: '文件服务配置',
  demos: [
    {
      path: 'sm-file-oss',
      component: () => import('@/components/sm-file/sm-file-oss/demo/index.vue'),
    },
    {
      path: 'sm-file-oss-cn',
      component: () => import('@/components/sm-file/sm-file-oss/demo/index.vue'),
    },
  ],
};
const SmFileMigration = {
  category: 'Modules',
  type: 'File',
  title: 'SmFileMigration',
  subtitle: '文件迁移',
  demos: [
    {
      path: 'sm-file-migration',
      component: () => import('@/components/sm-file/sm-file-migration/demo/index.vue'),
    },
    {
      path: 'sm-file-migration-cn',
      component: () => import('@/components/sm-file/sm-file-migration/demo/index.vue'),
    },
  ],
};
const SmFileManageModal = {
  category: 'Modules',
  type: 'File',
  title: 'SmFileManageModal',
  subtitle: '文件选择框',
  demos: [
    {
      path: 'sm-file-manage-modal',
      component: () => import('@/components/sm-file/sm-file-manage-modal/demo/index.vue'),
    },
    {
      path: 'sm-file-manage-modal-cn',
      component: () => import('@/components/sm-file/sm-file-manage-modal/demo/index.vue'),
    },
  ],
};
const SmFileTextEditor = {
  category: 'Modules',
  type: 'File',
  title: 'SmFileTextEditor',
  subtitle: '富文本编辑器',
  demos: [
    {
      path: 'sm-file-text-editor',
      component: () => import('@/components/sm-file/sm-file-text-editor/demo/index.vue'),
    },
    {
      path: 'sm-file-text-editor-cn',
      component: () => import('@/components/sm-file/sm-file-text-editor/demo/index.vue'),
    },
  ],
};
const SmFileManageSelect = {
  category: 'Modules',
  type: 'File',
  title: 'SmFileManageSelect',
  subtitle: '文件选择',
  demos: [
    {
      path: 'sm-file-manage-select',
      component: () => import('@/components/sm-file/sm-file-manage-select/demo/index.vue'),
    },
    {
      path: 'sm-file-manage-select-cn',
      component: () => import('@/components/sm-file/sm-file-manage-select/demo/index.vue'),
    },
  ],
};

export const modules = {
  SmFileManage,
  SmFileOss,
  SmFileManageModal,
  SmFileTextEditor,
  SmFileManageSelect,
  SmFileMigration,
};
export const demo = [
  ...SmFileManage.demos,
  ...SmFileOss.demos,
  ...SmFileManageModal.demos,
  ...SmFileTextEditor.demos,
  ...SmFileManageSelect.demos,
  ...SmFileMigration.demos,
];
