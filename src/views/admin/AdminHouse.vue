<template>
  <div class="adminhouse">
    <div class="title">
      <h2>房源管理</h2>
      <el-button class="btnhouse" size="small" @click="gotoRelease">发布新房源</el-button>
    </div>
    <div class="houses">
      <div class="item" v-for="item in list" :key="item.id">
        <House :house="item" :get-house-info="getHouseInfo" :Page="currentPage"></House>
      </div>
    </div>
    <div class="Page">
      <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
        :total="allList.length" :page-size="9">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import House from '@/components/houseset.vue'
export default {
  name: 'AdminHouse',
  created() {
    this.getHouseInfo();
  },
  components: {
    House
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      allList: [],
      list: [],
    }
  },
  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 9;
      const end = page * 9;
      this.list = this.allList.slice(start, end);
    },
    //跳转到发布房子页面
    gotoRelease() {
      this.$router.push('/index/admin/release')
    },
    //获取房子信息
    async getHouseInfo(page = 1) {
      if (this.$store.getters.getUserInfo.role === 'owner') {
        const { data: res } = await this.$axios.get(`/api/house/owner/${this.$store.getters.getUserInfo.id}`)
        if (res.status === 200) {
          this.allList = res.data;
          this.list = this.allList.slice(0, 9);
          this.handlePage(page)
        }
      } else {
        const { data: res } = await this.$axios.get(`/api/house/list`)
        if (res.status === 200) {
          this.allList = res.data;
          this.list = this.allList.slice(0, 9);
          this.handlePage(page)
        }
      }
    }
  }
}
</script>

<style scoped>
.adminhouse {
  padding: 20px 60px;
  min-height: 821px;
}

.title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 30px;
}

.btnhouse {
  background-color: #4a5eff;
  border: none;
  color: white;
  margin-left: 20px;
}

.btnhouse:hover {
  background-color: #4a5eff;
  color: white;
  opacity: 0.9;
}

.houses {
  display: flex;
  flex-wrap: wrap;
}

.houses .item {
  margin-right: 30px;
  margin-bottom: 40px;
}

.Page {
  display: flex;
  justify-content: center;
}
</style>