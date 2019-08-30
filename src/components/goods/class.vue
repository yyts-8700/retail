<template>
  <div class='type'>
    <subtitle :subtitle="'商品分类'"/>
    <div class='body'>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <div class='btn-wrapper'>
              <el-button class='returnBack' v-if="second" @click="getList()">返回</el-button>
              <el-button class='add' @click='$router.push("/goods/class/addClass")'>添加分类</el-button>
            </div>  
        </div>
        <el-table  :header-cell-style="headerStyle" :cell-style="tdStyle" :data='tableData' class='type-list'>
            <el-table-column label='编号'>
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label='分类名称'>
                <template slot-scope="scope">
                    {{ scope.row.typeName }}
                </template>
            </el-table-column>
            <el-table-column label='级别'>
                <template slot-scope="scope">
                    {{ scope.row.parentId=='0'?'一级':'二级' }}
                </template>
            </el-table-column>
            <el-table-column label='商品数量'>
                <template slot-scope="scope">
                    {{ scope.row.goodsNum }}
                </template>
            </el-table-column>
            <el-table-column label='数量单位'>
                <template slot-scope="scope">
                    {{ scope.row.goodsUnit }}
                </template>
            </el-table-column>
            <el-table-column label='是否显示'>
                <template slot-scope="scope">
                    <el-switch :active-value='0' 
                               :inactive-value='1' 
                                active-color="#5BC0BF" 
                                inactive-color="#dedede" 
                                v-model="scope.row.showStatus" 
                                @change="handleShow($event, scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label='排序'>
                <template slot-scope="scope">
                    {{ scope.row.goodsSort }}
                </template>
            </el-table-column>
            <el-table-column label='设置' width="260">
                <template slot-scope="scope">
                   <span class="table-btn" @click="moveGoods(scope.row.id)">转移商品</span>
                   <span class="table-btn" v-if="scope.row.parentId == 0" @click="$router.push('/goods/class/addClass?parentId='+scope.row.id)">新增下级</span>
                   <span class="table-btn" v-if="scope.row.parentId == 0" @click="getList(scope.row.id)">查看下级</span>
                </template>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope="scope">
                    <span class='table-btn' @click="$router.push('/goods/class/addClass?id='+scope.row.id)">编辑</span>
                    <span class='table-btn'  @click='remove(scope.row.id)'>删除</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total='total' :isBatch='false' :pageSize="pageSize" @next='next'></pagination>
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
  name: 'type',
  components:{
    subtitle,
    pagination
  },
  data () {
    return {
        addClassList:[],
        originalId:'',
        nextId:'',
        parentId:0,
        childClassId:0,
        second:true,


        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total:0,
        isAdd:false,
        dialogVisible:false,
        ruleForm: {
          styleName: ''
        },
        rules: {
          styleName: [
            { required: true, message: '请输 入类型名称', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
        }
        
     
     }
  },
  mounted(){
    this.getList()
    this.$axios.post("merchantGoodsType/merchant_goods_type_list").then((res)=>{
      this.addClassList = res.data.data
    })
  },
  methods:{
    moveGoods(id){
      this.dialogVisible = true;
      this.originalId = id;
    },
    next(val){
        this.currentPage = val
        this.getList()
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
    getList(id){
      if(id){
        this.parentId = id;
        this.childClassId = id;
        this.second = true;
      }else{
        this.parentId = 0;
        this.second = false;
      }
      this.$axios.post("merchantGoodsType/merchant_goods_type_list_page",{
          parentId: this.parentId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
      }).then((res)=>{
          this.total = res.data.data.totalCount
          this.tableData = res.data.data.list
      })
    },
    handleShow(event,row){
      let data = {
        id: row.id,
        typeName: row.typeName,
        parentId: row.parentId,
        goodsUnit: row.goodsUnit,
        goodsSort: row.goodsSort,
        showStatus: event,
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
      edit(row){
        this.isAdd = false
        this.dialogVisible = true
        this.ruleForm.id = row.id
        this.ruleForm.styleName = row.styleName
      },
      submit(val){
        this.$refs[val].validate((valid)=>{
          if(valid){
            if(this.isAdd){
              this.$axios.post("merchantGoodsStyle/merchant_goods_type_add",this.ruleForm).then(()=>{
                this.$message({
                  type:'success',
                  message:'操作成功'
                })
                this.getList()
                this.dialogVisible = false
              }).catch((err)=>{
                this.$message.error(err.msg)
              })
            }else{
              this.$axios.post("merchantGoodsStyle/merchant_goods_type_update",this.ruleForm).then(()=>{
                this.$message({
                  type:'success',
                  message:'操作成功'
                })
                this.getList()
                this.dialogVisible = false
              }).catch((err)=>{
                this.$message.error(err.msg)
              })
            }
          }else{
            return false
          }
        })
      },
      remove(id){
        this.$confirm("确认删除吗?").then(()=>{
          this.$axios.post("merchantGoodsType/merchant_goods_type_delete",{
            id:id
          }).then(()=>{
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
    position:relative
    line-height:60px
    background:#efefef
    border:1px solid #b4b4b4
    border-bottom:none
    display:flex
    justify-content:space-between
    .datalist
      font-size:20px
      font-weight:bold
      color:#5a5a5a
      padding-left:20px
    .btn-wrapper
      margin-right:20px
  .type-list
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
.body .type-list .el-table__empty-block{
    border-left:1px solid #b4b4b4;
    border-top:1px solid #b4b4b4;
} 
</style>