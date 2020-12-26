<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 产品管理
        `,
  us: `# 产品管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '产品管理',
  type: 'StdBasic',
  zhType: '标准库基础模块',
  title: 'SmStdBasicStandardEquipments',
  render() {
    return (
      <div id="components-std-basic-standard-equipments-demo">
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
