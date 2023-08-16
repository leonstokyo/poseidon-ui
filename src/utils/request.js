import axios from 'axios';
import Vue from 'vue';
import { SuccessCode } from '@/constant/httpCode';
import { noLoginErrorCode, ApiSuccessCode } from '@/constant/apiCode';
import { messageDuration, requestTimeout, contentType } from '@/config/settings.js';
import { Message } from 'element-ui';
import router from '@/router';
axios.defaults.withCredentials = true;
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeout,
  validateStatus: function(status) {
    // 更改状态码 不怎么用
    return status < 500; // 状态码在大于或等于500时才会 reject
  },
  headers: {
    'Content-Type': contentType,
  },
});
service.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const errorMsg = (message) => {
  return Message({
    message: message,
    type: 'error',
    duration: messageDuration,
  });
};

service.interceptors.response.use(
  (response) => {
    const { data } = response;
    const { code, msg } = data;
    const status = response.status;
    if (status !== SuccessCode && code !== ApiSuccessCode) {
      console.log('要在这个地方取消loading');
      switch (code) {
        case noLoginErrorCode:
          Vue.cookie.set('is_login', 0);
          errorMsg(msg);
          router.push({
            path: '/login',
          });
          break;
        default:
          errorMsg(msg || `后端接口${code}异常`);
          break;
      }
      return Promise.reject({ code, msg } || 'Error');
    } else {
      return data;
    }
  },
  (error) => {
    /*网络连接过程异常处理*/
    let { message } = error;
    switch (message) {
      case 'Network Error':
        message = '后端接口连接异常';
        break;
      case 'timeout':
        message = '后端接口请求超时';
        break;
      case 'Request failed with status code':
        message = '后端接口' + message.substr(message.length - 3) + '异常';
        break;
    }
    errorMsg(message || '后端接口未知异常');
    return Promise.reject(error);
  }
);
export default service;
