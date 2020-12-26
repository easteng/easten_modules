<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 模板
        `,
  us: `# 模板
        `,
};

export default {
  category: 'Modules',
  subtitle: '模板',
  type: 'System',
  zhType: '模板',
  title: 'SmResourceEquipments',
  render() {
    return (
      <div id="components-sm-resource-equipments-demo">
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
