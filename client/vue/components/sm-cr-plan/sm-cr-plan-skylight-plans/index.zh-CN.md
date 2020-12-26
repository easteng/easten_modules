## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| axios | 项目 axios.create 创建的实例 | function |
| planType | 天窗计划类型，垂直（Vertical）、综合（General）、点外（Outof） | string | Vertical |

## 方法

| 名称   | 描述     | 参数               |
| ------ | -------- | ------------------ |
| add()  | 添加事件 | (planTime) => void |
| view() | 查看事件 | (id) => void       |
| edit() | 编辑事件 | (id) => void       |
