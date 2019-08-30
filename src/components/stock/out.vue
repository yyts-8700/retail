<template>
  <div class='evaluate'>
    <subtitle :subtitle="'商品入库'"/>
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
	          <el-input v-model="name" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="商品名称/商品货号" class="search-input" clearable></el-input>
	          <div class='text'>操作类型:</div>
	           <el-select clearable placeholder="请选择操作类型" v-model="operateType" @change="search">
	           	<el-option v-for='(item,index) in stockTypeList' :value='item.code' :label='item.name' :key='index'></el-option>
	           </el-select>
	           <div class='text'>操作时间：</div>
	           <el-date-picker
	               style='margin-top: 8px; width: 300px;'
	               v-model="datePicker"
	               type="daterange"
	               @change="changeDate"
	               value-format="yyyy-MM-dd HH:mm:ss"
	               range-separator="至"
	               start-placeholder="开始日期"
	               end-placeholder="结束日期">
	           </el-date-picker>
	        </div>
	    </div>
	    <div class='table-title'>
	    	<span class='datalist'>数据列表</span>
	    </div>
	    <el-table @selection-change='selectionChange' ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column label="编号">
	          <template slot-scope="scope">{{ scope.row.id }}</template>
	        </el-table-column>
	        <el-table-column label="商品图片">
	          <template slot-scope="scope">
	            <img :src="getImg(scope.row.goodsImg)" alt="" style='max-height: 60px'>
	          </template>
	        </el-table-column>
	        <el-table-column label="商品名称">
	          <template slot-scope="scope">
	            <p>{{ scope.row.goodsName }}</p>
	            <p>品牌: {{ scope.row.brandName }}</p>
	          </template>
	        </el-table-column>
	        <el-table-column label="货号/属性">
	          <template slot-scope="scope">{{ scope.row.goodsNo }}/{{ scope.row.property }}</template>
	        </el-table-column>
	        <el-table-column label="订单号">
	          <template slot-scope="scope">{{ scope.row.orderCode }}</template>
	        </el-table-column>
	        <el-table-column label="库存">
	          <template slot-scope="scope">
	            <p>数量: {{ scope.row.changeNumber }}</p>
	            <p>剩余: {{ scope.row.changeAfter }}</p>
	          </template>
	        </el-table-column>
	        <el-table-column label="操作类型">
	          <template slot-scope="scope">{{ scope.row.typeName }}</template>
	        </el-table-column>
	        <el-table-column label="操作信息">
	          <template slot-scope="scope">{{ scope.row.createTime }}</template>
	        </el-table-column>			
        </el-table>
        <pagination :total='total'  :isBatch='false' :pageSize="pageSize" @next='next' ></pagination>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from "../pagination"
import qs from 'qs'
export default {
  name: 'evaluate',
  components:{
  	subtitle,
  	pagination
  },
  data () {
    return {
    	stockTypeList:[],
    	datePicker:[],
    	name:'',
    	operateType:'',
    	beginTime: '',
        endTime: '',
        tableData: [],

    	visibleSearch: false,
    	goodsName: '',
        checkItemId: [],
        currentPage: 1,
      	pageSize: 10,
      	pageCount: 0,
      	total: 0,
      	userName: '',
     }
  },
  mounted(){
  	this.getStockType(1)
  	this.getList()
  },
  methods:{
  	getStockType(val){
      this.$axios.post("merchant_goods_log/query_type",qs.stringify({
        type: val
      }),{type: 'form'}).then((res) => {
        this.stockTypeList = res.data.data
      })
    },
  	getImg(val){
  		if(val){
  			return val.split(',')[0]
  		}else{
  			return require('@/assets/image.png')
  		}
  	},
  	changeDate(val){
  		if(val){
  			this.beginTime = val[0];
  			this.endTime = val[1];
        	this.getList();
  		}else{
  			this.beginTime = '';
  			this.endTime = '';
        	this.getList();
  		}
  	},
  	getList(){
  		this.$axios.post("merchant_goods_log/query_for_page",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          search: this.name,
          operateType: this.operateType,
          beginTime: this.beginTime,
          endTime: this.endTime,
          type: 0
        }).then((res)=>{
        	this.tableData = res.data.data.list;
        	this.total = res.data.data.totalCount;
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