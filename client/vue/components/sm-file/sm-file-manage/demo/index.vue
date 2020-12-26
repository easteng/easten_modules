<script>
import Basic from './basic.md';
import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 文件管理
        `,
  us: `# 文件管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '文件管理',
  type: 'File',
  zhType: '文件2',
  title: 'SmFileManage',
  render() {
    return (
      <div id="components-sm-file-manage-demo">
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
