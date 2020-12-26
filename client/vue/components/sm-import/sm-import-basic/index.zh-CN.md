##  API

### 1.   sm-import 

#### props

| 参数  | 说明                         | 类型     | 默认值 |
| ----- | ---------------------------- | -------- | ------ |
| axios | 项目 axios.create 创建的实例 | function |null|
| url`*` | 文件导入地址 | string |""|
| size | 导入按钮的尺寸，“default"，"small","large" | string |'default'|
| importKey`*` | 文件导入的标识key,用来从后台获取当前导入文件的进度等信息，不能为空。 | string |null|
| isImport | 是否禁用 | boolean |false|
| multiple | 是否为多选，默认为`true`,即可以同时选择多个文件进行上传。(`暂时放弃使用`) | boolean |true|
| defaultTitle | 默认状态下按钮显示的文字 | string |"导入"|
| bussinessTitle | 正在导入时的按钮显示的文字 | string |"正在导入..."|
| btnDefaultType | 按钮默认的样式，与`antd` 按钮样式相同，显示不同的颜色。 | string |"primary"|
| btnBussinessType | 正在导入时按钮的样式，与`antd`按钮样式相同，显示不同的颜色。 | string |"danger"|
| downloadErrorFile | 是否下载导入过程中出错的文档信息，具体的错误文件或者需要导入完成后下载的文件需要在各自的导入接口中进行实现，此处只提供下载。 | boolean |false|


#### event

| 方法名   | 说明                                     | 示例                            |
| -------- | ---------------------------------------- | ------------------------------- |
| selected | 导入文件选中事件,返回选中的一个文件      | function(file){ //...}          |
| exect    | 在selected中调用，构造好后台参数后执行。 | this.$refs.import.exect(data)； |
| success  | 文件上传完成后回调此方法，可在此方法中执行各自业务逻辑，比如列表刷新，或者其他服务获取等等 | function success(){ // to do...} |
> 说明：监听到组件的selected事件后，在各自的模块中通过调用文件导入的接口执行导入操作。
>
> exect中的参数根据各自接口实际的参数进行创建。

示例：

```c#
async fileSelected(file){
   // 构造导入参数（根据自己后台方法的实际参数进行构造）
  let importParamter={
    'file.file':file,
    'importKey':'test',
    'type': 0
  } 
  // 执行文件上传    
  await this.$refs.smImport.exect(importParamter);
},
```



### 2. sm-import-modal

| 参数          | 说明                                        | 类型     | 默认值    |
| ------------- | ------------------------------------------- | -------- | --------- |
| axios         | 项目 axios.create 创建的实例                | function | null      |
| size          | 导入按钮的尺寸，“default"，"small"，"large" | string   | 'default' |
| title         | 导入按钮的文字显示                          | string   | 文件导入  |
| btnType       | 导入按钮的类型                              | string   | primary   |
| subComponents | 子组件，指模态框中包含的`sm-import`组件     | array    | []        |

#### subComponents 参数说明

示例：

```json
subComponents:[
   {
     importKey: "engineringEquipment",
     title: "工程设备导入",
     downloadErrorFile: true,
     url: '/api/app/resourceEquipment/engineeringDataImport'  // 相对地址
     parameters: {
       'file.file': null,
       'importKey': 'engineringEquipment',
       'type': 0
  	 }
    },
      {
       importKey: "engineringEquipment",
       title: "工程电缆导入",
       downloadErrorFile: true,
       url: '/api/app/resourceEquipment/engineeringDataImport'  // 相对地址
       parameters: {
         'file.file': null,
         'importKey': 'engineringEquipment',
         'type': 1
  	   }  
    },
]
```

- `importKey`：唯一的导入标识，用于获取导入状态
- `title`：导入组件的标题名称
  - `downloadErrorFile`: 下载导入出错的文件，默认条件下不下载。
- `parameters`：各自接口定义的参数

### 3.后台接口

在后台服务中使用公共导入组件，需要在各自的模块中注入：`IFileImportHandler `接口，然后通过以下步骤进行使用。

示例代码：

```c#
// 依赖注入
private readonly IFileImportHandler _fileImport;
public TestService(IFileImportHandler fileImport)
{
    _fileImport=fileImport;
}

// 测试方法
public Task ImportTest(FileUploadDto fileData)
 {
    _fileImport.Start(key, 30);  //* 执行导入计算前调用
    for (var i = 0; i < 30; i++)
    {
        // 导入的耗时测试，各自业务逻辑判断
        Thread.Sleep(200);
        _fileImport.UpdateState(key, i); // * 每执行一次循环调用一次，为了前台显示进度，放在最外面的循环中
    }
     // 模拟需要导出的文件
    var file = fileData.File;
    var read = file.OpenReadStream();
    var fileByte=read.GetAllBytes();
     // * 将文件存起来
    _fileImport.SaveExceptionFile(CurrentUser.Id.GetValueOrDefault(),key, fileByte);
    _fileImport.Complete(key); //* 执行完成后调用。
 }
```

