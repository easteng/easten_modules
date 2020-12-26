function _getOptions(options) {
  return {
    childrenProperty: 'children',
    parentKeyProperty: 'parentKey',
    keyPorperty: 'key',
    ...options,
  };
}

/**
 * 获取数组指定元素的父元素集合
 * @param { 原始数组 } data
 * @param { 目标节点 key } endKey
 * @param {  } options
 */
export function getFlatArrayParents(data, endKey, options = {}) {
  const _opt = _getOptions(options);
  let endNode = null;
  let parent = null;
  const parents = [];

  for (const item of data) {
    if (item[_opt.keyPorperty] === endKey) {
      endNode = item;
      break;
    }
  }

  function loop(parentKey) {
    for (const item of data) {
      if (item[_opt.keyPorperty] === parentKey) {
        parent = item;
        break;
      }
    }
    if (parent) {
      parents.push(parent);
      if (parent[options.parentKeyProperty]) {
        loop(parent[options.parentKeyProperty]);
      }
      parent = null;
    }
  }

  loop(endNode[options.parentKeyProperty]);

  return parents.reverse();
}

/**
 * 获取数组指定元素的父元素
 * @param { 原始数组 } data
 * @param { 目标节点 key} endKey
 * @param { } options
 */
export function getFlatArrayParent(data, endKey, options = {}) {
  const _opt = _getOptions(options);
  for (const item of data) {
    if (item[_opt.keyPorperty] === endKey) {
      return item;
    }
  }
}

/**
 * 为树状数组增加属性
 * @param { 原始数组 } treeArray
 * @param { 子节集合属性名 } childrenPropName
 * @param { 配置 } props [{sourceProp: 'name', targetProp: 'title', targetType: 'string', targetValue:null, handler:(item)=>{return any} }]
 */
export function treeArrayItemAddProps(treeArray, childrenPropName, props) {
  // 递归写法
  function loop(array) {
    for (const item of array) {
      for (const prop of props) {
        if (prop.sourceProp && prop.sourceProp.indexOf('{') > -1) {
          let sourceArray = prop.sourceProp.split('{');
          sourceArray.shift();

          sourceArray.map((sourceItem, index) => {
            // sourceItem = 'code} '  or 'name}'
            sourceItem = sourceItem.split('}')[0];

            const value = item[sourceItem].toString();
            item[prop.targetProp] =
              index > 0
                ? item[prop.targetProp].replace('{' + sourceItem + '}', value)
                : prop.sourceProp.replace('{' + sourceItem + '}', value);
          });
        } else if (prop.handler) {
          item[prop.targetProp] = prop.handler(item);
        } else {
          if (item.hasOwnProperty(prop.sourceProp)) {
            const value = item[prop.sourceProp];
            item[prop.targetProp] =
              prop.targetType && prop.targetType === 'string' ? value.toString() : value;
          } else if (prop.targetProp) {
            item[prop.targetProp] = prop.targetValue;
          }
        }
      }
      if (item[childrenPropName]) {
        loop(item[childrenPropName]);
      }
    }
  }
  loop(treeArray);
  return treeArray;
}

/**
 * 循环树状数组
 * @param {原始数组} treeArray
 * @param {回调函数} callback
 */
export function treeArrayLoop(treeArray, callback) {
  for (let item of treeArray) {
    callback(item);
    if (item.children) {
      treeArrayLoop(item.children, callback);
    }
  }
}

/**
 * 把一个树状数组转换为数组
 * @param { 树状数组 } array
 */
export function treeArrayToFlatArray(treeArray, childrenProp = 'children') {
  let _array = [];
  function loop(tickArray) {
    for (let item of tickArray) {
      _array.push(item);
      let children = item[childrenProp];
      if (children && children instanceof Array) {
        loop(children);
      }
    }
  }
  loop(treeArray);

  return _array;
}

/**
 * 获取树状数组中某个元素的父节点集合
 * @param array 原始数组
 * @param childrenAttr 子元素属性
 * @param keyAttr 索引属性
 * @param key 目标索引值
 */
export const getTreeArrayParentsByKey = function(array, childrenAttr, keyAttr, key) {
  const parents = [];
  let target = getTreeArrayItemByKey(array, childrenAttr, keyAttr, key);
  function find(child) {
    const parent = getTreeArrayParentByKey(array, childrenAttr, keyAttr, child[keyAttr]);
    if (parent) {
      parents.push(parent);
      target = parent;
      find(target);
    }
  }
  find(target);
  return parents.reverse();
};

/**
 * 获取树状数组指定元素的父元素
 * @param array 原始数组
 * @param childrenAttr 子元素属性
 * @param keyAttr 索引属性
 * @param key 目标索引值
 */
export const getTreeArrayParentByKey = function(array, childrenAttr, keyAttr, key) {
  let parent = null;
  function find(array) {
    for (const item of array) {
      if (item[childrenAttr]) {
        if (item[childrenAttr].some(child => child[keyAttr] === key)) {
          parent = item;
          break;
        } else {
          find(item[childrenAttr]);
        }
      }
    }
  }

  find(array);
  return parent;
};

/**
 * 获取树状数组指定元素
 * @param array 原始数组
 * @param childrenAttr 子元素属性
 * @param keyAttr 索引属性
 * @param key 目标索引值
 */
export const getTreeArrayItemByKey = function(array, childrenAttr, keyAttr, key) {
  let target = null;
  function find(array) {
    for (const item of array) {
      if (item[keyAttr] === key) {
        target = item;
        break;
      } else if (item[childrenAttr]) {
        find(item[childrenAttr]);
      }
    }
  }
  find(array);

  return target;
};
/**
 * 获取树状数组parentId转换为数组
 * @param array 原始数组
 * @param keyAttr 索引属性
 * @param key 目标索引值
 */
export const getTreeArrayItemByNull = function(array, keyAttr, key) {
  let target = [];
  function find(array) {
    for (const item of array) {
      if (item[keyAttr] === key) {
        target.push(item);
      }
    }
  }
  find(array);

  return target;
};

/**
 * 获取树状数组指定元素
 * @param array 原始数组
 * @param childrenAttr 子元素属性
 * @param keyAttr 索引属性
 * @param key 目标索引值
 */
export const getTreeArrayAllChildrenByKey = function(array, childrenAttr, keyAttr, key) {
  const target = getTreeArrayItemByKey(array, childrenAttr, keyAttr, key);
  const allChildren = [];
  function find(array) {
    for (const item of array) {
      allChildren.push(item);
      if (item[childrenAttr]) {
        find(item[childrenAttr]);
      }
    }
  }
  find(target[childrenAttr]);
  return allChildren;
};

export function deleteEmptyProps(treeArray, childrenProp, props) {
  function loop(tickArray) {
    for (let item of tickArray) {
      // 删除空属性
      for (let prop of props) {
        if (
          (item.hasOwnProperty(prop) && item[prop] instanceof Array && item[prop].length === 0) ||
          !item[prop]
        ) {
          delete item[prop];
        }
      }
      let children = item[childrenProp];
      if (children && children instanceof Array) {
        loop(children);
      }
    }
  }
  loop(treeArray);

  return treeArray;
}

export function getUpTreeParents(curNode, parentProperty) {
  let parent = parentProperty || 'parent';
  let array = [];

  function loop(node) {
    if (node.parent) {
      array.push(node[parent]);
      loop(node[parent]);
    }
  }

  loop(curNode);
  return array;
}

export function codeFlatArrayToTreeBySeperate(list, code, separator) {
  for (let item of list) {
    // 获取父级 code
    let parentCode = '';
    let codeArray = item[code].split(separator);
    codeArray.pop();
    let index = 0;
    for (let subCode of codeArray) {
      parentCode += subCode + (index < codeArray.length - 1 ? separator : '');
      index++;
    }

    // 找 item 的 parent，把 item 加入到 parent 的 children
    for (let target of list) {
      if (target[code] == parentCode) {
        target.children = target.children || [];
        target.children.push(item);
        item.parent = target;
        break;
      }
    }
  }

  return list.filter(x => !x.parent);
}
