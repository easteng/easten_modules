<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 图表统计
        `,
  us: `# 图表统计
        `,
};

export default {
  category: 'Modules',
  subtitle: '图表统计',
  type: 'Statistics',
  zhType: '图表统计',
  title: 'SmCrStatisticsDashboard',
  render() {
    return (
      <div id="components-sm-cr-statistics-plan-state-demo">
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
