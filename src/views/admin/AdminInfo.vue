<template>
  <div class="admininfo">
    <div class="adminmsg">
      <h2>个人信息</h2>
      <el-form :inline="true" :model="form" :rules="rules" ref="infoForm" :label-position="'top'">
        <el-form-item label="账号" class="inp">
          <el-input v-model="form.user" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" class="inp" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" class="inp" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="inp" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" class="inp" prop="idcard">
          <el-input v-model="form.idcard"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" class="inp">
            <el-option label="男" value="man"></el-option>
            <el-option label="女" value="woman"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业" class="inp">
          <el-input v-model="form.job"></el-input>
        </el-form-item>
        <el-form-item label="爱好" class="inp">
          <el-input v-model="form.hobby"></el-input>
        </el-form-item>
        <el-form-item label="个人说明" class="inp">
          <el-input type="textarea" :rows="7" v-model="form.desc">
          </el-input>
        </el-form-item>
        <el-form-item label="上传头像">
          <el-upload class="avatar-uploader" action="http://127.0.0.1:5000/api/user/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> <br>
        <el-form-item>
          <el-button type="primary" @click="setInfo" style="width: 110px;">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    //拷贝用户信息
    this.form = { ...this.$store.getters.getUserInfo }
    
  },
  data() {
    return {
      form: {},
      //上传头像后的url
      imageUrl: '',
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ],
        idcard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码', trigger: ['blur', 'change'] }
        ],
      }
    }
  },
  methods: {
    //修改个人信息
    async setInfo() {
      this.$refs['infoForm'].validate(async (valid) => {
        if (valid) {
          //要更改的信息
          const msg = {
            id: this.$store.getters.getUserInfo.id,
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            idcard: this.form.idcard,
            sex: this.form.sex,
            job: this.form.job,
            hobby: this.form.hobby,
            desc: this.form.desc,
            avatar: this.imageUrl
          }
          const { data: res } = await this.$axios.post('/api/user/updateinfo', msg)
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          }
          //更新用户信息
          this.$store.dispatch('logInit', msg.id)
          this.imageUrl = ''
        }
      });
    },
    //上传头像成功后的回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.url
      console.log(res.url);
    },
    //上传头像之前的验证
    beforeAvatarUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGorPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPGorPNG && isLt2M;
    }
  }
}

</script>

<style scoped>
.admininfo {
  width: 100%;
  min-height: 821px;
  background-color: #f8f6f8;
  padding: 30px;
}

.adminmsg {
  width: 100%;
  height: 761px;
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

.inp {
  width: 600px;
  padding-right: 10px;
  margin-bottom: 10px;
}

.avatar-uploader,
el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 158px;
  height: 158px;
}

.avatar-uploader:hover,
el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 158px;
  height: 158px;
  line-height: 158px;
  text-align: center;
}

.avatar {
  width: 158px;
  height: 158px;
  display: block;
}
</style>