<script>
import Basic from './basic.md';
import Disable from './disable.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 端子选择框
        `,
  us: `# 端子选择框
        `,
};

export default {
  category: 'Modules',
  subtitle: '端子选择框',
  type: 'StdBasic',
  zhType: '内容系统',
  title: 'SmStdBasicTerminalSelect',
  render() {
    return (
      <div id="components-sm-std-basic-terminal-select-demo">
        <md cn={md.cn} us={md.us} />
        <Basic />
        <Disable/>
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
