## API

| 参数  | 说明                         | 类型     | 默认值 |
| ----- | ---------------------------- | -------- | ------ |
| axios | 项目 axios.create 创建的实例 | function |
| disabled | 是否为查看模式，查看模式下不可选择 | Boolean | false |
| value | 已选择的条目(v-model 绑定)，当为单选模式时 vlaue 为 String,当为多选模式时 value 为 Array; | String Or Array | null |
| multiple | 是否为多选模式 | Boolean | false |
| placeholder | 选择为空时的信息提示 | String | '请选择' |

### 事件

| 事件名称 | 说明                       | 回调参数        |
| -------- | -------------------------- | --------------- |
| input  | 选择确认后的回调函数，获取所选的设备 | function(value) |
| change  | 选择确认后的回调函数，直接获取所选设备的Ids（视情况调用） | function(value) |