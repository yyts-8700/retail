<template>
  <div class='prop'>
    <subtitle :subtitle="'参数列表'"/>
    <div class='body'>
      <div class='table-title'>
        <span class='datalist'>数据列表</span>
        <div class='button-wrapper'>
          <el-button class='return' @click='back'>返回</el-button>  
          <el-button class='addProp' @click='$router.push("/goods/type/addParam")'>添加参数</el-button>    
        </div>
      </div>
      <el-table @selection-change='selectionChange' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle" ref='table' class='param-list'>
        <el-table-column type='selection' width='55'>
        </el-table-column>
        <el-table-column label='编号' width='80'>
            <template slot-scope="scope" >
                {{ scope.row.id }}
            </template>
        </el-table-column>
        <el-table-column label='参数名称' >
            <template slot-scope="scope">
                {{ scope.row.paramName }}
            </template>
        </el-table-column>
        <el-table-column label='商品类型' width='120'>
            <template slot-scope="scope">
                {{ scope.row.styleName }}
            </template>
        </el-table-column>
        <el-table-column label='参数录入方式' width="120"> 
            <template slot-scope="scope">
                {{ scope.row.paramSelect | getPropSelect}}
            </template>
        </el-table-column>
        <el-table-column label='可选值列表'>
            <template slot-scope="scope">
                {{ scope.row.paramList  }}
            </template>
        </el-table-column>
        <el-table-column label='排序' width="120">
            <template slot-scope="scope">
                {{ scope.row.paramSort }}
            </template>
        </el-table-column>
        <el-table-column label='操作'>
            <template slot-scope="scope">
                <span class='table-btn' @click='$router.push({name:"addParam",query:{id:scope.row.id}})'>编辑</span>
                <span class='table-btn' @click='remove([scope.row.id])'>删除</span>
            </template>
        </el-table-column>  
      </el-table>
      <pagination :total="total" :pageSize="pageSize" :optionsList="optionsList" @next="next"  @confirmBatch="confirmBatch" @handleChangeAll="handleChangeAll" :isClear='true'></pagination>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
import filters from '@/common/data/filters'
export default {
  name: 'prop',
  components:{
    subtitle,
    pagination,

  },
  filters:filters,
  data () {
    return {
      tableData: [],
      optionsList: {
        'delete': '删除'
      },
      checkItemId: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,   
     }
  },
  mounted(){
    this.getList()
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    selectionChange(val){
      let checkItem = []
      val.forEach((item)=>{
        checkItem.push(item.id)
      })
      this.checkItemId = checkItem
    },
    getList(){
        this.$axios.post("merchantGoodsParam/merchant_goods_property_list_page",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          styleId: this.$route.query.id
        }).then((res) => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
        },(err) => {
          this.$message.error(err.msg);
        })
    },
    next(val){
      this.currentPage = val;
      this.getList();
    },
    confirmBatch(val){
      if (val && this.checkItemId.length > 0){
        if(val == 'delete'){
          this.remove(this.checkItemId);
        }else if(val == 'shift'){
          this.shiftItem(this.checkItemId);
        }else if (val == 'restore'){
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
          type:'error',
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
        this.$confirm("确认删除吗?").then(()=>{
          this.$axios.post("merchantGoodsProperty/delete_batch",id).then(()=>{
            this.$message({
              type:'success',
              message:'操作成功'
            })
            this.getList()
          }).catch((err)=>{
            this.$message.error(err.msg)
          })
        },()=>{})
      }
    
      
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin: 30px auto
  .table-title
    display:flex
    justify-content:space-between
    position:relative
    line-height:60px
    background:#efefef
    border:1px solid #b4b4b4
    border-bottom:none
    .button-wrapper
      margin-right:20px
    .datalist
      font-size:20px
      font-weight:bold
      color:#5a5a5a
      padding-left:20px
  .param-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer
</style>
<style>
.body .param-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>