<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 年表月度计划编制
        `,
  us: `# 年表月度计划编制
        `,
};

export default {
  category: 'Modules',
  subtitle: '年表月度计划编制',
  type: 'CrPlan',
  zhType: '系统',
  title: 'SmCrPlanMonthOfYearPlan',
  render() {
    return (
      <div id="components-sm-cr-plan-month-of-year-plan-demo">
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
