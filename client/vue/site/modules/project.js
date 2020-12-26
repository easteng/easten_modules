const SmProjectBase = {
  category: 'Modules',
  type: 'Project',
  title: 'SmProjectBase',
  subtitle: '项目信息管理',
  demos: [
    {
      path: 'sm-project-base',
      component: () =>
        import('@/components/sm-project/sm-project-base/demo/index.vue'),
    },
    {
      path: 'sm-project-base-cn',
      component: () =>
        import('@/components/sm-project/sm-project-base/demo/index.vue'),
    },
  ],
};


export const modules = {
  SmProjectBase,
};
export const demo = [...SmProjectBase.demos];