------
# 消息中间件设计说明
(easten-2020-11-19)
## 1、引言
> 为了满足业务需求，新增了消息通知模块，通过实时消息通知来完成配合完成一些系统逻辑。例如：工作流审批通过后通知相应流程节点的管理员去处理等。还有还多的应用场景。

为了通知消息机制的可复用及可扩展，消息通知模块应满足以下特点：

1. `消息模板化`，提供可配置的消息模板，满足不同场景下的消息内容配置。
2. `扩展性强`，为后期通知逻辑部分业务扩展，提前设计抽象接口，方便横向扩展。
3. `服务健壮稳定`，底层采用SignalR实时通讯框架，结合Abp模块化构建，通信服务与API服务集成，相对稳定可靠。
4. `上手快`，服务底层逻辑分明，注释丰富，方便其他开发人员快速上手扩展必要的业务逻辑。
5. `低耦合`，不同模块间通过领域层接口进行访问SignalR服务，WebSocket 核心服务模块分离，降低服务应用耦合。

## 2 基于SignalR的消息中心开发说明

### 1、整体架构


![image.png](https://ae05.alicdn.com/kf/Hc01f2f86156d4d76b2c48c5c8704309fK.png)
![image.png](https://ae03.alicdn.com/kf/Hcca53efd9ce74a1a979777b690e9dc47f.png)

### 2、模块说明

SnAbp.Message解决方案共包含一下项目：

- `SnAbp.Message.Core`
- `SnAbp.Message.Domain`
- `SnAbp.Message.Domain.Shared`
- `SnAbp.Message.EntityFrameworkCore`
- `SnAbp.Message.HttpApi`

#### 2.1 SnAbp.Message.Core

此项目是模块间调用消息中间的核心封装，主要用于消息自模块中集成和实现使用。

例如在`SnabpMessage.Notice`项目中使用该模块,首先在模块文件中添加服务`AddMessageCore`

```c#
 public class SnAbpMessageNoticeModule:AbpModule
 {
     public override void OnPreApplicationInitialization(ApplicationInitializationContext context)
     {
         base.OnPreApplicationInitialization(context);
     }

     public override void ConfigureServices(ServiceConfigurationContext context)
     {
         // 配置当前模块的客户端名称
         context.Services.AddMessageCore(builder=>builder.UseHttpClient(option => option.ClientName= MessageBaseDefine.MessageType));
         // 自身服务注册
         context.Services.AddSingleton<IMessageNoticeProvider,MessageNoticeProvider>();
     }
 }
```

#### 2.2 SnAbp.Message.Domain

该模块领域层主要实现了对Identity模块的方法调用，并提供用户、角色、组织机构的数据查询方法`MessageManager`

#### 2.3 SnAbp.Message.Domain.Shared

核心消息中心相关类的定义及扩展方法

- `BaseMessage` 消息基类，规定消息发送规则及发送对象
- `MessageContent ` 消息内容基类，用于子模块基础使用
- `MessageType `消息类型枚举
- `MessageExtension `  消息中心扩展方法

#### 2.4 SnAbp.Message.HttpApi

此模块主要是为核心SignalR服务及消息中间件、扩展服务封装。提供自模块需要的接口定义。

- `BaseHub `所有子类需要依赖的Hub基类，和数据交换的核心并提供默认`Register`方法
- `IMessageContext` 消息上下文接口，用于消息的发送的方法定义。
- `MessageServiceProvider`消息服务接口，定义消息发送方法，用于自模块消息继承和实现

### 3、具体模块开发

以消息通知模块`SnAbp.Message.Notice`开发为例进行说明

#### 3.1 创建模块间通知接口及实现

- 在SnAbp.Message.Notice 项目中创建定义通知服务接口，用于使用该模块的其他业务模块依赖调用

`IMessageNoticeProvider`，接口要依赖`IMessageProvider`。

- 创建MessageNoticeProvider 类，进行实现`IMessageNoticeProvider`接口。

```c#
 public class MessageNoticeProvider : IMessageNoticeProvider
 {
     IHttpClientProvider ClientProvider { get; }
     public MessageNoticeProvider(IHttpClientProvider clientProvider) => ClientProvider = clientProvider;

     public async Task PushAsync(byte[] data)
     {
         await ClientProvider.PostAsync(data);
     }
 }
```

- 在模块服务中添加Message核心服务。

```c#
public override void ConfigureServices(ServiceConfigurationContext context)
{
    // 配置当前模块的客户端名称
    context.Services.AddMessageCore(builder=>
        builder.UseHttpClient(option => option.ClientName= MessageBaseDefine.MessageType));

    context.Services.AddSingleton<IMessageNoticeProvider,MessageNoticeProvider>();
}
```

> builder.UseHttpClient(option => option.ClientName= MessageBaseDefine.MessageType)) 用于配置客户端地址，固定使用

#### 3.2 定义消息类型及消息体

- `SnAbp.Message.Notice.Domain.Shared`通知模块消息类型定义，`MessageBaseDefine `，其他模块开发中定义类似，只是将`notice `修改成对应的模块名称即可。

```c#
 /// <summary>
 ///  当前消息类型定义，一个模块消息类型只有一个
 /// </summary>
 public class MessageBaseDefine
 {
     /// <summary>
     /// 消息类型
     /// </summary>
     public const string MessageType = "notice";

     /// <summary>
     /// 服务路由
     /// </summary>
     public const string HubRoute = MessageRoute.BaseRoute + MessageType;
 }
```

- 定义`notice`相关的消息体，`NoticeMessage`，消息体继承`BaseMessage`基类。注意需要给该类添加` [Serializable] `特性标记。

```c#
 [Serializable]
 public class NoticeMessage : BaseMessage
 {
 }
```

- 定义消息详细内容NoticeMessageContent，主要用与返回到客户端使用，需要继承MessageContent 基类，并可扩展通知类消息内容所需要的字段,同时添加[Serializable]标记

```c#
[Serializable]
public class NoticeMessageContent:MessageContent
{
    public virtual DateTime CreateTime { get; set; }
}
```

#### 3.3 消息服务配置及使用

- `SnAbp.Message.Notice.HttpApi` 模块中添加SnAbp.Message.HttpApi项目依赖

  ```c#
   [DependsOn(typeof(MessageHttpApiModule)]           
  ```

- 创建通知集线器 `NoticeHub`

  ```c#
   public class NoticeHub : BaseHub
   {
       public override Task Register(string topic)
       {
           // 具体业务实现
           return null;
       }
   }
  ```

- 添加注册SignalR服务

  ```c#
  public override void ConfigureServices(ServiceConfigurationContext context)
  {
      context.Services.AddSnabpSignalR(b =>
          {
              b.AddHubConfig<NoticeHub>(opt => opt.HubRoute = MessageBaseDefine.HubRoute);
              b.AddServiceProvider<NoticeServiceProvider>();
          });
  }
  ```

- 注册消息中间件`UseSnAbpMessageCore`

  ```c#
  public override void OnApplicationInitialization(ApplicationInitializationContext context)
  {
      var app = context.GetApplicationBuilder();
      // 使用消息中间件
      app.UseSnAbpMessageCore(option => option.MessageType = MessageBaseDefine.MessageType);
  }
  ```

- 新增通知类服务`NoticeServiceProvider`，实现消息的接收及数据库操作等逻辑

  ```c#
  public class NoticeServiceProvider :MessageServiceProvider
  {
      IMessageContext<NoticeHub> MessageContext { get; }
      public NoticeServiceProvider(IMessageContext<NoticeHub> hub)
      {
          MessageContext = hub;
      }
      /// <summary>
      /// 接收各功能模块发送过来的数据
      /// </summary>
      /// <param name="data">二进制的数据信息</param>
      /// <returns></returns>
      public override async Task Receive(byte[] data)
      {
          var message = data.GetMessage<NoticeMessage>();
          // 解析消息，根据类型发送
          await MessageContext.SendAsync(message, "ReceiveMessage");
      }
  }
  ```

  > 说明：消息发送时，ReceiveMessage 为前端监听的方法名称，一定更要与客户端对应，否则接收消息失败。SendAsync() 方法有多各重载，可根据实际需求进行添加参数。



### 4、其他模块调用

以其他模块调用消息通知模块为例。在应用层进行依赖注入，并发送消息

```c#
public class TestService:ITestService
{
    private readonly IMessageNoticeProvider _messageNotice;
    public TestService(IMessageNoticeProvider messageNotice)
    {
        _messageNotice=messageNotice;
    }
    
    public Task TestMethod()
    {
        // 创建消息实例
        var message=new NoticeMessage();
        message.SendType=SendModeType.User; //设置发送模式为用户，还有其他模式可以选择哦
        message.SetUserId(CurrentUser.Id.GetValueOrDefault());// 配置接收此消息的人员id
        // 创建消息内容实例
        var content=new NoticeMessageContent
        {
            Title="一条优秀的消息通知",
            Url:"https://www.easteng.cn",
            CreateTime:DateTime.Now
            // 具体的字段在相应的消息内容中定义
        };
        // 给消息添加消息内容
        message.SetContent(content);
        //调用接口，发送消息,发送时需要调用GetBinary方法，将消息转换成二进制数据
        _messageProvider.PushAsync(message.GetBinary())
    }
}
```

### 5、前端模块使用消息中间件

在需要订阅消息内容的部分添加以下代码，列入在通知类模块中添加

```jsx
...
props: {
    signalr: { type: Object, default: null },
},
...
created() {
    let _this = this;
    this.signalr
      .sub('notice')   // 订阅主题
      .on('ReceiveMessage', (a, b) => {
         // 实时接受的服务端消息，参数与服务端发送的参数一致
       }).then((data) => {
        // 首次连接收，返回的数据，具体内容在后端定义，例如未读的消息集合等
    });
},
```



### 5、附加说明

- BaseMessage方法说明

| MethodName                       | Descripition                                                 |
| :------------------------------- | :----------------------------------------------------------- |
| SetUserId(Guid id)               | 添加需要接收消息的用户id信息，同时要集合`SendType`属性来使用，否则不起作用。 |
| SetUserIds(Guid[] ids)           | 以数组的形式添加用户id,作用同上。                            |
| SetRoleId(Guid id)               | 添加角色id                                                   |
| SetRoleIds(Guid[] ids)           | 添加角色id                                                   |
| SetMembers(List[Member] members) | 添加成员集合                                                 |
| SetOrganizationId(Guid id)       | 设置组织机构id                                               |
| SetOrganizationIds(Guid[] ids)   | 设置组织机构id                                               |

