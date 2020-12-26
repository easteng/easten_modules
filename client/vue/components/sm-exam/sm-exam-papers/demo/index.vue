<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 试卷管理
        `,
  us: `# 试卷管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '试卷管理',
  type: 'Exam',
  zhType: '试卷管理系统',
  title: 'SmExamPapers',
  render() {
    return (
      <div id="components-sm-exam-papers-demo">
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

<style>

</style>
