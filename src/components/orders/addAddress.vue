<template>
  <div class='addProp'>
    <subtitle :subtitle="'添加发货点'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form">
        <el-form-item label="发货点名称: " prop="returnPname">
          <el-input v-model="ruleForm.returnPname"></el-input>
        </el-form-item>
        <el-form-item label="发货人姓名: " prop="returnName">
          <el-input v-model="ruleForm.returnName"></el-input>
        </el-form-item>
        <el-form-item label="详细地址: " prop="returnAddress">
          <el-input type="textarea" v-model="ruleForm.returnAddress"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="returnPhone">
          <el-input type="textarea" v-model="ruleForm.returnPhone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
export default {
  name: 'addProp',
  components:{
    subtitle
  },
  data () {
    return {
      isAdd:true,
      ruleForm: {
          returnPname: '',
          returnName: '',
          returnAddress: '',
          returnPhone:''
        },
        rules: {
          returnPname: [
            { required: true, message: '请输入发货点名称', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          returnName: [
            { required: true, message: '请输入发货人姓名', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          returnAddress: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          returnPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ]
          
        }        
     }
  },
  mounted(){
    if(this.$route.query.id){
    	this.$axios.post('/return_send/query_By_Id',{
    		id: this.$route.query.id
    	}).then((res)=>{	
    		this.isAdd = false
    		this.$set(this.ruleForm,'returnPname',res.data.data.returnPname)
    		this.$set(this.ruleForm,'returnName',res.data.data.returnName)
    		this.$set(this.ruleForm,'returnAddress',res.data.data.returnAddress)
    		this.$set(this.ruleForm,'returnPhone',res.data.data.returnPhone)
    	}).catch((err)=>{
    		this.$message.error(err.msg)
    	})
    }
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    afterSubmit(){
      setTimeout(()=>{
        this.back()
      },500)
    },
    submit(val){
      this.ruleForm.merchantId = JSON.parse(this.$store.getters.userInfo).merchantId
      this.$refs[val].validate((valid)=>{
        if(valid){
          if(this.isAdd){
            this.$axios.post("/return_send/add_or_update",this.ruleForm).then(()=>{
              this.$message({
                  type:'success',
                  message:'操作成功'
                });
              this.afterSubmit()
            }).catch((err)=>{
                this.$message.error(err.msg)
            })
          }else{
            this.ruleForm.id = this.$route.query.id;
            this.$axios.post("/return_send/add_or_update",this.ruleForm).then(()=>{
              this.$message({
                  type:'success',
                  message:'操作成功'
                });
              this.afterSubmit()
            }).catch((err)=>{
                this.$message.error(err.msg)
            })
          }
        }
      })
    },
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin: 30px auto
  .form
  	width:500px
  	margin-left:150px
</style>