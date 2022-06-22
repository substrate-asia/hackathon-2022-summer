import React from 'react';
 
export const useStorage = (key: string, val: any) => {
  // 获取 localStorage 对应键值
  let local = window.localStorage.getItem(key) as string | null;
  // 对取出的数据进行 JSON.parse 处理
  local = local === null ? null : localFormat(local);
  // 传入值 是否是 Object 如果是，进行 JSON.stringify 处理
  const value = valueFormat(val);
  // 创建 react 状态 若不存在对应 localStorage 则初始化 ，若存在则将其存储在 react 状态中
  const [state, setState] = React.useState<any | undefined>(local !== null ? local : value);
  // 对应 localStorage 不存在 初始化 localStorage
  if (local === null) {
    window.localStorage.setItem(key, value);
  }
  // 在页面更新状态后，同步更新 localStorage
  React.useEffect(() => {
    // 若 更新 react 状态时 传入空值，删除该 localStorage 对应键
    if (state === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    // 不为空时 更新 localStorage
    window.localStorage.setItem(key, valueFormat(state));
  }, [state]);
  // 对外暴露 react 状态 和 react reducer
  return [state, setState];
};
// 对于初始化和更新的值进行处理
function valueFormat(value: any): any {
  if (value instanceof Function) {
    throw new Error('function is not allowed');
  }
  if (typeof value === 'symbol') {
    throw new Error('symbol is not allowed');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}
// 对 localStorage 中取出的数据进行处理
function localFormat(value: string): any {
  let reValue: any;
  try {
    reValue = JSON.parse(value);
  } catch {
    reValue = value;
  }
  return reValue;
}