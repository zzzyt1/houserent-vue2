<template>
  <div class="home">
    <!-- 搜索框和背景 -->
    <div class="top">
      <h1>开始一段美好租房生活吧！</h1>
      <span>搜索你所在的城市的小区或房屋类型吧！</span>
      <div class="search">
        <el-form :inline="true" :model="formSearch" class="formsearch">
          <el-form-item>
            <div class="wz">标题/小区</div>
            <el-input v-model="formSearch.title" placeholder="请输入房源相关信息" class="nr1"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="wz">城市</div>
            <el-select v-model="formSearch.city" placeholder="城市" class="nr2">
              <el-option label="北京" value="北京"></el-option>
              <el-option label="上海" value="上海"></el-option>
              <el-option label="广州" value="广州"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="wz">租房类型</div>
            <el-select v-model="formSearch.type" placeholder="类型" class="nr2">
              <el-option label="整租" value="whole"></el-option>
              <el-option label="合租" value="share"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="wz">月租金范围</div>
            <el-select v-model="formSearch.range" placeholder="月租金">
              <el-option label="1000以内" value="1000"></el-option>
              <el-option label="2000以内" value="2000"></el-option>
              <el-option label="3000以内" value="3000"></el-option>
              <el-option label="4000以内" value="4000"></el-option>
              <el-option label="5000以内" value="5000"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="padding-top: 10px;">
            <el-button type="primary" @click="onSubmit" class="btn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 热门推荐 -->
    <div class="Recommend">
      <div class="whole">
        <div class="title">
          <h1>最新整租</h1>
          <span>给你推荐了一些最新发布的整租房子</span>
        </div>
        <div class="items">
          <houseItem v-for="item in wholeList" :key="item.id" :item="item"></houseItem>
        </div>
        <div class="more">
          <el-button @click="more('whole')" type="primary"> 查看更多 <i
              class="el-icon-arrow-right el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="shared">
        <div class="title">
          <h1>最新合租</h1>
          <span>给你推荐了一些最新发布的合租房子</span>
        </div>
        <div class="items">
          <houseItem v-for="item in shareList" :key="item.id" :item="item"></houseItem>
        </div>
        <div class="more">
          <el-button @click="more('share')" type="primary"> 查看更多 <i
              class="el-icon-arrow-right el-icon--right"></i></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import houseItem from '@/components/houseItem.vue'

export default {
  name: 'Home',
  components: {
    houseItem
  },
  created() {
    this.getHouseInfo()
  },
  data() {
    return {
      //搜索框
      formSearch: {
        title: '',
        city: '',
        type: '',
        range: ''
      },
      //整租列表
      wholeList: [],
      //合租列表
      shareList: []
    }
  },
  methods: {
    //查询
    onSubmit() {
      this.$router.push({
        path: '/index/renttype',
        query: {
          title: this.formSearch.title,
          city: this.formSearch.city,
          type: this.formSearch.type,
          range: this.formSearch.range
        }
      });
    },
    //获取房源信息
    async getHouseInfo() {
      const info1 = {
        title: '',
        city: '',
        rentType: 'whole',
        minPrice: '0',
        maxPrice: '999999',
        minArea: '0',
        maxArea: '999'
      }
      const { data: res1 } = await this.$axios.post('/api/house/search', info1)
      if (res1.status === 200) {
        this.wholeList = res1.data.slice(0, 6);
      }
      info1.rentType = 'share'
      const { data: res2 } = await this.$axios.post('/api/house/search', info1)
      if (res2.status === 200) {
        this.shareList = res2.data.slice(0, 6);
      }
    },
    //查看更多
    more(type) {
      this.$router.push({
        path: '/index/renttype',
        query: {
          type: type,
        }
      });
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 821px;
  background-color: #f8f9fe;
}

/* 搜索框和背景 */
.top {
  width: 100%;
  height: 650px;
  background-image: url(@/assets/background.jpg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.top h1 {
  font-size: 70px;
  color: white;
  font-weight: 800;
}

.top span {
  font-size: 20px;
  color: white;
  padding: 20px 0;
}

.search {
  background-color: white;
  width: 1100px;
  height: 70px;
  box-sizing: border-box;
  padding: 0 6px;
}

.formsearch {
  display: flex;
  justify-content: space-between;


}

.nr1 {
  width: 300px;
}

.nr2 {
  width: 180px;
}

.wz {
  font-size: 12px;
  color: #585c9b;
  line-height: 20px;
}

.btn {
  width: 180px;
  height: 50px;
  background-color: #fa5d03;
  border: none;

}

.btn:hover {
  background-color: #fa5d03;
}

/* 热门推荐 */
.Recommend {
  padding: 0 310px 50px 310px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fe;
}

.whole,
.shared {
  width: 1050px;
}

.shared {
  margin-top: 50px;

}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
}

.title h1 {
  font-size: 30px;
  font-weight: 600;
}

.title span {
  font-size: 15px;
  color: #777;
  margin-top: 10px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
}

.items> :nth-child(2),
.items> :nth-child(5),
.items> :nth-child(7) {
  margin-right: 45px;
  margin-left: 45px;
}

.items> :nth-child(-n+3) {
  margin-bottom: 30px;
}

.more {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  height: 50px;
}
</style>