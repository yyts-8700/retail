<template>
  <div class='confirm'>
    <subtitle :subtitle="'服务单详情'"/>
    <div class="body">
      <table class="table" border="1">
          <tbody>
            <tr>
                <td>服务单号</td>
                <td>{{tableData.code}}</td>
            </tr>
            <tr>
                <td>申请状态</td>
                <td>否</td>
            </tr>
            <tr>
                <td>订单编号</td>
                <td>{{tableData.orderCode}}</td>
            </tr>
            <tr>
                <td>申请时间</td>
                <td>{{tableData.resloveTime}}</td>
            </tr>
            <tr>
                <td>用户账号</td>
                <td>{{tableData.mobilePhone}}</td>
            </tr>
          </tbody>
      </table>
      <table class="table" border="1">
        <tbody>
          <tr>
              <td>订单金额</td>
              <td>{{tableData.returnMoney}}</td>
          </tr>
          <tr>
              <td>确认退款金额</td>
              <td>{{tableData.returnMoney}}</td>
          </tr>
          <tr>
              <td>退款方式</td>
              <td>退回到原支付渠道</td>
          </tr>
          <tr>
              <td>退款类型</td>
              <td>{{tableData.returnReason}}</td>
          </tr>
        </tbody>
      </table>
      <table class="table" border="1">
        <tr>
           <td>处理备注</td>
           <td><span class="returnMoney"><el-input v-model="beizhu" ></el-input> </span></td>
        </tr>
      </table>
      <div class="btn-wrapper">
        <el-button type="primary" class="ok"  @click='ok(tableData.id)'>确定退款</el-button>
        <el-button type="primary" class="refuse" @click='refuse(tableData.id)'>拒绝退款</el-button>
      </div>
      
    </div>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'


export default {
  name: 'confirm',
  components:{
    subtitle,

  },
  data () {
    return {
      tableData:'',
      beizhu:'',

    	
     }
  },
  mounted(){
    this.$axios.post('/merchant_return_goods/query_By_Id',{
      id : this.$route.query.id,
      merchantId : JSON.parse(localStorage.userInfo).merchantId
    }).then((res)=>{
      this.tableData = res.data.data
    }).catch((err)=>{
      this.$message.error(err.msg)
    })
  },
  methods:{
    ok(id){
      this.$axios.post('/merchant/return_money',{
        id: id,
        resolveRemark: this.beizhu
      }).then(()=>{
        this.$message({
          type:'success',
          message:'确定退钱操作成功'
        });
        this.$router.go(-1);
      })
    },
    refuse(id){
      this.$axios.post('/merchant_return_goods/update',{
        id: id,
        status: 5,
        resolveRemark: this.beizhu
      }).then(()=>{
        this.$message({
          type:'success',
          message:'拒绝退钱操作成功'
        });
        this.$router.go(-1);
      })
    },
  },
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin:30px auto
  .table 
    width:100%
    margin-bottom:30px
    border-right: 1px solid #b4b4b4
    border-bottom: 1px solid #b4b4b4
    tr
      height:40px
      font-size:14px
      td
        padding:0 20px
        color: #5a5a5a
        border-left: 1px solid #b4b4b4
        border-top: 1px solid #b4b4b4
        &:first-child
          width:15%
  .btn-wrapper
    width:40%
    text-align:center
    margin: 0 auto
    .ok
      background: #1abc9c
      border-color: #1abc9c
    .refuse
      background: #f04844
      border-color: #f04844
</style>
<style>

</style>