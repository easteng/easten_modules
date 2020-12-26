<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 出入库记录
        `,
  us: `# 出入库记录
        `,
};

export default {
  category: 'Modules',
  subtitle: '库存管理',
  type: 'source',
  zhType: '出入库记录',
  title: 'SmResourceStoreEquipmentTransfer',
  render() {
    return (
      <div id="components-sm-resource-store-equipment-transfer-demo">
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
