## API

| 参数       | 说明                                                   | 类型     | 默认值 |
| ---------- | ------------------------------------------------------ | -------- | :----- |
| axios      | 项目 axios.create 创建的实例                           | function |        |
| nodeConfig | 流程节点配置                                           | array    | []     |
| audit      | 是否启用审计,只在查看模式下起作用，对应事件：nodeClick | Boolean  | false  |

## 属性：nodeConfig

nodeConfig 是一个配置数组，需要配置的对象结构为：

```js
nodeConfig:[
 {type:'bpmStart',width:80,height:44,nodeProps:["basic","field-permission"]},
 {type:'bpmApprove',width:80,height:44,nodeProps:["basic","member-select","field-permission"]},
 {type:'bpmCc',width:80,height:44,nodeProps:["basic","member-select","field-permission"]},
 {type:'bpmEnd',width:80,height:44,nodeProps:["basic","field-permission"];},
]
```

### 参数说明：

- `type`:节点类型
- `width`: 节点框宽度
- `height`: 节点框高度
- `nodeProp`:节点属性 （nodeOptions）
- `stepProp`：流程属性（stepOptions）

### 流程节点名称定义:

- #### 工作流：bpm

  - `bpmStart` 开始节点
  - `bpmApprove` 审批节点
  - `bpmCc` 抄送节点
  - `bpmEnd` 结束节点

- #### 常规流程

  - `process` 流程 ，直角矩形或圆角矩形。
  - `determine` 判定,菱形
  - `subProcess` 子流程
  - `preProcess` 预定义流程

#### 节点属性配置 nodeOptions

节点属性配置，在使用组件之前对不同来行的流程节点需要的属性组件进行配置。配置项如下：

```javascript
nodeProps = ['basic', 'member-select', 'field-permission', 'condition'];
```

说明：

- `"basic"`：基础组件，提供节点的名称配置，节点图标的显示与隐藏。
- `"member-select"`：成员选择框，提供该节点是否绑定成员信息。
- `"field-permission"`：字段权限，该节点绑定表单字段权限信息，工作流中使用。
- `"condition"`：条件，当节点是“判定”节点时，可以配置条件属性，用来配置条件。
- `"message"`:处理建议,为节点添加处理建议字段。

#### 流程属性配置 stepOptions

流程属性配置为流程线的属性配置，基础配置为流程描述，当上一结点时判定节点是，需要根据判定节点的条件对流程线进行赋值绑定。

```javascript
stepProps = ['basic', 'xxx'];
```

说明：

- `"basic"`：基础组件，只提供流程描述。
- 其他属性待扩展。

### 判定节点属性 condition

判定节点属性组件是专门针对判定节点使用的，其他的节点不建议在使用时启动该组件。

节点属性共包含三个选项，分别时`boolean`,`range`,`options`,对应三种不同的判断类型。返回的数据格式如下：

```javascript
condition: {
  type: 'boolean' | 'range' | 'options;;;;;;;;;;;;;;;;;;;;;;'; // 条件类型
  items: [] | nu;
  ll; // 条件数据，当类型是boolean时，items为null
}
```

#### 😜range 条件返回数据

`range`表示数值范围，条件可为多条，每一个条件都由一个数值和运算符组成。数据格式为：

```javascript
items:[
    {value:0,operator:eq},
    {value:2,operator:le},
    ....
]
```

> 数学运算符定义参考：等于：eq,小于：lt,小于等于：le,大于：gt,大于等于：ge,不等于：ne

#### 😁options 条件返回数据

options 表示数据配置，可以根据业务需求，配置关键字和成立条件，完成条件的配置。数据格式为：

```javascript
items:[
	{key:xxx,value:xxx},
    {key:xxx,value:xxx},
    ...
]
```

#### 😡 判定条件注意事项

判定条件节点默认属性下只允许有两条出线，可通过属性进行配置，不同的条件对应的流程出线是不同的。

> 每一类流程节点对应的名称及图标都是唯一对应的，如需要新增节点，得再程序中提前预定义。

## 事件

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| nodeClick | 查看模式（mode="view"）下节点得点击事件 | nodeClick(data: {nodeId: "1", label: "开始节点", type: "bpmStart", steps: Array(1)}) |

参数示例：

```json
(data = {
  "nodeId": "xxx",
  "label": "节点名称",
  "type": "节点类型",
  "steps": [{ "sourceId": "xxx", "targetId": "xxx" }],
  "message": "节点建议",
  "processed": "节点处理状态",
  "active": "节点激活状态",
  "members": "节点成员"
})
```
