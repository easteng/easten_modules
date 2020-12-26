## API

| Property       | Description                  | Type          | Default |
| -------------- | ---------------------------- | ------------- | ------- |
| axios          | 项目 axios.create 创建的实例 | function      | null    |
| value(v-modle) | 字典 Id                      | String Number | null    |
| groupCode      | 字典 Code                    | String        | null    |
| multiple       | 是否多选                     | Boolean       |   false |
| disabled       | 是否禁用                     | Boolean       | false   |
| placeholder    | 选择框默认文字               | string        |         |

### 事件

| 事件名称 | 说明     | 回调参数        |
| -------- | -------- | --------------- |
| change   | 改变回掉 | function(value) |
| input    | 改变回掉 | function(value) |
