##  API

### 1.   sm-import-template

#### props

| 参数  | 说明                         | 类型     | 默认值 |
| ----- | ---------------------------- | -------- | ------ |
| axios | 项目 axios.create 创建的实例 | function |null|
| size | 导入按钮的尺寸，"default"，"small","large" | string |'default'|
| width | 导入按钮的宽度 | string |'auto'|
| downloadKey`*` | 文件模板下载的标识key,用来从后台下载对应模板，不能为空。 | string |null|
| downloadFileName | 文件模板下载的文件名,用来从后台下载对应模板后返回的文件名，若为空，下载的文件名则为下载标识 | string |null|
| defaultTitle | 默认状态下按钮显示的文字 | string |"模板下载"|
| btnDefaultType | 按钮默认的样式，与`antd` 按钮样式相同，显示不同的颜色。 | string |""|
| downComponents`*` | 子组件，指模态框中包含的`sm-import-template`组件     | array    | []        |


#### downloadKey 参数说明

> 说明：downloadKey指定参数有：   用户:`users`；厂家:`manufacturers`；组织机构:`organizations`；设备:`equipments`；产品（标准设备）:`standardEquipments`；线路:`railways`；站点:`stations`；机房:`installationSites`；产品分类:`productCategory`；构件分类:`componentCategory`；工程设备:`engineeringEquipments`；工程电缆:`engineeringCable`；电缆配线:`cableWiring`；机柜配线:`cabinetWiring`。
>

下载工程电缆示例：
```json
downloadKey:"engineeringCable"
```


#### downComponents 参数说明

示例：

```json
downComponents:[
   {
     downloadKey: "engineringEquipment",
     title: "工程设备文件",
     icon:"setting",
    },
      {
       downloadKey: "engineringEquipment",
       title: "工程电缆文件",
       icon:"deployment-unit",
    },
]
```

- `downloadKey`：唯一的下载标识，用于获取下载指定文件模板
- `title`：下载菜单选项的标题名称
- `icon`：下载菜单选项的前置图标