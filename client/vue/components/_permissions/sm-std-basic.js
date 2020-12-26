import Common from './common';
const { Create, Update, Delete, Dot, Import, Export, Detail } = Common;

const GroupName = 'AbpStdBasic';

const GroupNameComponentCategories = GroupName + Dot + 'ComponentCategories';
const ComponentCategories = {
  Default: GroupNameComponentCategories,
  Create: GroupNameComponentCategories + Dot + Create,
  Update: GroupNameComponentCategories + Dot + Update,
  Delete: GroupNameComponentCategories + Dot + Delete,
  Detail: GroupNameComponentCategories + Dot + Detail,
  Import: GroupNameComponentCategories + Dot + Import,
  Export: GroupNameComponentCategories + Dot + Export,
};

const GroupNameProductCategories = GroupName + Dot + 'ProductCategories';
const ProductCategories = {
  Default: GroupNameProductCategories,
  Create: GroupNameProductCategories + Dot + Create,
  Update: GroupNameProductCategories + Dot + Update,
  Delete: GroupNameProductCategories + Dot + Delete,
  Detail: GroupNameProductCategories + Dot + Detail,
  Import: GroupNameProductCategories + Dot + Import,
  Export: GroupNameProductCategories + Dot + Export,
};

const GroupNameManufactures = GroupName + Dot + 'Manufactures';
const Manufactures = {
  Default: GroupNameManufactures,
  Create: GroupNameManufactures + Dot + Create,
  Update: GroupNameManufactures + Dot + Update,
  Delete: GroupNameManufactures + Dot + Delete,
  Detail: GroupNameManufactures + Dot + Detail,
  Import: GroupNameManufactures + Dot + Import,
  Export: GroupNameManufactures + Dot + Export,
};

const GroupNameStandardEquipments = GroupName + Dot + 'StandardEquipments';
const StandardEquipments = {
  Default: GroupNameStandardEquipments,
  Create: GroupNameStandardEquipments + Dot + Create,
  Update: GroupNameStandardEquipments + Dot + Update,
  Delete: GroupNameStandardEquipments + Dot + Delete,
  Detail: GroupNameStandardEquipments + Dot + Detail,
  Import: GroupNameStandardEquipments + Dot + Import,
  Export: GroupNameStandardEquipments + Dot + Export,
};

const GroupNameTerminals = GroupName + Dot + 'Terminals';
const Terminals = {
  Default: GroupNameTerminals,
  Create: GroupNameTerminals + Dot + Create,
  Update: GroupNameTerminals + Dot + Update,
  Delete: GroupNameTerminals + Dot + Delete,
  Detail: GroupNameTerminals + Dot + Detail,
};

const GroupNameRepairGroup = GroupName + Dot + 'RepairGroup';
const RepairGroup = {
  Default: GroupNameRepairGroup,
  Create: GroupNameRepairGroup + Dot + Create,
  Update: GroupNameRepairGroup + Dot + Update,
  Delete: GroupNameRepairGroup + Dot + Delete,
  Detail: GroupNameRepairGroup + Dot + Detail,
};

const GroupNameRepairItems = GroupName + Dot + 'RepairItems';
const RepairItems = {
  Default: GroupNameRepairItems,
  Create: GroupNameRepairItems + Dot + Create,
  Update: GroupNameRepairItems + Dot + Update,
  Delete: GroupNameRepairItems + Dot + Delete,
  Detail: GroupNameRepairItems + Dot + Detail,
  CreateTagMigration: GroupNameRepairItems + Dot + 'CreateTagMigration',
};

const GroupNameRepairTestItems = GroupName + Dot + 'RepairTestItems';
const RepairTestItems = {
  Default: GroupNameRepairTestItems,
  Create: GroupNameRepairTestItems + Dot + Create,
  Update: GroupNameRepairTestItems + Dot + Update,
  Delete: GroupNameRepairTestItems + Dot + Delete,
  Detail: GroupNameRepairTestItems + Dot + Detail,
  Upgrade: GroupNameRepairTestItems + Dot + 'Upgrade',
};

const GroupNameInfluenceRanges = GroupName + Dot + 'InfluenceRanges';
const InfluenceRanges = {
  Default: GroupNameInfluenceRanges,
  Create: GroupNameInfluenceRanges + Dot + Create,
  Update: GroupNameInfluenceRanges + Dot + Update,
  Delete: GroupNameInfluenceRanges + Dot + Delete,
  Detail: GroupNameInfluenceRanges + Dot + Detail,
};

export default {
  GroupName,
  ComponentCategories,
  ProductCategories,
  Manufactures,
  StandardEquipments,
  Terminals,
  RepairGroup,
  RepairItems,
  RepairTestItems,
  InfluenceRanges,
};
