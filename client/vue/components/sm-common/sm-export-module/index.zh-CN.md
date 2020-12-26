##  API

### 1.   sm-export

#### props

| 参数  | 说明                         | 类型     | 默认值 |
| ----- | ---------------------------- | -------- | ------ |
| axios | 项目 axios.create 创建的实例 | function |null|
| url`*` | 文件导出地址 | string |""|
| size | 导入按钮的尺寸，"default"，"small","large" | string |'default'|
| templateName`*` | 文件导出的标识,用来将数据导进对应模板，不能为空。 | string |null|
| rowIndex`*` | 数据导进对应模板的有效数据起始行，不能为空。 | string |null|
| downloadFileName | 文件导出完成时下载的文件名,用来从后台下载对应模板后返回的文件名，若为空，下载的文件名则为templateName | string |null|
| defaultTitle | 默认状态下按钮显示的文字 | string |"模板下载"|
| btnDefaultType | 按钮默认的样式，与`antd` 按钮样式相同，显示不同的颜色。 | string |""|
| exportComponents`*` | 子组件，指多选框中包含的`sm-export`组件     | array    | []        |


#### templateName 参数说明

> 说明：downloadKey指定参数有：   用户:`users`；厂家:`manufacturers`；组织机构:`organizations`；设备:`equipments`；产品（标准设备）:`standardEquipments`；线路:`railways`；站点:`stations`；机房:`installationSites`；产品分类:`productCategory`；构件分类:`componentCategory`；工程设备:`engineeringEquipments`；工程电缆:`engineeringCable`；电缆配线:`cableWiring`；机柜配线:`cabinetWiring`。
>

下载工程电缆示例：
```json
templateName:"engineeringCable"
```


#### exportComponents 参数说明

示例：

```json
exportComponents:[
      {
        templateName:"engineeringEquipment",
        title:"工程设备数据",
        icon:"setting",
      },
      {
        templateName:"cabinetWiring",
        title:"机柜配线数据",
        icon:"border-verticle",
      }
    ]
```

- `templateName`：唯一的导入标识，用于将数据导进对应的模板，不能为空。
- `title`：导出菜单选项的标题名称
- `icon`：导出菜单选项的前置图标