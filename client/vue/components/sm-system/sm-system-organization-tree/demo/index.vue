<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 组织机构树
        `,
  us: `# 组织机构树
        `,
};

export default {
  category: 'Modules',
  subtitle: '组织机构树',
  type: 'System',
  zhType: '系统',
  title: 'SmSystemOrganizationTree',
  render() {
    return (
      <div id="components-sm-system-organization-tree-demo">
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
