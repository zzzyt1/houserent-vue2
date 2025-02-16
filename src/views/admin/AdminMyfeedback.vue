<template>
  <div class="adminmyfeedback">
    <div class="adminmsg">
      <h2>我的反馈</h2>
      <div class="title block">
        <span>反馈列表</span>
      </div>
      <div v-for="item in list" :key="item.id">
        <div class="info block">
          <div class="msg">
            <h3>{{ item.title }}</h3>
            <p>反馈内容：{{ item.content }}</p>
            <p>系统回复：{{ item.reply }}</p>
          </div>
          <div>
            <el-button @click="remoke(item.id)" type="text" size="small">删除反馈</el-button>
          </div>
        </div>
      </div>
      <div class="Page">
        <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
          :total="allList.length" :page-size="4">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'AdminMyfeedback',
  created() {
    this.getmyFBList()
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      //反馈列表
      allList: [],
      list: [],
    }
  },

  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 4
      const end = page * 4
      this.list = this.allList.slice(start, end)
    },
    //获取当前用户反馈列表
    async getmyFBList(page = 1) {
      let token = localStorage.getItem('mytoken')
      let decoded = jwt_decode(token)
      let { data: res } = await this.$axios.get(`/api/feedback//info/${this.$store.getters.getUserInfo.id}`)
      if (res.status == '200') {
        this.allList = res.data
        this.list = this.allList.slice(0, 4)
      }
      this.handlePage(page)
    },
    //删除反馈
    async remoke(id) {
      const { data: res } = await this.$axios.get(`/api/feedback/delete/${id}`)
      if (res.status == '200') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
      this.getmyFBList(this.currentPage)
    }
  }
}
</script>

<style scoped>
.adminmyfeedback {
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
  margin-top: 20px;
}

.block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}


.title {
  height: 50px;
  background-color: #4b5fff;
  color: white;
  padding-left: 20px;
  margin-top: 20px;
}

.info {
  height: 140px;

  padding: 30px 0;
  padding-right: 10px;
  border-bottom: 1px solid #eee;
}

.info .msg {
  color: #777;
  line-height: 25px;
}

.msg h3 {
  font-size: 18px;
  color: black;
  font-weight: 600;
  margin-bottom: 5px;
}
</style>