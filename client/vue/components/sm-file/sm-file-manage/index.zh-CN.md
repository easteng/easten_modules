## API

| Property       | Description                  | Type          | Default |
| -------------- | ---------------------------- | ------------- | ------- |
| axios          | 项目 axios.create 创建的实例 | function      | null    |
| select | 是否为选择模式，选择模式下组件整体组件尺寸会相应的变化 | Boolean | false |
| height | 当前文件框的高度      | Number | 100 |
| value | 已选择的文件数据集合,v-model 绑定 | Array | [] |
| multiple | 是否为多选模式 | Boolean | ture |

### 事件

| 事件名称 | 说明     | 回调参数        |
| -------- | -------- | --------------- |
| selected | 文件选择后的事件，无论是单选模式还时多选模式，都会触发该事件 | function(array) |