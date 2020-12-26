import Common from './common';
const { Create, Update, Delete, Dot, Enable } = Common;

const GroupName = 'AbpFile';

// const GroupNameFile = GroupName + Dot + 'File';
// const File = {
//   Default: GroupNameFile,
//   Create: GroupNameFile + Dot + Create,
//   Update: GroupNameFile + Dot + Update,
//   Delete: GroupNameFile + Dot + Delete,
// };

const GroupNameFileManager = GroupName + Dot + 'FileManager';
const FileManager = {
  Default: GroupNameFileManager,
  // Create: GroupNameFileManager + Dot + Create,
  // Update: GroupNameFileManager + Dot + Update,
  // Delete: GroupNameFileManager + Dot + Delete,
};

// const GroupNameFolder = GroupName + Dot + 'Folder';
// const Folder = {
//   Default: GroupNameFolder,
//   Create: GroupNameFolder + Dot + Create,
//   Update: GroupNameFolder + Dot + Update,
//   Delete: GroupNameFolder + Dot + Delete,
// };

const GroupNameOssConfig = GroupName + Dot + 'OssConfig';
const OssConfig = {
  Default: GroupNameOssConfig,
  Create: GroupNameOssConfig + Dot + Create,
  Update: GroupNameOssConfig + Dot + Update,
  Delete: GroupNameOssConfig + Dot + Delete,
  Enable: GroupNameOssConfig + Dot + Enable,
};

// const GroupNameTag = GroupName + Dot + 'Tag';
// const Tag = {
//   Default: GroupNameTag,
//   Create: GroupNameTag + Dot + Create,
//   Update: GroupNameTag + Dot + Update,
//   Delete: GroupNameTag + Dot + Delete,
// };

export default {
  GroupName,
  // File,
  FileManager,
  // Folder,
  OssConfig,
  // Tag,
};
