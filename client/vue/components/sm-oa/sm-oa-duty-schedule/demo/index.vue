<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 值班管理
        `,
  us: `# 值班管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '值班管理',
  type: 'Oa',
  zhType: '值班管理',
  title: 'SmOaDutySchedule',
  render() {
    return (
      <div id="sm-oa-duty-schedule-demo">
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
