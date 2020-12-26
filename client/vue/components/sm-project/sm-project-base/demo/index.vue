<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 通知消息
        `,
  us: `# 通知消息
        `,
};

export default {
  category: 'Modules',
  subtitle: '通知消息',
  type: 'Project',
  zhType: '通知消息',
  title: 'SmProjectModule',
  render() {
    return (
      <div id="components-sm-project-basic-demo">
        <md cn={md.cn} us={md.us} />
        <h3>项目信息管理</h3>
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
  h3{
    margin-bottom: 10px;
  }
</style>
