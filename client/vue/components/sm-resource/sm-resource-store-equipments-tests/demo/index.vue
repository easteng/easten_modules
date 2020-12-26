<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 检测记录
        `,
  us: `# 检测记录
        `,
};

export default {
  category: 'Modules',
  subtitle: '检测记录',
  type: 'System',
  zhType: '检测记录',
  title: 'SmResourceStoreEquipmentTest',
  render() {
    return (
      <div id="components-sm-resource-store-equipments-tests-demo">
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
