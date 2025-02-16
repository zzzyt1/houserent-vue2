import axios from 'axios'
import {Loading } from 'element-ui';
import jwtDecode from 'jwt-decode';
import store from './store';
import router from './router';
//加载动画
let loading;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "拼命加载中...",
    background: "rgba(0, 0, 0, .7)"
  })
}
function endLoading() {
  loading.close()
}



//请求拦截器
axios.interceptors.request.use(config => {
  //加载动画
  startLoading()
  //判断token是否过期
  const token = localStorage.getItem('mytoken'); // 从你的存储中获取 token
  if (token) {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token 已过期，你可以在这里处理 token 过期的情况，比如重新登录或者刷新 token
      console.log('Token 已过期');
      //退出登录，改变导航栏和清除登录信息
      store.commit('clearLoginInfo')
      //清除token跳转到首页
      if (router.currentRoute.path !== '/index') {
        router.push('/index');
      }
    } else {
      // Token 未过期，添加到请求头中
      config.headers.Authorization = 'token';
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

//相应拦截器
axios.interceptors.response.use(response => {
  //结束动画
  endLoading()
  return response
}, error => {
  endLoading()
  //消息提醒
  if (error.response) {
    console.log(error.response.data);
  } else {
    console.log('Error', error.message);
  }

  return Promise.reject(error)
})


export default axios