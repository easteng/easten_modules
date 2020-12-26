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
  type: 'Common',
  zhType: '通知消息',
  title: 'SmMessageModule',
  render() {
    return (
      <div id="components-sm-message-basic-demo">
        <md cn={md.cn} us={md.us} />
        <h3>系统消息通知</h3>
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
