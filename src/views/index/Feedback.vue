<template>
  <div class="feedback">
    <div class="title">
      <p>用户反馈</p>
      <h1>快速反馈，联系我们</h1>
    </div>
    <div class="msg">
      <div class="left">
        <p>填写你的反馈信息</p>
        <el-form :inline="true" :rules="rules" ref="fbForm" :model="formMsg">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formMsg.name" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="formMsg.email" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="formMsg.title" style="width: 580px;"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="formMsg.content" :rows="6" style="width: 580px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交反馈</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <div class="addr">
          <i class="el-icon-location-outline"></i>
          <h2>公司地址位置</h2>
          <p>广州市越秀区中山五路125号雨霆大厦23楼庄天地产</p>
        </div>
        <div class="call">
          <i class="el-icon-message"></i>
          <h2>联系我们</h2>
          <p>contact@abcd.com</p>
          <p>400-123-789456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Feedback',
  data() {
    return {
      //默认值为用户信息中的name和email
      formMsg: {
        name: this.$store.getters.getUserInfo?.name || '',
        email: this.$store.getters.getUserInfo?.email || '',
        title: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitForm() {
      //获取用户id
      const token = localStorage.getItem('mytoken');
      if (!token) {
        this.$message({
          message: '请先登录',
          type: 'warning'
        });
        return;
      }
      this.$refs['fbForm'].validate(async (valid) => {
        if (valid) {
          this.formMsg.id = this.$store.getters.getUserInfo.id;
          const { data: res } = await this.$axios.post('/api/feedback/add', this.formMsg);
          if (res.status == '200') {
            this.$message({
              message: '反馈成功',
              type: 'success'
            });
          }
          this.resetForm();
        }
      });
    },
    resetForm() {
      this.$refs['fbForm'].resetFields();
      this.formMsg = {
        name: this.$store.getters.getUserInfo?.name || '',
        email: this.$store.getters.getUserInfo?.email || '',
        title: '',
        content: ''
      };
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

.feedback {
  min-width: 1903px;
  min-height: 821px;
  background-color: #f8f9fe;

}

.title {
  height: 300px;
  padding: 0 350px;
  background-image: url(@/assets/background3.jpg);
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  ;
}

.title p {
  padding-top: 150px;
  padding-bottom: 20px;
}

.title h1 {
  font-size: 40px;
  font-weight: 600;
}

.msg {
  display: flex;
  justify-content: space-between;
  padding: 60px 350px 0;

}

.msg .left {
  width: 720px;
  background-color: white;
  padding: 15px 20px;
}

.left p {
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 20px;
}

.msg .right {
  width: 455px;
}

.right .addr,
.right .call {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: white;
  line-height: 30px;
  color: #777;
  height: 200px;
}

.right i {
  font-size: 30px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7586fb;
  background-color: #edeffe;
  border-radius: 50%;
  margin-bottom: 20px;
}

.right h2 {
  font-size: 20px;
  font-weight: 600;
  color: black;
}
</style>