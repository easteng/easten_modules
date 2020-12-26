<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 机房级联选择框
        `,
  us: `# 机房级联选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '机房级联选择框',
  type: 'Basic',
  zhType: '基础',
  title: 'SmBasicInstallationSiteCascader',
  render() {
    return (
      <div id="components-sm-basic-installation-site-cascader-demo">
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
