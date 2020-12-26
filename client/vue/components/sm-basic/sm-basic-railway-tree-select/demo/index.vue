<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 线路选择框
        `,
  us: `# 线路选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '线路选择框',
  type: 'Basic',
  zhType: '系统',
  title: 'SmBasicRailwayTreeSelect',
  render() {
    return (
      <div id="components-sm-basic-railway-tree-select-demo">
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
