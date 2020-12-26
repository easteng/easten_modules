## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| axios | 项目 axios.create 创建的实例 | function | null |
| disabled | 是否为查看模式，查看模式下不可选择 | Boolean | false |
| value | 已选择的条目(v-model 绑定)，当为单选模式时 vlaue 为 String,当为多选模式时 value 为 Array; | String Or Array | null |
| multiple | 是否为多选模式 | Boolean | false |
| placeholder | 选择为空时的信息提示 | String | '请选择' |

### 事件

| 事件名称 | 说明                       | 回调参数        |
| -------- | -------------------------- | --------------- |
| change   | 选择确认后的回调函数。 | function(value) |
