<template>
  <div class="contract">
    <div class="msg">
      <div class="content">
        <h2>房屋租赁合同</h2>
        <p>
          出租方：<span>{{ Info.ownerName }}</span>（以下简称甲方）
        </p>
        <p>
          身份证：<span>{{ Info.ownerIdcard }}</span>
        </p>
        <p>
          承租方：<span>{{ Info.customerName }}</span>（以下简称乙方）
        </p>
        <p>
          身份证：<span>{{ Info.customerIdcard }}</span>
        </p>
        <p>
          根据甲、乙双方在自愿、平等、互利的基础上，经协商一数，为明确双方之间的权利义务关系，就甲方将其合法拥有的房屋出租给乙方使用，乙方承租甲方房屋事宜，订立本合同。
        </p>
        <p>
          一、房屋地址: <span>{{ Info.address }}</span>，房屋名称 <span>{{ Info.houseName }}</span>
        </p>
        <p><span>二、租告期限及约定</span></p>
        <p>
          1、该房屋租赁期共 <span>{{ orderInfo.day_num }}</span> 天。自 <span>{{ orderInfo.start_date }}</span> 到
          <span>{{ orderInfo.end_date }}</span>
        </p>
        <p>
          2、房屋租金: 每日约 <span>{{ everday }}</span> 元，时长 <span>{{ orderInfo.day_num }}</span>天，总金额含押金<span>1000</span>元，共计
          <span>{{ orderInfo.total_amount }}</span> 元
        </p>
        <p>房屋终止，甲方验收无误后，将押金退还乙方，不计利息。</p>
        <p>3、乙方向甲方承诺，租赁该房犀仅作为普通住房使用。</p>
        <p>
          4、租货期满，甲方有权收回出租房屋，乙方应如期交还，乙方如要求续租，则必须在相赁期满前一个月内通知甲方，经甲方同章后，重新签订租赁合同。
        </p>
        <p><span>三、房屋修缮与使用</span></p>
        <p>
          1、在租赁期内，甲方应保证出租房的使用安全。乙方应合理使用其所承用的房屋及其附屋设施，如乙方因使用不当造成房屋及设施损坏的，乙方应负责修复或给予经济赔偿。
        </p>
        <p>
          2、该房屋及所属设施的维修责任除双方在本合同及补充条款中约定外，均由甲方负责(但乙方使用不当除外)。甲方进行维修须提前七天通知乙方，乙方应积极协助配合。
        </p>
        <p>
          3、乙方因使用需要，在不影响房屋结构的前提下，可以对房屋进行装修装饰，但其设计规模、范围、工艺、用料等方案应事先征得甲方的同章后方可施工，相赁期满后依附于房屋的装修归甲方所有。对乙方的装修装饰部分甲方不负有修缮的义务。
        </p>
        <p><span>四、房屋的转让与转租</span></p>
        <p>1、租赁期间，未经甲方书面同章，乙方不得擅自转租、转借承租房屋</p>
        <p>2、甲方同意乙方转租房屋的，应当单独订立补充协议，乙方应当依据与甲方的书面协议转租房屋。</p>
        <p><span>五、乙方违约的处理规定</span></p>
        <p>
          在租赁期内，乙方有下列行为之一的，甲方有权终止合同，回收该房屋，乙方应向甲方支付合同总租金20%的违约金，若支付的违约金不足弥补甲方损失的，乙方还应负责赔偿直至达到弥补全部损失为止。
        </p>
        <p>(1) 未经甲方书面同意，擅自将房屋转租、转借给他人使用的。</p>
        <p>(2) 未经甲方同意，擅自拆改变动房屋结构或损坏房屋，且经甲方通知，在规定期限内仍未纠正并修复的。</p>
        <p>(3) 擅自改变本合同规定的租赁用途或利用该房屋进行违法活动的。</p>
        <p>(4) 拖欠房租累计一个月以上的。</p>
        <p><span>六、本协议一式两份，甲,乙各执一份，己方支付后即行生效</span></p>
        <div class="signature">
          <p>甲方（签字）：_________________________</p>
          <p>乙方（签字）：_________________________</p>
          <p>签订日期：_________________________</p>
        </div>
      </div>
      <div class="btn">
        <el-button type="danger" @click="gotopay"
          v-if="$store.getters.getUserInfo.role === 'customer'">我已阅读并同意上述合同</el-button>
        <el-button @click="print" size="small">打印</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // 获取订单信息
    this.getOrderInfo()
  },
  name: 'Agreement',
  data() {
    return {
      // 订单信息
      orderInfo: {},
      //用户信息
      Info: {
        ownerName: 'Loading...',
        ownerIdcard: 'Loading...',
        customerName: 'Loading...',
        customerIdcard: 'Loading...',
        address: 'Loading...',
        houseName: 'Loading...'
      },
    }
  },
  computed: {
    everday() {
      return (this.orderInfo.month_rent / 30).toFixed(2)
    },
  },
  methods: {
    // 去支付
    gotopay() {
      if (this.orderInfo.o_status === 0) {
        this.$router.push('/index/admin/order')
        return this.$message({
          message: '该合同生效中',
        })
      }
      if (this.Info.houseStatus === 2) {
        this.$router.push('/index/admin/order')
        return this.$message({
          message: '该房屋已出租',
        })
      }
      this.$alert('请支付订单，点击确定前往支付页，取消请点右上角', '合同签订成功', {
        confirmButtonText: '确定',
        callback: async (action) => {
          if (action === 'confirm') {
            //修改订单状态
            const { data: res } = await this.$axios.post('/api/order/status', {
              id: this.orderInfo.id,
              status: -1
            })
            if (res.status !== 200) {
              return this.$message({
                type: 'error',
                message: '合同提交失败',
              })
            }
            // 跳转支付页面
            this.$router.push({
              // path: '/index/pay',
              name: 'pay',
              params: {
                orderNumber: this.$route.query.orderNo,
                ownerEmail: this.Info.ownerEmail,
                customerEmail: this.Info.customerEmail
              },
              query: {
                id: this.orderInfo.id,
                houseId: this.orderInfo.house_id,
                houseName: this.Info.houseName,
                totalAmount: this.orderInfo.total_amount
              }
            });
          } else {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          }
        },
      })
    },
    //获取订单信息
    async getOrderInfo() {
      const { data: res } = await this.$axios.get(`/api/order/orderNo/${this.$route.query.orderNo}`)
      if (res.status === 200) {
        this.orderInfo = res.data[0]
        // 获取用户信息
        this.getInfo(this.orderInfo.customer_id, this.orderInfo.owner_id, this.orderInfo.house_id)
      }
    },
    //获取用户和房子信息
    async getInfo(id1, id2, id3) {
      const { data: res } = await this.$axios.get(`/api/user/info/${id1}`)
      if (res.status === 200) {
        this.Info.customerName = res.data.name
        this.Info.customerIdcard = res.data.idcard
        this.Info.customerEmail= res.data.email
      }
      const { data: res2 } = await this.$axios.get(`/api/user/info/${id2}`)
      if (res2.status === 200) {
        this.Info.ownerName = res2.data.name
        this.Info.ownerIdcard = res2.data.idcard
        this.Info.ownerEmail = res2.data.email
      }
      const { data: res3 } = await this.$axios.get(`/api/house/${id3}`)
      if (res3.status === 200) {
        this.Info.address = res3.data.address
        this.Info.houseName = res3.data.title
        this.Info.houseStatus = res3.data.status
      }
    },
    //打印
    print() {
      var printContents = document.querySelector('.content').innerHTML;

      // 创建一个新的窗口或标签页  
      var printWindow = window.open('', '_blank');

      // 将需要打印的div内容写入新窗口的body中  
      printWindow.document.write('<html><head><title>打印</title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');

      // 打印新窗口的内容  
      printWindow.document.close();
      printWindow.print();
    }
  },
}
</script>

<style scoped>
.contract {
  width: 100%;
  min-height: 821px;
  background-color: #f8f9fe;
  padding: 3rem 20vw;
}

.msg {
  width: 100%;
  padding: 5px 10px;
  background-color: white;
}

.msg h2 {
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  line-height: 50px;
}

.msg p {
  font-size: 16px;
  line-height: 30px;
  color: #777;
  text-indent: 2rem;
}

.msg p span {
  color: #333;
  font-weight: 600;
}

.btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
  flex-direction: column;
  align-items: center;
  height: 140px;
}

.signature {
  text-align: right;
  margin-top: 20px;
  margin-right: 50px;
}
</style>