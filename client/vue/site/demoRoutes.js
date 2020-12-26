import { demo as components } from './modules/components';
import { demo as basic } from './modules/basic';
import { demo as bpm } from './modules/bpm';
import { demo as cms } from './modules/cms';
import { demo as common } from './modules/common';
import { demo as crPlan } from './modules/cr-plan';
import { demo as emerg } from './modules/emerg';
import { demo as exam } from './modules/exam';
import { demo as file } from './modules/file';
import { demo as resource } from './modules/resource';
import { demo as statistics } from './modules/statistics';
import { demo as stdBasic } from './modules/std-basic';
import { demo as system } from './modules/system';
import { demo as oa } from './modules/oa';
import { demo as project } from './modules/project';

export default [
  {
    path: 'sm-namespace-module',
    component: () => import('@/components/sm-namespace/sm-namespace-module/demo/index.vue'),
  },
  {
    path: 'sm-namespace-module-cn',
    component: () => import('@/components/sm-namespace/sm-namespace-module/demo/index.vue'),
  },
  ...components,
  ...basic,
  ...bpm,
  ...cms,
  ...common,
  ...crPlan,
  ...exam,
  ...file,
  ...resource,
  ...statistics,
  ...system,
  ...stdBasic,
  ...emerg,
  ...oa,
  ...project,
];
