const ScTest = {
  category: 'Modules',
  type: 'Components',
  title: 'ScTest',
  subtitle: '数据搜索框',
  demos: [
    {
      path: 'sc-test',
      component: () => import('@/components/sn-components/sc-test/demo/index.vue'),
    },
    {
      path: 'sc-test-cn',
      component: () => import('@/components/sn-components/sc-test/demo/index.vue'),
    },
  ],
};

export const modules = { ScTest };

export const demo = [...ScTest.demos];
