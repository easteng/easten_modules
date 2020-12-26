
<script>
import Basic from './basic.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# sm-dashboard-carousel` ,
  us: `# sm-dashboard-carousel` ,
};

export default {
  title: 'SmDashboardCarousel',
  render() {
    return (
      <div id="components-sm-dashboard-carousel-demo">
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
    