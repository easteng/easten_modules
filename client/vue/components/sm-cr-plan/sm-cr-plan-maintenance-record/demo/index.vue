<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 检修记录单页
        `,
  us: `# 检修记录单页
        `,
};

export default {
  category: 'Modules',
  subtitle: '检修记录单页',
  type: 'CrPlan',
  zhType: '检修记录单页',
  title: 'SmCrPlanMaintenanceRecord',
  render() {
    return (
      <div id="components-sm-cr-plan-maintenance-record-demo">
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
