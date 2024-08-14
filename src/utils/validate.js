/**
 * @description 验证手机号
 * @param value
 * @returns {boolean}
 */
export function isPhoneNum(rule, value, callback) {
  const reg = /^1[3,4,5,6,7,8,9]\d{9}$/;
  if (!value) {
    callback(false);
  } else if (value && !reg.test(value)) {
    callback('请输入正确的手机号码');
  } else {
    callback();
  }
}

export function isPhone(rule, value, callback) {
  var testPhone = /^1[3,4,5,6,7,8,9]\d{9}$/;
  var testFixedPhone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  if (!value) {
    callback('请输入手机号码或座机号码');
  } else if (!testPhone.test(value) && !testFixedPhone.test(value)) {
    callback('请输入正确的手机号码或座机号码');
  } else {
    callback();
  }
}

/**
 * @description 校验密码
 * @param value
 * @returns {boolean}
 */
export function isPassWord(value) {
  const reg = /^[A-Za-z0-9]{3,}$/;
  return reg.test(value);
}

/**
 * @description 校验验证码格式
 * @param value
 * @returns {boolean}
 */
export function isCode(value) {
  const reg = /^\d{6}$/;
  return reg.test(value);
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


/**
 * @description 表单-校验车牌号
 * @param value
 * @returns {Boolean}
 */


export function islicenseplatenumber(rule, value, callback) {
  // const form = this.form;
  if (!value) {
    callback(false);
  } else if (value && !(/[a-zA-Z0-9]/.test(value) && value.length <= 8)) {
    callback('请输入字母数字组合，最高8位字符');
  } else {
    callback();
  }
}


/**
 * @description 表单-校验车架编码
 * @param value
 * @returns {Boolean}
 */
export function isVehicleVINCode(rule, value, callback) {
  // const form = this.form;
  if (!value) {
    callback(false);
  } else if (value && !(/[a-zA-Z0-9]{17,18}/.test(value))) {
    callback('请输入字母数字组合，不能低于17且高于18位字符');
  }
   else {
    callback();
  }
}

/**
 * @description 表单-校验发动机号
 * @param value
 * @returns {Boolean}
 */

export function isEngineNumber(rule, value, callback) {
  // const form = this.form;
  callback();
  // if (!value) {
  //   callback(false);
  // } else if (value && !(/^[A-Za-z0-9]+$/.test(value))) {
  //   callback('请输入字母数字组合');
  // } else {
  //   callback();
  // }
}

/**
 * @description 表单-邮件
 * @param value
 * @returns {Boolean}
 */
export const IsEmail = (rule, value, callback) => {
  var reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!value) {
    callback();
  } else if (value && !(reg.test(value))) {
    callback('请输入正确的邮箱');
  } else {
    callback();
  }
}

/**
 * @description 表单-身份证号
 * @param value
 * @returns {Boolean}
 */

// export const regIdNo = (rule, value, callback) => {
//   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
//   if (!value) {
//     callback('请输入身份证号');
//   } else if (value && !reg.test(value)) {
//     callback('身份证号填写有误');
//   } else {
//     callback();
//   }
// }

/**
 * 身份证校验
 * @param  {String} idCard 身份证号
 * @return {Boolen}        格式是否正确
 */
// export const regIdNo = (rule, value, callback) => {
//   var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
//   var factor = [
//     7,
//     9,
//     10,
//     5,
//     8,
//     4,
//     2,
//     1,
//     6,
//     3,
//     7,
//     9,
//     10,
//     5,
//     8,
//     4,
//     2,
//   ];
//   var parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
//   var code = value.substring(17);
//   if (p.test(value)) {
//     var sum = 0;
//     for (var i = 0; i < 17; i++) {
//       sum += value[i] * factor[i];
//     }
//     if (parity[sum % 11] == code.toUpperCase()) {
//       callback();
//     }
//   }
//   callback('身份证号码校验失败');
// }


export const regIdNo = (rule, value, callback) => {
  // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
  var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(value)) {
    callback("身份证号码不合规");
  }
  //区位码校验
  //出生年月日校验  前正则限制起始年份为1900;
  // var year = value.substr(6, 4), //身份证年
  //   month = value.substr(10, 2), //身份证月
  //   date = value.substr(12, 2), //身份证日
  //   time = Date.parse(month + "-" + date + "-" + year), //身份证日期时间戳date
  //   now_time = Date.parse(new Date()), //当前时间戳
  //   dates = new Date(year, month, 0).getDate(); //身份证当月天数
  // if (time > now_time || date > dates) {
  //   callback("出生日期不合规");
  // }
  //校验码判断
  // var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
  // var b = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"); //校验码对照表
  // var id_array = value.split("");
  // var sum = 0;
  // for (var k = 0; k < 17; k++) {
  //   sum += parseInt(id_array[k]) * parseInt(c[k]);
  // }
  // if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
  //   debugger
  //   callback("身份证校验码不合规");
  // }
  callback();
}
