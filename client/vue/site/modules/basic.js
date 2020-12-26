const SmBasicRailways = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicRailways',
  subtitle: '线路管理',
  demos: [
    {
      path: 'sm-basic-railways',
      component: () => import('@/components/sm-basic/sm-basic-railways/demo/index.vue'),
    },
    {
      path: 'sm-basic-railways-cn',
      component: () => import('@/components/sm-basic/sm-basic-railways/demo/index.vue'),
    },
  ],
};
const SmBasicRailwayTreeSelect = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicRailwayTreeSelect',
  subtitle: '线路选择框',
  demos: [
    {
      path: 'sm-basic-railway-tree-select',
      component: () => import('@/components/sm-basic/sm-basic-railway-tree-select/demo/index.vue'),
    },
    {
      path: 'sm-basic-railway-tree-select-cn',
      component: () => import('@/components/sm-basic/sm-basic-railway-tree-select/demo/index.vue'),
    },
  ],
};
const SmBasicStations = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicStations',
  subtitle: '站点管理',
  demos: [
    {
      path: 'sm-basic-stations',
      component: () => import('@/components/sm-basic/sm-basic-stations/demo/index.vue'),
    },
    {
      path: 'sm-basic-stations-cn',
      component: () => import('@/components/sm-basic/sm-basic-stations/demo/index.vue'),
    },
  ],
};
const SmBasicStationSelect = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicStationSelect',
  subtitle: '车站选择框',
  demos: [
    {
      path: 'sm-basic-station-select',
      component: () => import('@/components/sm-basic/sm-basic-station-select/demo/index.vue'),
    },
    {
      path: 'sm-basic-station-select-cn',
      component: () => import('@/components/sm-basic/sm-basic-station-select/demo/index.vue'),
    },
  ],
};
const SmBasicStationCascader = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicStationCascader',
  subtitle: '车站级联选择框',
  demos: [
    {
      path: 'sm-basic-station-cascader',
      component: () => import('@/components/sm-basic/sm-basic-station-cascader/demo/index.vue'),
    },
    {
      path: 'sm-basic-station-cascader-cn',
      component: () => import('@/components/sm-basic/sm-basic-station-cascader/demo/index.vue'),
    },
  ],
};
const SmBasicInstallationSites = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicInstallationSites',
  subtitle: '机房管理',
  demos: [
    {
      path: 'sm-basic-installation-sites',
      component: () => import('@/components/sm-basic/sm-basic-installation-sites/demo/index.vue'),
    },
    {
      path: 'sm-basic-installation-sites-cn',
      component: () => import('@/components/sm-basic/sm-basic-installation-sites/demo/index.vue'),
    },
  ],
};
const SmBasicInstallationSiteCascader = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicInstallationSiteCascader',
  subtitle: '机房级联选择框',
  demos: [
    {
      path: 'sm-basic-installation-site-cascader',
      component: () =>
        import('@/components/sm-basic/sm-basic-installation-site-cascader/demo/index.vue'),
    },
    {
      path: 'sm-basic-installation-site-cascader-cn',
      component: () =>
        import('@/components/sm-basic/sm-basic-installation-site-cascader/demo/index.vue'),
    },
  ],
};
const SmBasicInstallationSiteSelect = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicInstallationSiteSelect',
  subtitle: '机房选择框',
  demos: [
    {
      path: 'sm-basic-installation-site-select',
      component: () =>
        import('@/components/sm-basic/sm-basic-installation-site-select/demo/index.vue'),
    },
    {
      path: 'sm-basic-installation-site-select-cn',
      component: () =>
        import('@/components/sm-basic/sm-basic-installation-site-select/demo/index.vue'),
    },
  ],
};
const SmBasicScopeCascader = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicScopeCascader',
  subtitle: '范围级联选择器',
  demos: [
    {
      path: 'sm-basic-scope-cascader',
      component: () =>
        import('@/components/sm-basic/sm-basic-scope-cascader/demo/index.vue'),
    },
    {
      path: 'sm-basic-scope-cascader-cn',
      component: () =>
        import('@/components/sm-basic/sm-basic-scope-cascader/demo/index.vue'),
    },
  ],
};
const SmBasicScopeSelect = {
  category: 'Modules',
  type: 'Basic',
  title: 'SmBasicScopeSelect',
  subtitle: '范围树状选择器',
  demos: [
    {
      path: 'sm-basic-scope-select',
      component: () =>
        import('@/components/sm-basic/sm-basic-scope-select/demo/index.vue'),
    },
    {
      path: 'sm-basic-scope-select-cn',
      component: () =>
        import('@/components/sm-basic/sm-basic-scope-select/demo/index.vue'),
    },
  ],
};


export const modules = {
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
};

export const demo = [
  ...SmBasicRailways.demos,
  ...SmBasicRailwayTreeSelect.demos,
  ...SmBasicStations.demos,
  ...SmBasicStationSelect.demos,
  ...SmBasicStationCascader.demos,
  ...SmBasicInstallationSites.demos,
  ...SmBasicInstallationSiteCascader.demos,
  ...SmBasicInstallationSiteSelect.demos,
  ...SmBasicScopeCascader.demos,
  ...SmBasicScopeSelect.demos,
];
