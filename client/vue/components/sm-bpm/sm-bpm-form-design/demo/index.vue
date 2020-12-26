<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 表单设计
        `,
  us: `# 表单设计
        `,
};

export default {
  category: 'Modules',
  subtitle: '表单设计',
  type: 'Bpm',
  zhType: '表单设计',
  title: 'SmBpmFormDesign',
  render() {
    return (
      <div id="components-sm-bpm-form-design-demo" class="components-sm-bpm-form-design-demo">
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
.components-sm-bpm-form-design-demo .sm-bpm-form-design {
  height: 600px;
}
</style>

