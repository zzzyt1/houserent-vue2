<template>
  <div class="pay">
    <div class="main">
      <h2>{{ $route.query.houseName }}</h2>
      <div class="price">
        <span>¥ {{ $route.query.totalAmount }}</span>
      </div>
      <img src="@/assets/qr.jpg" />
      <div class="title">支付完成后，将跳转订单列表页面</div>
      <div class="footer">
        <p>打开微信/支付宝扫一扫</p>
        <el-button class="btn" @click="goHome">支付成功</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pay",
  methods: {
    async goHome() {
      const { data: res } = await this.$axios.post('/api/order/status', {
        id: this.$route.query.id,
        status: 0, //已支付
        customerEmail: this.$route.params.customerEmail,
        ownerEmail: this.$route.params.ownerEmail,
        houseTitle: this.$route.query.houseName,
        orderNumber: this.$route.params.orderNumber,
      })
      const { data: res2 } = await this.$axios.post('/api/house/status', {
        id: this.$route.query.houseId,
        status: 2 //已出租
      })
      if (res.status !== 200 || res2.status !== 200) {
        return this.$message({
          type: 'error',
          message: '支付失败',
        })
      }
      this.$alert('开始联系房东入住吧', '支付成功', {
        confirmButtonText: '确定',
        showClose: false,
        callback: () => {
          this.$router.push("/index/admin/order");
        },
      })
    }
  }
}
</script>

<style scoped>
.pay {
  width: 100%;
  min-height: 821px;
  background-color: #f8f9fe;
  padding-top: 50px;
}

.main {
  width: 500px;
  height: 500px;
  background-color: white;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  text-align: center;
}

.main h2 {
  font-size: 20px;
}

.main .price {
  font-size: 40px;
  margin: 20px 0;
}

.main img {
  width: 200px;
  height: 200px;
}

.title {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
  margin-bottom: 60px;
}

.footer {
  display: flex;
  align-items: center;
}

.footer p {
  font-size: 14px;
  color: #999;
  margin-right: 20px;
}

.btn {
  width: 200px;
  height: 40px;
  background-color: green;
  color: white;
}

.btn:hover,
.btn:focus {
  background-color: green;
  color: white;
}
</style>