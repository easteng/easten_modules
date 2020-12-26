import Common from './common';
const { Create, Update, Delete, Dot, Import, Export, Authorization, Detail, AssignRoles } = Common;

const GroupName = 'AbpIdentity';

const GroupNameRoles = GroupName + Dot + 'Roles';
const Roles = {
  Default: GroupNameRoles,
  Create: GroupNameRoles + Dot + Create,
  Update: GroupNameRoles + Dot + Update,
  Delete: GroupNameRoles + Dot + Delete,
  ManagePermissions: GroupNameRoles + Dot + 'ManagePermissions',
};

const GroupNameUsers = GroupName + Dot + 'Users';
const Users = {
  Default: GroupNameUsers,
  Create: GroupNameUsers + Dot + Create,
  Update: GroupNameUsers + Dot + Update,
  Delete: GroupNameUsers + Dot + Delete,
  Import: GroupNameUsers + Dot + Import,
  Export: GroupNameUsers + Dot + Export,
  Detail: GroupNameUsers + Dot + Detail,
  Reset: GroupNameUsers + Dot + 'Reset',
  AssignRoles: GroupNameUsers + Dot + AssignRoles,
};

const GroupNameUserLookup = GroupName + Dot + 'UserLookup';
const UserLookup = {
  Default: GroupNameUserLookup,
};

const GroupNameOrganization = GroupName + Dot + 'Organization';
const Organization = {
  Default: GroupNameOrganization,
  Create: GroupNameOrganization + Dot + Create,
  Update: GroupNameOrganization + Dot + Update,
  Delete: GroupNameOrganization + Dot + Delete,
  Import: GroupNameOrganization + Dot + Import,
  Export: GroupNameOrganization + Dot + Export,
};

const GroupNameDataDictionary = GroupName + Dot + 'DataDictionary';
const DataDictionary = {
  Default: GroupNameDataDictionary,
  Create: GroupNameDataDictionary + Dot + Create,
  Update: GroupNameDataDictionary + Dot + Update,
  Delete: GroupNameDataDictionary + Dot + Delete,
};

export default {
  GroupName,
  Roles,
  Users,
  UserLookup,
  Organization,
  DataDictionary,
};
