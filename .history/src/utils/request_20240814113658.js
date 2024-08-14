import store from '@/store';
import { message } from 'ant-design-vue';
import axios from 'axios';

const service = axios.create({
  withCredentials: false,
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000 // 请求超时时间
});

//请求
service.interceptors.request.use(config => {
	// config.baseURL = getCache('SYSTEMURL');
	// console.log(getCache('SYSTEMURL'))
  if (store.getters.token) {
	  // console.log(store)
    config.headers['token'] = store.getters.token;
	
    // config.headers['Content-Type'] = "application/json;charset=UTF-8"
    // config.headers['Access-Control-Allow-Origin'] = "*"
    // config.headers = {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
  }
  return config;
});

const removeUrl = ['getVerificationCode']

//响应
service.interceptors.response.use(response => {
  const data = response;
  const isRemouveUrl = removeUrl.some((item) => {
    return data.config.url.includes(item)
  })
  if ((isRemouveUrl && data.status === 200) || data.data.code === 200) {
    return Promise.resolve(data);
  } else {
    message.error(data.message || data.data.message || '');
    return Promise.reject(data);
  }
});

let http = {};

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

http.get = function (url, params = null) {
  return new Promise((resolve, reject) => {
    service
      .get(url, { params })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

http.post = function (url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export default http;
