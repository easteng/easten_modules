const SmOaDutySchedule = {
  category: 'Modules',
  type: 'Oa',
  title: 'SmOaDutySchedule',
  subtitle: '值班管理',
  demos: [
    {
      path: 'sm-oa-duty-schedule',
      component: () => import('@/components/sm-oa/sm-oa-duty-schedule/demo/index.vue'),
    },
    {
      path: 'sm-oa-duty-schedule-cn',
      component: () => import('@/components/sm-oa/sm-oa-duty-schedule/demo/index.vue'),
    },
  ],
};

export const modules = {
  SmOaDutySchedule,
};
export const demo = [...SmOaDutySchedule.demos];
