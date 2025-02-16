<template>
  <div class="index">
    <!-- 顶部导航 -->
    <div class="header">
      <HeadNav />
    </div>
    <!-- 主体内容 -->
    <div class="body">
      <router-view />
    </div>
    <!-- 底部 -->
    <div class="footer">
      <Foot />
    </div>
    <!-- 登录注册 -->
    <LoginOrRegister />
  </div>
</template>

<script>
import HeadNav from '@/components/HeadNav.vue'
import Foot from '@/components/Footer.vue'
import LoginOrRegister from '@/components/Login&Register.vue'
export default {
  name: 'index',
  components: {
    HeadNav,
    Foot,
    LoginOrRegister
  },

}
</script>

<style scoped>
.header {
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  min-width: 1400px;
  max-width: 1903px;
}

.body {
  padding-top: 70px;
  max-width: 1903px;
}
</style>