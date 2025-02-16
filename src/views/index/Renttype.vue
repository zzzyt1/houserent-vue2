<template>
  <div class="search">
    <div class="renttype">
      <div class="select">
        <el-select v-model="form.city" placeholder="请选择城市" class="block">
          <el-option label="北京" value="北京"></el-option>
          <el-option label="上海" value="上海"></el-option>
          <el-option label="广州" value="广州"></el-option>
        </el-select>
        <el-select v-model="form.type" placeholder="请选择类型" class="block">
          <el-option label="整租" value="whole"></el-option>
          <el-option label="合租" value="share"></el-option>
        </el-select>
        <el-input placeholder="请输入小区" prefix-icon="el-icon-search" v-model="form.name" class="block">
        </el-input>
        <div class="block">
          <span>选择价格范围</span>
          <el-slider v-model="form.price" range :max="10000" :marks="marks1" class="block2"></el-slider>
          <span>选择面积范围</span>
          <el-slider v-model="form.area" range :max="200" :marks="marks2" class="block2"></el-slider>
        </div>
        <el-button type="primary" @click="searchHouse" style="width: 300px;">搜索</el-button>
      </div>
      <div class="houses">
        <div class="tab" v-for="item in list" :key="item.id">
          <houseItem :item="item" />
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
import houseItem from '@/components/houseItem.vue'
export default {
  name: 'Renttype',
  components: {
    houseItem
  },
  created() {
    //确保第一次从nav进入只请求一次
    if (!this.$route.query.nav) {
      this.getHouseInfo()
    }
  },
  data() {
    return {
      //搜索条件
      form: {
        city: '',
        type: '',
        name: '',
        price: [0, 2500],
        area: [0, 100],
      },
      //标记
      marks1: {
        0: '0',
        2500: '2500',
        5000: '5000',
        7500: '7500',
        10000: '10000',
      },
      marks2: {
        0: '0',
        50: '50',
        100: '100',
        150: '150',
        200: '200',

      },
      //当前页
      currentPage: 1,
      //请求参数
      msg: {
        title: '',
        city: '',
        rentType: '',
        minPrice: '0',
        maxPrice: '999999',
        minArea: '0',
        maxArea: '999'
      },
      list: [],
      allList: []
    }
  },
  //监听路由重新发起请求
  watch: {
    '$route.query.type': {
      handler(newType) {
        this.msg.rentType = newType
        // this.form.type = newType === 'whole' ? '整租' : '合租'
        this.form.type = newType 
        //判断是否有nav参数，有则重新发起请求
        if (this.$route.query.nav) {
          this.getHouseInfo()
        }
      },
      immediate: true
    },
  },
  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 6
      const end = page * 6
      this.list = this.allList.slice(start, end)
    },
    //初始化房子信息
    async getHouseInfo() {
      this.msg.city = this.$route.query.city || ''
      this.msg.title = this.$route.query.title || ''
      this.msg.rentType = this.$route.query.type || ''
      this.msg.maxPrice = this.$route.query.range || '999999'
      const { data: res } = await this.$axios.post('/api/house/search', this.msg)
      if (res.status === 200) {
        this.allList = res.data
        this.list = this.allList.slice(0, 6)
      }
    },
    //搜索
    async searchHouse() {
      this.msg.title = this.form.name
      // this.msg.rentType = this.form.type === '整租' ? 'whole' : 'share'
      this.msg.rentType = this.form.type
      this.msg.city = this.form.city
      this.msg.minPrice = this.form.price[0]
      this.msg.maxPrice = this.form.price[1]
      this.msg.minArea = this.form.area[0]
      this.msg.maxArea = this.form.area[1]
      const { data: res } = await this.$axios.post('/api/house/search', this.msg)
      if (res.status === 200) {
        this.allList = res.data
        this.list = this.allList.slice(0, 6)
      }
    }
  },
}
</script>

<style scoped>
.search {
  background-color: #f8f9fe;
  min-width: 1903px;
  min-height: 821px;
  padding: 50px 380px;
}

.renttype {
  display: flex;
  justify-content: space-evenly;
}

.select {
  width: 400px;
  height: 500px;
  padding: 30px 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.block {
  width: 300px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: 600;
}

.block2 {
  width: 320px;
  margin-bottom: 30px;
  transform: translateX(-10px);
}

.houses {
  width: 700px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;

}

.tab>* {
  margin-bottom: 20px;
}

.Page {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>