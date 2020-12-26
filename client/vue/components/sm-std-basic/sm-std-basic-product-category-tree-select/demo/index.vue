<script>
import Basic from './basic.md';
import Multiple from './multiple.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 产品分类选择树
        `,
  us: `# 产品分类选择树
        `,
};

export default {
  category: 'Modules',
  subtitle: '产品分类选择树',
  type: 'Basic',
  zhType: '数据库基础模块',
  title: 'SmStdBasicProductCategoryTreeSelect',
  render() {
    return (
      <div id="components-sm-std-basic-product-category-tree-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Multiple />
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
