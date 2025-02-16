<template>
  <div class="adminfeedback">
    <div class="adminmsg">
      <h2>反馈管理</h2>
      <div class="title block">
        <span>反馈列表</span>
      </div>
      <div v-for="item in list" :key="item.id">
        <div class="info block">
          <div class="msg">
            <h3>{{ item.title }}</h3>
            <span :class="item.status == 1 ? 'status1' : 'status0'">{{ item.status == 1 ? '已处理' : '未处理' }}</span>
            <p>{{ item.contact_name }} {{ item.contact_email }}</p>
            <p>反馈内容：{{ item.content }}</p>
            <p>回复内容：{{ item.reply }}</p>
          </div>
          <div>
            <el-button @click="remoke(item.id)" type="text" size="small">删除反馈</el-button>
            <el-button @click="reply(item.id)" type="text" size="small">回复反馈</el-button>
          </div>
        </div>
      </div>
      <div class="Page">
        <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
          :total="allList.length" :page-size="3">
        </el-pagination>
      </div>
      <!-- 发布消息资讯弹窗 -->
      <el-dialog title="发布消息资讯" :visible.sync="dialogForm" :before-close="handleClose" width="35%">
        <el-form :model="form" :rules="rules" ref="fbForm">
          <el-form-item label="回复内容" :label-width="'80px'" prop="reply">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reply">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="pushfb">发 送</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminFeedback',
  created() {
    this.getFeedbackList()
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      // 反馈是否已被处理
      isHandled: false,
      // 反馈列表
      allList: [],
      list: [],
      //发布消息资讯弹窗
      dialogForm: false,
      //回复
      form: {
        reply: '',
        id: ''
      },
      rules: {
        reply: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //获取反馈列表
    async getFeedbackList(page = 1) {
      const { data: res } = await this.$axios.get('/api/feedback/list')
      if (res.status == '200') {
        this.allList = res.data
        this.list = this.allList.slice(0, 3)
      }
      //之后再获取数据后不会跳回第一页而是保持在当前页
      this.handlePage(page)
    },
    //分页
    handlePage(page) {
      const start = (page - 1) * 3
      const end = page * 3
      this.list = this.allList.slice(start, end)
    },
    //点击取消或遮罩层关闭弹窗
    handleClose() {
      this.$refs['fbForm'].resetFields();
      this.form = {
        reply: '',
        id: '',
      }
      this.dialogForm = false
    },
    //点击回复反馈
    reply(id) {
      this.dialogForm = true
      this.form.id = id
    },
    //点击发送
    async pushfb() {
      this.$refs['fbForm'].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$axios.post('/api/feedback/reply', this.form)
          if (res.status == '200') {
            this.$message({
              message: '回复成功',
              type: 'success'
            })
          } else if (res.status == '400') {
            this.$message({
              message: res.message,
              type: 'error'
            })
          } else {
            this.$message({
              message: '回复失败',
              type: 'error'
            })
          }
          this.handleClose()
          this.getFeedbackList(this.currentPage)
        }
      });
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
      this.getFeedbackList(this.currentPage)
    }
  }
}
</script>

<style scoped>
.adminfeedback {
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
  height: 190px;
  padding: 30px 0;
  padding-right: 10px;
  border-bottom: 1px solid #eee;
}

.info .msg {
  color: #777;
  line-height: 25px;
}

.status0 {
  color: #ffb358;
}

.status1 {
  color: green;
  /* 已处理的颜色 */
}

.msg h3 {
  font-size: 18px;
  color: black;
  font-weight: 600;
  margin-bottom: 5px;
}
</style>