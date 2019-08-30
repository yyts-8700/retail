<template>
  <div class='areaSetting'>
    <subtitle :subtitle="'支付证书'"/>
    <div class='body'>
        <el-form ref='ruleForm' class='form' label-width='100px'>
            <el-form-item label='支付证书：'>
                <div class="btn-wrapper">
                    <label for="upload"><el-button class='btn' size="small" type="primary">{{ fileName ? '重新上传' : '上传证书' }}</el-button></label>
                    <input @change="upload" id="upload" type="file" class="upload-input">
                    <div class='fileName'>{{ fileName }}</div>
                    <div class='tips'>只能上传p12证书文件</div>
                    <img src="@/assets/wechat-merchant.png" alt="" width="800">
                    <div class='changeW'>转入微信商户平台<a href="https://pay.weixin.qq.com" target="_blank">请点击</a></div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style='background:#5BC0BF;border:none'>保存</el-button>
            </el-form-item>
        </el-form>
    </div>
    
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'areaSetting',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
        fileName:''
        
     }
  },
  computed:{
    userInfo(){
        return this.$store.getters.userInfo;
      }
  },
  mounted(){
    this.getCredentials();
    },
  methods:{
    getCredentials(){
        this.$axios.post("merchant_pay_mode/query",{
            merchantId: JSON.parse(this.userInfo).merchantId
        }).then((res)=>{
            this.fileName = res.data.data.remark1.split('/').pop();
        })
    },
    upload(val){
        let file = val.target.files;
        if(file.length>0){
            if (file[0].name.split('.').pop() != 'p12'){
            this.$message({
                type:'warning',
                message:"请上传p12证书文件"
            });
            return
          }else{
            let formData = new FormData();
            formData.append('files', file[0]);
            formData.append('merchantId', JSON.parse(this.userInfo).merchantId);
            this.$axios.post("file/file_upload",formData,{
              type: 'form',
              file: 'image'
            }).then(()=>{
                this.$message({
                    type:'success',
                    message:'上传成功'
                })
            })
          }
        }
    }
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin: 30px auto   
  .form
    .btn-wrapper
      position:relative
      .btn
        background:#5BC0BF
        border:none
      .upload-input
        width:80px
        height:32px
        position:absolute
        left:0
        top:5px
        z-index:5
        opacity:0
      .fileName
        font-size:14px
        color:#000
      .tips
        font-size: 12px
        color: #5a5a5a
        line-height: 16px
        margin: 10px 0
      .changeW
        a
          margin-left:5px
          color:#5BC0BF
        
</style>