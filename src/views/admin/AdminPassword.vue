<template>
  <div class="adminpassword">
    <div class="adminmsg">
      <h2>修改密码</h2>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" :label-position="'top'">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error('密码长度应在 6 到 18 位字符之间'));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //如果校验成功
        if (valid) {
          const msg = {
            id: this.$store.getters.getUserInfo.id,
            password: this.ruleForm.pass
          }
          let { data: res } = await this.$axios.post('/api/user/updatepwd', msg)
          if (res.status == '200') {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            });
          }
          this.$refs[formName].resetFields();
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}

</script>

<style scoped>
.adminpassword {
  width: 100%;
  min-height: 821px;
  background-color: #f8f6f8;
  padding: 30px;
}

.adminmsg {
  width: 100%;

  background-color: #fff;
  border-radius: 10px;
  padding: 20px 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.adminmsg h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>