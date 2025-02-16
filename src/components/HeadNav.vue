<template>
  <header class="headNav" v-if="this.$store.getters.getShowNav">
    <div class="left">
      <h1><router-link to="/index">租赁房源系统</router-link></h1>
      <ul>
        <li><router-link to="/index">首页</router-link></li>
        <li><router-link :to="{ path: '/index/renttype', query: { type: 'whole', nav: '1' } }">整租</router-link></li>
        <li><router-link :to="{ path: '/index/renttype', query: { type: 'share', nav: '1' } }">合租</router-link></li>
        <li><router-link to="/index/news">房屋资讯</router-link></li>
        <li><router-link to="/index/feedback">用户反馈</router-link></li>
      </ul>
    </div>
    <div class="right">
      <a href="#" @click.prevent="$store.commit('setLoginDialog', true)">
        <i class="el-icon-user-solid"></i>
        <span style="margin-left: 5px;">登录</span>
      </a>
      <el-button type="primary" icon="el-icon-right" class="btn1"
        @click="$store.commit('setRegisterDialog', true)">注册</el-button>
    </div>

  </header>
  <!-- 登录后的nav -->
  <header class="headNav" v-else>
    <div class="left">
      <h1><router-link to="/index">租赁房源系统</router-link></h1>
      <ul>
        <li><router-link to="/index">首页</router-link></li>
        <li><router-link :to="{ path: '/index/renttype', query: { type: 'whole', nav: '1' } }">整租</router-link></li>
        <li><router-link :to="{ path: '/index/renttype', query: { type: 'share', nav: '1' } }">合租</router-link></li>
        <li><router-link to="/index/news">房屋资讯</router-link></li>
        <li><router-link to="/index/feedback">用户反馈</router-link></li>
      </ul>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <a href="#" @click.prevent>
          <img :src="$store.getters.getUserInfo.avatar ? $store.getters.getUserInfo.avatar : defaultavatar">
          <span>{{ $store.getters.getUserInfo.name }} ({{ roleDisplay }})</span>
        </a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="$store.getters.getUserInfo.role !== 'admin'" icon="el-icon-user"
            command="/index/admin/info">个人信息</el-dropdown-item>
          <el-dropdown-item v-if="$store.getters.getUserInfo.role !== 'customer'" icon="el-icon-house"
            command="/index/admin/house">房源管理</el-dropdown-item>
          <el-dropdown-item v-if="$store.getters.getUserInfo.role !== 'customer'" icon="el-icon-s-order"
            command="/index/admin/order">订单管理</el-dropdown-item>
          <el-dropdown-item v-if="$store.getters.getUserInfo.role === 'admin'" icon="el-icon-news"
            command="/index/admin/news">资讯管理</el-dropdown-item>
          <el-dropdown-item v-if="$store.getters.getUserInfo.role === 'customer'" icon="el-icon-s-home"
            command="/index/admin/home">我的家</el-dropdown-item>
          <el-dropdown-item v-if="$store.getters.getUserInfo.role === 'customer'" icon="el-icon-collection"
            command="/index/admin/collect">我的收藏</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" command="/index">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>

export default {
  name: 'headNav',
  data() {
    return {
      //默认头像
      defaultavatar: require("@/assets/user-default.png"),
    };
  },
  methods: {
    //下拉菜单 判断后跳转路由
    handleCommand(command) {
      if (command == '/index') {
        //不是首页就跳转
        if (this.$route.path !== command) {
          this.$router.push(`${command}`);
        }
        //退出登录，改变导航栏和清除登录信息
        this.$store.commit('clearLoginInfo')
      } else {
        //目标路由与当前路由相同，则刷新页面
        if (this.$route.path == command) {
          location.reload();
        } else {
          this.$router.push(`${command}`);
        }
      }
    },
  },
  computed: {
    //角色显示
    roleDisplay() {
      switch (this.$store.getters.getUserInfo.role) {
        case 'admin':
          return '管理员';
        case 'owner':
          return '房东';
        case 'customer':
          return '租客';
        default:
          return '';
      }
    },
  }
}
</script>

<style scoped>
.headNav {
  width: 100%;
  height: 70px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 310px;

}

.left {
  display: flex;
  align-items: center;
  list-style: none;
}
.left h1{
  font-size: 25px;
  font-weight: 600;
  color: #666565;
}
.left ul {
  display: flex;
  align-items: center;
  margin-left: 50px;
  font-weight: 600;
}

.left ul li {
  margin-left: 30px;
}

a {
  text-decoration: none;
  color: inherit;
}

.left img {
  width: 150px;
  height: 50px;
}

.btn1 {
  color: white;
  background-color: #160b41;
  border: none;
  margin-left: 20px;
}

.right {
  display: flex;
  align-items: center;

}

.right a {
  color: #4696ef;
}

/* else的css */
.right img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
}

.right a {
  display: flex;
  align-items: center;
  color: #777;
  font-weight: 600;
}
</style>