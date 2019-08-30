<template>
  <div class='addProp'>
    <subtitle :subtitle="'添加广告'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="form">
        <el-form-item label='广告名称:' prop='adName'>
          <el-input  v-model='ruleForm.adName'></el-input>
        </el-form-item>
        <el-form-item label='广告位置:' prop='adPosition'>
          <el-select v-model="ruleForm.adPosition" placeholder="请选择广告位置">
            <el-option :label="item" :value="index" v-for="(item, index) in adPositionList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='上线/下线:' prop='adPosition'>
          <el-radio-group v-model="ruleForm.online">
            <el-radio :label="'1'">上线</el-radio>
            <el-radio :label="'0'">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告图片: " prop="adPicture">
          <img :src="ruleForm.adPicture" class="img" v-if="ruleForm.adPicture" width='150px'>
          <div class='btn-wrapper'>
            <label for="upload"><el-button type="primary" size="small">上传图片</el-button></label>
            <input id="upload" type="file" class="upload-input" accept="image/jpeg, image/png" @change="uploadPic">
            <div class="form-tidivs">只能上传jpg/png格式文件，文件不能超过50kb</div>
          </div>
        </el-form-item>
        <el-form-item label="广告商品链接: " prop="adLink">
          <el-autocomplete
              v-model="ruleForm.adLink"
              :fetch-suggestions="searchGoods"
              @select="toSelect"
              placeholder="请选择商品"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="广告备注: " prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
import qs from 'qs'
export default {
  name: 'addProp',
  components:{
    subtitle,
    pagination
  },
  data () {
    let validPic = (item, value, callback) => {
        if (!this.ruleForm.adPicture){
          callback(new Error('请上传广告图片'));
        }else{
          callback();
        }
      };
    return {
      adPositionList:{
        '1': 'APP首页轮播',
        '2': '分类轮播',
      },
      adLink:'',
      isAdd:true,
      inputValue:'',
      visible:false,
      ruleForm: {
          adName: '',
          adPosition: '',
          adPicture: '',
          adLink: '',
          online: '1',
          remark: '',
      },
      rules: {
          adName: [
            { required: true, message: '请输入广告名称', trigger: 'blur' },
            { max: 30, message: '长度必须小于30个字符', trigger: 'blur' }
          ],
          adPosition : [
            { required: true, message: '请选择广告位置', trigger: 'change' }
          ],
          adPicture: [
            { validator: validPic, trigger: 'change' }
          ],
          adLink: [
            { required: true, message: '请选择广告商品', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请输入广告备注', trigger: 'change' }
          ],
      }  
     }
  },
  created(){
    if(this.$route.query.id){
      this.$axios.post('merchant_ad/get_single_merchant_ad',{
        id: this.$route.query.id
      }).then((res)=>{
        this.isAdd = false
        console.log(res)
        this.$set(this.ruleForm, 'adName', res.data.data.adName)
        this.$set(this.ruleForm, 'adPosition', String(res.data.data.adPosition))
        this.$set(this.ruleForm, 'adPicture', res.data.data.adPicture)
        this.$set(this.ruleForm, 'online', res.data.data.online)
        this.$set(this.ruleForm, 'remark', res.data.data.remark)
        this.adLink = res.data.data.adLink

      })
    }
  },
  methods:{
    uploadPic(file){
      console.log(file)
      this.uploadFile(file).then((res) => {
        this.$set(this.ruleForm, 'adPicture', res.imgUrl)
      })
    },
    uploadFile(file){
      return new Promise((resolve, reject) => {
        if (file.target.files.length > 0){
          let formData = new FormData()
          formData.append('file', file.target.files[0])
          this.$axios.post('merchant/upload_file', formData, {
            type: 'form',
            file: 'image'
          }).then((res) => {
            console.log(res)
            resolve({
              imgUrl: res.imgUrl + res.image
            })
          },(err) => {
            this.$message.error(err.msg)
            reject(err)
          })
        }
      })
    },
    searchGoods(val,callback){
      this.$axios.post('merchantGoods/merchant_goods_list_page',{
        currentPage: 1,
        pageSize: 100,
        goodsName: val
      }).then((res)=>{
        let newList = res.data.data.list.map((item)=>{
          item.value = item.goodsName//ps:必须为每个对象增加value字段！！因为autocomplete只识别value字段并在下拉列中显示
          return item
        })
        callback(newList)
      })
    },
    toSelect(val){
      this.adLink = val.id
    },
    afterSubmit(){
      setTimeout(()=>{
        this.$router.push("/operate/list")
      },500)
    },
    submit(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          if(this.isAdd){
            this.ruleForm.adLink = this.adLink
            this.$axios.post("merchant_ad/add_merchant_ad",this.ruleForm).then(()=>{
              this.$message({
                type:'success',
                message:'提交成功'
              })
              this.afterSubmit()
            }).catch((err)=>{
              this.$message.error(err.msg)
            })
          }else{
            this.$set(this.ruleForm, 'id', this.$route.query.id)
            this.ruleForm.adLink = this.adLink
            this.$axios.post("merchant_ad/add_merchant_ad",this.ruleForm).then(()=>{
                this.$message({
                  type:'success',
                  message:'提交成功'
                })
                this.afterSubmit()
              }).catch((err)=>{
                this.$message.error(err.msg)
              })
          }
        }
        
         
      })
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:90%
  margin: 30px auto
  .form
    width:600px
    .btn-wrapper
      position:relative
      .upload-input
        width:80px
        height:32px
        position:absolute
        left:0
        top:5px
        z-index:5
        opacity:0
    .props
      .props-tag
        margin-right:8px
      .props-input
        width:110px
    .changeProp
      .tips
        font-size:12px
        color: #5a5a5a
        line-height:16px
    .propSort
      .tips
        font-size:12px
        color: #5a5a5a
        line-height:16px
        margin-top:5px
</style>