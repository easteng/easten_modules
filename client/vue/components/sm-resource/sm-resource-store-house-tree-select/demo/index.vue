<script>
import Basic from './basic.md';
import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 仓库选择框
        `,
  us: `# 仓库选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '仓库选择框',
  type: 'Resource',
  zhType: '资源管理系统',
  title: 'SmResourceStoreHouseTreeSelect',
  render() {
    return (
      <div id="components-sm-resource-store-house-tree-select-demo">
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
