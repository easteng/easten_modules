<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 文件服务配置
        `,
  us: `# 文件服务配置
        `,
};

export default {
  category: 'Modules',
  subtitle: '文件服务配置',
  type: 'File',
  zhType: '文件2',
  title: 'SmFileOss',
  render() {
    return (
      <div id="components-sm-file-oss-demo">
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
