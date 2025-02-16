<template>
  <div class="news">
    <div class="title">
      <p>消息资讯</p>
      <h1>最新房屋信息</h1>
    </div>
    <div class="msg">
      <div class="info" v-for="item in list" :key="item.id">
        <div class="left">
          <router-link :to="`/index/detail/${item.houseid}`">
            <h2>{{ item.title }}</h2>
          </router-link>
          <p>{{ item.content }}</p>
          <p>发布时间 <span> {{ item.create_time }}</span></p>
        </div>
        <div class="right">
          <el-button @click="goToDetail(item.houseid)" class="share-button" icon="el-icon-share" type="primary"></el-button>
        </div>
      </div>
    </div>
    <div class="Page">
      <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
        :total="allList.length" :page-size="6">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import dateTime from '@/utils/TimeFormat'
export default {
  name: 'News',
  mixins: [dateTime],
  created() {
    this.getNewsList()
  },
  data() {
    return {
      list: [],
      allList: [],
      //当前页
      currentPage: 1,
    }
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/index/detail/${id}`)
    },
    //获取新闻列表
    async getNewsList() {
      const { data: res } = await this.$axios.get('/api/news/list')
      if (res.status == '200') {
        this.allList = this.formatList(res.data)
        this.list = this.allList.slice(0, 6)
      }
    },
    //分页
    handlePage(page) {
      const start = (page - 1) * 6
      const end = page * 6
      this.list = this.allList.slice(start, end)
    },

  }
}
</script>

<style scoped>
.news {
  min-height: 821px;
  background-color: #f8f9fe;
}

a {
  text-decoration: none;
  color: black;
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
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.info {
  width: 900px;
  height: 120px;
  padding: 15px 20px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.info h2 {
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 20px;
}

.info p {
  font-size: 14px;
  color: #777;
  padding-bottom: 15px;
}

.Page {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}
</style>