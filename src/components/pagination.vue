<template>
  <div class="pagination-wrap">
    <div>
      <div class="batch-wrap" v-if="isBatch">
        <el-checkbox v-model="checkAll" @change="handleChangeAll">全选</el-checkbox>
        <el-select @change="batchChange" :clearable="isClear" v-model="checkBatch" placeholder="批量操作" size="mini" class="select">
          <el-option :value="index" :label="item" v-for="(item, index) in optionsList" :key="index"></el-option>
        </el-select>
        <el-button size="mini" @click="confirmBatch">确定</el-button>
      </div>
    </div>
    <el-pagination class='pagi'
       @current-change="handleCurrentChange"
       :current-page.sync="currentPage"
       :total="total"
       :page-size='pageSize'
       background
       layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "pagination",
    props: {
      isBatch: {
        type: Boolean,
        default: true
      },
      isClear: {
        type: Boolean,
        default: false
      },
      total: Number,
      pageCount: Number,
      pageSize: Number,
      optionsList: {
        type:Object,
        default: function () {
          return{
            name:'hello',
            age:'12'
          }
          
        }
      },
    },
    data(){
      return{
        checkAll: false,
        checkBatch: '',
        currentPage: 1,
      }
    },
    methods: {
      handleChangeAll(val){
        this.$emit('handleChangeAll', val);
      },
      handleCurrentChange(a){
        this.$emit('next', a)
      },
      confirmBatch(){
        this.$emit('confirmBatch', this.checkBatch);
      },
      batchChange($event){
        this.$emit('batchChange', $event);
      }
    }
  }
</script>

<style scoped lang="stylus">
.pagination-wrap
  padding:0 20px
  height:44px
  background:#efefef
  display:flex
  justify-content:space-between
  align-items:center
  border:1px solid #b4b4b4
  
  .batch-wrap
    flex:0 1 auto
  .pagi
    flex:0 1 auto
    
</style>
<style lang="stylus">
.pagination-wrap
  .pagi
    .el-pager
      li
        background:#fff
        &.active
          background-color: #5BC0BF !important
          color: #fff;  
        &:hover
          color:#5BC0BF !important
    .btn-prev,.btn-next
      background:#fff
  .batch-wrap
    .el-select
      width:150px
      margin-left:10px
      margin-right:10px   
</style>