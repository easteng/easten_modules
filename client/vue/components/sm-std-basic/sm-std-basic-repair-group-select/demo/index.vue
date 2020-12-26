<script>
import Basic from './basic.md';
import SubGroup from './subGroup.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 维护分组选择树
        `,
  us: `# 维护分组选择树
        `,
};

export default {
  category: 'Modules',
  subtitle: '维护分组选择树',
  type: 'StdBasic',
  zhType: '数据库基础模块',
  title: 'SmStdBasicRepairGroupSelect',
  render() {
    return (
      <div id="components-sm-std-basic-repair-group-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <SubGroup/>
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
