<template>
  <div>
    <!-- 注册和登录的弹窗 -->
    <div class="login">
      <el-drawer title="登录" :visible.sync="$store.getters.getLoginDialog" size="30%" :before-close="handleClose1"
        :wrapperClosable="false">
        <el-form class="position" :model="logAccount" :rules="rules" ref="logAccount" label-width="60px"
          :label-position="'top'">
          <el-form-item prop="user" label="账号">
            <el-input v-model="logAccount.user" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input placeholder="请输入密码" v-model="logAccount.password" show-password
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-button type="primary" @click="login" style="width: 540px;">登 录</el-button>
        </el-form>
      </el-drawer>
    </div>
    <div class="register">
      <el-drawer title="注册" :visible.sync="$store.getters.getRegisterDialog" width="30%" center
        :before-close="handleClose2" :wrapperClosable="false">
        <el-form class="position" :model="regAccount" :rules="rules" ref="regAccount" label-width="80px"
          :label-position="'top'">
          <el-form-item prop="user" label="账号">
            <el-input v-model="regAccount.user" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input placeholder="请输入密码" v-model="regAccount.password" show-password
              prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="姓名">
            <el-input v-model="regAccount.name" placeholder="请输入姓名" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="电子邮箱">
            <el-input v-model="regAccount.email" placeholder="请输入电子邮箱" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="regAccount.phone" placeholder="请输入手机号" prefix-icon="el-icon-phone"></el-input>
          </el-form-item>
          <el-form-item prop="role" label="身份">
            <el-select v-model="regAccount.role" placeholder="请选择身份" style="width: 540px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="register" style="width: 540px;">创 建 账 号</el-button>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //账号信息
      logAccount: {
        user: '',
        password: ''
      },
      regAccount: {
        name: '',
        email: '',
        phone: '',
        user: '',
        password: '',
        role: ''
      },
      //身份选择
      options: [{
        value: 'owner',
        label: '房东'
      }, {
        value: 'customer',
        label: '租客'
      }],
      //表单验证
      rules: {
        user: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]*$/, message: '只能输入英文字符和数字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 26, message: '长度在 6 到 26 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为11位', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        role: [
          { required: true, message: '请选择身份', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    // 抽屉里的登录
    login() {
      this.$refs['logAccount'].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$axios.post('/api/user/login', this.logAccount)
          if (res.status !== 200) return this.$message.error(res.message)
          this.$message.success('登录成功')
          this.$refs['logAccount'].resetFields();
          this.$store.commit('setLoginInfo', res) //把token存入vuex中
          await this.$store.dispatch('logInit', res.id)//获取用户信息
          await this.$store.dispatch('collectInit', res.id)//获取收藏表
          this.$store.commit('setShowNav', false)//改变导航栏
          this.$store.commit('setLoginDialog', false)
          if (!this.$store.getters.getUserInfo?.idcard) {
            return this.$alert('个人信息未完善', '提示', {
              confirmButtonText: '去完善',
              callback: action => {
                this.$router.push({ path: '/index/admin/info' })
              }
            });
          }
        }
      });
    },
    //抽屉里的创建账号
    register() {
      this.$refs['regAccount'].validate(async (valid) => {
        if (valid) {
          if (valid) {
            const { data: res } = await this.$axios.post('/api/user/register', this.regAccount)
            if (res.status !== 200) return this.$message.error(res.message)
            this.$message.success('注册成功')
            this.$refs['regAccount'].resetFields();
            this.$store.commit('setRegisterDialog', false)
          }
        }
      });
    },
    //抽屉关闭
    handleClose1() {
      this.$refs['logAccount'].resetFields();
      this.$store.commit('setLoginDialog', false)
    },
    handleClose2() {
      this.$refs['regAccount'].resetFields();
      this.$store.commit('setRegisterDialog', false)
    },

  }
}
</script>

<style scoped>
.position {
  padding: 20px;
}
</style>