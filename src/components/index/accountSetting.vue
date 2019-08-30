<template>
  <div class='accountSetting'>
    <subtitle :subtitle="'账户设置'"/>
    <div class="body">
      <div class='wrapper'>
        <img :src="imageUrl ? imageUrl:'http://attachments.gfan.com/forum/attachments2/day_110819/1108192322bb27a101fa4ac1fe.jpg'" alt="">
        <div class='tips'>上传图片</div>
        <input type="file" class='input-file' @change='upload' accept="image/jpeg, image/png">
      </div>
      <el-form :model='ruleForm' :rules='rules' ref='ruleForm' class='form' label-width='80px'>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="旧密码"  prop="oldPassword">
          <el-input type="password" v-model="ruleForm.oldPassword"></el-input>
        </el-form-item>
         <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword"></el-input>
        </el-form-item>
         <el-form-item label="确定密码" prop="twicePassword">
          <el-input type="password" v-model="ruleForm.twicePassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    
  </div>
</template>

<script>
import subtitle from '../subtitle.vue'
export default {
  name: 'accountSetting',
  data () {
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (this.ruleForm.twicePassword !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    }
    return {
      imageUrl:'',
      userInfo:'',
      ruleForm: {
        name: '',
        oldPassword: '',
        newPassword: '',
        twicePassword: '',
        merchantLogo: ''
      },
      rules: {
        name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
        twicePassword: [
            { required: true, trigger: 'blur',validator: validatePass2 }
          ]
      },
      
     }
  },
  components:{
	 subtitle
  },
  created(){
    this.userInfo = JSON.parse(this.$store.getters.userInfo)
    this.ruleForm.name = this.userInfo.merchantName
    this.ruleForm.merchantLogo = this.userInfo.merchantLogo
    // this.imageUrl = this.userInfo.imgUrl + this.userInfo.merchantLogo
  },
  methods:{
    upload(file){
      let fd = new FormData();
      fd.append('file', file.file);
      this.$axios.post('merchant/upload_file',fd,{
        type: 'form',
        file: 'image'
      }).then((res)=>{
        this.ruleForm.merchantLogo = res.data.data.image
        this.imageUrl = this.userInfo.imgUrl + res.data.data.image
      })
    },
    submit(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          this.$axios.post('/merchant/change_password',this.ruleForm,{
            type:'form'
          }).then(()=>{
            this.userInfo.merchantName = this.ruleForm.name;
            this.userInfo.merchantLogo = this.ruleForm.merchantLogo;
            this.$message({
              type:'success',
              message:'修改成功'
            });
            this.ruleForm.oldPassword = '';
            this.ruleForm.newPassword = '';
            this.ruleForm.twicePassword = '';
            this.$store.commit('SET_USERINFO', JSON.stringify(this.userInfo));
          }).catch((err)=>{
            this.$message.error(err.msg)
          })
        }
      })
    },
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin:30px auto
  .wrapper
    position:relative
    width:120px
    margin:0 auto
    text-align:center
    padding-left:50px
    img
      display:inline-block
      width:100px
      height:100px
      border-radius:50% 
      border:1px solid #b4b4b4
    .tips
      font-size: 12px
      color: #606266
      margin-top: 5px
    .input-file
      position:absolute
      top:-2px
      left:58px
      display:inline-block
      width:102px
      height:102px
      border-radius:50%
      z-index:5
      opacity:0
</style>
<style>
.body .form .el-form-item{
  width: 400px;
  margin: 26px auto;
}
.body .form .el-button{
  margin-left: 120px;
  background: #5BC0BF;
  border-color: #5BC0BF;
}
</style>