<script>
import Basic from './basic.md';
import FlowView from './flowView.md';
import Default from './default.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 流程设计
        `,
  us: `# 流程设计
        `,
};

export default {
  category: 'Modules',
  subtitle: '流程设计',
  type: 'Bpm',
  zhType: '流程设计',
  title: 'SmBpmFlowDesign',
  render() {
    return (
      <div id="components-sm-bpm-flow-design-demo" class="components-sm-bpm-flow-design-demo">
        <md cn={md.cn} us={md.us} />

        <h2>工作流流程设计</h2>
        <Basic />
        <h2>常规流程设计</h2>
        <Default />
        <h2>常规流程预览</h2>
        <FlowView />
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
.components-sm-bpm-flow-design-demo .sm-bpm-flow-design {
  height: 800px;
}
</style>
