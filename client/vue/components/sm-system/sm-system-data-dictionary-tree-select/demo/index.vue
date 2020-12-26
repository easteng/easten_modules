<script>
import Basic from './basic.md';
import Multiple from './multiple.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 数据字典选择框
        `,
  us: `# 数据字典选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '数据字典选择框',
  type: 'System',
  zhType: '系统',
  title: 'SmOrgs',
  render() {
    return (
      <div id="components-sm-system-data-dictionary-tree-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <h3>多选</h3>
        <Multiple />
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
