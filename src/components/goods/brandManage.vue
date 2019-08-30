<template>
  <div class='list'>
    <subtitle :subtitle="'商品列表'"/>
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
          <el-input v-model="name" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="品牌名称/关键字" class="search-input" clearable></el-input>
        </div>
      </div>
      <div class='table-title'>
        <span class='datalist'>数据列表</span>
        <el-button  class='add' @click='$router.push("/goods/brandManage/addBrand")'>添加品牌</el-button>
      </div>
      <el-table @selection-change='selectionChange' ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
	        <el-table-column type="selection" width="55"> </el-table-column>
	        <el-table-column label="编号">
	          <template slot-scope="scope">{{ scope.row.id }}</template>
	        </el-table-column>
	        <el-table-column label="品牌名称">
	          <template slot-scope="scope">{{ scope.row.name }}</template>
	        </el-table-column>
	        <el-table-column label="品牌首字母">
	          <template slot-scope="scope">{{ scope.row.firstChar }}</template>
	        </el-table-column>
	        <el-table-column label="排序">
	          <template slot-scope="scope">{{ scope.row.sorting }}</template>
	        </el-table-column>
	        <el-table-column label="是否显示">
	          <template slot-scope="scope">
	            <el-switch @change="changeShow($event, scope.row)" v-model="scope.row.isShow" :active-value="1" :inactive-value="0" active-color="#5BC0BF" inactive-color="#ff4949"></el-switch>
	          </template>
	        </el-table-column>
	        <el-table-column label="相关">
	          <template slot-scope="scope">
	            <span>商品: {{ scope.row.goodsTotal }}</span>
	          </template>
	        </el-table-column>
	        <el-table-column label="操作">
	          <template slot-scope="scope">
	            <span class="table-btn" @click="$router.push('/goods/brandManage/addBrand?id=' + scope.row.id)">编辑</span>
	            <span class="table-btn" @click="remove([scope.row.id])">删除</span>
	          </template>
	        </el-table-column>
        </el-table>
      <pagination :total="total" :pageSize="pageSize" :optionsList="optionsList" @next="next"  @confirmBatch="confirmBatch" @handleChangeAll="handleChangeAll" :isClear='true'></pagination>
    </div> 
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from "../pagination"
import jjd from "./js"


export default {
  name: 'list',
  data () {
    return {
      name:'',
      visibleSearch: false,
      currentPage: 1,
      pageSize: 10,
      pageCount: 0,
      total: 0,
      tableData: [],
      optionsList: {
          'delete': '删除',
          'showBrand': '显示品牌',
          'hideBrand': '隐藏品牌',
        },
      checkItemId: [],
      dialogLoading: false,
     }
  },
  components:{
    subtitle,
    pagination
  },
  methods:{
  	batchBrandHandleShow(id,type){
  		this.$axios.post("merchant_goods_brand/hidden_batch",{
  			type: type,
            ids: id
  		}).then((res)=>{
  			this.getList()
  			this.$message({
	          type:'success',
	          message:'操作成功'
	        })
  		}).catch(()=>{
	        this.$message.error(err.msg)
	      })
  	},
  	changeShow(e,row){
  		let data = {
    	  id: row.id,
          name: row.name,
          logo: row.logo,
          areaLogo: row.areaLogo,
          story: row.story,
          isShow: e,
          sorting: row.sorting,
          firstChar: row.firstChar
      };
      this.$axios.post("merchant_goods_brand/update",data).then((res)=>{
        this.$message({
          type:'success',
          message:'操作成功'
        })
      }).catch(()=>{
        this.$message.error(err.msg)
      })
  	},
    getList(){
      this.$axios.post("merchant_goods_brand/query_for_page",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          name: this.name,
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
    remove(id){
        this.$confirm("确认删除吗?",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios.post("merchant_goods_brand/delete_batch", id)
            .then(() => {
              this.getList();
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
          },(err) => {
            this.$message(err.msg);
          })
        },()=>{
            this.$message('已取消删除')
          }) 
    },
    selectionChange(val){
      let checkItem = []
      val.forEach((item)=>{
        checkItem.push(item.id)
      })
      this.checkItemId = checkItem
    },
    showToggle(){
      this.visibleSearch = !this.visibleSearch
    },
    search(){
      this.currentPage = 1;
      this.getList();
    },
  },
  mounted(){
    this.getList()
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
    .add
      position:absolute
      right:20px
      top:10px
  .goods-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer
  .dialog
    .goodsNo
       margin-bottom:20px
       color:#5a5a5a
    .table
      border:1px solid #b4b4b4
      thead
        background:#eeeeee
        line-height:50px
        text-align:center
        color:#5a5a5a
      tr
        line-height:50px
        text-align:center
        color:#5a5a5a
        td
          padding:5px 15px
          &:first-child
            padding:5px 60px
    .footer
      .el-button
        &:hover
          color:#5BC0BF
          background:#eff9f9
        &.confirm
          background:#5BC0BF
          color:#fff
          border:none
          &:hover
            background:#7ccdcc    
</style>
<style>
.main-content .goods-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>