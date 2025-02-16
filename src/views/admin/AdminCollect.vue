<template>
  <div class="admincollect">
    <div class="adminmsg">
      <h2>我的收藏</h2>
      <div class="title block">
        <span>收藏列表</span>
      </div>
      <div v-for="item in list" :key="item.id">
        <div class="info block">
          <div class="imgtitle">
            <RouterLink :to="'/index/detail/' + item.house_id">
              <img :src="item.img" alt="">
            </RouterLink>
            <div class="houseinfo">
              <h3>{{ item.title }}</h3>
              <p>{{ item.address }}</p>
              <div><el-tag type="info">¥ {{ item.month_rent }}/月</el-tag></div>
            </div>
          </div>
          <div class="msg">
            <el-button @click="cancelCollect(item.id)" type="text"><i class="el-icon-close"></i> 取消收藏</el-button>
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
  name: 'AdminCollect',
  created() {
    this.getCollectInfo();
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
    //获取收藏列表
    async getCollectInfo(page = 1) {
      const { data: res } = await this.$axios.get(`/api/collect/list/${this.$store.getters.getUserInfo.id}`);
      if (res.status === 200) {
        this.allList = res.data;
        this.list = this.allList.slice(0, 3);
      }
      //之后再获取数据后不会跳回第一页而是保持在当前页
      this.handlePage(page)
    },
    //取消收藏
    async cancelCollect(id) {
      const { data: res } = await this.$axios.get(`/api/collect/delete/${id}`);
      if (res.status === 200) {
        this.$message({
          type: 'success',
          message: '取消收藏成功'
        });
        this.getCollectInfo(this.currentPage);
      }
    }
  },

}
</script>

<style scoped>
.admincollect {
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
  flex: 6;
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

.houseinfo h4 {
  color: rgb(49, 159, 49);
}
</style>