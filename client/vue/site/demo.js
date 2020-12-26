import { modules as components } from './modules/components';
import { modules as basic } from './modules/basic';
import { modules as bpm } from './modules/bpm';
import { modules as cms } from './modules/cms';
import { modules as common } from './modules/common';
import { modules as crPlan } from './modules/cr-plan';
import { modules as emerg } from './modules/emerg';
import { modules as exam } from './modules/exam';
import { modules as file } from './modules/file';
import { modules as resource } from './modules/resource';
import { modules as statistics } from './modules/statistics';
import { modules as stdBasic } from './modules/std-basic';
import { modules as system } from './modules/system';
import { modules as oa } from './modules/oa';
import { modules as project } from './modules/project';
export default {
  template: {
    category: 'Components',
    subtitle: '模板',
    type: 'Template',
    title: 'SmNamespaceModule',
  },
  ...components,
  ...basic,
  ...bpm,
  ...cms,
  ...common,
  ...crPlan,
  ...emerg,
  ...exam,
  ...file,
  ...resource,
  ...statistics,
  ...stdBasic,
  ...system,
  ...oa,
  ...project,
};
