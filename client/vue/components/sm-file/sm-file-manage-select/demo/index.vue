<script>
import Basic from './basic.md';
import Disabled from './disable.md';
import Multiple from './multiple.md';
import Rightmenu from './download.md';
import DditDownload from './editDownload.md';
import FileTag from './fileTag.md';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';

const md = {
  cn: `# 文件选择
        `,
  us: `# 文件选择
        `,
};

export default {
  category: 'Modules',
  subtitle: '文件选择',
  type: 'File',
  zhType: '文件2',
  title: 'SmFileManageSelect',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <div id="select-baseic">
          <h3>文件选择（编辑模式-多选）</h3>
          <Basic />
        </div>
        <div id="select-baseic">
          <h3>文件选择（编辑模式-多选-可下载）</h3>
          <DditDownload />
        </div>
        <div id="select-signle">
          <h3>文件选择（编辑模式-单选）</h3>
          <Multiple />
        </div>
        <div id="select-disable">
          <h3>文件选择（查看模式）</h3>
          <Disabled />
        </div>
         <div id="select-baseic">
          <h3>文件选择（查看模式-可下载）</h3>
          <Rightmenu />
        </div>
         <div id="select-baseic">
          <h3>标签模式-可下载）</h3>
          <FileTag />
        </div>
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
h3 {
  color: #0d1a26;
  font-family: Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
    Segoe UI Symbol;
  font-variant: tabular-nums;
  margin: 1.6em 0 0.6em;
  font-weight: 500;
  clear: both;
}
</style>
