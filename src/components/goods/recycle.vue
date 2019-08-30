<template>
  <div class='recycle'>
    <subtitle :subtitle="'商品回收站'"/>
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
              <el-input v-model="goodsName" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="商品名称/商品货号" class="search-input" clearable></el-input>
              <!-- <div class='text'>选择分类：</div> -->
              <el-select placeholder="请选择商品分类" class="search-input" clearable v-model='typeId' @change="search">
                <el-option :label="item.typeName" :value="item.id" v-for="(item,index) in categoryList" :key='index'></el-option>

              </el-select>
              <div class='text'>选择品牌：</div>
              <el-select placeholder="请选择商品品牌" class="search-input" clearable v-model='brandId' @change="search">
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in brandList" :key='index'></el-option>
              </el-select>
            </div>
        </div>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
        </div>
        <el-table @selection-change='selectionChange' ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column type='selection' width="55" prop="id" ></el-table-column>
            <el-table-column label='编号'>
              <template slot-scope='scope'>
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img :src="getGoodImg(scope.row.goodsImg)" alt="" style='width:60px;height:60px'>
            </template>
            </el-table-column>
            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <p>{{ scope.row.goodsName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="商品分类">
              <template slot-scope="scope">
                <p>{{ scope.row.typeName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                {{scope.row.goodsPrice}}
              </template>
            </el-table-column>
            <el-table-column label="货号">
              <template slot-scope="scope">{{ scope.row.goodsNo }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class='table-btn' @click='restore(scope.row.id)'>还原</span>
                <span class="table-btn" @click='remove([scope.row.id])'>删除</span>
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
  name: 'recycle',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
        visibleSearch: false,
        goodsName: '',
        typeId: '',
        categoryList: [],
        brandList: [],
        brandId: '',
        checkItemId: [],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        optionsList: {
        'delete':'删除',
        'restore':'还原'
      },
     }
  },
  mounted(){
    this.$axios.post('merchantGoodsType/query_goods_type_tree')
    .then((res)=>{
      this.categoryList = res.data.data
    });
    this.$axios.post('merchant_goods_brand/query_list')
    .then((res)=>{
      this.brandList = res.data.data
    });
    this.getList()
  },
  methods:{
    getList(){
      this.$axios.post('/merchantGoods/merchant_goods_recycling',{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          typeId: this.typeId,
          brandId: this.brandId
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
      this.currentPage = 1;
      this.getList();
    },
    getGoodImg(data){
      if (data){
        return data.split(',')[0]
      } else {
        return require('@/assets/image.png')
      }
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
    restore(id){
        console.log(id)
        this.$confirm('确认还原吗?').then(()=>{
            this.$axios.post('/merchantGoods/merchant_goods_recycling_reduction', {id:id})
            .then(()=>{
                this.getList()
                this.$message({
                    type:'success',
                    message:'还原成功'
                })
            }).catch((err)=>{
                this.$message.error(err.msg)
            })
        },()=>{})
    },
    remove(id){
        this.$confirm("确认删除吗?",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios.post("/merchantGoods/delete_batch_recycling", id).then(() => {
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