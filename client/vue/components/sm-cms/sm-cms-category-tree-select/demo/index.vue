<script>
import Basic from './basic.md';
import Disable from './disable.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 栏目选择框
        `,
  us: `# 栏目选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '栏目选择框',
  type: 'Cms',
  zhType: '内容系统',
  title: 'SmCmsCategoryTreeSelect',
  render() {
    return (
      <div id="components-sm-cms-category-tree-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disable/>
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
