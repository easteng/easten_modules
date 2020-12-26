<script>
import Basic from './basic.md';
import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 维护分组选择框
        `,
  us: `# 维护分组选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '维护分组选择树',
  type: 'StdBasic',
  zhType: '维护分组',
  title: 'SmStdBasicRepairGroupTreeSelect',
  render() {
    return (
      <div id="components-sm-std-basic-repair-group-tree-select-demo">
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
