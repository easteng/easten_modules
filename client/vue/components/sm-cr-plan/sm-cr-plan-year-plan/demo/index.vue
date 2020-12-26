<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 年表编制
        `,
  us: `# 年表编制
        `,
};

export default {
  category: 'Modules',
  subtitle: '年表编制',
  type: 'CrPlan',
  zhType: '系统',
  title: 'SmCrPlanYearPlan',
  render() {
    return (
      <div id="components-sm-cr-plan-year-plan-demo">
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
