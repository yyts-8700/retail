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
          <el-input v-model="goodsName" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="商品名称/商品货号" class="search-input" clearable></el-input>
          <div class='text'>选择分类：</div>
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
        <el-button  class='add' @click='$router.push("/goods/addGoods")'>添加商品</el-button>
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
            <p>品牌{{ scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号">
          <template slot-scope="scope">
            <p>价格：¥{{ scope.row.goodsPrice }}</p>
            <p>货号：{{ scope.row.goodsNo }}</p>
          </template>
        </el-table-column>
        <el-table-column label="SKU库存">
          <template slot-scope="scope">
            <img class="sku" src="@/assets/icon-edit.png" alt="" @click='openEdit(scope.row.id)'>
          </template>
        </el-table-column>
        <el-table-column label="销量">
          <template slot-scope="scope">{{ scope.row.buyNum }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
          {{ scope.row.status == 0 ? '未上架' : '已上架' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span @click='upperShelf(scope.row.id,scope.row.status)' class="table-btn" >{{ scope.row.status == 0 ? '上架' : '下架'}}</span>
            <span class="table-btn" @click='toEdit'>编辑</span>
            <span class="table-btn" @click='remove([scope.row.id])'>删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :pageSize="pageSize" :optionsList="optionsList" @next="next"  @confirmBatch="confirmBatch" @handleChangeAll="handleChangeAll" :isClear='true'></pagination>
      <el-dialog class='dialog' :visible.sync="dialogVisible" title='编辑货品信息' >
        <div class='goodsNo'>商品货号：{{goodsNo}}</div>
        <table class='table' border=1 >
          <thead>
            <td width="80" v-for="item in stockHeader">{{ item }}</td>
            <td>销售价格</td>
            <td>商品库存</td>
            <td>库存预警值</td>
          </thead>
          <tbody>
            <tr v-for="item in stockList">
              <td v-for="prop in item.nameValue">{{ prop.value }}</td>
              <td><el-input class='input' v-model="item.goodsSalePrice" type="number"></el-input></td>
              <td><el-input class='input' v-model="item.goodsStock" type="number"></el-input></td>
              <td><el-input class='input' v-model="item.stockWarning" type="number"></el-input></td>
            </tr>
          </tbody>
        </table>
        <span slot='footer' class='footer'>
          <el-button @click='dialogVisible = false'>取消</el-button>
          <el-button @click='changeStock' class='confirm'>确定</el-button>
        </span>
      </el-dialog>
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
      visibleSearch: false,
      input:'',
      currentPage: 1,
      pageSize: 10,
      pageCount: 0,
      total: 0,
      isAdd: true,
      loading: true,
      stockTypeList: [],

      goodsName: '',
      checkAll: false,
      tableData: [],
      dialogVisible: false,
      optionsList: {
        'delete': '删除'
      },
      checkItemId: [],
      typeId: '',
      categoryList: [],
      brandList: [],
      brandId: '',
      dialogLoading: false,
      goodsId: '',
      goodsNo: '',
      stockHeader: [],
      stockList: [],
     }
  },
  components:{
    subtitle,
    pagination
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
      this.$axios.post('merchantGoods/merchant_goods_list_page',{
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
    getGoodImg(data){
      if (data){
        return data.split(',')[0]
      } else {
        return require('@/assets/image.png')
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
            this.$axios.post("merchantGoods/delete_batch", id)
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
    upperShelf(id, status){
      if(status == 0){
        this.$axios.post("merchantGoods/merchant_goods_put",{
          id:id
        }).then((res)=>{
          this.$message({
            type:'success',
            message:'上架成功'
          })
          this.getList()
        }).catch((err)=>{
          this.$message({
            type:'warning',
            message:err.msg
          })
        })
      }else{
         this.$axios.post("merchantGoods/merchant_goods_pull",{
            id:id
          }).then(()=>{
            this.$message({
              type:'success',
              message:'下架成功'
            })
            this.getList()
          }).catch((err)=>{
            this.$message({
              type:'warning',
              message:err.msg
            })
          })
      }
    },
    toEdit(){
      this.$router.push('/goods/addGoods')
    },
    showToggle(){
      this.visibleSearch = !this.visibleSearch
    },
    search(){
      this.currentPage = 1;
      this.getList();
    },
    openEdit(id){
      this.stockHeader = [];
      this.dialogVisible = true;
      this.$axios.post("merchantGoods/merchant_goods_by_id", {
        id: id
      }).then((res)=>{
        this.goodsNo = res.data.data.goodsNo
        this.goodsId = res.data.data.id
        this.stockList = res.data.data.merchantGoodsTypePropertyList
        res.data.data.map.forEach((item)=>{
          this.stockHeader.push(item.name)
        })
      })
    },
    changeStock(){
      this.$axios.post("merchantGoods/merchant_goods_update_sku",{
        merchantGoodsTypePropertyList: this.stockList,
        id: this.goodsId
      }).then(()=>{
        this.$message({
          message:'操作成功',
          type:'success'
        })
        this.dialogVisible = false
      }).catch((err)=>{
        this.$message({
          type:'warning',
          message:err.msg
        })
      })
    }
  }, 
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