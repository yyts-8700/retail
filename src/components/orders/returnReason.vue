<template>
  <div class='returnReason'>
    <subtitle :subtitle="'退货原因'"/>
    <div class='main-content'>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <div class='btn-wrapper'>
              <el-button @click='dialogVisible=true'>添加原因</el-button>
            </div>
        </div>
        <el-table @selection-change='selectionChange' ref='table' class='reason-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
                label="原因类型">
              <template slot-scope="scope">{{ scope.row.reasonType }}</template>
            </el-table-column>
            <el-table-column prop="name" label="排序">
              <template slot-scope="scope">{{scope.row.sorts}}</template>
            </el-table-column>
            <el-table-column prop="address" label="是否启用" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-switch @change="changeStatus($event, scope.row.id)" v-model="scope.row.isUse" :active-value="1"
                           :inactive-value="0" active-color="#5BC0BF" inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="添加时间" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.creatTime}}</template>
            </el-table-column>
            <el-table-column prop="address" label="编辑" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="table-btn" @click="update(scope.row.id)">编辑</span>
                <span class="table-btn" @click="remove([scope.row.id])">删除</span>
              </template>
            </el-table-column>
        </el-table>
        <pagination :total='total' :pageSize="pageSize" :optionsList="optionsList" :isClear="true" @handleChangeAll='handleChangeAll' @confirmBatch='confirmBatch'></pagination>
        <el-dialog
          title="退货原因"
          :visible.sync="dialogVisible"
          width='30%'>
            <el-form>
              <el-form-item label="原因类型">
                <el-input v-model="reason"></el-input>
              </el-form-item>
              <el-form-item label="排序">
                <el-input v-model="sorts" type='number' @keyup.native="transNumber"></el-input>
              </el-form-item>
              <el-form-item label="是否显示">
                <el-switch v-model="isUse" :active-value="1" :inactive-value="0" active-color="#5BC0BF" inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="add">确 定</el-button>
            </span>
      </el-dialog>
    </div>  
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'returnReason',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
        dialogVisible:false,
        reason:'',
        sorts:'',
        isUse:1,
        id:'',
        visibleSearch: false,
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
    this.getList(1)
  },
  methods:{
    add(){
        if (this.reason == "") {
          this.$message({
            type:'warning',
            message:'请输入退货原因'
          });
          return false;
        }
        if (this.sorts == "") {
          this.$message({
            type:'warning',
            message:'请输入排序'
          });
          return false;
        }
        if (this.id == '') {
          this.$axios.post('/return_reason/add', {
            reasonType: this.reason,
            sorts: this.sorts,
            isUse: this.isUse,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          }).then((res) => {
            this.$message({
            type:'success',
            message:'添加成功'
          });
            this.dialogVisible = false;
            this.getList(1);
          }, (err) => {
            this.$message.error(err.msg);
          })
        } else {
          this.$axios.post('/return_reason/add', {
            reasonType: this.reason,
            sorts: this.sorts,
            id: this.id,
            isUse: this.isUse,
            merchantId: JSON.parse(localStorage.userInfo).merchantId
          }).then((res) => {
            this.$message({
            type:'success',
            message:'修改成功'
          });
            this.getList(1);
            this.dialogVisible = false;
          }, (err) => {
            this.$message.error(err.msg);
          })
        }
    },
    transNumber() {
        this.sorts = this.sorts.replace(/[^\.\d]/g, '');
        this.sorts = this.sorts.replace('.', '');
    },
    update(id){
        this.dialogVisible = true;
        this.$axios.post('/return_reason/selectOne',{
            id:id,
            merchantId:JSON.parse(localStorage.userInfo).merchantId
        }).then((res)=>{
            this.sorts = res.data.data.sorts;
            this.reason = res.data.data.reasonType;
            this.isUse = res.data.data.isUse;
        }).catch((err)=>{
            this.$message.error(err.msg)
        })
    },
    changeStatus(e,id){
        this.$axios.post('/return_reason/add',{
          id: id,
          isUse: e,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        }).then((res)=>{
            this.$message({
                type:'success',
                message:'操作成功'
            });
            this.getList(1)
        }).catch((err)=>{
            this.$message.error(err.msg)
        })
    },
    getList(val){
      this.$axios.post('/return_reason/query_for_pageB',{
          currentPage: val,
          pageSize: this.pageSize,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
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
            this.$axios.post('/return_reason/delete', {ids: id}).then(() => {
              this.getList(1);
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