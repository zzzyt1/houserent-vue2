<template>
  <div class="item">
    <div class="img">
      <router-link :to="{ name: 'detail', params: { id: item.id } }"><img :src="item.img_url[0]" alt=""></router-link>
    </div>
    <div class="info">
      <router-link :to="{ name: 'detail', params: { id: item.id } }">
        <div class="title">
          <h1>{{ item.title }}</h1>
          <p>{{ item.address }}</p>
        </div>
      </router-link>
      <div class="price">
        <span>
          <p>¥ {{ item.month_rent }}</p> /月
        </span>
      </div>
    </div>
    <div class="info2">
      <div class="left">
        <span> {{ item.bedroom }}卧室 </span>
        <span> {{ item.toilet }}卫生间</span>
        <span> {{ item.area }}㎡</span>
      </div>
      <div class="right">
        <i @click="collect(item)" :class="[isStar ? 'el-icon-star-off star' : 'el-icon-star-off']"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'houseItem',
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    //收藏
    async collect(item) {
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
        const id = this.$store.getters.getcollectList?.find(my => my.house_id === item.id).id
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
          houseid: item.id,
          title: item.title,
          address: item.address,
          monthrent: item.month_rent,
          img: item.img_url[0]
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

    }
  },
  computed: {
    isStar() {
      return this.$store.getters.getcollectList?.some(item => item.house_id === this.item.id)
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #333;
}

.item {
  width: 320px;
  height: 400px;
  border-radius: 5px;
  background-color: white;
}

.item img {
  width: 100%;
  height: 200px;
}

.info {
  padding: 10px 10px 0 10px;
  border-bottom: 1px solid #ccc;
  position: relative;
  height: 150px;
}

.info h1 {
  font-size: 18px;
  font-weight: 600;
}

.info .title p {
  font-size: 14px;
  color: #777;
  padding-top: 10px;
}

.info .price {
  position: absolute;
  bottom: 20px;
  left: 10px;
  color: #777;
}

.price p {
  display: inline-block;
  font-size: 25px;
  color: #4b5eff;
  font-weight: 600;
}

.info2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 50px;
}

.info2 .left {
  font-size: 14px;
  color: #777;
}

.right .star {
  background-color: #6674f6;
  padding: 6px;
  color: white;
  border: none;
}

.el-icon-star-off {
  color: #777;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #8f8e8e;
  padding: 4px;
  border-radius: 50%;
}
</style>