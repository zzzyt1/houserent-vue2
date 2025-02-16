<template>
  <div class="adminnew">
    <div class="adminmsg">
      <div class="top">
        <h2>消息管理</h2>
        <el-button class="btnhouse" size="small" @click="dialogForm = true">发布消息</el-button>
      </div>
      <div class="title block">
        <span>标题</span>
        <span>时间</span>
        <span>操作</span>
      </div>
      <div v-for="item in list" :key="item.id">
        <div class="info block">
          <div class="msg">
            <p>{{ item.title }}</p>
            <p>{{ item.content }}</p>
          </div>
          <div class="msg">
            <p>{{ item.create_time }}</p>
          </div>
          <div>
            <el-button type="primary" size="small" @click="edit(item)">编辑</el-button>
            <el-button type="danger" size="small" @click="remoke(item.id)">删除</el-button>
          </div>
        </div>
      </div>
      <div class="Page">
        <el-pagination @current-change="handlePage" :current-page.sync="currentPage" layout="prev, pager, next"
          :total="allList.length" :page-size="5">
        </el-pagination>
      </div>
      <!-- 发布消息资讯弹窗 -->
      <el-dialog title="发布消息资讯" :visible.sync="dialogForm" :before-close="handleClose" width="35%">
        <el-form :model="form" :rules="rules" ref="newsForm">
          <el-form-item label="标题" :label-width="'80px'" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="'80px'" prop="content">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.content">
            </el-input>
          </el-form-item>
          <el-form-item label="房源选择" :label-width="'80px'" prop="houseid">
            <el-select v-model="form.houseid" placeholder="请选择房源" style="width: 100%;">
              <el-option v-for="(item, index) in houses" :key="item.value" :label="item.label" :value="item.value"
                class="formOption">
                <span style="width: 20px;">{{ index + 1 }}</span>
                <img :src="item.image" alt="" class="formImage">
                <span style="overflow: hidden;">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="newsPush">发 布</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dateTime from '@/utils/TimeFormat'
export default {
  name: 'adminnews',
  mixins: [dateTime],
  created() {
    this.getNewsList()
    this.getHouseList()
  },
  data() {
    return {
      //当前页
      currentPage: 1,
      //发布消息资讯弹窗
      dialogForm: false,
      form: {
        title: '',
        content: '',
        houseid: ''
      },
      //消息列表
      allList: [],
      list: [],
      houses: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
        ],
        houseid: [
          { required: true, message: '请选择房源', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //分页
    handlePage(page) {
      const start = (page - 1) * 5
      const end = page * 5
      this.list = this.allList.slice(start, end)
    },
    //获取新闻列表
    async getNewsList(page = 1) {
      const { data: res } = await this.$axios.get('/api/news/list')
      if (res.status == '200') {
        this.allList = this.formatList(res.data)
        this.list = this.allList.slice(0, 5)
      }
      //之后再获取数据后不会跳回第一页而是保持在当前页
      this.handlePage(page)
    },
    //获取房源列表，用于发布消息
    async getHouseList() {
      const { data: res } = await this.$axios.get('/api/house/unrented')
      if (res.status == '200') {
        this.houses = res.data.map(item => {
          return {
            value: item.id,
            label: item.title,
            image: item.img_url[0],
          }
        })
      }
    },
    //发布消息
    async newsPush() {
      //判断是新增还是修改,新增则没有id
      if (this.form.id == undefined) {
        this.$refs['newsForm'].validate(async (valid) => {
          if (valid) {
            const { data: res } = await this.$axios.post('/api/news/add', this.form)
            if (res.status == '200') {
              this.$message({
                message: '发布成功',
                type: 'success'
              })
            }
            this.handleClose()
            this.getNewsList(this.currentPage)
          }
        });
      } else {
        this.$refs['newsForm'].validate(async (valid) => {
          if (valid) {
            const { data: res } = await this.$axios.post('/api/news/edit', {
              id: this.form.id,
              title: this.form.title,
              content: this.form.content,
              houseid: this.form.houseid
            })
            if (res.status == '200') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
            this.handleClose()
            this.getNewsList(this.currentPage)
          }
        });
      }
    },
    //删除消息
    async remoke(id) {
      const { data: res } = await this.$axios.get(`/api/news/delete/${id}`)
      if (res.status == '200') {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getNewsList(this.currentPage)
      }
    },
    //编辑消息
    edit(val) {
      this.form = {
        title: val.title,
        content: val.content,
        id: val.id,
        houseid: val.houseid
      }
      this.dialogForm = true
    },
    //点击取消或遮罩层关闭弹窗
    handleClose() {
      this.$refs['newsForm'].resetFields();
      this.form = {
        title: '',
        content: '',
        houseid: ''
      },
      this.dialogForm = false
    }
  }
}
</script>

<style scoped>
.adminnew {
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
}

.top {
  display: flex;
  align-items: center;
}

.btnhouse {
  background-color: #4a5eff;
  border: none;
  color: white;
  margin-left: 20px;
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

.block> :first-child {
  flex: 3;
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
  height: 110px;
  padding: 30px 0;
  border-bottom: 1px solid #eee;
}

.info .msg {
  color: #777;
  line-height: 25px;
}

.formOption {
  display: flex;
  align-items: center;
  height: 100px;
  width: 552px;
  padding: 0 10px
}

.formImage {
  width: 100px;
  height: 80px;
  margin-right: 10px;
  margin-left: 5px;
}
</style>