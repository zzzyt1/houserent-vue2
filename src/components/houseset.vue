<template>
  <div class="houseset">
    <img :src="house.img_url[0]" alt="">
    <div class="title">
      <h2>{{ house.title }}</h2>
      <span><i class="el-icon-location-outline"></i> {{ house.address }}</span>
    </div>
    <div class="control">
      <el-tooltip effect="dark" content="查看" placement="bottom">
        <el-button @click="showHouse(house.id)" size="small" icon="el-icon-view" class="btn"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="修改" placement="bottom" v-if="house.status !== 2">
        <el-button @click="editHouse" size="small" icon="el-icon-edit" class="btn"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="下架" placement="bottom" v-if="house.status === 1">
        <el-button @click="changeHouseStatus(house.id, 3)" size="small" icon="el-icon-video-pause"
          class="btn"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="上架" placement="bottom" v-if="house.status === 3">
        <el-button @click="changeHouseStatus(house.id, 1)" size="small" icon="el-icon-caret-right"
          class="btn"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除" placement="bottom">
        <el-button @click="changeHouseStatus(house.id, -1)" size="small" icon="el-icon-delete" class="btn">
        </el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="审核通过" placement="bottom"
        v-if="house.status === -2 && $store.getters.getUserInfo.role === 'admin'">
        <el-button @click="changeHouseStatus(house.id, 1)" size="small" icon="el-icon-check" class="btn">
        </el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="审核不通过" placement="bottom"
        v-if="house.status === -2 && $store.getters.getUserInfo.role === 'admin'">
        <el-button @click="changeHouseStatus(house.id, -3)" size="small" icon="el-icon-close" class="btn">
        </el-button>
      </el-tooltip>
    </div>
    <div :class="['state', classType(house.status)]">{{ houseStatus }}</div>
  </div>
</template>

<script>
export default {
  name: 'HouseSet',
  props: {
    house: {
      type: Object,
      default: () => { }
    },
    getHouseInfo: {
      type: Function,
      required: true
    },
    Page: {
      type: Number,
      required: true
    }
  },
  methods: {
    //状态class
    classType(status) {
      switch (status) {
        case 1:
          return 'status1';
        case 2:
          return 'status2';
        case 3:
          return 'status3';
        case -2:
          return 'status4';
        case -3:
          return 'status5';
        default:
          return 'status1';
      }
    },
    //查看房子详情
    showHouse(id) {
      this.$router.push(`/index/detail/${id}`)
    },
    //修改房子状态
    async changeHouseStatus(id, status) {
      const { data: res } = await this.$axios.post(`/api/house/status`, { id: id, status: status })
      if (res.status === 200) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getHouseInfo(this.Page);
      }
    },
    //修改房子信息
    editHouse() {
      this.$router.push({ path: '/index/admin/release/', query: { id: this.house.id } });
    }
  },
  computed: {
    houseStatus() {
      switch (this.house.status) {
        case 1:
          return '未租出';
        case 2:
          return '已租出';
        case 3:
          return '已下架';
        case -2:
          return '待审核';
        case -3:
          return '审核不通过';
        default:
          return '未知状态';
      }
    }
  }
}
</script>

<style scoped>
.houseset {
  width: 430px;
  height: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding: 15px;
  border-radius: 5px;
  position: relative;
}

img {
  width: 100%;
  height: 250px;
  border-radius: 5px;
}

.title h2 {
  font-weight: 600;
  padding-top: 10px;
  line-height: 20px;
}

.title span {
  font-size: 14px;
  color: #999;
  border-bottom: 2px solid #eee;
  width: 90%;
  padding-bottom: 5px;
  position: absolute;
  bottom: 50px;
  left: 20px;
}

.control {
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 20px;
}

.btn {
  background-color: #eee;
}

.state {
  position: absolute;
  top: 30px;
  left: 30px;
  padding: 5px 10px;
  color: #fff;
  border-radius: 5px;
}

.status1 {
  background-color: black;
}

.status2 {
  background-color: #20ab6c;
}

.status3 {
  background-color: #e91e65;
}

.status4 {
  background-color: #f0ad4e;
}

.status5 {
  background-color: #d9534f;
}
</style>