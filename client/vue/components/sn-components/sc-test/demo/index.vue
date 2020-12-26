<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 数据搜索框
        `,
  us: `# 数据搜索框
        `,
};

export default {
  category: 'Modules',
  subtitle: '测试组件',
  type: 'Components',
  zhType: '组件',
  title: 'ScTest',
  render() {
    return (
      <div id="components-sc-table-operator-demo">
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
