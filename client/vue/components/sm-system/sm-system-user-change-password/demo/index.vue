<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 修改密码
        `,
  us: `# 修改密码
        `,
};

export default {
  category: 'Modules',
  subtitle: '修改密码',
  type: 'Basic',
  zhType: '基础',
  title: 'SmSystemUserChangePassword',
  render() {
    return (
      <div id="components-sm-system-user-select-demo">
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
