<template>
  <div class='addClass'>
    <subtitle :subtitle="'添加品牌'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
       <el-form-item label="品牌名称: " prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母: " prop="firstChar">
          <el-input v-model="ruleForm.firstChar"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO: " prop="logo">
          <img :src="ruleForm.logo" alt="" class="form-img" v-if="ruleForm.logo" style='max-width: 150px'>
          <div class="upload-wrapper">
            <label for="upload"><el-button type="primary" size="small" style='background:#5BC0BF;border:none'>上传图片</el-button></label>
            <input @change="uploadLogo1" id="upload" type="file" class="upload-input" accept="image/jpeg, image/png">
            <p class="tips">只能上传jpg/png格式文件</p>
          </div>
        </el-form-item>
        <el-form-item label="品牌专区大图: " prop="areaLogo">
          <img :src="ruleForm.areaLogo" alt="" class="form-img" v-if="ruleForm.areaLogo" style='max-width: 150px'>
          <div class="upload-wrapper">
            <label for="upload1"><el-button type="primary" size="small" style='background:#5BC0BF;border:none'>上传图片</el-button></label>
            <input @change="uploadLogo2" id="upload1" type="file" class="upload-input" accept="image/jpeg, image/png">
            <p class="tips">只能上传jpg/png格式文件</p>
          </div>
        </el-form-item>
        <el-form-item label="排序: " prop="sorting">
          <el-input v-model="ruleForm.sorting" type="number"></el-input>
        </el-form-item>
        <el-form-item label="品牌故事: " prop="story">
          <el-input type="textarea" v-model="ruleForm.story"></el-input>
        </el-form-item>
        <el-form-item label="是否显示: " prop="isShow" class='radio'>
          <el-radio-group v-model="ruleForm.isShow">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
          <p class="tips">当品牌下还没有商品的时候，分类页的品牌区将不会显示该品牌。</p>
        </el-form-item>
        <el-form-item>
          <el-button style='background:#5BC0BF;border:none' type="primary" @click="submit('ruleForm')">提交</el-button>
          <el-button @click="back">返回</el-button>
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
    let validLogo = (item, value, callback) => {
        if (!this.ruleForm.logo){
          callback(new Error('请上传品牌logo'));
        }else{
          callback();
        }
      };
    return {
      isAddClass:false,
      classList: [{id: 0,typeName: '顶级分类'}],
      isAdd:true,

      inputValue:'',
      visible:false,
      dynamicTags: [],
      ruleForm: {
          name: '',
          logo: '',
          areaLogo: '',
          story: '',
          isShow: '1',
          sorting: '',
          firstChar: ''
        },
      rules: {
          name: [
            { required: true, message: '请输入品牌名字', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          logo: [
            { validator: validLogo, required: true, trigger: 'change' }
          ],
          isShow: [
            { required: true, trigger: 'change' }
          ],
        }
     }
  },
  created(){
    if(this.$route.query.id){
      this.$axios.post('merchant_goods_brand/query_by_id',qs.stringify({
        id: this.$route.query.id
      })).then((res)=>{
        this.isAdd = false;
        this.$set(this.ruleForm, 'name', res.data.data.name);
        this.$set(this.ruleForm, 'logo', res.data.data.logo);
        this.$set(this.ruleForm, 'areaLogo', res.data.data.areaLogo);
        this.$set(this.ruleForm, 'story', res.data.data.story);
        this.$set(this.ruleForm, 'isShow', res.data.data.isShow.toString());
        this.$set(this.ruleForm, 'sorting', res.data.data.sorting);
        this.$set(this.ruleForm, 'firstChar', res.data.data.firstChar);
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    } 
  },
  methods:{
    uploadLogo2(){

    },
    uploadLogo1(val){
      this.uploadFile(val).then((res) => {
          this.$set(this.ruleForm, 'logo', res.imgUrl);
        })
    },
    uploadFile(file){
      return new Promise((resolve, reject) => {
        if (file.target.files.length > 0){
          let formData = new FormData();
          formData.append('file', file.target.files[0]);
          this.$axios.post('merchant/upload_file', formData, {
            type: 'form',
            file: 'image'
          }).then((res) => {

            resolve({
              imgUrl: res.imgUrl + res.image
            });
          },(err) => {
            this.$msgErr(err.msg);
            reject(err);
          })
        }
      })
    },
    back(){
      this.$router.go(-1)
    },
    afterSubmit(){
      setTimeout(()=>{
        this.back()
      },500)
    },
    submit(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          if(this.isAdd){
            this.$axios.post("merchant_goods_brand/add",this.ruleForm).then((res)=>{
              this.$message({
                  type:'success',
                  message:'操作成功'
                });
              this.afterSubmit()
            }).catch((err)=>{
                this.$message.error(err.msg)
            })
          }else{
            this.ruleForm.id = this.$route.query.id;
            this.$axios.post("merchant_goods_brand/update",this.ruleForm).then(()=>{
              this.$message({
                  type:'success',
                  message:'操作成功'
                });
              this.afterSubmit()
            }).catch((err)=>{
                this.$message.error(err.msg)
            })
          }
        }
      })
    },
    closeTag(item){
      this.dynamicTags.splice(this.dynamicTags.indexOf(item), 1)
    },
    showInput(){
      this.visible = true;
      this.$nextTick(()=>{
        this.$refs.tagInput.focus()
      })
    },
    handleInputConfirm(){
      if(this.inputValue){
        if(this.dynamicTags.indexOf(this.inputValue)<0){
          this.dynamicTags.push(this.inputValue)
        }
      }
      this.visible = false
      this.inputValue = ''
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
<style>
.body .radio .is-checked .el-radio__inner{
    background-color: #5BC0BF;
    border-color: #5BC0BF;
}
.body .radio .is-checked .el-radio__label{
  color: #5BC0BF;
}
 
</style>