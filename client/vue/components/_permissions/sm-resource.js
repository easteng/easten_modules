import Common from './common';
const { Create, Update, Delete, Dot, Import, Detail, Export, UpdateEnable } = Common;

const GroupName = 'AbpResource';

const GroupNameCableExtends = GroupName + Dot + 'CableExtends';
const CableExtends = {
  Default: GroupNameCableExtends,
  Update: GroupNameCableExtends + Dot + Update,
  Detail: GroupNameCableExtends + Dot + Detail,
};

const GroupNameCableLocations = GroupName + Dot + 'CableLocations';
const CableLocations = {
  Default: GroupNameCableLocations,
  Create: GroupNameCableLocations + Dot + Create,
  Update: GroupNameCableLocations + Dot + Update,
  Delete: GroupNameCableLocations + Dot + Delete,
  Detail: GroupNameCableLocations + Dot + Detail,
};

const GroupNameEquipments = GroupName + Dot + 'Equipments';
const Equipments = {
  Default: GroupNameEquipments,
  Create: GroupNameEquipments + Dot + Create,
  Update: GroupNameEquipments + Dot + Update,
  Delete: GroupNameEquipments + Dot + Delete,
  Detail: GroupNameEquipments + Dot + Detail,
  Import: GroupNameEquipments + Dot + Import,
  Export: GroupNameEquipments + Dot + Export,
};

const GroupNameEquipmentGroups = GroupName + Dot + 'EquipmentGroups';
const EquipmentGroups = {
  Default: GroupNameEquipmentGroups,
  Create: GroupNameEquipmentGroups + Dot + Create,
  Update: GroupNameEquipmentGroups + Dot + Update,
  Delete: GroupNameEquipmentGroups + Dot + Delete,
  Detail: GroupNameEquipmentGroups + Dot + Detail,
  Import: GroupNameEquipmentGroups + Dot + Import,
  Export: GroupNameEquipmentGroups + Dot + Export,
};

const GroupNameEquipmentProperties = GroupName + Dot + 'EquipmentProperties';
const EquipmentProperties = {
  Default: GroupNameEquipmentProperties,
  Create: GroupNameEquipmentProperties + Dot + Create,
  Update: GroupNameEquipmentProperties + Dot + Update,
  Delete: GroupNameEquipmentProperties + Dot + Delete,
};

const GroupNameStoreEquipments = GroupName + Dot + 'StoreEquipments';
const StoreEquipments = {
  Default: GroupNameStoreEquipments,
  Create: GroupNameStoreEquipments + Dot + Create,
  Detail: GroupNameStoreEquipments + Dot + Export,
};

const GroupNameStoreEquipmentTest = GroupName + Dot + 'StoreEquipmentTest';
const StoreEquipmentTest = {
  Default: GroupNameStoreEquipmentTest,
  Create: GroupNameStoreEquipmentTest + Dot + Create,
  Detail: GroupNameStoreEquipmentTest + Dot + Detail,
};

const GroupNameStoreEquipmentTransfer = GroupName + Dot + 'StoreEquipmentTransfer';
const StoreEquipmentTransfer = {
  Default: GroupNameStoreEquipmentTransfer,
  Create: GroupNameStoreEquipmentTransfer + Dot + Create,
};

const GroupNameStoreHouse = GroupName + Dot + 'StoreHouse';
const StoreHouse = {
  Default: GroupNameStoreHouse,
  Create: GroupNameStoreHouse + Dot + Create,
  Update: GroupNameStoreHouse + Dot + Update,
  UpdateEnable: GroupNameStoreHouse + Dot + UpdateEnable,
  Delete: GroupNameStoreHouse + Dot + Delete,
  Detail: GroupNameStoreHouse + Dot + Detail,
};

const GroupNameTerminal = GroupName + Dot + 'Terminal';
const Terminal = {
  Default: GroupNameTerminal,
};

const GroupNameTerminalLink = GroupName + Dot + 'TerminalLink';
const TerminalLink = {
  Default: GroupNameTerminalLink,
};

export default {
  GroupName,
  CableExtends,
  CableLocations,
  Equipments,
  EquipmentGroups,
  EquipmentProperties,
  StoreEquipments,
  StoreEquipmentTest,
  StoreEquipmentTransfer,
  StoreHouse,
  Terminal,
  TerminalLink,
};
