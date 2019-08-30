<template>
  <div class='type'>
    <subtitle :subtitle="'商品分类'"/>
    <div class='body'>
        <div class='table-title'>
            <span class='datalist'>数据列表</span>
            <div class='btn-wrapper'>
              <el-button class='goBack' @click="$router.go(-1)">返回</el-button>
              <el-button class='add' @click='dialogVisible1 = true'>上传图片</el-button>
            </div>  
        </div>
        <div class='imageList'>
          <el-checkbox-group class="img-wrapper" v-if="list.length > 0" v-model="checkItemId" @change="changeItemId">
            <div class="img-item" v-for="(item,index) in list" :key="index">
              <el-checkbox :label="item.id">
                <img :src="item.imgUrl" alt="">
              </el-checkbox>
              <span class="table-btn" @click="shiftItem([item.id])">转移相册</span>
              <span class="table-btn" @click="remove([item.id])">删除图片</span>
            </div>
          </el-checkbox-group>
          <div v-else class="empty-text">
            暂无图片
          </div>
        </div>
        <pagination :total='total' :optionsList="optionsList" :pageSize="pageSize" @next='next' @confirmBatch="confirmBatch" @handleChangeAll="handleChangeAll" :isClear='true'></pagination>
        <el-dialog width='50%' title='上传图片' :visible.sync='dialogVisible1' class='dialog1'>
          <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="form">
            <el-form-item label="选择相册: " prop="goodsGalleriesId">
              <el-select v-model="ruleForm1.goodsGalleriesId" placeholder="请选择广告位置">
                <el-option :label="item.name" :value="item.id" v-for="(item, index) in picList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择图片: " prop="imgUrl">
              <div class="upload-img-list">
                <div v-for="(item, index) in ruleForm1.imgUrl" :key="index">
                  <img :src="item">
                </div>
              </div>
              <div class="upload-wrapper">
                <label for="upload"><el-button type="primary" size="small">上传图片</el-button></label>
                <input @change="uploadImg" id="upload" type="file" class="upload-input" accept="image/jpeg, image/png">
                <p class="tips">可批量选择多张图片上传 (最多上传5张)</p>
              </div>
            </el-form-item>
          </el-form>
          <span slot='footer' class='dialog-footer'>
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="submit1()">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="转移相册"
          :visible.sync="dialogVisible2"
          >
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="form">
            <el-form-item label="选择相册: " prop="changeToGalleries">
              <el-select v-model="ruleForm2.changeToGalleries" placeholder="请选择相册">
                <el-option :label="item.name" :value="item.id" v-for="(item, index) in picList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="submit2()">确 定</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
import qs from 'qs'

export default {
  name: 'type',
  components:{
    subtitle,
    pagination
  },
  data () {
    let validImgUrl = (item, value, callback) => {
        if (!this.ruleForm1.imgUrl.length > 0){
          callback(new Error('请上传图片'));
        }else{
          callback();
        }
      }
    return {
        list:[],
        checkItemId:[],
        optionsList: {
          'delete': '删除',
          'shift': '转移'
        },
        dialogVisible1:false,
        dialogVisible2:false,
        ruleForm1: {
          goodsGalleriesId: '',
          imgUrl: [],
        },
        ruleForm2: {
          ids: [],
          subGalleries: '',
          changeToGalleries: '',
        },
        rules1: {
          goodsGalleriesId: [
            { required: true, message: '请选择相册', trigger: 'change' },
          ],
          imgUrl: [
            {validator: validImgUrl, required: true, trigger: 'change'},
          ]
        },
        rules2: {
          changeToGalleries: [
            { required: true, message: '请选择相册', trigger: 'change' },
          ],
        },
        picList:[],


        currentPage: 1,
        pageSize: 10,
        total:0,
        isAdd:false
     }
  },
  mounted(){
    this.getList()
    this.getPicList()
  },
  methods:{
    shiftItem(val){
        this.ruleForm2.ids = val
        this.dialogVisible2 = true
    },
    submit2(){
      this.$refs['ruleForm2'].validate((valid) => {
          if (valid) {
            this.$axios.post("merchant_goods_galleries_detail/change_galleries_batch",this.ruleForm2).then((res) => {
              this.$message({
                type:'success',
                message:'提交成功'
              });
              this.getList();
              this.dialogVisible2 = false;
            }, (err) => {
              this.$message.error(err.msg);
            })
          } else {
            return false;
          }
        })
    },
    submit1(){
      this.$refs['ruleForm1'].validate((valid) => {
          if (valid) {
            this.$axios.post("merchant_goods_galleries_detail/add_batch",this.ruleForm1).then(() => {
              this.$message({
                type:'success',
                message:'提交成功'
              });
              this.getList();
              this.dialogVisible1 = false;
            }, (err) => {
              this.$message.error(err.msg);
            })
          } else {
            return false;
          }
        })
    },
    getPicList(){
        this.$axios.post("merchant_goods_galleries/query", {
        }).then((res) => {
          this.picList = res.data.data.list;
        })
      },
    uploadImg(file){
      let files = file.target.files;
      if (files.length + this.ruleForm1.imgUrl.length > 5){
        this.$message({
          type:'warning',
          message:"图片最多5张"
        });
        return
      }
      let imgUrl = this.ruleForm1.imgUrl;
      let promiseList = [];
      for(let i = 0; i < files.length; i++){
        if (files[i] == []){
          continue;
        }
        promiseList.push(this.uploadFiles(files[i]))
      }
      Promise.all(promiseList).then((res) => {
        res.map((item) => {
          imgUrl.push(item.imgUrl)
        });
        this.$set(this.ruleForm1, 'imgUrl', imgUrl);
      },() => {
        this.$message.error("上传失败");
      })
    },
    uploadFiles(file){
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('file', file);
        this.$axios.post('merchant/upload_file', formData, {
          type: 'form',
          file: 'image'
        }).then((res) => {
          resolve({
            imgUrl: res.data.data.imgUrl + res.data.data.image
          });
        },(err) => {
          this.$message.error(err);
          reject(err);
        })
      })
    },
    confirmBatch(val){
      if (val && this.checkItemId.length > 0){
        if(val == 'delete'){
          this.remove(this.checkItemId)
        }else if(val == 'shift'){
          this.shiftItem(this.checkItemId)
        }else if (val == 'restore'){
          this.restore(this.checkItemId)
        }else if (val == 'showBrand'){
          this.batchBrandHandleShow(this.checkItemId, 1)
        }else if (val == 'hideBrand'){
          this.batchBrandHandleShow(this.checkItemId, 0)
        }else if (val == 'close'){
          this.closeItem(this.checkItemId)
        }
      }else {
        this.$message("未选择操作项")
      }
    },
    handleChangeAll(val){
        this.checkItemId = [];
        if (val){
          this.list.map((item) => {
            this.checkItemId.push(item.id);
          })
        }
    },
    changeItemId(){
    },
    next(val){
        this.currentPage = val
        this.getList()
    },
    getList(){
      this.$axios.post("merchant_goods_galleries_detail/query_for_page",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          galleriesId: this.$route.query.id,
      }).then((res)=>{
          this.total = res.data.data.totalCount
          this.list = res.data.data.list
      })
    },
    
    remove(id){
      this.$confirm("确认删除吗?").then(()=>{
        this.$axios.post("merchant_goods_galleries_detail/delete_batch",id).then(()=>{
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
  .imageList
    border:1px solid #b4b4b4
    border-bottom:none
    .img-wrapper
      display:flex
      flex-wrap:wrap
      padding:20px
      .img-item
        position:relative
        flex:0 1 auto
        width: 150px
        height: 130px
        padding-top: 110px
        margin-right: 20px
        box-sizing: border-box
        img
          width: 100px
          height: 100px
          border-right: 4px
          display: block
          position: absolute
          top: -110px
          left: 26px
        .table-btn
          color: #5BC0BF
          margin-right: 10px
          cursor: pointer
          font-size: 14px
  .dialog1
    .form
      .upload-img-list
        img
          max-width:150px
      .upload-wrapper
        position:relative
        .upload-input
          width:80px
          height:32px
          position:absolute
          left:0
          top:5px
          z-index:5
          opacity:0
        .tips
          font-size: 12px
          color: #5a5a5a
          line-height: 16px
          margin: 10px 0
      
      
</style>
