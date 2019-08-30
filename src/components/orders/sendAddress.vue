<template>
  <div class='sendAddress'>
    <subtitle :subtitle="'发货点信息管理'"/>
    <div class='main-content'>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <div class='btn-wrapper'>
              <el-button @click="$router.push('/orders/sendAddress/addAddress')">添加发货点</el-button>
            </div>
        </div>
        <el-table @selection-change='selectionChange' ref='table' class='reason-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column  type="selection" width="55"></el-table-column>
            <el-table-column label="编号">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="发货点名称">
              <template slot-scope="scope">{{ scope.row.returnPname }}</template>
            </el-table-column>
             <el-table-column label="发货人姓名">
              <template slot-scope="scope">{{ scope.row.returnName }}</template>
            </el-table-column>
            <el-table-column label="地址">
              <template slot-scope="scope">{{ scope.row.returnAddress }}</template>
            </el-table-column>
            <el-table-column label="联系电话">
              <template slot-scope="scope">{{ scope.row.returnPhone }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="table-btn" @click="$router.push('/orders/sendAddress/addAddress?id=' + scope.row.id)">编辑</span>
                <span class="table-btn" @click="remove([scope.row.id])">删除</span>
              </template>
            </el-table-column>
        </el-table>
        <pagination :total='total' :pageSize="pageSize" :optionsList="optionsList" :isClear="true" @handleChangeAll='handleChangeAll' @confirmBatch='confirmBatch'></pagination>
    </div>  
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'sendAddress',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
        checkItemId: [],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        optionsList: {
        'delete':'删除'
      },
     }
  },
  mounted(){
    this.getList()
  },
  methods:{
    
    getList(){
      this.$axios.post("/return_send/query_for_page",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
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
    remove(id){
        this.$confirm("确认删除吗?",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios.post("return_send/delete ", {ids: id}).then(() => {
              this.getList()
              this.$message({
              type: 'success',
              message: '删除成功!'
            })
          },(err) => {
            this.$message(err.msg);
          })
        },()=>{
            this.$message({
                type: 'info',
                message: '已取消删除'
              }) 
          })
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
  .reason-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer   
</style>
<style>
.main-content .reason-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>
</style>