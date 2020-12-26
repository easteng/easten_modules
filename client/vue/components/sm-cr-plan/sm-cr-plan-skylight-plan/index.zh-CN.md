## API

| 参数           | 说明                                      | 类型     | 默认值        |
| -------------- | ----------------------------------------- | -------- | ------------- |
| axios          | 项目 axios.create 创建的实例              | function |
| organizationId | 组织机构 Id                               | String   | null          |
| planType       | 天窗计划类型(vertical/general/outOf)      | String   | vertical      |
| pageState      | 页面状态添加、编辑、查看（add/edit/view） | String   | PageState.Add |
| id             | 天窗计划 Id                               | String   | null          |

## 方法

| 名称     | 描述     | 参数         |
| -------- | -------- | ------------ |
| ok()     | 确认事件 | (id) => void |
| cancel() | 取消事件 | () => void   |
