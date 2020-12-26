<script>
import Basic from './basic.md';
import Disable from './disable.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 文章选择框
        `,
  us: `# 文章选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '文章选择框',
  type: 'Cms',
  zhType: '内容系统',
  title: 'SmCmsArticleSelect',
  render() {
    return (
      <div id="components-sm-cms-article-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disable/>
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
