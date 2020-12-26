<script>
import Basic from './basic.md';
import Disable from './disable.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 设备连锁类型选择框
        `,
  us: `# 设备连锁类型选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '设备连锁类型选择框',
  type: 'StdBasic',
  zhType: '基础',
  title: 'SmStdBasicEquipmentControlType',
  render() {
    return (
      <div id="components-sm-std-basic-equipment-control-type-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disable/>
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
