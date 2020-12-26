<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 完成情况
        `,
  us: `# 完成情况
        `,
};

export default {
  category: 'Modules',
  subtitle: '完成情况',
  type: 'Statistics',
  zhType: '完成情况',
  title: 'SmCrStatisticsPlanState',
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
