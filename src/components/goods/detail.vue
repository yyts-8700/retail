<template>
  <div class='detail'>
    <subtitle :subtitle="'评价详情'" @close='back' class='subtitle' :isClose='true'></subtitle>
    <div class='main-content'>
        <div class='left'>
            <div class='userAvatar'>
                <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1504788190,2342400802&fm=27&gp=0.jpg" alt="" width=100>
                <div class='userName'>{{tableData.userName}}</div>
            </div>
            <div class='userInfo'>
                <div>
                    商品：{{tableData.goodsName}}
                </div>
                <div>
                    评价：
                    <img v-for='(star,index) in tableData.commentLevel' src="@/assets/starOn.png" alt=""><img v-for='(star,index) in tableData.commentLevel1' src="@/assets/starOff.png" alt="">
                </div>
                <div>
                    日期：{{tableData.createTime}}
                </div>
                <div>
                    IP地址：{{tableData.commentIp}}
                </div>
            </div>
        </div>
        <div class='right'>
            <div class='comment'>
               <div>{{tableData.commentContent}}</div>
               <img v-for='i in picArray' width=200 :src="i">
            </div>
            <div class='response'>
                <div class='review'>回复评价</div>
                <el-form label-width='100px' style="width: 500px;">
                    <el-form-item label='用户名'>
                        <el-input v-model='ruleForm.name' readOnly></el-input>
                    </el-form-item>
                    <el-form-item label='回复内容'>
                        <el-input v-model='ruleForm.commentContent' type='textarea' rows=7 ></el-input>
                    </el-form-item>
                    <el-form-item label='回复内容'>
                        <el-button @click="handIn(ruleForm)" class='button' >提交</el-button>
                    </el-form-item> 
                </el-form>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
export default {
  name: 'detail',
  components:{
    subtitle
  },
  data () {
    return {
        tableData : '',
        picArray : '',
        ruleForm: {
            name: JSON.parse(localStorage.userInfo).merchantName,
            commentContent : ''
          },
     }
  },
  mounted(){
    this.$axios.post('/merchantGoodsComment/merchant_goods_type_list_page', {
            id : this.$route.query.id
        }).then((res)=>{
            for(let i=0;i<res.data.data.list.length;i++){
                res.data.data.list[i].commentLevel1 = 5-res.data.data.list[i].commentLevel;
            }
            this.tableData = res.data.data.list[0]
            if(this.tableData.imgUrl.length >0){
            this.picArray = this.tableData.imgUrl.split(',')
          }
        })
  },
  methods:{
    handIn(a){
        if(this.ruleForm.commentContent == ''){
            this.$message({
                type:'warning',
                message:'请输入评价内容'
            })
            return;
        }
        this.$axios.post('/merchantGoodsComment/merchant_comment_reply',{
            commentReplyContent : this.ruleForm.commentContent,
            id : this.tableData.id
        }).then((res)=>{
            this.$message({
                type:'success',
                message:'回复成功'
            })
        }).catch((err)=>{
            this.$message(err.msg)
        })
    },
    back(){
      console.log(1)
      this.$router.go(-1);
    },
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
  .detail
    height:100%
    .subtitle
      position:absolute
      top:0
      left:0
    .main-content
      width:90%
      height:100%
      margin: 90px auto 0
      border:1px solid #b4b4b4
      display:flex

      .left
        flex:0 0 25%
        border-right:1px solid #dedede
        .userAvatar
          text-align:center
          margin:30px 0 20px
          img
            border-radius:50%
        .userInfo
          width:80%
          margin:0 auto
          padding-left:25px
          line-height:30px
          color:#5a5a5a
      .right
        flex:1 1 auto
        .comment
          border-bottom:1px solid #b4b4b4
          padding:30px
        .response
          padding:30px 
          .review
            font-size:16px
            color:#5a5a5a
            font-weight:bold
            margin-bottom:30px
          .button
            background:#5BC0BF
            color:#fff
            &:hover
              background:#7ccdcc
            
          
          
      


      
        
</style>