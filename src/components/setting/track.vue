<template>
  <div class='addProp'>
    <subtitle :subtitle="'支付设置'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="form">
        <el-form-item label='支付名称:' prop='name'>
          <el-input  v-model='ruleForm.name'></el-input>
        </el-form-item>
        <el-form-item label='支付描述:' prop='detail'>
          <el-input  v-model='ruleForm.detail' type='textarea'></el-input>
        </el-form-item>
        <el-form-item label='AppId:' prop='appid'>
          <el-input  v-model='ruleForm.appid'></el-input>
        </el-form-item>
        <el-form-item label="AppSecret: " prop="appsecret">
          <el-input v-model="ruleForm.appsecret"></el-input>
        </el-form-item>
        <el-form-item label="商户密钥key: " prop="appkey">
          <el-input v-model="ruleForm.appkey"></el-input>
        </el-form-item>
        <el-form-item label="支付商户号: " prop="mchId">
          <el-input v-model="ruleForm.mchId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'addProp',
  components:{
    subtitle,
    pagination
  },
  data () {
    let validParam = (item, value, callback) => {
        if (this.dynamicTags.length == 0){
          callback(new Error('请添加属性值'));
        } else if (this.ruleForm.paramSelect == 0 && this.dynamicTags.length > 1){
          callback(new Error('唯一属性只能添加一个属性值'));
        }else{
          callback();
        }
      };
    return {
      isAdd:true,
      inputValue:'',
      visible:false,
      typeList:[],
      dynamicTags: [],
      ruleForm: {
          name: '',
          detail: '',
          appid: '',
          appsecret: '',
          appkey: '',
          mchId: '',
      },
      rules: {
          name: [
            { required: true, message: '请输入支付名称', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          appid: [
            { required: true, message: '请输入AppID', trigger: 'blur' },
          ],
          appsecret: [
            { required: true, message: '请输入AppSecret', trigger: 'blur' },
          ],
          appkey: [
            { required: true, message: '请输入商户密钥key', trigger: 'blur' },
          ],
          mchId: [
            { required: true, message: '请输入支付商户号', trigger: 'blur' },
          ],
        },
       
        
        
     
     }
  },
  mounted(){
    this.$axios.post("merchant_pay_mode/query").then((res)=>{
        this.$set(this.ruleForm, 'name', res.data.data.name);
        this.$set(this.ruleForm, 'detail', res.data.data.detail);
        this.$set(this.ruleForm, 'appid', res.data.data.appid);
        this.$set(this.ruleForm, 'appsecret', res.data.data.appsecret);
        this.$set(this.ruleForm, 'appkey', res.data.data.appkey);
        this.$set(this.ruleForm, 'mchId', res.data.data.mchId);
        if (res.data.data.id){
          this.$set(this.ruleForm, 'id', res.data.data.id);
        }
    })
  },
  methods:{
    afterSubmit(){
      setTimeout(()=>{
        this.back()
      },500)
    },
    submit(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          if(this.ruleForm.id){
          	this.$axios.post("merchant_pay_mode/update",this.ruleForm).then((res)=>{
          		console.log(res)
          		this.$message({
          			type:'success',
          			message:'操作成功'
          		})
          	}).catch((err)=>{
          		this.$message.error(err.msg)
          	})
          }else{
          	this.$axios.post("merchant_pay_mode/add",this.ruleForm).then((res)=>{
          		console.log(res)

          		this.$message({
          			type:'success',
          			message:'操作成功'
          		})
          	}).catch((err)=>{
          		this.$message.error(err.msg)
          	})
          }
        }
      })
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin: 30px auto
  .form
    width:600px
    .props
      .props-tag
        margin-right:8px
      .props-input
        width:110px
    .changeProp
      .tips
        font-size:12px
        color: #5a5a5a
        line-height:16px
    .propSort
      .tips
        font-size:12px
        color: #5a5a5a
        line-height:16px
        margin-top:5px
</style>