## API

| Property       | Description                  | Type          | Default |
| -------------- | ---------------------------- | ------------- | ------- |
| axios          | 项目 axios.create 创建的实例 | function      | null    |
| modalHeight | 文件选择模态框的高度 | Number | 500 |
| height | 当前文件框的高度      | Number | 100 |
| disabled | 是否为查看模式，查看模式下不可选择文件 | Boolean | false |
| value | 已选择的文件数据(v-model绑定)，当为单选模式时vlaue={},当为多选模式时value=[]; | Object | null |
| multiple | 是否为多选模式 | Boolean | ture |
| enableDownload | 启用文件下载 | Boolean | false |
| placeholder | 文件选择为空时的信息提示 | String | '请选择文件' |
### 事件

| 事件名称 | 说明     | 回调参数        |
| -------- | -------- | --------------- |
| change | 文件选择确认后的回调事件，参数中value需要根据当前文件选择模态类型确定，当模式为多选时返回Array,当为单选模式时返回Object. | function(value) |