<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 机房选择框
        `,
  us: `# 机房选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '机房选择框',
  type: 'Basic',
  zhType: '基础',
  title: 'SmBasicInstallationSiteModal',
  render() {
    return (
      <div id="sm-basic-installation-site-modal-demo">
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
