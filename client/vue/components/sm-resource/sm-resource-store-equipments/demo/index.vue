<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 库存设备
        `,
  us: `# 库存设备
        `,
};

export default {
  category: 'Modules',
  subtitle: '库存设备',
  type: 'System',
  zhType: '库存设备',
  title: 'SmResourceStoreEquipments',
  render() {
    return (
      <div id="components-sm-resource-store-equipments-demo">
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
