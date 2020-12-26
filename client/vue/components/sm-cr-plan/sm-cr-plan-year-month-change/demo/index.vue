<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 年月表变更单页
        `,
  us: `# 年月表变更单页
        `,
};

export default {
  category: 'Modules',
  subtitle: '年月表变更单页',
  type: 'CrPlan',
  zhType: '系统',
  title: 'SmCrPlanYearMonthChange',
  render() {
    return (
      <div id="components-sm-cr-plan-year-month-change-demo">
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
