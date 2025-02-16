<template>
  <div class="adminuser">
    <div class="adminmsg">
      <h2>用户管理</h2>
      <div class="title block">
        <span>账号信息</span>
        <span>联系方式</span>
        <span>其他信息</span>
        <span>状态</span>
        <span>操作</span>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <div class="info block">
          <div class="msg">
            <p>姓名：{{ item.name }}</p>
            <p>账号：{{ item.user }}</p>
          </div>
          <div class="msg">
            <p>邮箱：{{ item.email }}</p>
            <p>手机：{{ item.phone }}</p>
          </div>
          <div class="msgRole msg">
            <p v-if="!isChangingRole || changingRoleId !== item.id" style="margin-right: 10px;">
              身份：{{ roleDisplay(item.role) }}
              <el-button type="text" size="mini" @click="startChangeRole(item.id)">更改</el-button>
            </p>
            <div v-else>
              <el-select v-model="selectedRole" placeholder="请选择" @change="finishChangeRole(item.id)">
                <el-option label="管理员" value="admin"></el-option>
                <el-option label="房东" value="owner"></el-option>
                <el-option label="租客" value="customer"></el-option>
              </el-select>
            </div>
          </div>
          <div>
            <el-tag type="success" v-if="item.status">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </div>
          <div style="margin-bottom: 10px;display: flex; ">
            <el-button type="primary" size="small" @click="enable(item.id)">启用</el-button>
            <el-button type="danger" size="small" @click="disable(item.id)">禁用</el-button>
            <el-button type="info" size="small" @click="changePassword(item.id)">修改密码</el-button>
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
export default {
  name: 'adminuser',
  created() {
    this.getUserList()
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      //用户列表
      allList: [],
      list: [],
      isChangingRole: false, //是否正在修改角色
      changingRoleId: null,//正在修改角色的用户id
      selectedRole: null,//选择的角色
    }
  },
  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 4
      const end = page * 4
      this.list = this.allList.slice(start, end)
    },
    //获取用户列表
    async getUserList(page = 1) {
      const { data: res } = await this.$axios.get('/api/user/all')
      if (res.status == '200') {
        this.allList = res.data
        this.list = this.allList.slice(0, 4)
      }
      //之后再获取数据后不会跳回第一页而是保持在当前页
      this.handlePage(page)
    },
    //启用
    async enable(id) {
      const { data: res } = await this.$axios.post('/api/user/status', { id: id, status: 1 })
      if (res.status == '200') {
        this.$message({
          message: '启用成功',
          type: 'success'
        })
      }
      this.getUserList(this.currentPage)
    },
    //禁用
    async disable(id) {
      const { data: res } = await this.$axios.post('/api/user/status', { id: id, status: 0 })
      if (res.status == '200') {
        this.$message({
          message: '禁用成功',
          type: 'success'
        })
      }
      this.getUserList(this.currentPage)
    },
    //修改密码
    changePassword(id) {
      this.$prompt('请输入密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[a-zA-Z0-9]{6,18}$/,
        inputErrorMessage: '要求6 到 18 位字符之间'
      }).then(async ({ value }) => {
        let { data: res } = await this.$axios.post('/api/user/updatepwd', { id: id, password: value })
        if (res.status == '200') {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        });
      });
    },
    //修改身份
    startChangeRole(id) {
      this.isChangingRole = true;
      this.selectedRole = null, //清空选择的角色
        this.changingRoleId = id;
    },
    //完成修改身份
    async finishChangeRole(id) {
      let { data: res } = await this.$axios.post('/api/user/role', { id: id, role: this.selectedRole });
      if (res.status == '200') {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        });
      }
      this.getUserList(this.currentPage)
      this.isChangingRole = false;
      this.changingRoleId = null;
    },
    //判断角色身份
    roleDisplay(role) {
      switch (role) {
        case 'admin':
          return '管理员';
        case 'owner':
          return '房东';
        case 'customer':
          return '租客';
        default:
          return '';
      }
    }
  }
}
</script>

<style scoped>
.adminuser {
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
  display: block;
  display: flex;
  align-items: center;
  width: 100%;
}

.block> :nth-child(-n+3) {
  flex: 4;
}

.block> :nth-child(n+4) {
  flex: 3;
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
  border-bottom: 1px solid #eee;
}

.info .msg {
  color: #777;
  line-height: 25px;
}

.msgRole {
  display: flex;
  align-content: center;
}
</style>