<template>
  <div class='indexFirst'>
    <subtitle :subtitle="'系统首页'"/>
    <div class="body">
      <div class='first-row'>
        <div class='item'>
          <img src="../../assets/index/icon-1.png">
          <div class='inner-item'>
            <span class='char'>今日订单总数</span><br>
            <span class='number'>{{ data.todayOrderNum }}</span>
          </div>
        </div>
        <div class='item'>
          <img src="@/assets/index/icon-2.png">
          <div class='inner-item'>
            <span class='char'>今日销售额</span><br>
            <span class='number'>¥{{data.todayOrderMoney}}</span>
          </div>
        </div>
        <div class='item'>
          <img src="@/assets/index/icon-3.png">
          <div class='inner-item'>
            <span class='char'>昨日销售额</span><br>
            <span class='number'>￥{{data.yesterdayOrderMoney}}</span>
          </div>
        </div>
        <div class='item'>
          <img src="@/assets/index/icon-4.png">
          <div class='inner-item'>
            <span class='char'>近七日销售总额</span><br>
            <span class='number'>￥{{data.nearlySevenDaysOrderMoney}}</span>
          </div>
        </div>
      </div>
      <table class='table' border='1'>
        <caption class='title'>待处理事务</caption>
        <tbody>
        <tr>
          <td @click="linkOrder">代付款订单<em>({{ data.dfk }})</em></td>
          <td @click="linkOrder">已完成订单<em>({{ data.ywc }})</em></td>
          <td @click="linkOrder">待确认退货订单<em>({{ data.dqrth }})</em></td>
        </tr>
        <tr>
          <td @click="linkOrder">待发货订单<em>({{ data.dfh }})</em></td>
          <td @click="linkOrder">待处理退款申请<em>({{ data.dcltk }})</em></td>
          <td @click="linkOrder">已发货订单<em>({{ data.dsh }})</em></td>
        </tr>
        <tr>
          <td @click="linkAd">广告位即将到期<em>(0)</em> </td>
        </tr>
      </tbody>
      </table>
      <div class='fast-in'>
        <div class='fast-head'>运营快捷入口</div>
        <ul>
          <li @click='linkUrl(item.path)' v-for='(item,index) in entryList' :key='index' class='item'>
            <img :src="item.icon">
            <div class='list-text'>{{item.text}}</div>
          </li>
        </ul>
      </div>
      <div class='info'>
        <div class='goodsview'>
          <div class='title'>商品总览</div>
          <ul class='flex'>
            <li class='flex-1'>
              <span class='number'>{{ goodsData.notpull || 0 }}</span><br>
              <span class='text'>已下架</span>
            </li>
            <li class='flex-1'>
              <span class='number'>{{ goodsData.put || 0 }}</span><br>
              <span class='text'>已上架</span>
            </li>
            <li class='flex-1'>
              <span class='number'>{{ goodsData.all || 0 }}</span><br>
              <span class='text'>全部商品</span>
            </li>
          </ul>
        </div>
         <div class='userview'>
          <div class='title'>用户总览</div>
          <ul class='flex'>
            <li class='flex-1'> 
              <span class='number'>{{ userData.yesterdayAddUserCount  || 0 }}</span><br>
              <span class='text'>昨日新增</span>
            </li>
            <li class='flex-1'>
              <span class='number'>{{ userData.monthAddUserCount  || 0 }}</span><br>
              <span class='text'>本月新增</span>
            </li>
            <li class='flex-1'>
              <span class='number'>{{ userData.allUserCount  || 0 }}</span><br>
              <span class='text'>会员总数</span>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle.vue'
export default {
  name: 'indexFirst',
  components:{
   subtitle
  },
  data () {
    return {
      data:'',
      goodsData:'',
      userData:'',
      entryList: [
          {
            icon: require('../../assets/index/icon-5.png'),
            text: '添加商品',
            path: '/goods/addGoods',
            nav:'goods'
          },
          {
            icon: require("@/assets/index/icon-6.png"),
            text: '订单列表',
            path: '/orders/list',
            nav:'orders'
          },
          {
            icon: require("@/assets/index/icon-7.png"),
            text: '用户管理',
            path: '/users/list',
            nav:'users'
          },
          // {
          //   icon: require("@/assets/index/icon-8.png"),
          //   text: '交易统计',
          //   path: '/stat/trade',
          //   nav:'stat'
          // },
          {
            icon: require("@/assets/index/icon-10.png"),
            text: '广告管理',
            path: '/operate/list',
            nav:'operate'
          }
        ]
     }
  },
  mounted(){
    this.$axios.post("merchant_order/getOrderAllCount",{
      merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
    }).then((res)=>{
      this.data = res.data.data
    });
    this.$axios.post("merchant/merchant_index").then((res)=>{
      this.userData = res.data.data
    });
    this.$axios.post("merchantGoods/goodsCountStatistics").then((res)=>{
      this.goodsData = res.data.data
    })
  },
  methods:{
    linkUrl(path){
      this.$router.push(path)
    },
    linkOrder(){
      this.$router.push('/orders/list')
    },
    linkAd(){
      this.$router.push('/operate/list')
    }
    
  }
}
</script>
<style lang='stylus' scoped>
.body
  margin:36px 44px 0 
  .first-row
    display:flex
    min-width:1244px
    margin-bottom:30px
    .item
      flex:1
      height:106px
      background:#f7f8f8
      margin-right:54px
      border: 1px solid #5BC0BF
      img
        margin:11px 0px 11px 14px
      &:last-child
        margin-right:0
      .inner-item
        display:inline-block 
        height:54px
        vertical-align:top
        margin:26px 0 
        span
          line-height:28px
        .char
          font-size:18px
          color:#5a5a5a
        .number
          font-size:18px
          color:#d23029
          font-weight:bold
  .table
    width:100%
    margin-bottom:30px
    border:1px solid #b4b4b4
    .title
      line-height: 60px
      color: #5a5a5a
      font-weight: bold
      font-size: 22px
      background-color: #efefef
      text-align: left
      padding-left: 20px
      border: 1px solid #b4b4b4
      border-bottom-color: transparent
    tr
      line-height:60px
      background:#fff
      td
        padding-left:20px
        color:#646262
        &:hover
          text-decoration:underline
          cursor:pointer
        em
          float:right
          margin-right:20px
          color:#f31414
  .fast-in
    height:234px
    border:1px solid #b4b4b4
    margin-bottom:30px
    .fast-head
      line-height: 60px
      color: #5a5a5a
      font-weight: bold
      font-size: 22px
      background-color: #efefef
      text-align: left
      padding-left: 20px
      border-bottom: 1px solid #b4b4b4
    ul
      display:flex
      padding:20px 0 35px
      .item
        flex:1
        text-align:center
        .list-text
          font-size:18px
          color:#646262
          &:hover
            color:#5AC2C0
            cursor:pointer
  .info
    margin-bottom:30px
    display:flex
    justify-content:space-between
    .goodsview,.userview
      flex: 0 1 auto
      width:600px
      border: 1px solid #b4b4b4
      .title
        line-height:60px
        background:#efefef
        color:#5a5a5a
        font-size:22px
        text-align:left
        padding-left:20px
        font-weight:bold
        border-bottom:1px solid #b4b4b4
      .flex
        display:flex  
        .flex-1
          flex:1
          padding:20px 0  
          text-align:center
          font-size:18px
          color:#646262
          line-height:26px
          .number
            color:#D23029
          
        

      
      
</style>
