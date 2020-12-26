<script>
import Basic from './import.md';
import Export from './export.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 设备出入库
        `,
  us: `# 设备出入库
       `,
};

export default {
  category: 'Modules',
  subtitle: '设备出入库',
  type: 'source',
  zhType: '设备出入库',
  title: 'SmResourceStoreImportAltExport',
  render() {
    return (
      <div id="sm-resource-store-import-alt-export">
        <md cn={md.cn} us={md.us} />
        <h3>入库信息</h3>
        <Basic />
        <h3>出库信息</h3>
        <Export />
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
</style>
