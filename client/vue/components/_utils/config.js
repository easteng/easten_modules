/**
 * Form 表单
 */
export const form = {
  // 表单标签
  labelCol: { span: 5 },
  // 表单输入框
  wrapperCol: { span: 17 },
  // 没有标签的表单输入框
  wrapperColTail: { span: 17, offset: 5 },
};
//select dropdownStyle
export const dropdownStyle = {
  'overflow-y': scroll,
  'max-height': '400px',
};
/**
 * 分页器配置项
 */
export const pagination = {
  // 默认分页大小
  defaultPageSize: 10,
  // 分页下拉框显示格式
  buildOptionText: props => `${props.value} 条/页`,
  // 总数显示格式
  showTotal: x => `共 ${x} 条`,
};

export const tips = {
  moveOut: {
    title: '确认移出',
    content: '确定要移出当前组织机构吗？',
  },
  remove: {
    title: '确认删除',
    content: '确定要删除该条数据吗？',
  },
  UnEnable: {
    title: '确认禁用',
    content: '确定要停用当前组织机构吗？',
  },
  Enable: {
    title: '确认启用',
    content: '确定要启用当前组织机构吗？',
  },
  UnEnableStoreHouse: {
    title: '确认停用',
    content: '确定要停用当前仓库吗？',
  },
  EnableStoreHouse: {
    title: '确认启用',
    content: '确定要启用当前仓库吗？',
  },
  download:{
    title: '确认下载',
    content: '确定要下载此导入模板吗？',
  },
  export:{
    title: '确认导出',
    content: '确定要导出此数据吗？',
  },
};
