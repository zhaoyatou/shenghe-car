import request from '@/utils/request';
import qs from 'qs';
/**
 * @description 获取用户列表
 * @param {string}  role
 * @param {string}  username
 * @param {string}  startTime
 * @param {string}  endTime
 * @param {string}  page
 * @param {string}  size
 * @returns {Object} table
 */

export const getVerificationCode = (params) => {
  return request.post('/getVerificationCode', qs.stringify(params));
}


// 登录
// http://47.94.241.160/api/login?userName=wk&password=123&verificationCode=123

export const login = (params) => {
  return request.post('/login', qs.stringify(params));
}


// store/userStore 用户的所属门店
export const userStore = (params) => {
  return request.post('/store/userStore', qs.stringify(params));
}

// 用户的车辆品牌，车系，车型接口
// car/listByStoreId?storeId=1
export const listByStoreId = (params) => {
  return request.post('/car/listByStoreId', qs.stringify(params));
}

// 列表查询 extend/listExtendOrder
/**
 * params Object
 * 参数json
{
    "pageNum": "1",
    "pageSize": "10",
    "province":"北京市",
    "city": "北京市",
    "operStatus": "2",
    "contractNo": "ZQ16519218412639923",
    "startTime": "",
    "storeId": "1",
    "userId": "",
    "customerName": "",
    "useName": "",
    "carLicenseNum": "",
    "carLicense": "",
    "carCode": "",
    "saleStoreType":"",
    "saleStoreName":"",
    "projectId":""

}
 * **/
export const listExtendOrder = (params) => {
  return request.post('/extend/listExtendOrder', params);
}


// 保存接口地址

/**
 * @param Object
 * @url extend/saveExtend
 * 
 * **/

export const saveExtend = (params) => {
  return request.post('/extend/saveExtend', params);
}


// oss/uploadFiles

export const uploadFiles = (params) => {
  return request.post('/oss/uploadFile', params);
}

// 延保项目
// project/getByStoreIdAndCarId?storeId=1&carId=1
export const getByStoreIdAndCarId = (params) => {
  return request.post('/project/getByStoreIdAndCarId', params);
}


/***
 * @doc 计算延保价格
 * @url extend/calPrice
 * @param {
    "projectId":1,
    "carId":1,
    //购车时间
    "carBuyTime":"2018-04-20",
    //行驶里程
    "carMileage":100
}
 * 
 * **/
export const calPrice = (params) => {
  return request.post('/extend/calPrice', params);
}

/***
 * url：  extend/detailExtendOrder?orderNo=  这个是详情的
 * */
export const detailExtendOrder = (params) => {
  return request.post('/extend/detailExtendOrder', qs.stringify(params));
}

/***
 * url：订单列表删除 extend/del?orderNo=
 * */
export const del = (params) => {
  return request.post('/extend/del', params);
}

/***
 * url：审核通过 extend/approved?orderNo=
 * */
export const approved = (params) => {
  return request.post('/extend/approved', params);
}
/***
 * url：订单列表-查询条件 延保项目（下拉框） 查询全部的
 * */
export const listAll = (params) => {
  return request.post('/project/listAll', params);
}
/***
 * url：新建-》驳回 extend/cancel?orderNo=&body=
 * */

export const cancel = (params) => {
  return request.post('/extend/cancel', qs.stringify(params));
}

/***
 * @退单列表接口（相关操作）
 refund/refundOrder  
（body里是json格式） 
{
    "orderNo":"C16527748360523137",
    "reason":"退单"
}
 * **/

export const refundOrder = (params) => {
  return request.post('/refund/refundOrder', params);
}

/***
 * @url refund/refundList
 * @退单列表
 * **/
export const refundList = (params) => {
  return request.post('/refund/refundList', params);
}

/***
 * @url refund/calRefund  
 * @撤销回退
 * **/
export const calRefund = (params) => {
  return request.post('/refund/calRefund', params);
}

export const exportListRefund = (params) => {
  return request.post('/refund/exportListRefund', params);
}


/***
 * @url extend/exportListExtend 
 * @param  { type } 1是选中导出  2为全部导出
 * {
  "type": 1,
  "orderNos": ["", ""]  //部分导出的时候需要，全部不需要
}
 * @导出
 * **/
export const exportListExtend = (params) => {
  return request.post('/extend/exportListExtend', params);
}

/***
 * @url statistics/exportFinance
 * @param  { type } 这个不是财务导出
 * **/
export const exportFinance = (params) => {
  return request.post('/statistics/exportFinance', params);
}

/***
 * @url message/sendEmail?email=
 * @param  { type } 重新发送邮件
 * **/
export const sendEmail = (params) => {
  return request.post('/message/sendEmail', qs.stringify(params));
}

/***
 * @description  汇总统计
 * @url http://localhost:8080/statistics/collect
 * **/

export const collect = (params) => {
  return request.post('/statistics/collect', params);
}
/***
 * @description  查询全部经办人员的接口 暂时可以临时不给 经办人员全部接口
 * @url extend/listCreateUser?name =
 * **/

export const listCreateUser = (params) => {
  return request.post('/extend/listCreateUser', params);
}

/***
 * @description  统计详情
 * @url /statistics/collectDetail
 * **/

export const collectDetail = (params) => {
  return request.post('/statistics/collectDetail', params);
}

/***
 * @description  业务
 * @url /statistics/business
 * **/

export const business = (params) => {
  return request.post('/statistics/business', params);
}

/***
 * @description  财务 
 * @url /statistics/finance
 * **/

export const finance = (params) => {
  return request.post('/statistics/finance', params);
}

/***
 * 系统配置
 * @description 用户列表
 * @url user/listAll?pageNum=1&pageSize=10
 * 
 * */
export const userListAll = (params) => {
  return request.post('/user/listAll', qs.stringify(params));
}

/***
 * 系统配置
 * @description 用户列表/新增修改
 * @url user/saveUser
 * 
 * */
export const systemSaveUser = (params) => {
  return request.post('/user/saveUser', params);
}

/***
 * 系统配置
 * @description 用户列表/上级领导
 * @url user/listLeader
 * 
 * */
export const systemListLeader = (params) => {
  return request.post('/user/listLeader', (params));
}
/***
 * 系统配置
 * @description 用户列表/删除
 * @url user/listLeader
 * 
 * */
export const systedel = (params) => {
  return request.post('/user/del', params);
}


/***
 * 系统配置
 * @description 门店列表
 * @url store/listStore
 * 
 * */
export const listStore = (params) => {
  return request.post('/store/listStore', params);
}


/***
 * 系统配置
 * @description  门店关联所有的品牌
 * @url /store/storeCarBrand
 * 
 * */
export const storeCarBrand = (params) => {
  return request.post('/store/storeCarBrand', params);
}


/***
 * 系统配置
 * @description   门店关联所有的项目
 * @url store/storeProject
 * @param {
  "storeId":"1"
}  
 * 
 * */
export const storeProject = (params) => {
  return request.post('/store/storeProject', params);
}



/***
 * 系统配置
 * @description   导出是
 * @url store/exportStore
 * @param {
  "storeId":"1"
}  
 * */
export const exportStore = (params) => {
  return request.post('/store/exportStore', params);
}


/***
 * 系统配置
 * @description   保存
 * @url store/saveStore
 * @param {
  "storeId":"1"
}  
 * */
export const saveStore = (params) => {
  return request.post('/store/saveStore ', params);
}

/***
 * 系统配置
 * @description   删除
 * @url store/delStore
 * @param {
  "storeId":"1"
}  
 * */
export const delStore = (params) => {
  return request.post('/store/delStore ', params);
}


// ---------------------------------------------产品管理----------------------------
/***
 * 系统配置
 * @description   项目列表
 * @url project/allData
 * @param {
  "storeId":"1"
}  
 * */
export const productListAll = (params) => {
  return request.post('/project/allData', params);
}


/***
 * 系统配置
 * @description   保存修改
 * @url project/saveProject
 * @param {
  "storeId":"1"
}  
 * */
export const saveproduct = (params) => {
  return request.post('/project/saveProject', params);
}


/***
 * 系统配置
 * @description   删除
 * @url project/delProject
 * @param {
  "storeId":"1"
}  
 * */
export const delProject = (params) => {
  return request.post('/project/delProject', params);
}


/***
 * 系统配置
 * @description   价格管理
 * @url projectCar/listProjectCar
 * @param {
  "storeId":"1"
}  
 * */
export const listProjectCar = (params) => {
  return request.post('/projectCar/listProjectCar', params);
}

/***
 * 系统配置
 * @description   价格管理-删除
 * @url projectCar/delProjectCar
 * @param {
  "storeId":"1"
}  
 * */
export const delProjectCar = (params) => {
  return request.post('/projectCar/delProjectCar', params);
}


/***
 * 系统配置
 * @description   价格管理-   这个是不带分页的，所有品牌车系车型的接口
 * @url car/llistAll
 * @param {
  "storeId":"1"
}  
 * */
export const llistAll = (params) => {
  return request.post('/car/listAll', params);
}

/***
 * 系统配置
 * @description   保存修改
 * @url projectCar/saveProjectCar
 * @param {
  "storeId":"1"
}  
 * */
export const saveProjectCar = (params) => {
  return request.post('/projectCar/saveProjectCar', params);
}



/***
 * 系统配置
 * @description  关联门店 
 * @url user/userSelectStore
 * @param {
  "storeId":"1"
}  
 * */
export const userSelectStore = (params) => {
  return request.post('/user/userSelectStore', params);
}




/***
 * 系统配置|价格管理|导出参数 
 * @description  导出参数 
 * @url projectCar/exportProjectCar
 * @param { "projectId": "", "prodYear": "" }
 * */
export const exportProjectCar = (params) => {
  return request.post('/projectCar/exportProjectCar', params);
}



/***
 * 系统配置|价格管理|导入
 * @description  导入 
 * @url user/userSelectStore
 * @param {
  "storeId":"1"
}  
 * */
export const importProjectCar = (params) => {
  return request.post('/projectCar/importProjectCar', params);
}


/***
 * 系统配置|数据管理|导入
 * @description  导入 
 * @url user/userSelectStore
 * @param {
  "storeId":"1"
}  
 * */
export const importProjectData = (params) => {
  return request.post('/car/importCar', params);
}
// --------------------------------------------数据管理----------------------------


/***
 * 
 * @description 系统配置|数据管理|列表
 * @url user/userSelectStore
 * @param {
      "pageNum":"1",
        "pageSize":"10",
      "carBrand":"",
      "content":""
    }  
 * */
export const listAllByName = (params) => {
  return request.post('/car/listAllByName', params);
}


/***
 * 
 * @description 系统配置|数据管理| 品牌列表
 * @url car/listCarBrand
 * @param {}  
 * */
export const listCarBrand = (params) => {
  return request.post('/car/listCarBrand', params);
}


/***
 * 
 * @description 系统配置|数据管理| 保存
 * @url car/saveCar
 * @param  {
       
            "carBrand": "凯德拉克",
            "carSeries": "XXXX",
            "carModel": "2022款 320i",
            "carType": "燃油",
            "carPeriod": 4,
            "carMileage": 1000000,
            "carCapacity": "1000",
            "userId": 1,
            "createTime": null,
            "updateTime": "2022-05-11T00:54:31.000+0000",
            "selectStatus": null
        }  
 * */
export const saveCar = (params) => {
  return request.post('/car/saveCar', params);
}

/***
 * 
 * @description 系统配置|数据管理| 删除
 * @url car/delCar
 * @param  {ID}
 * */
export const delCar = (params) => {
  return request.post('/car/delCar', params);
}


// 这个地方接口换一下，

/***
 * 
 * @description 获取门店关联的所有品牌
 * @url /car/listCarBrandByStoreId
 * @param  {"storeId":""} 
 * */
export const listCarBrandByStoreId = (params) => {
  return request.post('/car/listCarBrandByStoreId', params);
}


/***
 * 
 * @description 获取门店关联的所有车系
 * @url /car/listCarSeriesByCarBrand
 * @param  { "storeId": "", "carBrand": "" } 
 * */
export const listCarSeriesByCarBrand = (params) => {
  return request.post('/car/listCarSeriesByCarBrand', params);
}


/***
 * 
 * @description 获取门店关联的所有车辆信息
 * @url /car/listCarModelByCarSeries
 * @param  { "storeId": "", "carBrand": "", "carSeries": "" } 
 * */
export const listCarModelByCarSeries = (params) => {
  return request.post('/car/listCarModelByCarSeries', params);
}

/***
 * 
 * @description 下载合同接口
 * @url /contract/downLoadFile
 * @param  ?orderNo=C16533105189669622
 * */
export const contractdownLoadFile = (params) => {
  return request.get('/contract/downLoadFile', params);
}

