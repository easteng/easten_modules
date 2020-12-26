## API

| Property       | Description                  | Type          | Default |
| -------------- | ---------------------------- | ------------- | ------- |
| axios          | 项目 axios.create 创建的实例 | function      | null    |
| width | 文件选择框的宽度                                             | Number | 1000 |
| height | 当前文件框的高度      | Number | 100 |
| visible | 模态框是否可见（v-model 绑定) | Boolean | false |
| selected | 已选择的文件数据，当为单选模式时vlaue={},当为多选模式时value=[]; | Object | null |
| multiple | 是否为多选模式 | Boolean | ture |

### 事件

| 事件名称 | 说明     | 回调参数        |
| -------- | -------- | --------------- |
| change | 确认选择或者关闭模态框回调事件，返回当前模态框的可见性,visible | function(value) |
| ok | 确认选择事件，返回已选择的文件,多选模式下返回Array[],单选模式下返回{} | function(array\|\|object) |