<template>
  <div class="adminhome">
    <div class="adminmsg">
      <h2>我的家</h2>
      <div class="title block">
        <span>租房信息</span>
        <span>类型</span>
        <span>联系人</span>
      </div>
      <div v-for="item in list" :key="item.id">
        <div class="info block">
          <div class="imgtitle">
            <router-link :to="'/index/detail/' + item.id">
              <img :src="item.img_url[0]" alt="">
            </router-link>
            <div class="houseinfo">
              <h3>{{ item.title }}</h3>
              <p>{{ item.address }}</p>
              <p>到期时间：{{ item.end_date }}</p>
            </div>
          </div>
          <div class="msg">
            <el-tag v-if="item.rent_type === 'whole' ? true : false">整租</el-tag>
            <el-tag type="success" v-else>合租</el-tag>
          </div>
          <div class="msg">
            <p>{{ item.contact_name }}</p>
            <p>{{ item.contact_phone }}</p>
          </div>
        </div>
      </div>
      <div class="Page">
        <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
          :total="allList.length" :page-size="3">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'AdminHome',
  created() {
    this.getMyhomeInfo();
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      // 列表
      allList: [],
      list: [],
    };
  },
  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 3;
      const end = page * 3;
      this.list = this.allList.slice(start, end);
    },
    //获取我的家列表
    async getMyhomeInfo() {
      const { data: res } = await this.$axios.post('/api/house/my', { id: this.$store.getters.getUserInfo.id });
      if (res.status == '200') {
        this.allList = res.data.map(item => {
          // 找到与当前元素 id 匹配的 orders 元素
          const order = res.orders.find(order => order.house_id === item.id);
          // 如果找到了匹配的 orders 元素，使用其 end_date，否则使用默认值
          const end_date = order ? order.end_date : 'N/A';
          return {
            ...item,
            end_date
          };
        });
        this.list = this.allList.slice(0, 3);
      }
    }
  },

}
</script>

<style scoped>
.adminhome {
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
  flex: 3;
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
  line-height: 20px;
}

.imgtitle {
  display: flex;
}

.houseinfo {
  margin-left: 20px;
  line-height: 40px;
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

.houseinfo h4 {
  color: rgb(49, 159, 49);
}
</style>