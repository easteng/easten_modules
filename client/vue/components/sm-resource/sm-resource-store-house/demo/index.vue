<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 仓库管理
        `,
  us: `# 仓库管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '仓库管理',
  type: 'source',
  zhType: '资源管理',
  title: 'SmResourceStoreHouse',
  render() {
    return (
      <div id="components-sm-resource-store-house-demo">
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

<style>
</style>
