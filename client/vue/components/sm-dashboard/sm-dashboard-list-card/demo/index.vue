
<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# sm-dashboard-list-card` ,
  us: `# sm-dashboard-list-card` ,
};

export default {
  title: 'SmDashboardListCard',
  render() {
    return (
      <div id="components-sm-dashboard-list-card-demo">
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
    