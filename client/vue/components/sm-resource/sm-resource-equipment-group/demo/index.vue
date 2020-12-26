<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 设备分组
        `,
  us: `# 设备分组
        `,
};
export default {
  category: 'Modules',
  type: 'Resource',
  subtitle: '设备分组管理',
  zhType: '标准数据库基础模块',
  title: 'SmResourceEquipmentGroup',
  render() {
    return (
      <div id="components-sm-resouce-equipment-group-demo">
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
