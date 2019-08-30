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
              <div class='text'>类目名称:</div>
              <el-input v-model="goodsName" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="请输入类目名称" class="search-input" clearable></el-input>
              <div class='text'>类目状态:</div>
              <el-select placeholder="请选择类目状态" class="search-input" clearable v-model='typeId' @change="search">
                <el-option :label="item" :value="index" v-for="(item,index) in recommendStatus" :key='index'></el-option>
              </el-select>
            </div>
        </div>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <div class='btn-wrapper'>
                <el-button  v-if="second" class='add' @click='getList()'>返回</el-button>
                <el-button  class='add' @click='$router.push("/promotion/addHeader")'>添加头部</el-button>
            </div>
           
        </div>
        <el-table @selection-change='selectionChange' ref='table' class='goods-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column type="selection" width="55" prop="id"></el-table-column>
            <el-table-column label="编号">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column label="类目名称">
              <template slot-scope="scope">{{ scope.row.typeName }}</template>
            </el-table-column>
            <el-table-column label="级别">
              <template slot-scope="scope">{{ scope.row.parentId == '0' ? '一级' : '二级' }}</template>
            </el-table-column>
            <el-table-column label="是否推荐">
              <template slot-scope="scope">
                <el-switch @change="showChange($event, scope.row)" v-model="scope.row.showStatus" :active-value="0" :inactive-value="1" active-color="#5BC0BF" inactive-color="#dedede"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="排序">
              <template slot-scope="scope">{{ scope.row.goodsSort }}</template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">{{ scope.row.goodsUnit }}</template>
            </el-table-column>
            <el-table-column label="设置" width="260">
              <template slot-scope="scope">
                <span class="table-btn" @click="moveGoods(scope.row.id)">转移商品</span>
                <span class="table-btn" v-if="scope.row.parentId == 0" @click="$router.push('/goods/class/addClass?parentId=' + scope.row.id)">新增下级</span>
                <span class="table-btn" v-if="scope.row.parentId == 0" @click="getList(scope.row.id)">查看下级</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="table-btn" @click="$router.push('/promotion/addHeader?id=' + scope.row.id)">编辑</span>
                <span class="table-btn" @click="remove(scope.row.id)">删除</span>
              </template>
            </el-table-column>
        </el-table>
        <pagination :total='total' :pageSize="pageSize" :optionsList="optionsList" :isClear="true" @handleChangeAll='handleChangeAll' @confirmBatch='confirmBatch'></pagination>
        <el-dialog width='50%' title='转移商品' :visible.sync='dialogVisible' class='dialog'>
          <div class='left box'>
            <div class='text'>原商品分类:</div>
            <el-select v-model='originalId' placeholder='请选择商品分类' class='oldInput' disabled>
              <el-option v-for='(item,index) in addClassList' :label='item.typeName' :value='item.id' :key='index'></el-option>
            </el-select>
          </div>
          <div class='right box'>
            <div class='text'>目标商品分类:</div>
            <el-select v-model='nextId' placeholder='请选择商品分类' class='newInput'>
              <el-option v-for='(item,index) in addClassList' :label='item.typeName' :value='item.id' :key='index'></el-option>
            </el-select>
          </div>
          <span slot='footer' class='dialog-footer'>
            <el-button @click='dialogVisible = false'>取消</el-button>
            <el-button type='primary' @click='changeConfirm'>确定</el-button>
          </span>
        </el-dialog>
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
        recommendStatus:{
              '0': '未推荐',
              '1': '推荐中',
            },
        parentId:0,
        childClassId:0,
        second:false,
        dialogVisible:false,
        originalId:'',
        addClassList:[],
        nextId:'',

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
          '0': '取消推荐',
          '1': '设为推荐',
          'delete': '删除',
        }
     }
  },
  mounted(){
    this.getList();
    this.$axios.post("merchantGoodsType/merchant_goods_type_list").then((res) => {
        this.addClassList = res.data.data;
      })
  },
  methods:{
    moveGoods(id){
      this.dialogVisible = true;
      this.originalId = id;
    },
    changeConfirm(){
      this.$axios.post("merchantGoodsType/merchant_goods_type_transfer", {
          originalId: this.originalId,
          lastId: this.nextId
        }).then(()=>{
          this.$message({
          type:'success',
          message:'操作成功'
        });
          this.dialogVisible = false;
          this.getList();
          this.nextId = ''
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    },
    showChange(e,row){
        let data = {
        id: row.id,
        typeName: row.typeName,
        parentId: row.parentId,
        goodsUnit: row.goodsUnit,
        goodsSort: row.goodsSort,
        showStatus: e,
        typeIcon: row.typeIcon,
      };
      this.$axios.post("merchantGoodsType/merchant_goods_type_update",data).then((res)=>{
        this.$message({
          type:'success',
          message:'操作成功'
        })
      }).catch(()=>{
        this.$message.error(err.msg)
      })
    },
    getList(id){
        if(id){
            this.childClassId = id;
            this.parentId = id;
            this.second = true;
        }else{
            this.parentId = 0;
            this.second = false;
        }
      this.$axios.post("merchantGoodsType/merchant_goods_type_list_page",{
          parentId: this.parentId,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
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
    remove(id){
        this.$confirm("确认删除吗?",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios.post("merchantGoodsType/merchant_goods_type_delete", {id:id}).then(() => {
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
    display:flex
    justify-content:space-between
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
    .btn-wrapper
      margin-right:20px
  .goods-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer   
  .dialog
    .box
      display:inline-block
      margin-right:200px
      .text
        margin-bottom:15px
</style>
<style>
.main-content .goods-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>