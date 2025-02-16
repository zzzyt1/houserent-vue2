import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
Vue.use(Vuex)
// console.log(this.$store.getters.getId);//获取vuex中的id 
// this.$store.commit(setLoginInfo,{}) //修改vuex中的登录信息
export default new Vuex.Store({
  //存放数据
  state() {
    return {
      // 从本地存储中获取
      token: localStorage.getItem('mytoken') || null,
      showNav: localStorage.getItem('showNav') ? false : true,
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
      collectList: JSON.parse(localStorage.getItem('collectList')) || [],
      loginDialog: false,
      registerDialog: false
    }
  },
  //获取数据
  getters: {
    getToken(state) {
      return state.token
    },
    getShowNav(state) {
      return state.showNav
    },
    getUserInfo(state) {
      return state.userInfo
    },
    getLoginDialog(state) {
      return state.loginDialog //获取登录弹窗状态
    },
    getRegisterDialog(state) {
      return state.registerDialog //获取注册弹窗状态
    },
    getcollectList(state) {
      return state.collectList
    }
  },
  //修改数据
  mutations: {
    //设置登录信息
    setLoginInfo(state, payload) {
      state.token = payload.token;
      localStorage.setItem('mytoken', payload.token);
    },
    //设置导航栏显示状态
    setShowNav(state, payload) {
      state.showNav = payload
      // 将 showNav 的状态保存到本地存储
      localStorage.setItem('showNav', payload);
    },
    //清除登录信息
    clearLoginInfo(state) {
      state.token = null;
      state.showNav = true;
      state.userInfo = null;
      state.collectList = [];
      localStorage.removeItem('mytoken');
      localStorage.removeItem('showNav');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('collectList');
    },
    //设置用户信息
    setUserInfo(state, payload) {
      state.userInfo = payload;
      localStorage.setItem('userInfo', JSON.stringify(payload));
    },
    //设置登录弹窗
    setLoginDialog(state, payload) {
      state.loginDialog = payload;
    },
    //设置注册弹窗
    setRegisterDialog(state, payload) {
      state.registerDialog = payload;
    },
    //设置收藏表
    setcollectList(state, payload) {
      state.collectList = payload;
      localStorage.setItem('collectList', JSON.stringify(payload));
    }
  },
  //异步操作
  actions: {
    //获取当前用户信息
    async logInit({ commit, state }, id) {
      let { data: res } = await axios.get(`/api/user/info/${id}`)
      if (res.status == 200) {
        commit('setUserInfo', res.data);
      }
    },
    //获取当前用户的收藏表
    async collectInit({ commit, state }, id) {
      let { data: res } = await axios.get(`/api/collect/list/${id}`)
      if (res.status == 200) {
        let list = res.data.map(item => ({ id: item.id, house_id: item.house_id }));
        commit('setcollectList', list);
      }
    },
  },
  //模块化
  modules: {
  }
})
