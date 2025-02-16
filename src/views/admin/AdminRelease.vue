<template>
  <div class="adminrelease">
    <div class="adminmsg">
      <h2>基本信息</h2>
      <el-form :inline="true" :model="form" :label-position="'top'" :rules="rules" ref="ruleForm">
        <el-form-item label="出租类型" prop="rentType">
          <el-select v-model="form.rentType" class="inp">
            <el-option label="整租" value="whole"></el-option>
            <el-option label="合租" value="share"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月租金" class="inp" prop="monthRent">
          <el-input v-model="form.monthRent"></el-input>
        </el-form-item>
        <el-form-item label="所属城市" prop="city">
          <el-select v-model="form.city" class="inp">
            <el-option label="北京" value="北京"></el-option>
            <el-option label="上海" value="上海"></el-option>
            <el-option label="广州" value="广州"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房子标题信息" class="inp" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="房子详细地址信息" class="inp" prop="address">
          <el-input v-model="form.address" placeholder="请输入省市区门牌号"></el-input>
        </el-form-item>
        <el-form-item label="经纬度坐标，填写完详细地址信息点击获取" class="inp" prop="longitudeLatitude">
          <div @click="coordinate(form.address)">
            <el-input v-model="form.longitudeLatitude" :disabled="false"></el-input>
          </div>
        </el-form-item>
        <h2>结构信息</h2>
        <el-form-item label="房产证号" class="inp" prop="certificate">
          <el-input v-model="form.certificate"></el-input>
        </el-form-item>
        <el-form-item label="面积" class="inp" prop="area">
          <el-input v-model="form.area"></el-input>
        </el-form-item>
        <el-form-item label="朝向" class="inp" prop="direction">
          <el-select v-model="form.direction" class="inp">
            <el-option label="东" value="东"></el-option>
            <el-option label="南" value="南"></el-option>
            <el-option label="西" value="西"></el-option>
            <el-option label="北" value="北"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有空调" prop="conditioner">
          <el-select v-model="form.conditioner" class="inp">
            <el-option label="有空调" value="1"></el-option>
            <el-option label="没有空调" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卧室数量" class="inp" prop="bedroom">
          <el-input v-model="form.bedroom"></el-input>
        </el-form-item>
        <el-form-item label="客厅数量" class="inp" prop="livingroom">
          <el-input v-model="form.livingroom"></el-input>
        </el-form-item>
        <el-form-item label="厨房数量" class="inp" prop="kichen">
          <el-input v-model="form.kichen"></el-input>
        </el-form-item>
        <el-form-item label="卫生间数量" class="inp" prop="toilet">
          <el-input v-model="form.toilet"></el-input>
        </el-form-item>
        <h2>建筑信息</h2>
        <el-form-item label="建成年份" class="inp" prop="buildyear">
          <el-input v-model="form.buildyear"></el-input>
        </el-form-item>
        <el-form-item label="所在楼层" class="inp" prop="floor">
          <el-input v-model="form.floor"></el-input>
        </el-form-item>
        <el-form-item label="总楼层" class="inp" prop="maxfloor">
          <el-input v-model="form.maxfloor"></el-input>
        </el-form-item>
        <el-form-item label="是否有电梯" prop="elevator">
          <el-select v-model="form.elevator" class="inp">
            <el-option label="有电梯" value="1"></el-option>
            <el-option label="没有电梯" value="0"></el-option>
          </el-select>
        </el-form-item>
        <h2>联系人信息</h2>
        <el-form-item label="联系人姓名" class="inp" prop="contactName">
          <el-input v-model="form.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" class="inp" prop="contactPhone">
          <el-input v-model="form.contactPhone"></el-input>
        </el-form-item>
        <h2>详细描述</h2>
        <el-form-item label="房屋详细描述" style="width: 1200px;" prop="content">
          <el-input type="textarea" :rows="8" v-model="form.content">
          </el-input>
        </el-form-item>
        <h2>图片上传</h2>
        <div class="upload">
          <el-upload action="http://127.0.0.1:5000/api/user/upload" list-type="picture-card"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :limit="9"
            multiple ref="uploadRef" :file-list="fileList">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">*必须项，只能上传jpg/png文件，且不超过9张</div>
          </el-upload>
        </div>
        <br>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminRelease',
  mounted() {
    //如果是从修改页面跳转过来的，获取房子信息
    if (this.$route.query.id) {
      this.getHouseInfo()
    }
    if (!this.$store.getters.getUserInfo?.idcard) {
      return this.$alert('个人信息未完善，需完善后才能发布房源', '提示', {
        confirmButtonText: '去完善',
        callback: action => {
          this.$router.push({ path: '/index/admin/info' })
        }
      });
    }
  },
  data() {
    return {
      imgs: [],
      form: {
        ownerId: this.$store.getters.getUserInfo.id,
        rentType: '',
        monthRent: '',
        city: '',
        title: '',
        address: '',
        longitudeLatitude: '',
        certificate: '',
        area: '',
        direction: '',
        conditioner: '',
        bedroom: '',
        livingroom: '',
        kichen: '',
        toilet: '',
        buildyear: '',
        floor: '',
        maxfloor: '',
        elevator: '',
        contactName: '',
        contactPhone: '',
        content: '',
        imgUrl: []
      },
      //表单验证规则
      rules: {
        rentType: [
          { required: true, message: '请选择出租类型', trigger: 'blur' }
        ],
        monthRent: [
          { required: true, message: '请输入月租金', trigger: 'blur' },
          { pattern: /^(?:[1-9][0-9]{0,3}|10000)$/, message: '只能输入1到9999的数字', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择所属城市', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入房子标题信息', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入房子详细地址信息', trigger: 'blur' }
        ],
        longitudeLatitude: [
          { required: true, message: '请输入经纬度坐标', trigger: 'blur' }
        ],
        certificate: [
          { required: true, message: '请输入房产证号', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入面积', trigger: 'blur' },
          { pattern: /^(1[0-9]{2}|200|[1-9]?[0-9])$/, message: '只能输入1到200的数字', trigger: 'blur' }
        ],
        direction: [
          { required: true, message: '请选择朝向', trigger: 'blur' }
        ],
        conditioner: [
          { required: true, message: '请选择是否有空调', trigger: 'blur' }
        ],
        bedroom: [
          { required: true, message: '请输入卧室数量', trigger: 'blur' },
          { pattern: /^(10|[1-9])$/, message: '只能输入1到10的数字', trigger: 'blur' }
        ],
        livingroom: [
          { required: true, message: '请输入客厅数量', trigger: 'blur' },
          { pattern: /^(10|[0-9])$/, message: '只能输入0到10的数字', trigger: 'blur' }
        ],
        kichen: [
          { required: true, message: '请输入厨房数量', trigger: 'blur' },
          { pattern: /^(10|[1-9])$/, message: '只能输入1到10的数字', trigger: 'blur' }
        ],
        toilet: [
          { required: true, message: '请输入卫生间数量', trigger: 'blur' },
          { pattern: /^(10|[1-9])$/, message: '只能输入1到10的数字', trigger: 'blur' }
        ],
        buildyear: [
          { required: true, message: '请输入建成年份', trigger: 'blur' },
          { pattern: /^(19(4[5-9]|[5-9]\d)|20(0[0-9]|1[0-9]|2[0-4]))$/, message: '请输入正确年份', trigger: 'blur' }
        ],
        floor: [
          { required: true, message: '请输入所在楼层', trigger: 'blur' },
          { pattern: /^([1-9]|1[0-9]|2[0-9]|30)$/, message: '只能输入1到30的数字', trigger: 'blur' }
        ],
        maxfloor: [
          { required: true, message: '请输入总楼层', trigger: 'blur' },
          { pattern: /^([1-9]|1[0-9]|2[0-9]|30)$/, message: '只能输入1到30的数字', trigger: 'blur' }
        ],
        elevator: [
          { required: true, message: '请选择是否有电梯', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为11位', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入房屋详细描述', trigger: 'blur' }
        ]
      },
      //上传图片列表
      fileList: []
    }
  },
  methods: {
    //移除图片
    async handleRemove(file, fileList) {
      //分两种情况
      //1.新上传的图片file.response.url存在，说明是新上传的图片，直接删除
      if (file && file.response && file.response.url) {
        this.imgs = this.imgs.filter(item => item !== file.response.url)
        await this.$axios.post('/api/user/deleteimg', { url: file.response.url })
        return
      }
      //2.回流的图片只存在file.url，考虑数据库完整需删除数据库中的图片
      if (file.url && this.$route.query.id) {
        this.imgs = this.imgs.filter(item => item !== file.url)
        this.form.imgUrl = JSON.stringify(this.imgs)
        await this.$axios.post('/api/user/deleteimg', { url: file.url })
        await this.$axios.post('/api/house/edit', this.form)
        return
      }
    },
    // 清空已上传的文件列表
    clearFiles() {
      // 通过 ref 获取 Upload 组件实例
      const uploadInstance = this.$refs.uploadRef;
      // 调用 clearFiles 方法清空文件列表
      uploadInstance.clearFiles();
    },
    //上传图片成功后的回调
    async handleAvatarSuccess(res, file) {
      console.log(res);
      this.imgs.push(res.url)
    },
    //上传图片之前的验证
    beforeAvatarUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGorPNG) {
        this.$message.error('上传的图片只能是 JPG/png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 2MB!');
      }
      return isJPGorPNG && isLt2M;
    },
    //获取经纬度坐标
    async coordinate(address) {
      if (address === '') {
        return this.$message({
          type: 'error',
          message: '请输入房子详细地址信息'
        })
      }
      const { data: res } = await this.$axios.get('/mapApi/ws/geocoder/v1/', {
        params: {
          address: address,
          key: '2CYBZ-2DWKH-EELDW-WTJ6S-6H4EQ-WDFWC'
        }
      })
      if (res.status !== 0) {
        return this.$message({
          type: 'error',
          message: '请输入正确的地址信息(省市区门牌号)'
        })
      }
      this.form.longitudeLatitude = res.result.location.lat + ',' + res.result.location.lng
    },
    //发布
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (this.imgs.length === 0) {
          return this.$message({
            type: 'error',
            message: '请上传图片'
          })
        }
        //校验成功，发送请求
        if (valid) {
          this.form.imgUrl = JSON.stringify(this.imgs)
          if (this.$route.query.id) {
            const { data: res } = await this.$axios.post('/api/house/edit', this.form)
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
            this.$router.push('/index/admin/house')
          } else {
            const { data: res } = await this.$axios.post('/api/house/add', this.form)
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '发布成功'
              })
            }
          }
          //清空表单
          this.clearFiles()
          this.form = {
            ownerId: this.$store.getters.getUserInfo.id,
            rentType: '',
            monthRent: '',
            city: '',
            title: '',
            address: '',
            longitudeLatitude: '',
            certificate: '',
            area: '',
            direction: '',
            conditioner: '',
            bedroom: '',
            livingroom: '',
            kichen: '',
            toilet: '',
            buildyear: '',
            floor: '',
            maxfloor: '',
            elevator: '',
            contactName: '',
            contactPhone: '',
            content: '',
            imgUrl: []
          }
          this.imgs = []
        }
      });
    },
    //如果是从修改页面跳转过来的，获取房子信息
    async getHouseInfo() {
      const { data: res } = await this.$axios.get(`/api/house/${this.$route.query.id}`)
      if (res.status === 200) {
        this.imgs = res.data.img_url
        this.fileList = res.data.img_url.map(item => {
          return {
            name: item,
            url: item
          }
        })
        this.form = {
          id: this.$route.query.id,
          rentType: res.data.rent_type,
          monthRent: res.data.month_rent,
          city: res.data.city,
          title: res.data.title,
          address: res.data.address,
          longitudeLatitude: res.data.longitude_latitude,
          certificate: res.data.certificate,
          area: res.data.area,
          direction: res.data.direction,
          conditioner: res.data.conditioner,
          bedroom: res.data.bedroom,
          livingroom: res.data.livingroom,
          kichen: res.data.kichen,
          toilet: res.data.toilet,
          buildyear: res.data.buildyear,
          floor: res.data.floor,
          maxfloor: res.data.maxfloor,
          elevator: res.data.elevator,
          contactName: res.data.contact_name,
          contactPhone: res.data.contact_phone,
          content: res.data.content,
        }
      }
    }
  }
}
</script>

<style scoped>
.adminrelease {
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

.inp {
  width: 600px;
  padding-right: 10px;
}
</style>