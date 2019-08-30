<template>
  <div class='setting'>
    <subtitle :subtitle="'订单设置'"></subtitle>
    <div class="body">
        <el-form :model='ruleForm' :rules='rules' ref='ruleForm' label-width='150px' class='form'>
            <el-form-item label='正常订单超过' prop="normalEndpayTime">
                <el-input v-model='ruleForm.normalEndpayTime' placeholder="请输入时间" class='el-input1'></el-input><span class="span">分</span><em class="em">未付款，订单自动关闭</em>
            </el-form-item>
            <el-form-item label="发货超过" prop="sendEndTime">
               <el-input v-model="ruleForm.sendEndTime" placeholder="请输入时间" class='el-input1'></el-input><span class="span">天</span><em class="em">未收货，订单自动完成</em>
            </el-form-item>
            <el-form-item label="最终评论时间" prop="commentEndTime">
                <el-input v-model="ruleForm.commentEndTime" placeholder="请输入时间" class='el-input1'></el-input><span class="span">天</span><em class="em">好评并完成</em>
            </el-form-item>
            <el-form-item label="完成收货后" prop="finalEndTime">
                <el-input v-model="ruleForm.finalEndTime" placeholder="请输入时间" class='el-input1'></el-input><span class="span">天</span><em class="em">不能申请售后</em>
            </el-form-item>
            <el-form-item class='button-wrapper'>
                <el-button type="primary" @click="submit('ruleForm')">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
export default {
  name: 'setting',
  components:{
    subtitle,
  },
  data () {
    return {
        id:'',
        ruleForm: {
          normalEndpayTime: '',
          sendEndTime: '',
          commentEndTime: '',
          finalEndTime: ''
        },
        rules: {
          normalEndpayTime: [
            {required: true, message: '请输入时间', trigger: 'blur'},
          ],
          sendEndTime: [
            {required: true, message: '请输入时间', trigger: 'blur'}
          ],
          commentEndTime: [
            {required: true, message: '请输入时间', trigger: 'blur'}
          ],
          finalEndTime: [
            {required: true, message: '请输入时间', trigger: 'blur'}
          ]
        }
     
     }
  },
  created(){
    this.$axios.post('/merchant_order_set/queryOrderSet',{
        merchantId: JSON.parse(localStorage.userInfo).merchantId
    }).then((res)=>{
        this.$set(this.ruleForm, 'normalEndpayTime', res.data.data.normalEndpayTime);
        this.$set(this.ruleForm, 'sendEndTime', res.data.data.sendEndTime);
        this.$set(this.ruleForm, 'commentEndTime', res.data.data.commentEndTime);
        this.$set(this.ruleForm, 'finalEndTime', res.data.data.finalEndTime);
        this.id = res.data.data.id
    }).catch((err)=>{
        this.$message.error(err.msg)
    })
  },
  methods:{
    submit(val){
        this.$refs[val].validate((valid)=>{
            if(valid){
                this.$axios.post('/merchant_order_set/add_or_update',{
                  normalEndpayTime: this.ruleForm.normalEndpayTime,
                  sendEndTime: this.ruleForm.sendEndTime,
                  commentEndTime: this.ruleForm.commentEndTime,
                  finalEndTime: this.ruleForm.finalEndTime,
                  id: this.id,
                  merchantId: JSON.parse(localStorage.userInfo).merchantId
                }).then((res)=>{
                    this.$message({
                        type:'success',
                        message:'提交成功'
                    })
                })
            }
        })
    },
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  .form
    width:60%
    margin:30px auto 0
    .span
      display:inline-block
      text-align:center
      width: 40px
      height: 40px
      background: #efefef
      border: 1px solid #dcdfe6
      border-left:none
    .em
      display: inline-block
      width: 190px
      color: #606266
      text-align: left
      margin-left: 10px
     
</style>
<style>
.body .el-input{
    width: 200px;
    display: inline-block;
}
.body .el-form-item{
    width: 600px;
    margin: 18px auto;
}
.body .form .button-wrapper .el-button{
    margin-left: 100px;
}
</style>