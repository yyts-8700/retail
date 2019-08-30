<template>
  <div class='list'>
    <subtitle :subtitle="'用户列表'"/>
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
              <div class='text'>用户昵称:</div>
              <el-input v-model="realName" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="请输入用户昵称" class="search-input" clearable></el-input>
              <div class='text'>用户手机:</div>
              <el-input v-model="phoneNumber" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="请输入手机号" class="search-input" clearable></el-input>
              <div class='text'>注册时间:</div>
              <el-date-picker
	              v-model="datePicker"
	              @change="getList"
	              value-format="yyyy-MM-dd HH:mm:ss"
	              type="datetimerange"
	              style='margin-top:8px;width:300px'
	              clearable
	              range-separator="至"
	              start-placeholder="开始日期"
	              end-placeholder="结束日期">
	          </el-date-picker>
            </div>
        </div>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
        </div>
        <el-table  ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            
            <el-table-column label='用户ID'>
              <template slot-scope='scope'>
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column label="手机号">
            <template slot-scope="scope">
             {{ scope.row.mobilePhone }}
            </template>
            </el-table-column>
            <el-table-column label="用户昵称">
              <template slot-scope="scope">
                {{ scope.row.realName }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="账户启用状态">
              <template slot-scope="scope">
                <el-switch @change='changeUserStatus($event,scope.row)' v-model="scope.row.userStatus" active-color='#5BC0BF' inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="table-btn" @click="$router.push('/users/list/info?id=' + scope.row.id)">查看</span>
              </template>
            </el-table-column>
        </el-table>
        <pagination @next='next' :total='total' :pageSize="pageSize" :isBatch="false" ></pagination>
    </div>  
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
import qs from 'qs'

export default {
  name: 'list',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
    	tableData: [],
        phoneNumber: null,
        realName: null,
        datePicker: [],
        beginTime: null,
        endTime: null,
        visibleSearch: false,
        goodsName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        
     }
  },
  mounted(){
    this.getList()
  },
  methods:{
  	changeUserStatus(e,row){
  		this.$axios.post('user/change_user_status',qs.stringify({
		  userId: row.id,
          userStatus: e
  		}),{type: 'form'}).then((res)=>{ 			
  			this.$message({
  				type:'success',
  				message:'操作成功'
  			})
  		}).catch((err)=>{
        	this.$message.error(err.msg)
        })
  	},
  	next(val){
  		this.currentPage = val
  		this.getList()
  	},
    getList(){
      if (this.datePicker && this.datePicker.length > 0){
          this.beginTime = this.datePicker[0];
          this.endTime = this.datePicker[1];
        }else {
          this.beginTime = '';
          this.endTime = '';
        }
        this.$axios.post('/user_detail/list',{
        	  currentPage: this.currentPage,
            pageSize: this.pageSize,
            mobilePhone: this.phoneNumber,
            realName: this.realName,
            beginTime: this.beginTime,
            endTime: this.endTime,
        }).then((res)=>{
        	this.tableData = res.data.data.list;
        	this.total=res.data.data.totalCount
        }).catch((err)=>{
        	this.$message.error(err.msg)
        })
    },
    showToggle(){
      this.visibleSearch = !this.visibleSearch
    },
    search(){
        this.getList()
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