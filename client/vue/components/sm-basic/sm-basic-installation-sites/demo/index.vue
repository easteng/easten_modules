<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 机房管理`,
  us: `# 机房管理`,
};

export default {
  category: 'Modules',
  subtitle: '机房管理',
  type: 'Basic',
  zhType: '基础',
  title: 'SmBasicInstallationSites',
  render() {
    return (
      <div id="components-sm-basic-installation-sites-demo">
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
