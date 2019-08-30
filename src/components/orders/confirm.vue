<template>
  <div class='confirm'>
    <subtitle :subtitle="'确认收货'"/>
    <div class='main-content'>
        <div class='filter-wrapper'>
            <div class='first-view'>
              <div class='search-left'>
                 <span><i class="el-icon-search"></i>筛选查询</span>
              </div>
              <div class='search-right'>
                <span v-show='!visibleSearch' @click='showToggle'><i class="el-icon-arrow-down"></i>
                  打开筛选</span></span>
                <span v-show='visibleSearch' @click='showToggle'><i class="el-icon-arrow-up"></i>
                  收起筛选</span></span>
                <el-button class='search' @click='search'>查询结果</el-button>
              </div>
            </div>
            <div class='second-view' v-show='visibleSearch'>
              <div class='text'>输入搜索:</div>
              <el-input v-model="searchcode" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="订单编号" class="search-input" clearable></el-input>
              <div class='text'>用户账号</div>
              <el-input v-model="receiver" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="用户账号" class="search-input" clearable></el-input>
            </div>
        </div>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
        </div>
        <el-table  ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column label="订单编号" width='200'>
	          <template slot-scope="scope">{{ scope.row.code }}</template>
	        </el-table-column>
	        <el-table-column label="提交时间" width='180'>
	          <template slot-scope="scope">{{ scope.row.creatTime }}</template>
	        </el-table-column>
	        <el-table-column label="用户账号">
	          <template slot-scope="scope">{{ scope.row.mobilePhone}}</template>
	        </el-table-column>
	        <el-table-column label="订单金额" width='100'>
	          <template slot-scope="scope">{{ scope.row.totalMoeny }}</template>
	        </el-table-column>
	        <el-table-column label="支付方式">
	          <template slot-scope="scope">微信小程序支付</template>
	        </el-table-column>
	        <el-table-column label="订单来源">
	          <template slot-scope="scope">微信小程序</template>
	        </el-table-column>
	        <el-table-column label="订单状态" width='100'>
	          <template slot-scope="scope">待收货</template>
	        </el-table-column>
	        <el-table-column label="操作">
	          <template slot-scope="scope">
	            <span class="table-btn" @click="$router.push('/orders/list/orderDetail?id=' + scope.row.id)">查看订单</span>
	            <span class="table-btn" @click="makeSure(scope.row.id)">确定收货</span>
	          </template>
	        </el-table-column>
        </el-table>
        <pagination :total='total' :pageSize="pageSize" @next='next' :isBatch="false" ></pagination>
    </div>  
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'

export default {
  name: 'confirm',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
    	searchcode:'',
    	receiver:'',
    	tableData: [],
    	pageSize: 10,
        total: 0,
        visibleSearch: false,
        currentPage: 1,      
     }
  },
  mounted(){
    this.getList(1)
  },
  methods:{
  	next(val){
  		this.getList(val)
  	},
  	makeSure(id){
  		this.$confirm('确定收货嘛', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then((res) => {
          this.$axios.post('/merchant_order/update', {
            id: id,
            status: 4,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          }).then((res) => {
            this.getList(1)
            this.$message({
            	type:'success',
            	message:'收货成功'
            })
          }).catch((err)=>{
          	this.$message.error(err.msg)
          })
        },()=>{})
  	},
    getList(val){
    	if (this.searchcode == "") {
          this.searchcode = null
        }
        if (this.receiver == "") {
          this.receiver = null
        }
      this.$axios.post('/merchant_order/query_for_page',{
          currentPage: val,
          pageSize: this.pageSize,
          status: 3,
          phone: this.receiver,
          code: this.searchcode,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        }).then((res) => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
        },(err) => {
          this.$message({
              showClose: true,
              message: '获取失败',
              type: 'error'
          });
        })
    },
    showToggle(){
      this.visibleSearch = !this.visibleSearch
    },
    search(){
      this.getList(1)
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
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.main-content
  width:90%
  margin: 30px auto
  .filter-wrapper
    width:100%
    border:1px solid #b4b4b4
    margin-bottom:30px
    .first-view
      height:56px
      display:flex
      line-height:56px
      justify-content:space-between
      .search-left
        flex: 0 0 auto
        color:#5a5a5a
        font-size:14px
        margin-left:20px
        i
          margin-right:5px
      .search-right
         flex: 0 0 auto
         margin-right:20px
         span
           color:#5a5a5a
           font-size:14px
           margin-right:10px
           cursor:pointer
    .second-view
      background:#efefef
      height:56px
      line-height:56px
      display:flex
      .text
        margin: 0 15px
        font-size:14px
        color:#5a5a5a   
  .table-title
    position:relative
    line-height:60px
    background:#efefef
    border:1px solid #b4b4b4
    border-bottom:none
    .datalist
      font-size:20px
      font-weight:bold
      color:#5a5a5a
      padding-left:20px
  .goods-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer   
</style>
<style>
.main-content .goods-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>