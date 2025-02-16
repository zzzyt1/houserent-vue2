<template>
  <div class="detail">
    <div class="title">
      <div class="price">
        <span>¥ {{ house.month_rent }}/月</span>
      </div>
      <div class="info">
        <h1>{{ house.title }}</h1>
        <p><i class="el-icon-map-location"></i> {{ house.address }}</p>
      </div>
    </div>
    <el-carousel :interval="3000" type="card" height="500px">
      <el-carousel-item v-for="item in house.img_url" :key="item">
        <img :src="item" alt="">
      </el-carousel-item>
    </el-carousel>
    <div class="main">
      <div class="left">
        <div class="descriptions">
          <el-descriptions title="房子详细信息">
            <el-descriptions-item label="状态">{{ houseStatus }}</el-descriptions-item>
            <el-descriptions-item label="租金">¥{{ house.month_rent }}/月</el-descriptions-item>
            <el-descriptions-item label="押金">¥1000</el-descriptions-item>
            <el-descriptions-item label="租赁方式">{{ house.rent_type === 'whole' ? '整租' : '合租' }}</el-descriptions-item>
            <el-descriptions-item label="房产证编号">{{ house.certificate }}</el-descriptions-item>
            <el-descriptions-item label="卧室数量">{{ house.bedroom }}</el-descriptions-item>
            <el-descriptions-item label="卫生间数量">{{ house.toilet }}</el-descriptions-item>
            <el-descriptions-item label="厨房数量">{{ house.kichen }}</el-descriptions-item>
            <el-descriptions-item label="客厅数量">{{ house.toilet }}</el-descriptions-item>
            <el-descriptions-item label="房间面积">{{ house.area }} ㎡</el-descriptions-item>
            <el-descriptions-item label="是否有空调">{{ house.conditioner ? '有空调' : '没有空调' }}</el-descriptions-item>
            <el-descriptions-item label="建成年份">{{ house.buildyear }}</el-descriptions-item>
            <el-descriptions-item label="朝向">朝{{ house.direction }}</el-descriptions-item>
            <el-descriptions-item label="楼层">{{ house.floor }}/{{ house.maxfloor }}</el-descriptions-item>
            <el-descriptions-item label="是否有电梯">{{ house.elevator ? '有电梯' : '没有电梯' }}</el-descriptions-item>
            <el-descriptions-item label="联系人姓名">{{ house.contact_name }}</el-descriptions-item>
            <el-descriptions-item label="联系人手机号">{{ house.contact_phone }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="desc">
          <h2>详细描述</h2>
          <span>{{ house.content }}</span>
        </div>
        <div class="container">
          <h2>地图位置</h2>
          <div class="map" id="map"></div>
        </div>
        <div class="gallery">
          <h2>房屋相册</h2>
          <div class="imgs">
            <!-- src要完整地址，preview-src-list要数组 -->
            <el-image style="width: 33.33%; height: 180px;padding-right: 10px;" v-for="item in house.img_url" :key="item"
              :src="item" :preview-src-list="house.img_url">
            </el-image>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="collect" v-if="house.status === 1">
          <!-- <el-button @click="collect" plain type="danger" class="btn1" icon="el-icon-star-off">收藏</el-button> -->
          <i @click="collect" :class="[isStar ? 'el-icon-star-off star' : 'el-icon-star-off']"> 收藏</i>
        </div>
        <!-- house.status === 1 表示未租出才显示 -->
        <div class="date" v-if="house.status === 1">
          <div class="price">¥ {{ (house.month_rent / 30).toFixed(2) }} /日</div>
          <div class="pick">

            <p>选择日期下单预定，入住时间和退租时间</p>
            <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" :default-time="[formatDate]" :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" class="btn2" @click="timeBtn">立即预定</el-button>
          </div>
        </div>
        <div class="contact">
          <h2>联系人信息</h2>
          <div class="msg">
            <img :src="defaultavatar" alt="" class="imgtx" />
            <h3>{{ house.contact_name }}</h3>
            <p>{{ house.contact_phone }}</p>
            <img src="@/assets/wxqr.jpg" alt="扫一扫添加微信" class="imgewm" />
            <h3 class="wz">扫一扫上面的二维码图案，加我为朋友</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
export default {
  name: 'Detail',
  created() {
    //获取房屋信息
    this.getHouseInfo()
  },
  data() {
    return {
      //入住时间
      date: '',
      //默认房东头像
      defaultavatar: require('@/assets/user.png'),
      //房屋信息
      house: [],
      //当前时间
      currentDate: new Date(),
      //日期选择器快捷选项
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  methods: {
    // 地图
    init() {
      //字符串转数字
      var coordinates = this.house.longitude_latitude.split(',').map(Number)
      //创建地图 坐标
      var myLatlng = new qq.maps.LatLng(coordinates[0], coordinates[1])
      var myOptions = {
        zoom: 16,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP,
      }
      var map = new qq.maps.Map('map', myOptions)
      //标记点
      var marker = new qq.maps.Marker({
        position: myLatlng,
        map: map,
      })
    },

    // 立即预定
    async timeBtn() {
      //判断是否登录
      if (!this.$store.getters.getUserInfo) {
        return this.$message({
          message: '请先登录',
          type: 'warning'
        })
      }
      //判断是否完善个人信息
      if (!this.$store.getters.getUserInfo?.idcard) {
        return this.$alert('个人信息未完善，需完善后才能租房', '提示', {
          confirmButtonText: '去完善',
          callback: action => {
            this.$router.push({ path: '/index/admin/info' })
          }
        });
      }
      //判断是否是租客账号
      if (this.$store.getters.getUserInfo?.role != 'customer') {
        return this.$message({
          message: '只有租客账号才能预定房屋',
          type: 'warning'
        })
      }
      if (this.date.length > 1) {
        // 格式化时间
        let formattedDates = this.date.map((d) => {
          let date = new Date(d)
          return (
            date.getFullYear() +
            '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            date.getDate().toString().padStart(2, '0')
          )
        })
        //判断下单时间是否有效
        if (!this.isNowDateValid()) {
          this.date = ''
          return this.$message({
            type: 'warning',
            message: '请选择有效的入住时间',
          })
        }
        this.date = ''
        //创建订单
        const orderInfo = {
          houseid: this.house.id,
          customerid: this.$store.getters.getUserInfo.id,
          ownerid: this.house.owner_id,
          status: -2,
          daynum: this.calculateRentDays(formattedDates[0], formattedDates[1]),
          startdate: formattedDates[0],
          enddate: formattedDates[1],
          monthrent: this.house.month_rent,
          totalamount: (this.calculateRentDays(formattedDates[0], formattedDates[1]) * (this.house.month_rent / 30).toFixed(2)) + 1000,//1000是合同页的押金
        }
        const { data: res } = await this.$axios.post('/api/order/add', orderInfo)
        if (res.status !== 200) {
          return this.$message({
            type: 'warning',
            message: res.message,
          })
        }
        //弹出提示框
        this.$alert('请签约合同，点击确认前往合同页，取消请点右上角', '订单创建成功', {
          confirmButtonText: '确定',
          callback: (action) => {
            if (action === 'confirm') {
              // 跳转合同页面
              this.$router.push({ path: '/index/agreement', query: { orderNo: res.data.order_number } });
            } else {
              this.$message({
                type: 'info',
                message: '已取消',
              })
            }
          },
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择入住时间',
        })
      }
    },
    // 获取房屋信息
    async getHouseInfo() {
      const id = this.$route.params.id;
      const { data: res } = await this.$axios.get(`/api/house/${id}`)
      if (res.status === 200) {
        this.house = res.data
        this.getOwner() //获取房东信息
        this.init() //地图
      }
    },
    // 获取房东信息
    async getOwner() {
      const { data: res } = await this.$axios.get(`/api/user/info/${this.house.owner_id}`)
      if (res.status === 200) {
        if (res.data.avatar) {
          this.defaultavatar = res.data.avatar
        }
      }
    },
    // 收藏
    async collect() {
      //判断是否登录
      if (!this.$store.getters.getUserInfo) {
        return this.$message({
          message: '请先登录',
          type: 'warning'
        })
      }
      //判断是否是租客账号
      if (this.$store.getters.getUserInfo?.role != 'customer') {
        return this.$message({
          message: '只有租客账号才能收藏房屋',
          type: 'warning'
        })
      }
      //判断是否已经收藏，已经收藏则取消收藏
      if (this.isStar) {
        const id = this.$store.getters.getcollectList?.find(my => my.house_id === this.house.id).id
        const { data: res } = await this.$axios.get(`/api/collect/delete/${id}`)
        await this.$store.dispatch('collectInit', this.$store.getters.getUserInfo.id)//获取收藏表
        if (res.status === 200) {
          this.$message({
            message: '取消收藏成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      } else {
        const info = {
          userid: this.$store.getters.getUserInfo.id,
          houseid: this.house.id,
          title: this.house.title,
          address: this.house.address,
          monthrent: this.house.month_rent,
          img: this.house.img_url[0]
        }
        const { data: res } = await this.$axios.post('/api/collect/add', info)
        await this.$store.dispatch('collectInit', this.$store.getters.getUserInfo.id)//获取收藏表
        if (res.status === 200) {
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }
    },
    //判断下单时间的预约是否有效
    isNowDateValid() {
      return this.date[0] >= this.currentDate
    },
    //计算租住天数
    calculateRentDays(start, end) {
      let startDate = new Date(start);
      let endDate = new Date(end);
      let differenceInTime = endDate.getTime() - startDate.getTime();
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return Math.ceil(differenceInDays) + 1;
    }
  },
  computed: {
    //房屋状态
    houseStatus() {
      switch (this.house.status) {
        case 1:
          return '未租出';
        case 2:
          return '已租出';
        case 3:
          return '已下架';
        case -2:
          return '待审核';
        case -3:
          return '审核不通过';
        default:
          return '未知状态';
      }
    },
    //下单时间
    formatDate() {
      let date = new Date(this.currentDate.getTime() + 5000); // 加 5000 毫秒，即 5 秒
      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');
      let seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    //是否收藏
    isStar() {
      return this.$store.getters.getcollectList?.some(item => item.house_id === this.house.id)
    }
  }

}
</script>

<style scoped>
.detail {
  min-height: 821px;
  background-color: #f8f9fe;
}

.title {
  height: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-weight: 600;
}

.title .price {
  font-size: 40px;
  color: #4b5eff;
}

.info h1 {
  font-size: 50px;
  color: #293672;
  padding-top: 20px;
  padding-bottom: 25px;
}

.info p {
  display: flex;
  justify-content: center;
  color: #777;
}

.info i {
  padding-right: 10px;
}


img {
  width: 100%;
  height: 100%;
}


.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.main {
  padding: 0 310px;
  display: flex;
  justify-content: space-between;
}

.main .left,
.main .right {
  margin-top: 20px;
}

.main .left {
  width: 850px;
}

.descriptions {
  background-color: white;
  height: 300px;
  padding: 20px;
  line-height: 40px;
}

.desc {
  min-height: 100px;
  background-color: white;
  margin-top: 30px;
  padding: 15px;
}

.desc h2 {
  font-weight: 600;
  padding-bottom: 20px;
}

.desc span {
  color: #777;
  font-size: 15px;
  line-height: 30px;
}

.container {
  height: 550px;
  margin-top: 30px;
  font-weight: 600;
  background-color: white;
}

.container h2 {
  padding: 15px;
}

.map {
  height: 500px;
}

.gallery {
  height: 650px;
  margin-top: 30px;
  font-weight: 600;
  background-color: white;
  padding: 15px;
}

.gallery .imgs {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.imgs> :nth-child(4),
.imgs> :nth-child(5),
.imgs> :nth-child(6) {
  margin-top: 20px;
  margin-bottom: 20px;
}

.main .right {
  width: 400px;
}

.right .collect {
  background-color: white;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  margin-bottom: 30px;
}

.el-icon-star-off {
  width: 200px;
  height: 50px;
  font-size: 25px;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  line-height: 50px;
  border: 1px solid rgb(242, 94, 0);
  color: rgb(242, 94, 0);
  background-color: rgb(255, 218, 218);
}

.star {
  border: 1px solid rgb(242, 94, 0);
  color: #fff;
  background-color: rgb(242, 94, 0);
}

.date {
  background-color: white;
  height: 350px;
  margin-bottom: 30px;
}

.date .price {
  background-color: #4b5fff;
  height: 80px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-size: 25px;
  color: white;
  font-weight: 600;
}

.date .pick {
  padding: 50px 20px;
}

.date .pick p {
  color: #777;
  font-size: 15px;
  padding-bottom: 10px;
}

.btn2 {
  width: 350px;
  height: 50px;
  margin-top: 50px;
  background-color: #4b5fff;
}

.contact {
  background-color: white;
}

.contact h2 {
  padding: 15px;
  background-color: #4b5fff;
  color: white;
  font-weight: 600;
  height: 50px;
}

.msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  line-height: 30px;
}

.msg .imgtx {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.msg .imgewm {
  width: 300px;
  height: 300px;
  margin-top: 10px;
}

.msg .wz {
  font-size: 15px;
  color: #777;
  padding-top: 10px;
}
</style>