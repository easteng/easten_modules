const SmSystemMemberModal = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemMemberModal',
  subtitle: '成员选择对话框',
  demos: [
    {
      path: 'sm-system-member-modal',
      component: () => import('@/components/sm-system/sm-system-member-modal/demo/index.vue'),
    },
    {
      path: 'sm-system-member-modal-cn',
      component: () => import('@/components/sm-system/sm-system-member-modal/demo/index.vue'),
    },
  ],
};
const SmSystemMemberSelect = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemMemberSelect',
  subtitle: '成员选择框',
  demos: [
    {
      path: 'sm-system-member-select',
      component: () => import('@/components/sm-system/sm-system-member-select/demo/index.vue'),
    },
    {
      path: 'sm-system-member-select-cn',
      component: () => import('@/components/sm-system/sm-system-member-select/demo/index.vue'),
    },
  ],
};
const SmSystemUserSelect = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemUserSelect',
  subtitle: '用户选择框',
  demos: [
    {
      path: 'sm-system-user-select',
      component: () => import('@/components/sm-system/sm-system-user-select/demo/index.vue'),
    },
    {
      path: 'sm-system-user-select-cn',
      component: () => import('@/components/sm-system/sm-system-user-select/demo/index.vue'),
    },
  ],
};

const SmSystemUsers = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemUsers',
  subtitle: '用户管理',
  demos: [
    {
      path: 'sm-system-users',
      component: () => import('@/components/sm-system/sm-system-users/demo/index.vue'),
    },
    {
      path: 'sm-system-users-cn',
      component: () => import('@/components/sm-system/sm-system-users/demo/index.vue'),
    },
  ],
};

const SmSystemUserChangePassword = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemUserChangePassword',
  subtitle: '修改密码',
  demos: [
    {
      path: 'sm-system-user-change-password',
      component: () =>
        import('@/components/sm-system/sm-system-user-change-password/demo/index.vue'),
    },
    {
      path: 'sm-system-user-change-password-cn',
      component: () =>
        import('@/components/sm-system/sm-system-user-change-password/demo/index.vue'),
    },
  ],
};

const SmSystemOrganizationUserSelect = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemOrganizationUserSelect',
  subtitle: '组织机构下用户选择框',
  demos: [
    {
      path: 'sm-system-organization-user-select',
      component: () =>
        import('@/components/sm-system/sm-system-organization-user-select/demo/index.vue'),
    },
    {
      path: 'sm-system-organization-user-select-cn',
      component: () =>
        import('@/components/sm-system/sm-system-organization-user-select/demo/index.vue'),
    },
  ],
};

const smSystemRoles = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemRoles',
  subtitle: '角色管理',
  demos: [
    {
      path: 'sm-system-roles',
      component: () => import('@/components/sm-system/sm-system-roles/demo/index.vue'),
    },
    {
      path: 'sm-system-roles-cn',
      component: () => import('@/components/sm-system/sm-system-roles/demo/index.vue'),
    },
  ],
};

const smSystemOrganizations = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemOrganizations',
  subtitle: '组织机构管理',
  demos: [
    {
      path: 'sm-system-organizations',
      component: () => import('@/components/sm-system/sm-system-organizations/demo/index.vue'),
    },
    {
      path: 'sm-system-organizations-cn',
      component: () => import('@/components/sm-system/sm-system-organizations/demo/index.vue'),
    },
  ],
};
const smSystemOrganizationTree = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemOrganizationTree',
  subtitle: '组织机构树',
  demos: [
    {
      path: 'sm-system-organization-tree',
      component: () => import('@/components/sm-system/sm-system-organization-tree/demo/index.vue'),
    },
    {
      path: 'sm-system-organization-tree-cn',
      component: () => import('@/components/sm-system/sm-system-organization-tree/demo/index.vue'),
    },
  ],
};

const smSystemOrganizationTreeSelect = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemOrganizationTreeSelect',
  subtitle: '组织机构选择框',
  demos: [
    {
      path: 'sm-system-organization-tree-select',
      component: () =>
        import('@/components/sm-system/sm-system-organization-tree-select/demo/index.vue'),
    },
    {
      path: 'sm-system-organization-tree-select-cn',
      component: () =>
        import('@/components/sm-system/sm-system-organization-tree-select/demo/index.vue'),
    },
  ],
};
const SmSystemDataDinctionaryTreeSelect = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemDataDictionaryTreeSelect',
  subtitle: '数据字典选择框',
  demos: [
    {
      path: 'sm-system-data-dictionary-tree-select',
      component: () =>
        import('@/components/sm-system/sm-system-data-dictionary-tree-select/demo/index.vue'),
    },
    {
      path: 'sm-system-data-dictionary-tree-select-cn',
      component: () =>
        import('@/components/sm-system/sm-system-data-dictionary-tree-select/demo/index.vue'),
    },
  ],
};
const SmSystemDataDictionaries = {
  category: 'Modules',
  type: 'System',
  title: 'SmSystemDataDictionaries',
  subtitle: '数据字典',
  demos: [
    {
      path: 'sm-system-data-dictionaries',
      component: () => import('@/components/sm-system/sm-system-data-dictionaries/demo/index.vue'),
    },
    {
      path: 'sm-system-data-dictionaries-cn',
      component: () => import('@/components/sm-system/sm-system-data-dictionaries/demo/index.vue'),
    },
  ],
};

export const modules = {
  SmSystemMemberModal,
  SmSystemMemberSelect,
  SmSystemUserSelect,
  SmSystemUsers,
  SmSystemUserChangePassword,
  SmSystemOrganizationUserSelect,
  smSystemRoles,
  smSystemOrganizations,
  smSystemOrganizationTree,
  smSystemOrganizationTreeSelect,
  SmSystemDataDinctionaryTreeSelect,
  SmSystemDataDictionaries,
};

export const demo = [
  ...SmSystemMemberModal.demos,
  ...SmSystemMemberSelect.demos,
  ...SmSystemUserSelect.demos,
  ...SmSystemUsers.demos,
  ...SmSystemUserChangePassword.demos,
  ...SmSystemOrganizationUserSelect.demos,
  ...smSystemRoles.demos,
  ...smSystemOrganizations.demos,
  ...smSystemOrganizationTree.demos,
  ...smSystemOrganizationTreeSelect.demos,
  ...SmSystemDataDinctionaryTreeSelect.demos,
  ...SmSystemDataDictionaries.demos,
];
