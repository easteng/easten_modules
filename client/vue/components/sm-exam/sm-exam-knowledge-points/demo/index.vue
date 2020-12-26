<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 知识点管理
        `,
  us: `# 知识点管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '知识点管理',
  type: 'Exam',
  zhType: '知识点管理',
  title: 'SmExamKnowledgePoints',
  render() {
    return (
      <div id="components-sm-exam-knowledge-points-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
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
