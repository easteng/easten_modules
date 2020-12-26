## API

|
| Property       | Description                  | Type          | Default |
| -------------- | ---------------------------- | ------------- | ------- |
| axios          | 项目 axios.create 创建的实例 | function      | null    |
| value(v-modle) | 构件分类 Id，单选模式为String，多选模式为String类型数组 | String Or String[] | null    |
| disabled       | 是否禁用                     | Boolean       | false   |
| treeCheckable     | 是否多选               | Boolean        | false   |
| treeCheckStrictly  | 父子级是否严格控制              | Boolean        | false   |
| maxTagCount     | 多选状态下最多显示tag数             | Number        | 3   |
| placeholder    | 选择框默认文字               | string        |请选择
| allowClear    | 是否可清除               | Boolean        |true
| showSearch    | 是否显示搜索              | Boolean        |false

### 事件

| 事件名称 | 说明     | 回调参数        |
| -------- | -------- | --------------- |
| change   | 下拉框值改变时回调方法 | function(value) |
| input    | 下拉框值改变时回调方法 | function(value) |

