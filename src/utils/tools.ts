export function checkIsPC(): boolean {
  return !navigator.userAgent
    .toLowerCase()
    .match(
      /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/
    );
}

/**
 * 获取向下取整的小数
 * @param num 待处理的数 e.g. 16.999
 * @param digits 保留位数 2
 * @returns '16.99'
 */
export function getFloorFloatStr(num: number, digits = 2): string {
  return (Math.floor(num * 100) / 100).toFixed(digits);
}
