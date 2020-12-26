import Common from './common';
const { Create, Update, Delete, Detail, UpdateOrder, UpdateEnable, Dot } = Common;

const GroupName = 'AbpCms';

const GroupNameCategories = GroupName + Dot + 'Categories';
const Categories = {
  Default: GroupNameCategories,
  Create: GroupNameCategories + Dot + Create,
  Update: GroupNameCategories + Dot + Update,
  Delete: GroupNameCategories + Dot + Delete,
  Detail: GroupNameCategories + Dot + Detail,
  UpdateEnable: GroupNameCategories + Dot + UpdateEnable,
};

const GroupNameArticles = GroupName + Dot + 'Articles';
const Articles = {
  Default: GroupNameArticles,
  Create: GroupNameArticles + Dot + Create,
  Update: GroupNameArticles + Dot + Update,
  Delete: GroupNameArticles + Dot + Delete,
  Detail: GroupNameArticles + Dot + Detail,
};
const GroupNameCategoriesRltArticles = GroupName + Dot + 'CategoriesRltArticles';
const CategoriesRltArticles = {
  Default: GroupNameCategoriesRltArticles,
  Create: GroupNameCategoriesRltArticles + Dot + Create,
  Update: GroupNameCategoriesRltArticles + Dot + Update,
  Delete: GroupNameCategoriesRltArticles + Dot + Delete,
  Detail: GroupNameCategoriesRltArticles + Dot + Detail,
  UpdateOrder: GroupNameCategoriesRltArticles + Dot + UpdateOrder,
  UpdateEnable: GroupNameCategoriesRltArticles + Dot + UpdateEnable,
};
export default {
  GroupName,
  Categories,
  Articles,
  CategoriesRltArticles,
};
