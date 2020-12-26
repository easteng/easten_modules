<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 厂家选择模态框
        `,
  us: `# 厂家选择模态框
        `,
};

export default {
  category: 'Modules',
  subtitle: '厂家选择模态框',
  type: 'StdBasic',
  zhType: '标准库基础模块',
  title: 'SmStdBasicManufacturerModal',
  render() {
    return (
      <div id="sm-std-basic-manufacturer-modal-demo">
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
