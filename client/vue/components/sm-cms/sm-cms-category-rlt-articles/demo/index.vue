<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 栏目文章
        `,
  us: `# 栏目文章
        `,
};

export default {
  category: 'Modules',
  subtitle: '栏目文章',
  type: 'Cms',
  zhType: '内容管理系统',
  title: 'SmCmsCategoryRltArticles',
  render() {
    return (
      <div id="components-sm-cms-category-rlt-articles-demo">
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

<style>
#components-badge-demo .ant-badge:not(.ant-badge-not-a-wrapper) {
  margin-right: 20px;
}
#components-badge-demo .head-example {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  background: #eee;
  display: inline-block;
  vertical-align: middle;
}
#components-badge-demo .ant-badge-not-a-wrapper:not(.ant-badge-status) {
  margin-right: 8px;
}
</style>
