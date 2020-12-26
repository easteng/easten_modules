<script>
import Basic from './basic.md';
import Multiple from './multiple.md';
import AutoInitial from './autoInitial.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 组织机构选择框
        `,
  us: `# 组织机构选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '组织机构选择框',
  type: 'System',
  zhType: '系统',
  title: 'SmOrgs',
  render() {
    return (
      <div id="components-sm-system-organization-tree-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Multiple />
        <AutoInitial />
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
