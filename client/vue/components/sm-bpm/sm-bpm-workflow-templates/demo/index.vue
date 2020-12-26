<script>
import Basic from './basic.md';
import ForCurrentUser from './for_current_user.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 工作流管理
        `,
  us: `# 工作流管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '工作流管理',
  type: 'Bpm',
  zhType: '工作流管理',
  title: 'SmBpmWorkflowTemplates',
  render() {
    return (
      <div id="sm-bpm-workflow-templates-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <ForCurrentUser />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>

<style></style>
