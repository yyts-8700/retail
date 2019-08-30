<template>
  <div class='homepage'>
    <!-- 123 -->
    <div class='header'>
        <div class='logo'>
            <img src="../../assets/logo.jpg">
        </div>
        <ul class="nav">
            <li  @click='switchNav(item.path)' :class="{active:index === activeNav}" class='nav-item' v-for='(item,index) in nav' :key='index'>{{item.title}}</li>
        </ul>
        <ul class='user-nav'>
            <li class='user hover' @mouseover='show' @mouseout='hide'>
                <i class='iconfont'>&#xe63f;</i><span class='admin'>123</span>
            </li>
            <li class='home hover' @click='toIndex'>
                <i class='iconfont'>&#xe661;</i>  
            </li>
            <li class='turn-off hover' @click='close'>
                <i class='iconfont'>&#xe61f;</i>
            </li>
        </ul> 
        <div class='loginfo' v-show='showlogin' @mouseover='show' @mouseout='hide'>
          <div class='head'>
            <span class='login'>登录信息</span>
            <span class='setting' @click="toSetting">账户设置</span>
          </div>
          <div class='content'>
            <ul>
              <li><span class='text block'>本次登录：</span>{{ loginData[0].operateTime }}</li>
              <li><span class='text block'>登录地区：</span>( IP：{{ loginData[0].ip }} )</li>
              <li><span class='text block'>上次登录：</span>{{ loginData[1].operateTime }}</li>
            </ul>
          </div>
        </div>
        <div class='orderinfo'></div>
    </div>
    <div class='menu'>
      <ul v-for='(item,index) in menu' :key='index'>
        <li class='menu-title'>{{item.sub}}</li>
        <router-link class='menu-item' v-for='(child,idx) in item.menu' tag='li' :to='child.path' :key='idx'>{{child.name}}</router-link>
      </ul>
    </div> 
    <div class='main-content'>

        <router-view></router-view>

    </div>
  </div>
</template>

<script>
import nav from '../../common/data/nav.js'
export default {
  name: 'homepage',
  data () {
    return {
        nav:nav,
        showlogin:false,
        loginData:[{},{}],
     }
  },
  computed:{
    activeNav(){
      return this.$store.getters.activeNav;
    },
    menu(){
      return nav[this.$store.getters.activeNav].child
    },
    // userInfo(){
    //     return JSON.parse(this.$store.getters.userInfo);
    // }
  },
  mounted(){
    // this.$axios.post("merchant/get_merchant_login_info_list",{
    //     currentPage: 1,
    //     pageSize: 10,
    //     orderBy: 'operate_time desc'
    // }).then((res)=>{
    //   this.loginData = res.data.data.list
    // })

  },
  methods:{
    switchNav(path){
      this.$router.push(path);
    },
    toSetting(){
      this.$router.push('/index/accountSetting')
    },
    show(){
      this.showlogin = true
    },
    hide(){
      this.showlogin = false
    },
    toIndex(){
      this.$router.push('/index/systemIndex')
    },
    close(){
      this.$router.push('/')
      this.$store.commit('clearUserinfo')
    }   
  }
}
</script>


<style lang='stylus' rel='stylesheet/stylus' scoped>
.homepage
  position:relative
  height:100%
  .header
    position:fixed
    top:0
    left:0
    box-sizing:border-box
    width:100%
    height:90px
    min-width:1920px
    padding:0 144px
    background:#5BC0BF
    z-index:10
    .logo
      display:inline-block
      height:38px
      width:116px
      vertical-align:top
      margin:26px 39px 26px 0
      img
        height:100%
        width:100%
    .nav
      display:inline-block
      width:960px
      height:90px
      .nav-item
        display:inline-block
        width:80px
        height:90px
        font-size:20px
        line-height:90px
        text-align:center
        color:#fff
        &.active
          background:#7ccdcc
        &:hover
          cursor:pointer
    .user-nav
      float:right
      display:inline-block
      width:380px
      height:90px
      vertical-align:top
      li
        display:inline-block
        color:#fff
        height:90px
        line-height:90px
        margin-right:40px
        i
          font-size:30px
          vertical-align:top
        &:last-child
          padding-right:0
        &.hover:hover
          color:#eef0a4
        &.user i
          padding-right:15px
          font-size:40px
        &.user .admin
          display:inline-block
          line-height:30px
          height:30px
          vertical-align:top
          border-right:1px solid #fff
          margin-top:30px
          padding-right:20px
        &:hover
          cursor:pointer
        &.user:hover,&.tips:hover
          cursor:default  
    .loginfo
      position:absolute
      right:144px
      bottom:0
      height:240px
      width:420px
      margin-bottom:-241px
      border:1px solid #B9B9BA
      border-radius:0 0 5px 5px
      background:#fff
      box-shadow:3px 3px 1px #E9E9E9
      .head
        height:66px
        width:380px
        line-height:66px
        margin:0 20px
        border-bottom:1px solid #d2d2d2
        font-size:18px
        .login
          margin-left:20px
          font-weight:700
          background:#fff
        .setting
          float:right
          margin-right:20px
          color:#5bc0bf
          &:hover
            cursor:pointer
      .content
        margin:35px 20px 0 35px
        li
          margin-bottom:20px
          font-size:16px
          .text
            color:#B9B9BA
            &.block
              margin-right:10px
  .menu
    position:fixed
    left:144px
    top:90px
    bottom:0
    width:260px
    height:100%
    background:#EFEFEF
    z-index:10
    .menu-title
      height:60px
      line-height:60px
      font-size:18px
      text-align:center
      background:#EFEFEF
      color:#B9B9BA
      border-bottom:1px solid #e5e5e5
    .menu-item
      height:60px
      line-height:60px
      font-size:18px
      text-align:center
      background:#EFEFEF
      color:#595757
      border-bottom:1px solid #e5e5e5
      i
        margin-right:10px
        font-size:10px
      &.active
        background:#FFFFFF
        color:#5BC0BF
      &:hover
        cursor:pointer
        color:#5BC0BF
  .main-content
    position:absolute  
    height:100%
    top:90px
    left:404px 
    width:70%      
</style>
