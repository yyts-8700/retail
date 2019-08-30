<template>
  <div class='return'>
    <subtitle :subtitle="'订单列表'"/>
    <div class='body'>
        <div class='menu-btn-wrapper'>
            <el-button class='menu-btn' :class='isActive=="all"?"active":""' @click='changeList("all")'>
                全部申请(<em class='number'>{{all}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==1?"active":""' @click='changeList(1)'>
                待处理(<em class='number'>{{all_wei}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==2?"active":""' @click='changeList(2)'>
                退货中(<em class='number'>{{all_return}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==6?"active":""' @click='changeList(6)'>
                已完成(<em class='number'>{{all_complate}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==3?"active":""' @click='changeList(3)'>
                已拒绝(<em class='number'>{{all_refuse}}</em>)
            </el-button>
        </div>
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
              <div class='text'>收货人:</div>
              <el-input v-model="receiver" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="收货人姓名" class="search-input" clearable></el-input>
              <div class='text'>提交时间:</div>
	          <el-date-picker
	              v-model="value"
	              align="right"
	              type="date"
	              placeholder="选择日期"
	              format="yyyy-MM-dd"
	              value-format="yyyy-MM-dd hh:mm:ss"
	              :picker-options="pickerOptions" @change="search">
	          </el-date-picker>
            </div>
        </div>
        <div class='table-title'>
            <span class='datalist'>订单列表</span>
            <div class="btn-wrapper">
                <el-button @click="exportOrder">导出订单</el-button>
            </div>
        </div>
        <el-table @selection-change='selectionChange' ref='table' class='order-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column
            type="selection"
            width="55" :selectable='selectable'>
	        </el-table-column>
	        <el-table-column label="服务单号">
	          <template slot-scope="scope">{{ scope.row.code }}</template>
	        </el-table-column>
	        <el-table-column label="申请时间">
	          <template slot-scope="scope">{{ scope.row.creatTime }}</template>
	        </el-table-column>
	        <el-table-column label="用户账号">
	          <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
	        </el-table-column>
	        <el-table-column label="退款金额">
	          <template slot-scope="scope">{{ scope.row.applicationReturnMoney }}</template>
	        </el-table-column>
	        <el-table-column label="申请状态">
	          <template slot-scope="scope">
	            <span v-if="scope.row.status == 1">待处理</span>
	            <span v-else-if="scope.row.status == 2">同意退货</span>
	            <span v-else-if="scope.row.status == 3">拒绝退货</span>
	            <span v-else-if="scope.row.status == 4">收到货确认退款</span>
	            <span v-else-if="scope.row.status == 5">收到货拒绝退款</span>
	            <span v-else>完成</span>
	          </template>
	        </el-table-column>
	        <el-table-column label="操作">
	          <template slot-scope="scope">
	            <span class="table-btn" v-if="scope.row.status == 1"
	                  >查看详情</span>
	            <span class="table-btn" v-else-if="scope.row.status == 3" @click="remove([scope.row.id])">删除</span>
	          </template>
	        </el-table-column>
        </el-table>
        <pagination :total='total' :pageSize="pageSize" :optionsList="optionsList" :isClear="true" @handleChangeAll='handleChangeAll' @confirmBatch='confirmBatch' @next='next'></pagination>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'return',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
    	all: '',
        all_wei: '',
        all_return: '',
        all_complate: '',
        all_refuse: '',
        value:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        isActive:'all',
        searchcode:'',
        receiver:'',
        tableData: [],
        optionsList: {
          'delete': '删除'
        },
        status:'',
        visibleSearch: false,
        checkItemId: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        
     }
  },
  mounted(){
    this.getNumber()
    this.getList(1)
  },
  methods:{
  	getNumber(){
  		this.$axios.post('/merchant_return_goods/getCountByStatus',{
  			status: '',
            merchantId: JSON.parse(localStorage.userInfo).merchantId
  		}).then((res)=>{
  			this.all = res.data.data
  		});
  		this.$axios.post('/merchant_return_goods/getCountByStatus',{
  			status: 1,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
  		}).then((res)=>{
  			this.all_wei = res.data.data
  		});
  		this.$axios.post('/merchant_return_goods/getCountByStatus',{
  			status: 2,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
  		}).then((res)=>{
  			this.all_return = res.data.data
  		});
  		this.$axios.post('/merchant_return_goods/getCountByStatus',{
  			status: 6,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
  		}).then((res)=>{
  			this.all_complate = res.data.data
  		});
  		this.$axios.post('/merchant_return_goods/getCountByStatus',{
  			status: 3,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
  		}).then((res)=>{
  			this.all_refuse = res.data.data
  		});
  	},
    selectable(row){
	   if(row.status == 3){
          return true
        }else{
          return false
        }
    },
    next(val) {
        this.nowPage = val;
        this.getList(val)
    },
    remove(id){
        this.$confirm('确定关闭订单嘛', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then((res)=>{
            this.$axios.post('/merchant_return_goods/delete',{ids: id}).then(()=>{
                this.getList(1)
                this.$message({
                    type:'success',
                    message:'删除成功'
                })
            })
        },()=>{})
    },

    exportOrder(){

    },
    changeList(val){
        this.isActive = val
        if (val == 'all') {
          this.status = ''
          this.getList(1)
        }else{
          this.status = val
          this.getList(1)
        }
        
    },
    getList(pageSize){
        if (this.searchcode == "") {
          this.searchcode = null;
        }
        if (this.receiver == "") {
          this.receiver = null;
        }
      this.$axios.post('/merchant_return_goods/query_for_page',{
          currentPage: pageSize,
          pageSize: this.pageSize,
          contact: this.receiver,
          code: this.searchcode,
          creatTime: this.value,
          status: this.status,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        }).then((res) => {
          this.total = res.data.data.totalCount
          this.tableData = res.data.data.list
        },(err) => {
          this.$message({
              showClose: true,
              message: '获取失败',
              type: 'error'
          })
        })
    },
    search(){
        this.getList(1)
    },
    showToggle(){
      this.visibleSearch = !this.visibleSearch
    },
    
    selectionChange(val){
      let checkItem = []
      val.forEach((item)=>{
        checkItem.push(item.id)
      })
      this.checkItemId = checkItem
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
    confirmBatch(val){
      if (val && this.checkItemId.length > 0){
        if(val == 'delete'){
          this.remove(this.checkItemId);
        }else if(val == 'shift'){
          this.shiftItem(this.checkItemId);
        }else if (val == 'restore'){
            console.log(this.checkItemId)
          this.restore(this.checkItemId);
        }else if (val == 'showBrand'){
          this.batchBrandHandleShow(this.checkItemId, 1);
        }else if (val == 'hideBrand'){
          this.batchBrandHandleShow(this.checkItemId, 0);
        }else if (val == 'close'){
          this.closeItem(this.checkItemId);
        }
      }else {
        this.$message({
          type:'warning',
          message:"未选择操作项"
        });
      }
    },
    handleChangeAll(val){
      if (val){
        this.$refs.table.toggleAllSelection();
      } else {
        this.$refs.table.clearSelection();
      }
    },
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin: 30px auto
  .menu-btn-wrapper
    margin-bottom:30px
    .menu-btn
      .number
        color:#f00
      &.active
        color:#fff
        background-color: #5BC0BF
        border-color: #5BC0BF
        .number
          color:#fff
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
    display:flex
    justify-content:space-between
    line-height:60px
    background:#efefef
    border:1px solid #b4b4b4
    border-bottom:none
    .datalist
      font-size:20px
      font-weight:bold
      color:#5a5a5a
      padding-left:20px
    .btn-wrapper
      margin-right:20px
        
  .order-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer  
  .track-dialog
    .wrapper1,.wrapper2
      margin-left:40px
      margin-bottom:30px 
      font-size:16px
      .prop
        margin-right:10px
    .wrapper2
      margin-bottom:0 
      
           
</style>
<style>
.body .order-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>