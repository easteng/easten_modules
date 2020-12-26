<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 消息模块-消息通知
        `,
  us: `# 消息模块-消息通知
        `,
};

export default {
  category: 'Modules',
  subtitle: '消息模块-消息通知',
  type: 'Common',
  zhType: '消息模块-消息通知',
  title: 'SmMessageModule',
  render() {
    return (
      <div id="components-sm-message-notice-demo">
        <md cn={md.cn} us={md.us} />
        <h3>消息模块-消息通知</h3>
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
