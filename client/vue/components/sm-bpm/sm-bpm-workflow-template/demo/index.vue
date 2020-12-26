<script>
import Basic from './basic.md';
import Edit from './edit.md';
import View from './view.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 工作流单页
        `,
  us: `# 工作流单页
        `,
};

export default {
  category: 'Modules',
  subtitle: '工作流单页',
  type: 'Bpm',
  zhType: '工作流单页',
  title: 'SmBpmWorkflowTemplate',
  render() {
    return (
      <div id="sm-bpm-workflow-template-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Edit />
        <View />
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
