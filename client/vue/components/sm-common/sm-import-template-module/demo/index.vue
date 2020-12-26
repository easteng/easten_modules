<script>
import Basic from './basic.md';
import Multiple from './multiple.md';
import Modal from './modal.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 导入模板下载
        `,
  us: `# 导入模板下载
        `,
};

export default {
  category: 'Modules',
  subtitle: '模板下载',
  type: 'Common',
  zhType: '模板下载',
  title: 'SmImportTemplate',
  render() {
    return (
      <div id="components-sm-import-template-demo">
        <md cn={md.cn} us={md.us} />
        <h3>单文件下载</h3>
        <Basic />
       
        <h3>文件下载模态框</h3>
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
