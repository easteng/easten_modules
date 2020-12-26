<script>
import Basic from './basic.md';
import MyIinitial from './my_initial.md';
import MyWaiting from './my_waiting.md';
import MyApproved from './my_approved.md';
import MyCc from './my_cc.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 工作流管理
        `,
  us: `# 工作流管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '工作流管理',
  type: 'Bpm',
  zhType: '工作流管理',
  title: 'SmBpmWorkflows',
  render() {
    return (
      <div id="sm-bpm-workflows-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <MyIinitial />
        <MyWaiting />
        <MyApproved />

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
