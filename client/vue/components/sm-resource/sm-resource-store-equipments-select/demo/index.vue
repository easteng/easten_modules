<script>
import Basic from './basic.md';
import Multiple from './multiple.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 库存设备选择
        `,
  us: `# 库存设备选择
        `,
};

export default {
  category: 'Modules',
  subtitle: '库存设备选择',
  type: 'System',
  zhType: '库存设备选择',
  title: 'SmResourceStoreEquipmentsSelect',
  render() {
    return (
      <div id="components-sm-resource-store-equipments-select-demo">
        <md cn={md.cn} us={md.us} />
        <div id="select-baseic">
          <Basic />
        </div>
        <div id="select-multiple">
          <Multiple />
        </div>
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
