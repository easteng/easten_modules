<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 富文本编辑器
        `,
  us: `# 富文本编辑器
        `,
};

export default {
  category: 'Modules',
  subtitle: '富文本编辑器',
  type: 'File',
  zhType: '富文本编辑器',
  title: 'SmFileTextEditor',
  render() {
    return (
      <div id="components-sm-file-text-editor-demo">
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
