import Common from './common';
const { Create, Update, Delete, Detail, Apply, Dot } = Common;
const GroupName = 'AbpEmerg';

const GroupNameFaults = GroupName + Dot + 'Faults';
const Faults = {
  Default: GroupNameFaults,
  Create: GroupNameFaults + Dot + Create,
  Update: GroupNameFaults + Dot + Update,
  Delete: GroupNameFaults + Dot + Delete,
  Detail: GroupNameFaults + Dot + Detail,
};

const GroupNamePlans = GroupName + Dot + 'Plans';
const Plans = {
  Default: GroupNamePlans,
  Create: GroupNamePlans + Dot + Create,
  Update: GroupNamePlans + Dot + Update,
  Delete: GroupNamePlans + Dot + Delete,
  Detail: GroupNamePlans + Dot + Detail,
  Apply: GroupNamePlans + Dot + Apply,
};

export default {
  GroupName,
  Faults,
  Plans,
};
