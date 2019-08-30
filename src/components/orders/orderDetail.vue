<template>
  <div class='info'>
    <subtitle :subtitle="'用户信息'" :isBack='true'/>
    <div class='body'>
      <el-steps :active="datalist.status" align-center finish-status="success" style="margin-bottom: 30px">
        <el-step title="提交订单" :description="datalist.creatTime"></el-step>
        <el-step title="支付订单" :description="datalist.finishTime"></el-step>
        <el-step title="平台发货" :description="datalist.sendEndTime"></el-step>
        <el-step title="确认收货" :description="datalist.creatTime"></el-step>
        <el-step title="完成评价" :description="datalist.finishEndTime"></el-step>
      </el-steps>
      <div class='nowStatus'>
        <div class="text">
          <i class="el-icon-warning icon"></i>
          <span class='icon'>当前订单状态:{{ datalist.status | getOrderStatus }}</span>
        </div>
        <div class="btn-wrapper">
          <el-button @click='dialogVisible=true;dialogStatus = 1;title="修改收货人信息"'>
            修改收货人信息
          </el-button>
          <el-button @click='close' v-if='datalist.status == 1'>
            关闭订单
          </el-button>
          <el-button @click='dialogVisible=true;dialogStatus = 2;title="备注订单"'>
            备注订单
          </el-button>
        </div>
      </div> 
      <div class='second'>
          <div class='title'>统计信息</div>
          <div class='flex'>
              <div class='wrapper'>
                  <div class='prop'>订单id</div>
                  <div class='value'>{{datalist.id}}</div>
              </div>
              <div class='wrapper'>
                  <div class='prop'>订单编号</div>
                  <div class='value'>{{datalist.code}}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>用户账号</div>
                <div class='value'>{{mobilePhone}}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>支付方式</div>
                <div class='value'>微信小程序支付</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>订单来源</div>
                <div class='value'>小程序</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>订单类型</div>
                <div class='value'>{{ datalist.type == 1 ? '普通类型' : '限时秒杀' }}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>配送方式</div>
                <div class='value'>{{ datalist.sendCompany }}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>物流单号</div>
                <div class='value'>{{ datalist.sendCode }}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>自动确认收货时间</div>
                <div class='value'>{{ datalist.finishEndTime }}</div>
              </div>
          </div>
      </div>
      <div class='second'>
          <div class='title'>收货人信息</div>
          <div class='flex'>
              <div class='wrapper'>
                  <div class='prop'>收货人</div>
                  <div class='value'>{{ datalist.receiver }}</div>
              </div>
              <div class='wrapper'>
                  <div class='prop'>手机号码</div>
                  <div class='value'>{{datalist.phone}}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>邮政编码</div>
                <div class='value'></div>
              </div>
              <div class='wrapper'>
                <div class='prop'>收货地址</div>
                <div class='value'>{{ datalist.address }}</div>
              </div>
          </div>
      </div>
      <div class="fourth">
          <div class="title">商品信息</div>
          <el-table class="mall-table" :data="datalist.details" :header-cell-style="headerStyle" :cell-style="tdStyle" style='border-right:1px solid #b4b4b4;border-bottom:1px solid #b4b4b4'>
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <img :src="getGoodImg(scope.row.goodsPic)" style='max-width: 60px'/>
                </template>
              </el-table-column>
              <el-table-column label="商品名称">
                <template slot-scope="scope">{{ scope.row.goodsName }}</template>
              </el-table-column>
              <el-table-column label="价格/货号">
                <template slot-scope="scope">{{ scope.row.goodsPrice }}/{{ scope.row.goodsNo }}</template>
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="scope">{{ scope.row.goodsDesc }}</template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <span>{{ scope.row.buyNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="品牌">
                <template slot-scope="scope">
                  <span>{{ scope.row.goodsBrand }}</span>
                </template>
              </el-table-column>
              <el-table-column label="小计">
                <template slot-scope="scope">
                  <span>{{ scope.row.totalMoney }}</span>
                </template>
              </el-table-column>
          </el-table>
      </div>
      <div class='second'>
          <div class='title'>费用信息</div>
          <div class='flex'>
              <div class='wrapper'>
                  <div class='prop'>商品合计</div>
                  <div class='value'>{{ datalist.totalMoeny }}</div>
              </div>
              <div class='wrapper'>
                  <div class='prop'>运费</div>
                  <div class='value'>包邮</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>订单总金额</div>
                <div class='value'>{{ datalist.totalMoeny }}</div>
              </div>
              <div class='wrapper'>
                <div class='prop'>应付款金额</div>
                <div class='value'>{{ datalist.totalMoeny }}</div>
              </div>
          </div>
      </div> 
      <el-dialog :visible.sync='dialogVisible' :title='title' width="30%">
        <el-form :model='ruleForm' :rules="rules" label-width="100px" ref="ruleForm" class="form" style='margin:0 20px'>
          <div v-if="dialogStatus == 1">
            <el-form-item label="收货人姓名: " prop="receiver">
              <el-input v-model="ruleForm.receiver"></el-input>
            </el-form-item>
            <el-form-item label="手机号码: " prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="详细地址: " prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
          </div>
          <div v-if="dialogStatus == 2">
            <el-form-item label="操作备注: ">
              <el-input v-model="mechantRemark" type="textarea" :rows="5"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="mall-btn" @click="dialogVisible = false">取 消</el-button>
          <el-button class="mall-btn" type='primary' @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>       
    </div>
</div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
import filters from '../../common/data/filters'
export default {
  components:{
    subtitle,
    pagination
  },
  filters:filters,
  name: 'info',
  data () {
    return {
      datalist:'',
      dialogVisible:false,
      dialogStatus:'',
      mobilePhone:'',
      title:'',
      ruleForm: {},
      mechantRemark: '',
      rules: {
          receiver: [
            { required: true, message: '请输入收货人姓名', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { max: 11, message: '请输入正确的手机号', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ] 
      },
     }
  },
  created(){
    if (this.$route.query.id) {
        this.getOrderInfo()
        this.mobilePhone = this.$route.query.mobilePhone
      }
  },
  methods:{
    close(){
      this.$confirm('确定关闭订单嘛', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=>{
          this.$axios.post('/merchant_order/update',{
            id: this.$route.query.id,
            status: 0
          }).then((res)=>{
            if(res.data.errno != '200'){
              this.$message.error(res.data.msg)
            }else{
              this.getOrderInfo();
              this.$message({
                type:'success',
                message:'关闭成功'
              });
            }
            
          },(err)=>{
            this.$message.error(err.msg)
          })  
        },()=>{
          this.$message('已取消删除')
        })
    },
    submitForm(val){
      if(this.dialogStatus == 1){
        this.$refs[val].validate((valid)=>{
          if(valid){
            this.$axios.post("merchant_order/updateOrder",this.ruleForm).then(()=>{
              this.$message({
                type:'success',
                message:'操作成功'
              });
              this.dialogVisible = false;
              this.getOrderInfo();
            }).catch((err)=>{
              this.$message.error(err.msg)
            })
          }else{
            return false
          }
        })
      }else{
        this.$axios.post("merchant_order/updateOrder",{
          id: this.ruleForm.id,
          mechantRemark: this.mechantRemark
        }).then(()=>{
              this.$message({
                type:'success',
                message:'操作成功'
              });
              this.dialogVisible = false;
              this.getOrderInfo();
            }).catch((err)=>{
              this.$message.error(err.msg)
            })
      }
    },
    getOrderInfo(){
      this.$axios.post('merchant_order/query_By_Id',{
        id: this.$route.query.id,
        merchantId : JSON.parse(localStorage.userInfo).merchantId
      }).then((res)=>{
        this.datalist = res.data.data
        this.$set(this.ruleForm, 'receiver', res.data.data.receiver)
        this.$set(this.ruleForm, 'phone', res.data.data.phone)
        this.$set(this.ruleForm, 'address', res.data.data.address)
        this.$set(this.ruleForm, 'id', res.data.data.id)
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    },
    getGoodImg(val){
      if(val){
        return val.split(',')[0]
      }else{
        return require('@/assets/image.png')
      }
    },
    headerStyle(){  
      return {
        color: '#595757',
        background: '#F6F6F6',
        fontSize: '15px',
        borderLeft: '1px solid #b4b4b4',
        borderTop: '1px solid #b4b4b4',
        textAlign: 'center'
      }
   },
   tdStyle(){
     return {
        color: '#595757',
        fontSize: '15px',
        borderLeft: '1px solid #b4b4b4',
        borderTop: '1px solid #b4b4b4',
        textAlign: 'center'
      }
   },
  },
  
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin:30px auto   
  .nowStatus
    display:flex
    justify-content:space-between
    align-items:center
    border:1px solid #b4b4b4
    padding:20px
    background:#efefef
    .text
      color:#D23029
  .second
    margin-top:30px
    border-right:1px solid #b4b4b4
    .title
      border:1px solid #b4b4b4
      border-right:none
      background:#f6f6f6
      line-height:40px
      padding-left:20px
      font-size: 16px
      font-weight:bold
    .flex
      display:flex
      .wrapper
        flex:1 1 auto
        text-align:center 
        .prop
          background:#f6f6f6
          line-height:49px
          color: #5a5a5a
          font-weight:700
          font-size:15px
          border-left:1px solid #b4b4b4
          border-bottom:1px solid #b4b4b4
        .value
          height:49px
          line-height:49px
          font-size:15px
          border-left:1px solid #b4b4b4
          border-bottom:1px solid #b4b4b4
  .fourth
    margin-top:30px
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer
    .title
      border:1px solid #b4b4b4
      border-bottom:none
      background:#f6f6f6
      line-height:40px
      padding-left:20px
      font-size: 16px
      font-weight:bold
</style>
<style>
.body .fourth .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
}  
</style>