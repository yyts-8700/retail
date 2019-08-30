<template>
  <div class='login'>
  	<div class='main'>
      <div class='title'>
        后台管理服务系统
      </div>
      <div class='form'>       
            <input class='input' type="text" placeholder="请输入用户名称" autocomplete = 'off' v-model='form.loginName'>   
            <input class='input' type="password" placeholder="请输入登录密码" v-model='form.loginPassword' autocomplete = 'off'>
            <input type="submit" name="submit" value='登录' class='submit' @click='login'>
      </div>
    </div>
    <div class='footer'>
      Copyright © 2018-2019 零售后台
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'login',
  data () {
    return {

      tipsmap:['用户名或密码不正确','请输入用户名称','请输入登录密码','正常登陆成功'],
      form: {
          loginName: '13932493200',
          loginPassword: '000000'
        },
     }
  },
  
  methods:{
    login(){
      this.$router.push('/index');
        // if(!this.form.loginName){
        //   this.$message({
        //     type:'warning',
        //     message:this.tipsmap[1]
        //   })
        //   return false
        // }
        // if(!this.form.loginPassword){
        //   this.$message({
        //     type:'warning',
        //     message:this.tipsmap[2]
        //   })
        //   return false
        // }
        // this.$axios.post('/merchant/login', qs.stringify(this.form), {
        //   type: 'form'
        // }).then((res) => {
        //   if(res.data.errno == 200){
        //     this.$store.commit("setUserinfo", JSON.stringify(res.data.data));
        //     // localStorage.userId = res.data.data.userId
        //     // localStorage.userMobile = res.data.data.merchantMobile
        //     // localStorage.merchantId_ID = res.data.data.merchantId
        //     // localStorage.moduleId = 300
        //     this.$message({
        //       showClose: true,
        //       message: '登录成功',
        //       type: 'success' 
        //     });
        //     setTimeout(() => {
        //       this.$router.push('/index');
        //     }, 500);
        //   } else {
        //     this.$message.error(res.data.msg);
        //   }
          
        // }, (err) => {
        //   this.$message.error(err.msg);
        // })
      }
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.login
  position:relative
  height:100%
  background:#84E1DF
  .main
    position:absolute
    left:50%
    top:50%
    margin-left:-185px;
    margin-top:-210px;
    width:370px
    height:420px
    padding:10px 10px
    .title
      height:28px
      font-size:28px
      text-align:center
      color:rgba(255,255,255,1);
      margin-bottom:72px
    .form
      height:290px
      width:370px
      .input
        height:60px
        width:350px
        text-align:center
        border-radius:15px
        border:none
        background:#fff !important
        margin:0 10px 30px 10px
        &:-webkit-autofill
          box-shadow: 0 0 0px 1000px #fff inset !important
      .submit
        position:absolute
        bottom:9px
        height:60px
        width:350px
        text-align:center
        border-radius:15px
        border:none
        margin:1px 10px 30px 10px
        background:#3CBBBA
        color:#fff
        &:hover
          cursor:pointer
  .footer
    position:absolute
    bottom:0
    left:50%
    margin-left:-150px
    width:300px
    height:20px
    font-size:18px
    line-height:20px
    text-align:center
    color:#fff
          
        
        
        
      
</style>
