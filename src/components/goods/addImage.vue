<template>
  <div class='addProp'>
    <subtitle :subtitle="'添加图片库'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label="相册名称: " prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="相册封面: " prop="cover">
          <img :src="ruleForm.cover" alt="" class="form-img" v-if="ruleForm.cover" width=150px>
          <div class="upload-wrapper">
            <label for="upload"><el-button type="primary" size="small">上传图片</el-button></label>
            <input id="upload" type="file" class="upload-input" accept="image/jpeg, image/png" @change="uploadLogo">
            <p class="tips">只能上传jpg/png格式文件，文件不能超过50kb</p>
          </div>
        </el-form-item>
        <el-form-item label="排序: " prop="sorting">
          <el-input v-model="ruleForm.sorting" type="number"></el-input>
        </el-form-item>
        <el-form-item label="相册描述: " prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
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
import qs from 'qs'
export default {
  name: 'addProp',
  components:{
    subtitle
  },
  data () {
    let validCover = (item, value, callback) => {
        if (!this.ruleForm.cover){
          callback(new Error('请上传相册封面'));
        }else{
          callback();
        }
      };
    return {
      
      adLink:'',
      isAdd:true,
      inputValue:'',
      visible:false,
      ruleForm: {
          name: '',
          cover: '',
          sorting: '',
          description: ''
        },
      rules: {
          name: [
            { required: true, message: '请输入相册名称', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          cover: [
            { validator: validCover, required: true, trigger: 'change' }
          ],
        }
     }
  },
  created(){
    if(this.$route.query.id){
      this.$axios.post('merchant_goods_galleries/query_by_id',qs.stringify({
        id: this.$route.query.id
      })).then((res)=>{
        this.isAdd = false
        this.$set(this.ruleForm, 'name', res.data.data.name)
        this.$set(this.ruleForm, 'cover', res.data.data.cover)
        this.$set(this.ruleForm, 'sorting', res.data.data.sorting)
        this.$set(this.ruleForm, 'description', res.data.data.description)
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    }
  },
  methods:{
    uploadLogo(file){
      this.uploadFile(file).then((res) => {
        this.$set(this.ruleForm, 'cover', res.imgUrl);
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
              imgUrl: res.data.data.imgUrl + res.data.data.image
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
        this.$router.push("/goods/libManage")
      },500)
    },
    submit(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          if(this.isAdd){
            this.$axios.post("merchant_goods_galleries/add",this.ruleForm).then(()=>{
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
            this.$axios.post("merchant_goods_galleries/update",this.ruleForm).then(()=>{
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