<template>
  <div class='info'>
    <subtitle :subtitle="'用户信息'"/>
    <div class='body'>
        <div class='first'>
            <div class='img-wrapper'>
                <img src="http://img4.imgtn.bdimg.com/it/u=1595412055,4203759403&fm=15&gp=0.jpg" alt="">
            </div>
            <div class="father">
              <div class="son">
                <div class='prop'>用户ID</div>
                <div class='value'>{{ data.user.id }}</div>
              </div>
              <div class="son">
                <div class='prop'>昵称</div>
                <div class='value'>{{ data.user.realName }}</div>
              </div>
              <div class="son">
                <div class='prop'>性别</div>
                <div class='value'>{{ data.user.sex | getSex }}</div>
              </div>
              <div class="son">
                <div class='prop'>生日</div>
                <div class='value'>{{ data.user.birthday }}</div>
              </div>
              <div class="son">
                <div class='prop'>城市</div>
                <div class='value'>{{ data.user.remark5 }}</div>
              </div>
            </div>
            <div class="father">
              <div class="son">
                <div class='prop'>职业</div>
                <div class='value'>无</div>
              </div>
              <div class="son">
                <div class='prop'>个性签名</div>
                <div class='value'>无</div>
              </div>
              <div class="son">
                <div class='prop'>喜欢的分类</div>
                <div class='value'>无</div>
              </div>
              <div class="son">
                <div class='prop'>注册时间</div>
                <div class='value'>{{ data.user.createTime }}</div>
              </div>
              <div class="son">
                <div class='prop'>用户来源</div>
                <div class='value'>小程序</div>
              </div>
            </div>
        </div>
        <div class='second'>
            <div class='title'>统计信息</div>
            <div class='flex'>
                <div class='wrapper'>
                    <div class='prop'>消费金额</div>
                    <div class='value'>{{data.consumption ? data.consumption : 0}}</div>
                </div>
                <div class='wrapper'>
                    <div class='prop'>订单数量</div>
                    <div class='value'>{{data.order_count}}</div>
                </div>
                <div class='wrapper'>
                  <div class='prop'>收藏商品</div>
                  <div class='value'>100</div>
                </div>
                <div class='wrapper'>
                  <div class='prop'>商品评价</div>
                  <div class='value'>{{ data.evaluation }}</div>
                </div>
                <div class='wrapper'>
                  <div class='prop'>退货记录</div>
                  <div class='value'>{{ data.return_record }}</div>
                </div>
                <div class='wrapper'>
                  <div class='prop'>登录次数</div>
                  <div class='value'>{{ data.login_count }}</div>
                </div>
            </div>
        </div>
        <div class='third'>
           <div class="add-title">收货地址</div>
            <el-table class="mall-table" :data="data.addressList" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column label="姓名">
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column label="手机号" width="140">
                  <template slot-scope="scope">{{ scope.row.phone }}</template>
                </el-table-column>
                <el-table-column label="详细地址">
                  <template slot-scope="scope">{{ scope.row.address }}</template>
                </el-table-column>
                <el-table-column label="邮政编码" width="140">
                  <template slot-scope="scope">{{ scope.row.postalCode }}</template>
                </el-table-column>
                <el-table-column label="默认地址" width="140">
                  <template slot-scope="scope">
                    <el-switch disabled v-model="scope.row.defaultState" :active-value="1" :inactive-value="2" active-color="#5BC0BF" inactive-color="#ff4949"></el-switch>
                  </template>
                </el-table-column>
            </el-table> 
        </div>
        <div class="fourth">
            <div class="title">订单记录</div>
            <el-table class="mall-table" :data="list" :header-cell-style="headerStyle" :cell-style="tdStyle" style='border-right:1px solid #b4b4b4'>
                <el-table-column label="订单编号">
                  <template slot-scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column label="提交时间" width="140">
                  <template slot-scope="scope">{{ scope.row.creatTime }}</template>
                </el-table-column>
                <el-table-column label="用户账号">
                  <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
                </el-table-column>
                <el-table-column label="订单金额" width="140">
                  <template slot-scope="scope">{{ scope.row.totalMoeny }}</template>
                </el-table-column>
                <el-table-column label="支付方式" width="140">
                  <template slot-scope="scope">
                    <span>微信</span>
                  </template>
                </el-table-column>
                <el-table-column label="订单来源" width="140">
                  <template slot-scope="scope">
                    <span>小程序</span>
                  </template>
                </el-table-column>
                <el-table-column label="订单状态" width="140">
                  <template slot-scope="scope">
                    <span>{{ scope.row.status | getOrderStatus }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                  <template slot-scope="scope">
                    <span class="table-btn">查看订单</span>
                  </template>
                </el-table-column>
            </el-table>
            <pagination @next="next" :isBatch="false" :total="total" :pageSize="pageSize"></pagination>
        </div>
        
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
        data: {
         user:{}
        },
        total:0,
        currentPage:1,
        pageSize:10,
        list:[],
     }
  },
  mounted(){
    this.getList()
    this.getUserInfo()
  },
  methods:{
    next(val){
        this.currentPage = val
        this.getList()
    },
    getUserInfo(){
        this.$axios.post("user_detail/query/"+this.$route.query.id)
        .then((res)=>{    
            this.data = res.data.data
        }).catch((err)=>{
            this.$message.error(err.msg)
        })
    },
    getList(){
        this.$axios.post("merchant_order/query_for_page",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.getItem('userInfo')).merchantId,
          userId: this.$route.query.id
        }).then((res)=>{

            this.list = res.data.data.list
            this.total = res.data.data.totalCount
        })
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
  .first
    display:flex
    border-left:1px solid #b4b4b4
    border-top:1px solid #b4b4b4
    .img-wrapper
      display:flex
      align-items:center
      flex:0 0 200px
      border-right:1px solid #b4b4b4   
      border-bottom:1px solid #b4b4b4 
      img
        width: 100px
        border-radius:50%
        margin:0 50px
    .father
      flex:1 1 auto
      .son
        display:flex
        line-height:36px
        font-size:14px
        border-right:1px solid #b4b4b4   
        border-bottom:1px solid #b4b4b4    
        .prop
          flex: 0 0 35%
          color:#5a5a5a 
          padding-left:10px 
          border-right:1px solid #b4b4b4 
          background:#f6f6f6
        .value
          padding-left:10px 
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
        flex:0 1 20%
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
          line-height:49px
          font-size:15px
          border-left:1px solid #b4b4b4
          border-bottom:1px solid #b4b4b4
  .third
    margin-top:30px
    border-right:1px solid #b4b4b4
    border-bottom:1px solid #b4b4b4    
    .add-title
      border:1px solid #b4b4b4
      border-right:none
      border-bottom:none
      background:#f6f6f6
      line-height:40px
      padding-left:20px
      font-size: 16px
      font-weight:bold
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
.body .third .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
.body .fourth .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>