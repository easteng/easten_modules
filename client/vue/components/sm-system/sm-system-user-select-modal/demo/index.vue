<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 成员选择模态框
        `,
  us: `# 成员选择模态框
        `,
};

export default {
  category: 'Modules',
  subtitle: '成员选择模态框',
  type: 'System',
  zhType: '成员选择模态框',
  title: 'SmSystemUserSelectModal',
  render() {
    return (
      <div id="sm-system-user-select-modal-demo">
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
