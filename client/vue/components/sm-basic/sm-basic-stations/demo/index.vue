<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 站点管理
        `,
  us: `# 站点管理
        `,
};

export default {
  category: 'Modules',
  subtitle: '站点管理',
  type: 'Basic',
  zhType: '系统',
  title: 'SmBasicStations',
  render() {
    return (
      <div id="components-sm-basicstations-demo">
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
