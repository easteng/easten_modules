import Common from './common';
const { Create, Update, Delete, Dot, Detail } = Common;

const GroupName = 'AbpOa';

const GroupNameDutySchedule = GroupName + Dot + 'DutySchedule';
const DutySchedule = {
  Default: GroupNameDutySchedule,
  Create: GroupNameDutySchedule + Dot + Create,
  Update: GroupNameDutySchedule + Dot + Update,
  Delete: GroupNameDutySchedule + Dot + Delete,
  Detail: GroupNameDutySchedule + Dot + Detail,
};

export default {
  GroupName,
  DutySchedule,
};
