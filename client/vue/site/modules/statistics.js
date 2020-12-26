const SmCrStatisticsDashboard = {
  category: 'Modules',
  type: 'Statistics',
  title: 'SmCrStatisticsDashboard',
  subtitle: '统计图表',
  demos: [
    {
      path: 'sm-cr-statistics-dashboard',
      component: () =>
        import('@/components/sm-cr-statistics/sm-cr-statistics-dashboard/demo/index.vue'),
    },
    {
      path: 'sm-cr-statistics-dashboard-cn',
      component: () =>
        import('@/components/sm-cr-statistics/sm-cr-statistics-dashboard/demo/index.vue'),
    },
  ],
};
const SmCrStatisticsPlanState = {
  category: 'Modules',
  type: 'Statistics',
  title: 'SmCrStatisticsPlanState',
  subtitle: '完成情况',
  demos: [
    {
      path: 'sm-cr-statistics-plan-state',
      component: () =>
        import('@/components/sm-cr-statistics/sm-cr-statistics-plan-state/demo/index.vue'),
    },
    {
      path: 'sm-cr-statistics-plan-state-cn',
      component: () =>
        import('@/components/sm-cr-statistics/sm-cr-statistics-plan-state/demo/index.vue'),
    },
  ],
};
const SmCrStatisticsPlanTrack = {
  category: 'Modules',
  type: 'Statistics',
  title: 'SmCrStatisticsPlanTrack',
  subtitle: '追踪计划',
  demos: [
    {
      path: 'sm-cr-statistics-plan-track',
      component: () =>
        import('@/components/sm-cr-statistics/sm-cr-statistics-plan-track/demo/index.vue'),
    },
    {
      path: 'sm-cr-statistics-plan-track-cn',
      component: () =>
        import('@/components/sm-cr-statistics/sm-cr-statistics-plan-track/demo/index.vue'),
    },
  ],
};

export const modules = {
  SmCrStatisticsDashboard,
  SmCrStatisticsPlanState,
  SmCrStatisticsPlanTrack,
};
export const demo = [
  ...SmCrStatisticsDashboard.demos,
  ...SmCrStatisticsPlanState.demos,
  ...SmCrStatisticsPlanTrack.demos,
];
