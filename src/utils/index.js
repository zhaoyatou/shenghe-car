import remoteLoad from './remoteLoad';
import moment from 'moment'
const { AMapCDN, AMapUiCDN } = require('@/plugins/cdn');
import store from '../store';
import { getCache } from '@/utils/session';
/**
 * 用于将地址后面的参数转换成对象返回
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  );
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {number} delay
 * @param {boolean} immediate
 * @return {*}
 */

export function debounce(func, delay, immediate = false) {
  let timer,
    context = this;
  return (...args) => {
    if (immediate) {
      func.apply(context, args);
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * 获取geoJson数据  通过高德获取    递归获取区县geoJson
 * @param  {string} adcode  行政区code
 * @param  {string} childAdcode 区县级行政区code
 * @return {Array}
 */
export function getGeoJson(adcode, childAdcode = '') {
  return new Promise((resolve, reject) => {
    if (window.AMap && window.AMapUI) {
      insideFun(adcode, childAdcode);
    } else {
      remoteLoad(AMapCDN).then(() => {
        if (window.AMap) {
          remoteLoad(AMapUiCDN).then(() => {
            if (window.AMapUI) {
              insideFun(adcode, childAdcode);
            } else {
              console.error('AMapUI获取失败');
            }
          });
        } else {
          console.error('AMap获取失败');
        }
      });
    }
    function insideFun(adcode, childAdcode) {
      // eslint-disable-next-line
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        var districtExplorer = new DistrictExplorer();
        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          if (Json.length === 0) {
            let parent = areaNode._data.geoData.parent.properties.acroutes;
            insideFun(parent[parent.length - 1], adcode);
            return;
          }

          if (childAdcode) {
            Json = Json.filter(item => {
              return item.properties.adcode == childAdcode;
            });
          }
          let mapJson = {
            features: Json
          };
          resolve(mapJson);
        });
      });
    }
  });
}

/**
 * 转换JSON  导出
 * @param  {Array}
 * @return {Array}
 */

export function formatJson(arr, filterVal) {
  return arr.map(v => filterVal.map(j => v[j].toString()));
}

// 根据ID找对当前对象
export const findObj = (arr, id) => {
  if (!arr || arr.length <= 0) {
    console.warn('请检查函数-findObj()-->数组是否正确====>findObj', arr);
    return []
  }
  return arr.find((item) => {
    return item.id == id || item.prodName == id || item.carBrand == id || item.name == id
  })
}

// 根据ID找对当前对象
export const findObj1 = (arr, id) => {
  if (!arr || arr.length <= 0) {
    console.warn('请检查函数-findObj()-->数组是否正确====>findObj', arr);
    return []
  }
  return arr.find((item) => {
    return item.id == id
  })
}

// 1草稿2审核中3审核通过4拨回
export const operStatusColor = () => new Map([[1, { color: 'cyan', text: '草稿' }], [2, { color: 'purple', text: '待审核' }], [3, { color: 'green', text: '已生效' }], [4, { color: 'red', text: '未生效' }]])
// 证件类型
export const cardTypeText = () => new Map([['1', '身份证'], ['2', '驾驶证'], ['3', '护照'], ['4', '港澳台证件']])

/***
 * @description 判断是否是审核权限 管理员权限
 * @authority_type  是审核权限  1 有审核权限 2没有审核权
 * @dec 审核权限是个单独的功能，和菜单没关系了
 * */
export const authType = () => {
  const userInfo = store?.state?.user?.userInfo || getCache('USERIFNO')
  const isAuthority = userInfo?.authorityType;
  /***
   * @codepeding  const isSupAdmin = store.state?.user?.userInfo?.authorityMenu?.authority.some((item) => item.id == 10)
   * @codepeding  if (isSupAdmin) return true  // 有审核权限,证明是炒股案，有所有权限，这里应该和管理员没关系，先把这块的逻辑放着 
   * */
  const isSupAdmin = userInfo?.authorityMenu?.authority?.some((item) => item.id == 10)
  if (isSupAdmin && isAuthority == 1) return true  // 有审核权限,证明是炒股案，有所有权限，这里应该和管理员没关系，先把这块的逻辑放着 
  if (isAuthority !== 1) {
    // 没有审核权限
    return false
  }
  // 有审核权限
  return true
}


/***
 * @description 订单列表按钮权限
 *              1、草稿：查看，编辑，删除，
                2、待审核：查看
                3、已生效：查看  （管理员或审核人员：编辑，退单，删除）
                4、未生效：查看，编辑，删除（管理员）
 * 
 * */
// 草稿按钮权限
const oneBtnType = [{ text: '查看', btnType: 'primary' }, { text: '编辑', btnType: 'dashed' }, { text: '删除', popconfirm: true }]
// 待审核按钮权限
const twoBtnType = [{ text: '查看', btnType: 'primary' }]
// 已生效 按钮权限
const threeBtnAuth = authType() ? [{ text: '查看', btnType: 'primary' }, { text: '编辑', btnType: 'dashed' }, { text: '退单' }, { text: '删除', popconfirm: true }, { text: '合同', btnType: 'primary' }] : [{ text: '查看', btnType: 'primary' }, { text: '合同', btnType: 'primary' }]
// 未生效 按钮权限
const fourBtnAuth = authType() ? [{ text: '查看', btnType: 'primary' }, { text: '编辑', btnType: 'dashed' }, { text: '删除', popconfirm: true }] : [{ text: '查看', btnType: 'primary' }]

export const btnTypeAuth = () => new Map([[1, oneBtnType], [2, twoBtnType], [3, threeBtnAuth], [4, fourBtnAuth]])
/**
* 金额千分位分割格式函数
* @param {Number|String} vlaue 需要转化的金额字符串
*/
export const formatAmount = (value) => {
  //传入值不是数字直接返回0
  if (!value) return '0.00'
  const values = value.toString().split('.')
  // 整数部分
  let integerNum = values[0]
  // 小数部分
  let decimalNum = values[1] ? values[1] : '00'
  decimalNum = decimalNum.length === 1 ? decimalNum + 0 : decimalNum
  //传入值小于1000不切割
  if (integerNum < 1000) {
    return `${integerNum}.${decimalNum}`
  }
  const list = []
  while (integerNum.length > 3) {
    // 倒序切割
    list.unshift(integerNum.slice(-3))
    integerNum = integerNum.slice(0, -3)
  }
  // 处理剩余长度
  list.unshift(integerNum)
  return `${list.join(',')}.${decimalNum}`
}


export const payTypeFn = () => new Map([['1', '微信'], ['2', '支付宝'], ['3', '现金'], ['4', '刷卡']])

/***
 * @description 获取当前月的第一天和最后一天日期
 * */
//当前月第一天
export const getFirstDay = (date) => {
  var y = new Date(date).getFullYear(); //获取年份
  var m = new Date(date).getMonth() + 1; //获取月份
  var d = '01';
  m = m < 10 ? '0' + m : m; //月份补 0

  return [y, m, d].join("-")
}
//当前月最后一天
export const getLastDay = (date) => {
  var y = new Date(date).getFullYear(); //获取年份
  var m = new Date(date).getMonth() + 1; //获取月份
  var d = new Date(y, m, 0).getDate(); //获取当月最后一日
  m = m < 10 ? '0' + m : m; //月份补 0
  d = d < 10 ? '0' + d : d; //日数补 0

  return [y, m, d].join("-")
}

export const defaultAuthority = () => [{ "name": "新建录单", "id": "1" }, { "name": "订单列表", "id": "2" }, { "name": "退单列表", "id": "3" }, { "name": "汇总统计", "id": "4" }, { "name": "财务报表", "id": "5" }, { "name": "业务报表", "id": "6" }, { "name": "人员管理", "id": "9" }, { "name": "门店管理", "id": "7" }, { "name": "订单审核（所有）", "id": "11" }, { "name": "数据管理", "id": "8" }, { "name": "产品管理", "id": "12" }, { "name": "价格管理", "id": "13" }, { "name": "超级管理员", "id": "10" }]
// 购车时间- 限制今天以后的时间不可选
export const disabledDate = (current) => {
  return current && current > moment().endOf("day");
}

const DateAdd = (interval, number, date) => {
  /* 
    *   功能:实现VBScript的DateAdd功能. 
    *   参数:interval,字符串表达式，表示要添加的时间间隔. 
    *   参数:number,数值表达式，表示要添加的时间间隔的个数. 
    *   参数:date,时间对象. 
    *   返回:新的时间对象. 
    *   var   now   =   new   Date(); 
    *   var   newDate   =   DateAdd( "d ",5,now); 
    *---------------   DateAdd(interval,number,date)   ----------------- 
    */
  switch (interval) {
    case "y": {
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "q ": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    }
    case "m ": {
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }
    case "w ": {
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    }
    case "d ": {
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
    case "h ": {
      date.setHours(date.getHours() + number);
      return date;
      break;
    }
    case "m ": {
      date.setMinutes(date.getMinutes() + number);
      return date;
      break;
    }
    case "s ": {
      date.setSeconds(date.getSeconds() + number);
      return date;
      break;
    }
    default: {
      date.setDate(d.getDate() + number);
      return date;
      break;
    }
  }
}

// var  now  =  new  Date();  
// //加五天.  
// var   newDate   =   DateAdd( "d ",5,now);  
// // alert(newDate.toLocaleDateString())  
// // //加两个月.  
// // newDate   =   DateAdd( "m ",2,now);  
// // alert(newDate.toLocaleDateString())  
// //加一年  
// newDate   =   DateAdd( "y ",1,now);  
// alert(newDate.toLocaleDateString())




// export const estimateRegistrationTime = (beginDate, endDate) => {
//   var begin = new Date()
//   if (8 - endDate > 0) {
//     var newDate = DateAdd("y", 8, begin);
//     // alert(newDate.toLocaleDateString())
//     var day = (newDate - begin) / (24 * 60 * 60 * 1000);
//     if (day >= 365 * (8 - 8)) {
//       return true;
//     } else {
//       return false;
//     }
//   } else {
//     return true;
//   }
// }


export const estimateRegistrationTime = (beginDate, endDate) => {
  var begin = new Date(beginDate).getTime();
  var end = new Date(endDate).getTime();
  var day = (end - begin) / (24 * 60 * 60 * 1000);
  if (day > 365 * 8) {
    return true;
  } else {
    return false;
  }
}


export const imgShowInfo = () => new Map([['1', '身份证正面信息'], ['3', '行驶证证件信息'], ['4', '行驶里程'], ['7', '线上支付照'], ['8', '刷卡小票照'], ['5', '车辆前照'], ['6', '车辆后照']])


export const filterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}