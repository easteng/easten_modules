import Common from './common';
const { Create, Update, Delete, Dot, Detail, Relate, PublishState } = Common;
const GroupName = 'AbpBpm';

const GroupNameWorkflowTemplate = GroupName + Dot + 'WorkflowTemplates';
const WorkflowTemplate = {
  Default: GroupNameWorkflowTemplate,
  Create: GroupNameWorkflowTemplate + Dot + Create,
  Update: GroupNameWorkflowTemplate + Dot + Update,
  Delete: GroupNameWorkflowTemplate + Dot + Delete,
  Detail: GroupNameWorkflowTemplate + Dot + Detail,
  PublishState: GroupNameWorkflowTemplate + Dot + PublishState,
};

export default {
  GroupName,
  WorkflowTemplate,
};
