<template>
  <div class='list'>
    <subtitle :subtitle="'订单列表'"/>
    <div class='body'>
        <div class='menu-btn-wrapper'>
            <el-button class='menu-btn' :class='isActive=="all"?"active":""' @click='changeList("all")'>
                全部订单(<em class='number'>{{orderData.allOrder}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==1?"active":""' @click='changeList(1)'>
                待付款(<em class='number'>{{orderData.dfk}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==2?"active":""' @click='changeList(2)'>
                待发货(<em class='number'>{{orderData.dfh}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==3?"active":""' @click='changeList(3)'>
                已发货(<em class='number'>{{orderData.dsh}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==5?"active":""' @click='changeList(5)'>
                已完成(<em class='number'>{{orderData.ywc}}</em>)
            </el-button>
            <el-button class='menu-btn' :class='isActive==0?"active":""' @click='changeList(0)'>
                已关闭(<em class='number'>{{orderData.ygb}}</em>)
            </el-button>
        </div>
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
              <el-input v-model="searchcode" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="请输入订单编号" class="search-input" clearable></el-input>
              <div class='text'>用户账号:</div>
              <el-input v-model="receiver" @keyup.enter.native="search" @clear="search" style="width:200px;" placeholder="请输入用户账号" class="search-input" clearable></el-input>
            </div>
        </div>
        <div class='table-title'>
            <span class='datalist'>订单列表</span>
            <div class="btn-wrapper">
                <el-button @click="exportOrder">导出订单</el-button>
            </div>
        </div>
        <el-table @selection-change='selectionChange' ref='table' class='order-list' :data='tableData' :header-cell-style="headerStyle" :cell-style="tdStyle">
            <el-table-column :selectable='selectable' type="selection" width="55"></el-table-column>
            <el-table-column label="订单编号" width='200'>
              <template slot-scope="scope">{{ scope.row.code }}</template>
            </el-table-column>
            <el-table-column label="提交时间" width='180'>
              <template slot-scope="scope">{{ scope.row.creatTime }}</template>
            </el-table-column>
            <el-table-column label="用户账号">
              <template slot-scope="scope">{{ scope.row.mobilePhone }}</template>
            </el-table-column>
            <el-table-column label="订单金额" >
              <template slot-scope="scope">{{ scope.row.totalMoeny }}</template>
            </el-table-column>
            <el-table-column label="支付方式">
              <template slot-scope="scope">微信小程序支付</template>
            </el-table-column>
            <el-table-column label="订单来源">
              <template slot-scope="scope">微信小程序</template>
            </el-table-column>
            <el-table-column label="订单状态">
              <template slot-scope="scope">{{ scope.row.statuse }}</template>
            </el-table-column>
            <el-table-column label="订单操作" width='180'>
              <template slot-scope="scope">
                <span class="table-btn" @click="$router.push('/orders/list/orderDetail?id=' + scope.row.id+'&mobilePhone='+scope.row.mobilePhone)">查看订单</span>
                <span class="table-btn" v-if="scope.row.status == 2" @click="deliver(scope.row.id)">订单发货</span>
                <span class="table-btn" v-else-if="scope.row.status == 4 || scope.row.status == 5"
                      @click="delivered(scope.row.id)">订单追踪</span>
                <span class="table-btn" v-else-if="scope.row.status == 0" @click="remove(scope.row.id)">删除订单</span>
                <span class="table-btn" v-if="scope.row.status == 1" @click="close(scope.row.id)">关闭订单</span>
              </template>
            </el-table-column> 
        </el-table>
        <pagination :total='total' :pageSize="pageSize" :optionsList="optionsList" :isClear="true" @handleChangeAll='handleChangeAll' @confirmBatch='confirmBatch' @next='next'></pagination>
        <el-dialog
          title="订单发货"
          :visible.sync="dialogVisible"
          :width="'30%'">
            <el-form>
              <el-form-item label="快递公司">
                <el-input v-model="sendCompany"></el-input>
              </el-form-item>
              <el-form-item label="快递单号">
                <el-input v-model="sendCode"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button class="mall-btn" @click="dialogVisible = false">取 消</el-button>
              <el-button class="mall-btn" type='primary' @click="add()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
          title="快递追踪"
          :visible.sync="dialogVisibled"
          :width="'30%'"
          class='track-dialog'>
          <div class="wrapper1">
              <span class="prop">快递公司:</span>
              <span class="value">{{company}}</span>
          </div>
          <div class="wrapper2">
              <span class="prop">快递单号:</span>
              <span class="value">{{code}}</span>
          </div>
            
          <span slot="footer" class="dialog-footer">
            <el-button class="mall-btn" @click="dialogVisibled = false">确定</el-button>
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
        isActive:'all',
        orderData:'',
        searchcode:'',

        receiver:'',
        tableData: [],
        optionsList: {
          'close': '关闭订单',
          'delete': '删除订单'
        },
        status:'',
        sendCompany:'',
        sendCode:'',
        id:'',
        dialogVisible:false,
        dialogVisibled:false,
        nowPage:1,
        company:'',
        code:'',

        visibleSearch: false,
        checkItemId: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        
     }
  },
  mounted(){
    this.getList(1)
  },
  methods:{
    selectable(){
        return false
    },
    next(val) {
        this.nowPage = val;
        this.getList(val)
    },
    close(id){
        this.$confirm('确定关闭订单嘛', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then((res)=>{
            this.$axios.post('/merchant_order/update',{
                id: id,
                status: 0,
                merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
            }).then(()=>{
                this.getList(this.nowPage)
                this.$message({
                    type:'success',
                    message:'删除成功'
                })
            })
        },()=>{})
    },
    remove(id){
        this.$confirm('确定关闭订单嘛', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then((res)=>{
            this.$axios.post('/merchant_order/update',{
                id: id,
                status: 20,
                merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
            }).then(()=>{
                this.getList(this.nowPage)
                this.$message({
                    type:'success',
                    message:'删除成功'
                })
            })
        },()=>{})
    },
    delivered(id){
        this.$axios.post('/merchant_order/query_By_Id',{
            id: id,
            merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        }).then((res)=>{
            this.company = res.data.data.sendCompany
            this.code = res.data.data.sendCode
            this.dialogVisibled = true 
        })
    },
    deliver(id){
        this.dialogVisible = true
        this.id = id
    },
    add(){
        if(this.sendCompany == ""){
            this.$message.error('请输入快递公司')
            return false
        }
        if(this.sendCode == ""){
            this.$message.error('请输入快递单号')
            return false
        }
        this.$axios.post('/merchant_order/update',{
            id: this.id,
            status: 3,
            sendCompany: this.sendCompany,
            sendCode: this.sendCode,
            merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
        }).then((res)=>{
            this.getList(this.nowPage)
            this.sendCompany = ''
            this.sendCode = ''
            this.dialogVisible = false
            this.$message({
                type:'success',
                message:'发货成功'
            })
        })

    },
    exportOrder(){

    },
    changeList(val){
        this.isActive = val
        if (val == 'all') {
          this.status = ''
          this.getList(1)
        }else{
          this.status = val
          this.getList(1)
        }
        
    },
    getList(pageSize){
      this.$axios.post("merchant_order/getOrderAllCount",{
        merchantId: JSON.parse(this.$store.getters.userInfo).merchantId
    }).then((res)=>{
        this.orderData = res.data.data
    })
        if (this.searchcode == "") {
          this.searchcode = null;
        }
        if (this.receiver == "") {
          this.receiver = null;
        }
      this.$axios.post('/merchant_order/query_for_page',{
          currentPage: pageSize,
          pageSize: this.pageSize,
          phone: this.receiver,
          code: this.searchcode,
          status: this.status,
          merchantId: JSON.parse(localStorage.userInfo).merchantId
        }).then((res) => {
          for (var i = 0; i < res.data.data.list.length; i++) {
            switch (res.data.data.list[i].status) {
              case 0:
                res.data.data.list[i].statuse = '已关闭'
                break
              case 1:
                res.data.data.list[i].statuse = '待付款'
                break
              case 2:
                res.data.data.list[i].statuse = '待发货'
                break
              case 3:
                res.data.data.list[i].statuse = '待收货'
                break
              case 4:
                res.data.data.list[i].statuse = '待评价'
                break
              case 5:
                res.data.data.list[i].statuse = '已完成'
                break
              case 20:
                res.data.data.list[i].statuse = '已删除'
                break
            }
          }
          this.total = res.data.data.totalCount
          this.tableData = res.data.data.list
        },(err) => {
          this.$message({
              showClose: true,
              message: '获取失败',
              type: 'error'
          })
        })
    },
    search(){
        this.getList(1)
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
.body
  width:90%
  margin: 30px auto
  .menu-btn-wrapper
    margin-bottom:30px
    .menu-btn
      .number
        color:#f00
      &.active
        color:#fff
        background-color: #5BC0BF
        border-color: #5BC0BF
        .number
          color:#fff
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
        
  .order-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer  
  .track-dialog
    .wrapper1,.wrapper2
      margin-left:40px
      margin-bottom:30px 
      font-size:16px
      .prop
        margin-right:10px
    .wrapper2
      margin-bottom:0 
      
           
</style>
<style>
.body .order-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>