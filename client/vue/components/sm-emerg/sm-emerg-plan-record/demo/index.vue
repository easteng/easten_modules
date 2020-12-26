<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 应急预案记录单页
        `,
  us: `# 应急预案记录单页
        `,
};

export default {
  category: 'Modules',
  subtitle: '应急预案记录单页',
  type: 'Emerg',
  zhType: '应急预案记录单页',
  title: 'SmEmergPlanRecord',
  render() {
    return (
      <div id="components-sm-emerg-plan-record-demo">
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
