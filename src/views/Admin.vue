<template>
  <div class="admin">
    <div class="side">
      <!-- default-active根据跳转的参数设置 -->
      <el-menu :default-active="$route.matched[2].path" background-color="#160b41" text-color="#fff"
        active-text-color="white" router>
        <el-menu-item index="/index/admin/info">
          <i class="el-icon-user"></i>
          <span slot="title">个人信息</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/house" v-if="$store.getters.getUserInfo.role !== 'customer'">
          <i class="el-icon-document"></i>
          <span slot="title">房源管理</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/order">
          <i class="el-icon-s-platform"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/user" v-if="$store.getters.getUserInfo.role === 'admin'">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/feedback" v-if="$store.getters.getUserInfo.role === 'admin'">
          <i class="el-icon-question"></i>
          <span slot="title">反馈管理</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/news" v-if="$store.getters.getUserInfo.role === 'admin'">
          <i class="el-icon-news"></i>
          <span slot="title">房屋资讯</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/home" v-if="$store.getters.getUserInfo.role === 'customer'">
          <i class="el-icon-s-home"></i>
          <span slot="title">我的家</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/collect" v-if="$store.getters.getUserInfo.role === 'customer'">
          <i class="el-icon-collection-tag"></i>
          <span slot="title">我的收藏</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/release" v-if="$store.getters.getUserInfo.role !== 'customer'">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布出租</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/myfeedback" v-if="$store.getters.getUserInfo.role !== 'admin'">
          <i class="el-icon-question"></i>
          <span slot="title">我的反馈</span>
        </el-menu-item>
        <el-menu-item index="/index/admin/password">
          <i class="el-icon-unlock"></i>
          <span slot="title">密码修改</span>
        </el-menu-item>
        <el-menu-item index="/index" @click="exit">
          <i class="el-icon-switch-button"></i>
          <span slot="title">退出登录</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    exit() {
      //退出登录，改变导航栏和清除登录信息
      this.$store.commit('clearLoginInfo')
    }
  }
}
</script>

<style scoped>
.admin {
  display: flex;
}

.admin .side {
  position: fixed;
  left: 0;
  top: 70px;
  z-index: 999;
  width: 400px;
  height: 100vh;
  background-color: #160b41;
}

.el-menu-item {
  width: 400px;
}

.el-menu-item.is-active {
  background-color: #4b5fff !important;
}

.main {
  width: 100%;
  margin-left: 400px;
  min-width: 1503px;
}
</style>