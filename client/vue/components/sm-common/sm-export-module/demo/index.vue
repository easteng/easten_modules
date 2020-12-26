<script>
import Basic from './basic.md';
import Multiple from './multiple.md';
import Modal from './modal.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 文件导出
        `,
  us: `# 文件导出
        `,
};

export default {
  category: 'Modules',
  subtitle: '文件导出',
  type: 'Common',
  zhType: '文件导出',
  title: 'SmExport',
  render() {
    return (
      <div id="components-sm-export-demo">
        <md cn={md.cn} us={md.us} />
        <h3>单文件导出</h3>
        <Basic />
       
        <h3>文件导出多选框</h3>
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
