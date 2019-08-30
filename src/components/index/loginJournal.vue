<template>
  <div class='loginJournal'>
    <subtitle :subtitle="'系统信息'"/>
    <div class="body">
        <p> <img src="@/assets/index/icon-6.png" alt="">数据列表</p>
        <table class="table-middle" border=1>
          <thead>
            <tr>
              <th>
                时间
              </th>
              <th>
                IP
              </th>
              <th>
                地区
              </th>
              <th>  
                浏览器
              </th>
            </tr>
          </thead>
          <tbody id="tbody">
            <tr v-for='tab in table' align="center">
              <td>{{tab.operateTime}}</td>
              <td>{{tab.ip}}</td>
              <td v-if="tab.description.data">{{tab.description.data.country}}-{{tab.description.data.region}}-{{tab.description.data.city}}</td>
              <td v-else></td>
              <td>{{tab.pack}}</td>
            </tr>  
          </tbody>
        </table>
        <pagination class='pagination' @next="next" :isBatch="false" :total="total"></pagination>
    </div>


  </div>
</template>

<script>
import subtitle from '../subtitle.vue'
import pagination from '../pagination.vue'
import qs from 'qs'

export default {
  name: 'loginJournal',
  data () {
    return {
     	table : [],
      currentPage: 1,
      total:0,
      pageSize:10,
     }
  },
  created(){
  	this.getList(1)
  },
  methods:{
  	getList(pageSize11){
        this.$axios.post('/merchant/get_merchant_login_info_list', qs.stringify({
                  currentPage : pageSize11,
                  pageSize : this.pageSize,
                  orderBy: 'operate_time desc'
                
          }),{
                type : "form"
          })
          .then((response) => {
            this.tableData = response.data.data.list;
            this.total = response.data.data.totalCount;
             for(var i=0;i<response.data.data.list.length;i++){
                      if(response.data.data.list[i].description!=''){
                          if(response.data.data.list[i].description != '成功'){
                               response.data.data.list[i].description = JSON.parse(response.data.data.list[i].description)
                          }
                      }
                  }

             this.table = response.data.data.list
           

          }, (err) => {

          })
    	},
    next(val) {
      this.getList(val);
     }
  },
  components:{
  	subtitle,
    pagination
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:80%
  margin:30px auto 0 
  p
    line-height:50px
    width:100%
    height:50px
    background: #efefef;
    img
      width:25px
      margin-left:10px
      margin-bottom:-7px
  .table-middle
    width:100%
    border-right: 1px solid #b4b4b4;
    border-bottom: 1px solid #b4b4b4;
    tr
      height:50px
      td,th
        border-left: 1px solid #b4b4b4;
        border-top: 1px solid #b4b4b4;
        color:#5a5a5a;
        padding: 0 20px;
  .pagination
    border-top:none
    box-sizing:border-box
</style>
