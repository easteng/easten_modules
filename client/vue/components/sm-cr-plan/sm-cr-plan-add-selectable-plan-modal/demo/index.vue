<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 添加待选计划对话框
        `,
  us: `# 添加待选计划对话框
        `,
};

export default {
  category: 'Modules',
  subtitle: '添加待选计划对话框',
  type: 'Cr-plan',
  zhType: '添加待选计划对话框',
  title: 'SmCrPlanAddSelectablePlanModal',
  render() {
    return (
      <div id="sm-cr-plan-add-selectable-plan-modal-demo">
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
