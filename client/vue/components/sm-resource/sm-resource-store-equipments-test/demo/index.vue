<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 设备检测
        `,
  us: `# 设备检测
        `,
};

export default {
  category: 'Modules',
  subtitle: '设备检测',
  type: 'System',
  zhType: '设备检测',
  title: 'SmResourceStoreEquipmentsTest',
  render() {
    return (
      <div id="components-sm-resource-store-equipments-test-demo">
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
