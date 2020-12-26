<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 设备分组选择
        `,
  us: `# 设备分组选择
        `,
};

export default {
  category: 'Modules',
  subtitle: '设备分组选择',
  type: 'Resource',
  zhType: '设备分组选择',
  title: 'SmResourceEquipmentGroupTreeSelect',
  render() {
    return (
      <div id="components-sm-resource-equipment-group-tree-select-demo">
        <md cn={md.cn} us={md.us} />
        <div id="select-baseic">
          <Basic />
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
