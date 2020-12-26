## API

| Property       | Description                  | Type          | Default |
| -------------- | ---------------------------- | ------------- | ------- |
| axios          | 项目 axios.create 创建的实例 | function      | null    |
| value(v-modle) | 线路 Id                      | String Number | null    |
| disabled       | 是否禁用                     | Boolean       | false   |
| isCheckBox     | 是否显示多选框               | Boolean        | false   |
| placeholder    | 选择框默认文字               | string        |

### 事件

| 事件名称 | 说明     | 回调参数        |
| -------- | -------- | --------------- |
| change   | 改变回掉 | function(value) |
| input    | 改变回掉 | function(value) |
