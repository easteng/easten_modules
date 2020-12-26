import Common from './common';
const { Create, Update, Delete, Dot, Relate, Import, Export, Detail } = Common;

const GroupName = 'AbpBasic';

const GroupNameRailways = GroupName + Dot + 'Railways';
const Railways = {
  Default: GroupNameRailways,
  Create: GroupNameRailways + Dot + Create,
  Update: GroupNameRailways + Dot + Update,
  Delete: GroupNameRailways + Dot + Delete,
  Relate: GroupNameRailways + Dot + Relate,
  Import: GroupNameRailways + Dot + Import,
  Export: GroupNameRailways + Dot + Export,
  Detail: GroupNameRailways + Dot + Detail,
};

const GroupNameStations = GroupName + Dot + 'Stations';
const Stations = {
  Default: GroupNameStations,
  Create: GroupNameStations + Dot + Create,
  Update: GroupNameStations + Dot + Update,
  Delete: GroupNameStations + Dot + Delete,
  Import: GroupNameStations + Dot + Import,
  Export: GroupNameRailways + Dot + Export,
  Detail: GroupNameStations + Dot + Detail,
};

const GroupNameInstallationSites = GroupName + Dot + 'InstallationSites';
const InstallationSites = {
  Default: GroupNameInstallationSites,
  Create: GroupNameInstallationSites + Dot + Create,
  Update: GroupNameInstallationSites + Dot + Update,
  Delete: GroupNameInstallationSites + Dot + Delete,
  Import: GroupNameInstallationSites + Dot + Import,
  Export: GroupNameInstallationSites + Dot + Export,
  Detail: GroupNameInstallationSites + Dot + Detail,
};

export default {
  GroupName,
  Railways,
  Stations,
  InstallationSites,
};
