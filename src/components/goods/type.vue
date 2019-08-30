<template>
  <div class='type'>
    <subtitle :subtitle="'商品类型'"/>
    <div class='body'>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <el-button class='add' @click='dialogVisible = true; isAdd=true; ruleForm.styleName = ""'>添加类型</el-button>
        
        </div>
        <el-table :header-cell-style="headerStyle" :cell-style="tdStyle" :data='tableData' class='type-list'>
            <el-table-column label='编号'>
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label='类型名称'>
                <template slot-scope="scope">
                    {{ scope.row.styleName }}
                </template>
            </el-table-column>
            <el-table-column label='属性数量'>
                <template slot-scope="scope">
                    {{ scope.row.propertyNum }}
                </template>
            </el-table-column>
            <el-table-column label='参数数量'>
                <template slot-scope="scope">
                    {{ scope.row.paramNum }}
                </template>
            </el-table-column>
            <el-table-column label='设置'>
                <template slot-scope="scope">
                    <span class='table-btn' @click='$router.push("/goods/type/prop/?id=" + scope.row.id)'>属性列表</span>
                    <span class='table-btn' @click='$router.push("/goods/type/param/?id=" + scope.row.id)'>参数列表</span>
                </template>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope="scope">
                    <span class='table-btn' @click='edit(scope.row)'>编辑</span>
                    <span class='table-btn'  @click='remove(scope.row.id)'>删除</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total='total' :isBatch='false' :pageSize="pageSize" @next='next'></pagination>
        <el-dialog width='30%' title='添加类型' :visible.sync='dialogVisible'>
        		<el-form  :model="ruleForm" :rules="rules" ref="form" label-width="100px" class="form">
              <el-form-item label="类型名称: " prop="styleName">
                <el-input style='width:400px' v-model="ruleForm.styleName"></el-input>
              </el-form-item>
            </el-form>
            <span slot='footer'>
              <el-button @click='dialogVisible=false'>取消</el-button>
              <el-button @click='submit("form")'>确定</el-button>
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
            { required: true, message: '请输入类型名称', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
        }
        
     
     }
  },
  mounted(){
    this.getList()
  },
  methods:{
    next(val){
        this.currentPage = val
        this.getList()
    },
    getList(){
        this.$axios.post("merchantGoodsStyle/merchant_goods_style_list_page",{
            currentPage: this.currentPage,
            pageSize: this.pageSize
        }).then((res)=>{
            this.total = res.data.data.totalCount
            this.tableData = res.data.data.list
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
          this.$axios.post("merchantGoodsStyle/merchant_goods_type_delete",{
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
    .datalist
      font-size:20px
      font-weight:bold
      color:#5a5a5a
      padding-left:20px
    .add
      position:absolute
      right:20px
      top:10px
  .type-list
    border-right:1px solid #b4b4b4
    .table-btn
      color:#5BC0BF
      &:hover
        text-decoration:underline
        cursor:pointer
</style>