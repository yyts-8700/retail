<template>
  <div class='evaluate'>
    <subtitle :subtitle="'商品评价'"/>
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
	          <el-input v-model="goodsName" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="关键字/商品名称" class="search-input" clearable></el-input>
	          <div class='text'>用户昵称：</div>
	           <el-input v-model="userName" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="关键字/商品名称" class="search-input" clearable></el-input>
	        </div>
	    </div>
	    <div class='table-title'>
	    	<span class='datalist'>数据列表</span>
	    </div>
	    <el-table @selection-change='selectionChange' ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column type='selection' width="55" prop="id" ></el-table-column>
            <el-table-column label='编号' width="100">
        		<template slot-scope='scope'>
        			{{scope.row.id}}
        		</template>
        	</el-table-column>
        	<el-table-column label='用户昵称' >
        		<template slot-scope='scope'>
        			{{scope.row.userName}}
        		</template>
        	</el-table-column>
        	<el-table-column label='商品名称' >
        		<template slot-scope='scope'>
        			{{scope.row.goodsName}}
        		</template>
        	</el-table-column>
        	<el-table-column label='评价' width="140">
        		<template slot-scope='scope'>
        			<img v-for='(star,index) in scope.row.commentLevel' src="@/assets/starOn.png" alt=""><img v-for='(star,index) in scope.row.commentLevel1' src="@/assets/starOff.png" alt="">
        		</template>
        	</el-table-column>
        	<el-table-column label='IP地址' width="140">
        		<template slot-scope='scope'>
        			{{scope.row.commentIp}}
        		</template>  		
        	</el-table-column>
        	<el-table-column label='评论时间' width="180">
        		<template slot-scope='scope'>
        			{{scope.row.createTime}}
        		</template>
        	</el-table-column>
        	<el-table-column label='是否显示' width="120">
        		<template slot-scope='scope'>
        			<el-switch
					  v-model="scope.row.status"
					  @change='changeStatus($event,scope.row.id)'
					  :active-value="0" 
					  :inactive-value="1"
					  active-color="#5BC0BF" 
					  inactive-color="#ff4949">
					</el-switch>
        		</template>
        	</el-table-column>
        	<el-table-column label='操作' >
        		<template slot-scope='scope'>
        			<span class="table-btn" @click='toDetail(scope.row.id)'>查看</span>
        			<span class="table-btn" @click='remove([scope.row.id])'>删除</span>
        		</template>
        	</el-table-column>			
        </el-table>
        <pagination :total='total' :pageSize="pageSize" :optionsList='optionsList' @handleChangeAll='handleChangeAll' @confirmBatch="confirmBatch" @next='next' :isClear='true'></pagination>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from "../pagination"
export default {
  name: 'evaluate',
  components:{
  	subtitle,
  	pagination
  },
  data () {
    return {
    	visibleSearch: false,
    	goodsName: '',
    	tableData: [],
        checkItemId: [],
        currentPage: 1,
      	pageSize: 10,
      	pageCount: 0,
      	total: 0,
      	userName: '',
      	optionsList: {
          'delete': '删除'
        },

     
     }
  },
  mounted(){
  	this.getList()
  },
  methods:{
  	getList(){
  		this.$axios.post('/merchantGoodsComment/merchant_goods_type_list_page',{
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            goodsName: this.goodsName,
            userName: this.userName,
        }).then((res)=>{
        	for(var i=0;i<res.data.data.list.length;i++){
               res.data.data.list[i].commentLevel1 = 5-res.data.data.list[i].commentLevel;
            }
        	this.total = res.data.data.totalCount
        	this.tableData = res.data.data.list
        })
  	},
  	showToggle(){
      this.visibleSearch = !this.visibleSearch
    },
    search(){
      this.currentPage = 1;
      this.getList();
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
    selectionChange(val){
      let checkItem = []
      val.forEach((item)=>{
        checkItem.push(item.id)
      })
      this.checkItemId = checkItem
    },
    changeStatus(e,id){
    	this.$axios.post('/merchantGoodsComment/delete_not_show',{
              id: id,
              status: e
            }).then(()=>{
            	this.$message({
            		message:'操作成功',
            		type:'success'
            	})
            }).catch((err)=>{
            	$message.error(err.msg)
            })
    },
    remove(id){
        this.$confirm("确认删除吗?",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios.post('/merchantGoodsComment/delete_batch', id).then(() => {
              this.getList();
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
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
    toDetail(id){
    	this.$router.push("/goods/evaluate/detail?id="+id)
    },
    handleChangeAll(val){
      if (val){
        this.$refs.table.toggleAllSelection();
      } else {
        this.$refs.table.clearSelection();
      }
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
    next(val){
      this.currentPage = val;
      this.getList();
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