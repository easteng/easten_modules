const SmEmergFault = {
  category: 'Modules',
  type: 'Emerg',
  title: 'SmEmergFault',
  subtitle: '故障案例单页',
  demos: [
    {
      path: 'sm-emerg-fault',
      component: () => import('@/components/sm-emerg/sm-emerg-fault/demo/index.vue'),
    },
    {
      path: 'sm-emerg-fault-cn',
      component: () => import('@/components/sm-emerg/sm-emerg-fault/demo/index.vue'),
    },
  ],
};
const SmEmergFaults = {
  category: 'Modules',
  type: 'Emerg',
  title: 'SmEmergFaults',
  subtitle: '故障案例',
  demos: [
    {
      path: 'sm-emerg-faults',
      component: () => import('@/components/sm-emerg/sm-emerg-faults/demo/index.vue'),
    },
    {
      path: 'sm-emerg-faults-cn',
      component: () => import('@/components/sm-emerg/sm-emerg-faults/demo/index.vue'),
    },
  ],
};
const SmEmergPlans = {
  category: 'Modules',
  type: 'Emerg',
  title: 'SmEmergPlans',
  subtitle: '应急预案',
  demos: [
    {
      path: 'sm-emerg-plans',
      component: () => import('@/components/sm-emerg/sm-emerg-plans/demo/index.vue'),
    },
    {
      path: 'sm-emerg-plans-cn',
      component: () => import('@/components/sm-emerg/sm-emerg-plans/demo/index.vue'),
    },
  ],
};
const SmEmergPlan = {
  category: 'Modules',
  type: 'Emerg',
  title: 'SmEmergPlan',
  subtitle: '应急预案单页',
  demos: [
    {
      path: 'sm-emerg-plan',
      component: () => import('@/components/sm-emerg/sm-emerg-plan/demo/index.vue'),
    },
    {
      path: 'sm-emerg-plan-cn',
      component: () => import('@/components/sm-emerg/sm-emerg-plan/demo/index.vue'),
    },
  ],
};

export const modules = {
  SmEmergFault,
  SmEmergFaults,
  SmEmergPlans,
  SmEmergPlan,
};
export const demo = [
  ...SmEmergFault.demos,
  ...SmEmergFaults.demos,
  ...SmEmergPlans.demos,
  ...SmEmergPlan.demos,
];