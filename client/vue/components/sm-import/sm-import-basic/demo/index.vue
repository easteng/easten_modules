<script>
import Basic from './basic.md';
import Multiple from './multiple.md';
import Modal from './modal.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 文件导入
        `,
  us: `# 文件导入
        `,
};

export default {
  category: 'Modules',
  subtitle: '文件导入',
  type: 'Common',
  zhType: '文件导入',
  title: 'SmImportModule',
  render() {
    return (
      <div id="components-sm-import-basic-demo">
        <md cn={md.cn} us={md.us} />
        <h3>单文件导入</h3>
        <Basic />
       
        <h3>文件导入模态框</h3>
        <Modal />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>

<style>
  h3{
    margin-bottom: 10px;
  }
</style>
