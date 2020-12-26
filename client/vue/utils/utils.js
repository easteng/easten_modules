const { getUserPermissions } = require('../site/components/Authorize/api');

export function getPermissions() {
  let rst = [];
  let string = localStorage.getItem('permissions');
  if (string) {
    rst = JSON.parse(string);
  }
  return rst;
}
