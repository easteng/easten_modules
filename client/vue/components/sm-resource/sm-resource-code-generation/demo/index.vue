<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 编码生成
        `,
  us: `# 编码生成
        `,
};

export default {
  category: 'Modules',
  subtitle: '编码生成',
  type: 'System',
  zhType: '编码生成',
  title: 'SmResourceCodeGeneration',
  render() {
    return (
      <div id="components-sm-resource-code-generation-demo">
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
