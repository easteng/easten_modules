<script>
import Basic from './basic.md';
import Disabled from './disabled.md';
import Dynamic from './dynamic.md';
import OnlyUser from './onlyUser.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 成员选择对话框
        `,
  us: `# 成员选择对话框
        `,
};

export default {
  category: 'Modules',
  subtitle: '成员选择对话框',
  type: 'System',
  zhType: '成员选择对话框',
  title: 'SmSystemMemberModal',
  render() {
    return (
      <div id="sm-system-member-modal-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disabled />
        <Dynamic />
        <OnlyUser />
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
