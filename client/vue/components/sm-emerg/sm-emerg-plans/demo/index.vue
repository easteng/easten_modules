<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 应急预案
        `,
  us: `# 应急预案
        `,
};

export default {
  category: 'Modules',
  subtitle: '应急预案',
  type: 'Emerg',
  zhType: '应急预案',
  title: 'SmEmergPlans',
  render() {
    return (
      <div id="components-sm-emerg-plans-demo">
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
