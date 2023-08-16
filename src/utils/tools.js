/**
 *
 * @param name
 * @returns {*}
 *
 * 下划线式变量名转驼峰式
 */
export function toHump(name) {
  if (name) {
    return name.replace(/_(\w)/g, function(all, letter) {
      return letter.toUpperCase();
    });
  }
}

/**
 *
 * @param str
 * @param separator
 * @returns {*}
 *
 * 字符串转化为数组
 */
export function strToArr(str, separator = ',') {
  return str.split(separator);
}

/**
 * 枚举类型label转化成option
 */
export function labelSwitchOptions(name = {}) {
  const result = [];
  for (const index in name) {
    result.push({
      label: name[index],
      value: index,
    });
  }
  return result;
}

/**
 * 验证手机号
 */
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

/**
 * 处理瞳距（PD）
 */

export function handlePd(pd) {
  if (pd) {
    pd = Number(pd);
    if (pd === parseInt(pd)) {
      return parseInt(pd);
    }
    return pd.toFixed(1);
  }
  return '';
}

/**
 * 处理轴距（axis）
 */

export function handleAxis(axis) {
  let result = axis || 0;
  return parseInt(result).toFixed(0);
}

/**
 * 处理金额
 */

export function formatMoney(money = 0, locales = 'zh', currency = 'CNY', digits = 2) {
  if (isNaN(money)) {
    money = 0;
  }
  money = Number(money);
  return money.toLocaleString(locales, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
  });
}

/**
 *
 * 字符串填充
 *
 * @param str
 * @param n
 * @param pattern
 */
export function padPattern(str, n, pattern = '0') {
  let len = str.toString().length;
  while (len < n) {
    str = pattern + str;
    len++;
  }
  return str;
}
