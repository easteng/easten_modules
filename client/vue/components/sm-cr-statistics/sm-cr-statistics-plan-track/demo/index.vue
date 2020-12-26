<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 计划追踪
        `,
  us: `# 计划追踪
        `,
};

export default {
  category: 'Modules',
  subtitle: '计划追踪',
  type: 'Statistics',
  zhType: '计划追踪',
  title: 'SmCrStatisticsPlanTrack',
  render() {
    return (
      <div id="components-sm-cr-statistics-plan-track-demo">
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
