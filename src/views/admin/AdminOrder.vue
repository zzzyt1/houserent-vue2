<template>
  <div class="adminorder">
    <div class="adminmsg">
      <h2>订单管理</h2>
      <div class="title block">
        <span>订单列表</span>
        <span>租客</span>
        <span>房东</span>
        <span>操作</span>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="info block">
          <div class="imgtitle">
            <img :src="item.img" alt="">
            <div class="houseinfo">
              <h5>订单号：{{ item.order_number }}</h5>
              <h3>{{ item.title }}</h3>
              <p>{{ item.address }}</p>
              <div class="sdiv">
                <span>开始时间：{{ item.start_date }}</span>
                <span>结束时间：{{ item.end_date }}</span>
                <span>总金额：¥ {{ item.total_amount }}</span>
              </div>
              <h4 :class="classType(item.o_status)">{{ statusText(item.o_status) }}</h4>
            </div>
          </div>
          <div class="msg">
            <p>{{ item.userName }}</p>
            <p>{{ item.userPhone }}</p>
          </div>
          <div class="msg">
            <p>{{ item.contact_name }}</p>
            <p>{{ item.contact_phone }}</p>
          </div>
          <div>
            <el-button type="primary" size="small" @click="contract(item.order_number, item.o_status)">查看合同</el-button>
            <el-button type="danger" size="small" v-if="item.o_status === 0"
              @click="cancel(item.id, item.o_status, item.userEamil, item.ownerEmail, item.title, item.order_number)">申请退租</el-button>
            <el-button type="warning" size="small"
              @click="openDialong(item.id, item.houseId, item.userEamil, item.ownerEmail, item.title, item.order_number)"
              v-if="item.o_status === 2 && $store.getters.getUserInfo.role !== 'customer'">退租申请</el-button>
          </div>
          <el-dialog title="退租申请" :visible.sync="dialogVisible" width="30%" center>
            <div>该租客申请退租请尽快审核，如有其它问题可联系租客或管理员</div>
            <span slot="footer" class="dialog-footer">
              <el-button type="danger" @click="handleOrder(0)">拒绝申请</el-button>
              <el-button type="success" @click="handleOrder(1)">通过申请</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
      <div class="Page">
        <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
          :total="allList.length" :page-size="6">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOrder',
  created() {
    this.getOrderInfo();
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      allList: [],
      list: [],
      //处理申请的弹框
      dialogVisible: false,
      //处理申请的订单ID和房屋ID
      handleId: []
    }
  },
  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 6;
      const end = page * 6;
      this.list = this.allList.slice(start, end);
    },
    //获取订单列表
    async getOrderInfo(page = 1) {
      const { data: house } = await this.$axios.get('/api/house/list');
      const { data: user } = await this.$axios.get('/api/user/all');
      if (house.status === 200) {
        if (this.$store.getters.getUserInfo.role === 'owner') {
          const { data: res } = await this.$axios.get(`/api/order/ownerid/${this.$store.getters.getUserInfo.id}`);
          if (res.status === 200) {
            this.processData(res, house, user, page);
          }
        } else if (this.$store.getters.getUserInfo.role === 'customer') {
          const { data: res } = await this.$axios.get(`/api/order/customerid/${this.$store.getters.getUserInfo.id}`);
          if (res.status === 200) {
            this.processData(res, house, user, page);
          }
        } else {
          const { data: res } = await this.$axios.get('/api/order/list');
          if (res.status === 200) {
            this.processData(res, house, user, page);
          }
        }
      }
    },
    //获取数据后处理
    processData(res, house, user, page) {
      this.allList = res.data.map(item => {
        const houseItem = house.data.find(houseItem => houseItem.id === item.house_id);
        const userItem = user.data.find(userItem => userItem.id === item.customer_id);
        const ownerItem = user.data.find(userItem => userItem.id === houseItem.owner_id);
        return {
          ...item,
          userName: userItem.name,
          userPhone: userItem.phone,
          userEamil: userItem.email,
          ownerEmail: ownerItem.email,
          contact_name: houseItem.contact_name,
          contact_phone: houseItem.contact_phone,
          img: houseItem.img_url[0],
          title: houseItem.title,
          address: houseItem.address,
          houseId: houseItem.id,
        }
      })
      this.list = this.allList.slice(0, 6);
      this.handlePage(page);
    },
    //订单状态class
    classType(o_status) {
      switch (o_status) {
        case -3:
          return 'status-3';
        case -2:
          return 'status-2';
        case -1:
          return 'status-1';
        case 0:
          return 'status0';
        case 1:
          return 'status1';
        case 2:
          return 'status-3';
        default:
          return 'status1';
      }
    },
    //取消订单
    async cancel(orderId, status, customerEmail, ownerEmail, houseTitle, orderNumber) {
      if (status == '-3' || status == '1') {
        return this.$message({
          message: '订单已取消或已到期',
          type: 'warning'
        });
      }
      //申请退租审核
      const { data: res } = await this.$axios.post('/api/order/status', {
        status: 2,
        id: orderId,
        customerEmail: customerEmail,
        ownerEmail: ownerEmail,
        houseTitle: houseTitle,
        orderNumber: orderNumber,
      });
      if (res.status === 200) {
        this.$message({
          message: '退租已申请，请联系房东审核',
          type: 'success'
        });
        this.getOrderInfo(this.currentPage); //刷新页面
      }
    },
    //打开退租申请弹框
    openDialong(orderId, houseId, customerEmail, ownerEmail, houseTitle, orderNumber) {
      this.dialogVisible = true
      //存储订单ID、房屋ID、租客邮箱、房东邮箱、房屋标题、订单号
      this.handleId = [orderId, houseId, customerEmail, ownerEmail, houseTitle, orderNumber]
    },
    //处理退租申请
    async handleOrder(status) {
      if (status === 0) {
        //拒绝申请
        const { data: res } = await this.$axios.post('/api/order/status', {
          status: 0,
          id: this.handleId[0],
        });
        if (res.status === 200) {
          this.$message({
            message: '已拒绝申请',
            type: 'success'
          });
          this.getOrderInfo(this.currentPage); //刷新页面
        }
      } else {
        //通过申请，订单状态改为已退租
        const { data: res } = await this.$axios.post('/api/order/status', {
          status: 1,//存储订单ID、房屋ID、租客邮箱、房东邮箱、房屋标题、订单号
          id: this.handleId[0],
          customerEmail: this.handleId[2],
          ownerEmail: this.handleId[3],
          houseTitle: this.handleId[4],
          orderNumber: this.handleId[5],
        });
        //房屋状态改为未出租
        const { data: res2 } = await this.$axios.post('/api/house/status', {
          status: 1,
          id: this.handleId[1],
        });
        if (res.status === 200 && res2.status === 200) {
          this.$message({
            message: '已通过申请',
            type: 'success'
          });
          this.getOrderInfo(this.currentPage); //刷新页面
        }
      }
      this.handleId = []
      this.dialogVisible = false
    },
    //查看合同
    contract(order_number, status) {
      if (status == '-3' || status == '1') {
        return this.$message({
          message: '订单已取消或已退租',
          type: 'warning'
        });
      }
      this.$router.push({
        path: '/index/agreement',
        query: {
          orderNo: order_number
        }
      })
    }
  },
  computed: {
    //订单状态文本
    statusText() {
      return function (o_status) {
        switch (o_status) {
          case -3:
            return '租客已取消';
          case -2:
            return '待签合同';
          case -1:
            return '待付款';
          case 0:
            return '生效中';
          case 1:
            return '已退租';
          case 2:
            return '退租申请';
          default:
            return '未知状态';
        }
      }
    },

  }
}
</script>

<style scoped>
.adminorder {
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

.Page {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.block {
  display: block;
  display: flex;
  align-items: center;
  width: 100%;
}

.block> :first-child {
  flex: 4;
}

.block> :nth-child(n+2) {
  flex: 1;
}

.title {
  height: 50px;
  background-color: #4b5fff;
  color: white;
  padding-left: 20px;
  margin-top: 20px;
}

.info {
  height: 180px;
  padding: 30px 0;
  border-bottom: 1px solid #eee;
}

.info img {
  width: 200px;
  height: 150px;
}

.info .msg {
  color: #777;
}

.imgtitle {
  display: flex;
}

.houseinfo {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.houseinfo h3 {
  font-size: 18px;
  font-weight: 600;
}

.houseinfo p {
  font-size: 14px;
  color: #777;
}

.houseinfo span {
  padding: 3px 10px;
  width: 150px;
  font-size: 12px;
  color: #777;
  background-color: #eee;
}

.status-3 {
  color: rgb(255, 0, 0);
}

.status-2 {
  color: rgb(255, 153, 0);
}

.status-1 {
  color: rgb(0, 153, 255);
}

.status0 {
  color: rgb(49, 159, 49);
}

.status1 {
  color: rgb(153, 153, 153);
}
</style>