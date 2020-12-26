## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| axios | 项目 axios.create 创建的实例 | function | null |
| maxTagCount | 多选状态下最多显示 tag 数 | Number | 3 |
| disabled | 是否禁用 | Boolean | false |
| value | 指定当前选中的条目| string/string[] | null |
| treeCheckable | 是否为多选模式 | Boolean | false |
| showSearch | 是否显示搜索，单选模式下起作用 | Boolean | false |
| placeholder | 文本框显示的文字 | String | '请选择' |
| isAutoDisableOrg | 禁用当前用户未加入的组织机构 | Boolean | false |
| onlyCurrentUserOrganizations | 只显示当前用户的组织机构 | Boolean | false |

### 事件

| 事件名称 | 说明                     | 回调参数        |
| -------- | ------------------------ | --------------- |
| change   | 下拉框值改变时回调方法 | function(value) |
| input    | 下拉框值改变时回调方法 | function(value) |