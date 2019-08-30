<template>
  <div class='type'>
    <subtitle :subtitle="'商品类型'"/>
    <div class='body'>

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
            <el-button class='search' @click="search">查询结果</el-button>
          </div>
        </div>
        <div class='second-view' v-show='visibleSearch'>
          <div class='text'>操作日期:</div>
          <el-date-picker
              v-model="value1"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              
              :picker-options="pickerOptions1"
              @change="getList(1)"
              clearable
              class="select-time">
          </el-date-picker>
        </div>
      </div>
      <div class='table-title'>
          <span class='datalist'>数据列表</span>
      </div>
      <el-table class="goods-list" :data="tableData" :header-cell-style="headerStyle":cell-style="tdStyle">
        <el-table-column label="编号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="操作者">
          <template slot-scope="scope">{{ scope.row.operator }}</template>
        </el-table-column>
        <el-table-column label="操作日期">
          <template slot-scope="scope">{{ scope.row.operationDate }}</template>
        </el-table-column>
        <el-table-column label="IP地址">
          <template slot-scope="scope">{{ scope.row.ip }}</template>
        </el-table-column>
        <el-table-column label="操作记录">
          <template slot-scope="scope">{{ scope.row.operationRecord }}</template>
        </el-table-column>
      </el-table> 
      <pagination :total='total' :isBatch='false' :pageSize="pageSize" @next='next'></pagination> 
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'type',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
      visibleSearch:false,
      tableData: [],
      total: 1,
      pageSize: 10,
      value1:'',
      pickerOptions1: {
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
    }
  },
  mounted(){
    this.getList(1)
  },
  methods:{
    getList(val){
      this.$axios.post('/user_operation_log/query_user_operation_log',{
        currentPage: val,
        pageSize: this.pageSize,
        operationDate: this.value1 || null,
        merchantId: JSON.parse(localStorage.userInfo).merchantId
      }).then((res)=>{
        this.tableData = res.data.data.list
        this.total= res.data.data.totalCount
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    },
    next(val) {
      this.getList(val);
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
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
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
.body .goods-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>