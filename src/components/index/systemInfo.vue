<template>
  <div class='systemInfo'>
    <subtitle :subtitle="'系统信息'"/>
    <table class="table" border="1">
        <tr>
            <td>服务器操作系统:</td>
            <td>Linux(114.55.35.251)</td>
            <td>web服务器:</td>
            <td>nginx/1.10.2</td>
        </tr>
        <tr>
            <td>PHP版本:</td>
            <td>5.6.30</td>
            <td>MySQL版本:</td>
            <td>否</td>
        </tr>
        <tr>
            <td>安全模式:</td>
            <td>否</td>
            <td>安全模式GID:</td>
            <td>否</td>
        </tr>
        <tr>
            <td>Socket支持:</td>
            <td>是</td>
            <td>时区设置:</td>
            <td>Asia/Shanghai</td>
        </tr>
        <tr>
            <td>GD版本:</td>
            <td>GD2(JPED GIF PNG)</td>
            <td>Zilb支持:</td>
            <td>是</td>
        </tr>
        <tr>
            <td>IP库版本:</td>
            <td>20071024</td>
            <td>文件上传的最大大小:</td>
            <td>40M</td>
        </tr>
        <tr>
            <td>程序版本:</td>
            <td>v2.2.2 RELEASE 20170629</td>
            <td>安装日期:</td>
            <td>2017-05-02</td>
        </tr>
        <tr>
            <td>编码:</td>
            <td>UTF-8</td>
            <td></td>
            <td></td>
        </tr>
    </table>
  </div>
</template>

<script>
import subtitle from '../subtitle.vue'

export default {
  name: 'systemInfo',
  data () {
    return {
      
     }
  },
  components:{
    subtitle
  },

}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.table  
  width:70%
  margin:30px auto
  border:#b4b4b4
  tr 
    height:60px  
    td
      padding-left:20px  
      color: #5a5a5a; 
      &:nth-child(1),&:nth-child(3) 
        background:#F9FAFC
</style>