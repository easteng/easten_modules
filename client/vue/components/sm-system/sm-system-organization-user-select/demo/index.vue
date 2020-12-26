<script>
import Basic from './basic.md';
// import Multiple from './multiple.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 组织机构下用户选择框
        `,
  us: `# 组织机构下用户选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '组织机构下用户选择框',
  type: 'Basic',
  zhType: '基础',
  title: 'SmSystemOrganizationUserSelect',
  render() {
    return (
      <div id="components-sm-organization-system-user-select-demo">
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
