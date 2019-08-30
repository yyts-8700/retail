<template>
  <div class='type'>
    <subtitle :subtitle="'商品类型'"/>
    <div class='body'>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <el-button class='add' @click='$router.push("/operate/addAd")'>添加广告</el-button>
        </div>
        <el-table :header-cell-style="headerStyle" :cell-style="tdStyle" :data='tableData' class='type-list' @selection-change="selectionChange" ref='table'>
        	<el-table-column type='selection' width='55px'>
            </el-table-column>
            <el-table-column label='编号'>
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label='广告名称'>
                <template slot-scope="scope">
                    {{ scope.row.adName }}
                </template>
            </el-table-column>
            <el-table-column label='广告位置'>
                <template slot-scope="scope">
                    {{ scope.row.adPosition}}
                </template>
            </el-table-column>
            <el-table-column label='广告图片'>
                <template slot-scope="scope">
                    <img :src="scope.row.adPicture" alt="" height='60px'>
                </template>
            </el-table-column>
            <el-table-column label='上线/下线'>
                <template slot-scope="scope">
                    {{ scope.row.online == '1' ? '上线' : '下线' }}
                </template>
            </el-table-column>
            <el-table-column label='点击次数'>
                <template slot-scope="scope">
                    {{ scope.row.clickNumber }}
                </template>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope="scope">
                    <span class="table-btn" @click='$router.push("/operate/addAd?id="+scope.row.id)'>编辑</span>
                    <span class="table-btn" @click='toTop(scope.row.id, scope.row.topState)'>{{ scope.row.topState == '1' ? '取消置顶' : '置顶' }}</span>
                    <span class="table-btn" @click="remove(scope.row.id)">删除</span>

                </template>
            </el-table-column>
        </el-table>
        <pagination :total='total' :optionsList='optionsList' :pageSize="pageSize" @confirmBatch='confirmBatch' @next='next' @handleChangeAll='handleChangeAll' :isClear='isClear'></pagination>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
// import filters from '../../common/data/filters'
export default {
  name: 'type',
  components:{
    subtitle,
    pagination
  },
  // filters:filters,
  data () {
    return {
    	isClear:true,
    	optionsList:{
    		'delete':'删除'
    	},
    	checkItemId:[],
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total:0,
        isAdd:false
     }
  },

  mounted(){
    this.getList()
  },
  methods:{
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
  	toTop(id,topState){
  		this.$axios.post('merchant_ad/change_merchant_ad',{
  			id: id,
            topState: topState == '1' ? '0' : '1'
  		}).then(()=>{
  			this.$message({
              type:'success',
              message:'删除成功'
            })
            this.getList()
  		}).catch((err)=>{
  			this.$message.error(err.msg)
  		})
  	},
  	selectionChange(val){
      let checkItem = []
      val.forEach((item)=>{
        checkItem.push(item.id)
      })
      this.checkItemId = checkItem
    },
    next(val){
        this.currentPage = val
        this.getList()
    },
    getList(){
        this.$axios.post('merchant_ad/get_merchant_ad_list',{
        	currentPage: this.currentPage,
            pageSize: this.pageSize,
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
      remove(id){
        this.$confirm("确认删除吗?").then(()=>{
          this.$axios.post("merchant_ad/delete_merchant_ad",{
            remark:id
          }).then(()=>{
            this.$message({
              type:'success',
              message:'删除成功'
            })
            this.getList()
          }).catch((err)=>{
            this.$message.error(err.msg)
          })
        },()=>{
        	this.$message('操作取消')
        })
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