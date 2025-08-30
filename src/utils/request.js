/*
 * @Author: y
 * @Date: 2025-05-12 16:53:18
 * @LastEditors: y
 * @LastEditTime: 2025-06-10 15:58:06
 * @Description: axios请求封装
 */
import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui';

import {
  debounceLoading,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'

let loadingInstance

const instance = axios.create({
  timeout: 3000,
  headers: {
    Accept: 'application/json, text/javascript, */*',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = store.getters['user/accessToken']//获取token

    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    if (config.data) config.data = Vue.prototype.$baseLodash.pickBy(config.data, Vue.prototype.$baseLodash.identity)

    // 文件上传
    if (config.method === 'post' && config.url.includes('/upload')) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      config.headers['Content-Type'] = 'application/json'
      // if (config.method === 'post') {
      //   config.data = qs.stringify(config.data) //如果用application/x-www-form-urlencoded就需要序列化
      // }
    }

    // 公共头部
    config.headers['Accept'] = 'application/json, text/javascript, */*'
    config.headers['token'] = token

    // 需要页面 loading 的接口
    if (debounceLoading.some((item) => config.url.includes(item))) loadingInstance = Vue.prototype.$baseLoading()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(response => {
  if (loadingInstance) loadingInstance.close()
  let _status = Number(response.data.status);//接口返回的状态码
  let _notice = "";//消息提示
  switch (_status) {
    case 201://错误
      if (typeof response.data == "object") {
        _notice = response.data.msg;
      } else if (typeof response.data == "string") {
        _notice = response.data;
      }
      break
    case 202://登录失效
      _notice = response.data.msg;
      store.dispatch('user/resetAccessToken').catch(() => { })
      location.reload()
      break
    case 404://找不到页面
      router.push({ path: '/404' }).catch(() => { })
      break
    case 401:
      router.push({ path: '/401' }).catch(() => { })
      break
    case 500://服务器错误
      router.push({ path: '/500' }).catch(() => { })
      break
  }
  if (_notice) {
    Message.closeAll();
    Message({
      message: _notice,
      type: "error",
      duration: 1500,
      offset: 40
    });
  }
  return response.data;
},
  (error) => {
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(error);
  }
)

export default instance
