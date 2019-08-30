<template>
    <div class='subtitle'>
        <div class='text'>{{subtitle}}</div>
        <div class='buttons'>
            <el-button v-if="isClose" @click="close" class='button'>关闭</el-button>
            <el-button v-if="isRefresh" @click="refresh" class='button'>刷新</el-button>
            <el-button v-if="isBack" @click="back" class='button'>返回</el-button>    
        </div>
    </div>
</template>
<script type="text/javascript">
    export default{
        name:'subtitle',
        data(){
            return {

            }
        },
        props:{
            subtitle:{
                type:String,
                default:'....'
            },
            isClose:{
                type:Boolean,
                default:false
            },
            isRefresh:{
                type:Boolean,
                default:false
            },
            isBack:{
                type:Boolean,
                default:false
            },
        },
        methods:{
            back(){
                this.$router.go(-1)
            },
            close(){
                this.$emit('close')
            },
            refresh(){
                this.$emit('refresh')
            },
            
        }
    }
</script>
<style lang='stylus'>
.subtitle
  display:flex
  align-items:center
  justify-content:space-between
  height:60px
  width:100%
  background:#efefef
  border-bottom:1px solid #e5e5e5
  .text
    font-size:22px
    font-weight:bold
    color:#5a5a5a
    padding-left:22px
    border-left:8px solid #5BC0BF
  .buttons
    margin-right:40px
    .button
      &:hover
        background:#7ccdcc
        color:#fff
      
</style>