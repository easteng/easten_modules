<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 维修项管理
        `,
  us: `# 维修项管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '维修项管理',
  type: 'StdBasic',
  zhType: '标准数据库基础模块',
  title: 'SmStdBasicRepairItems',
  render() {
    return (
      <div id="components-sm-std-basic-repair-items-demo">
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
