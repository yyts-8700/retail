<template>
  <div class='addProp'>
    <subtitle :subtitle="'添加分类'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="form">
        <el-form-item label='类目名称:' prop='navName'>
          <el-input  v-model='ruleForm.navName'></el-input>
        </el-form-item>
        <el-form-item label='上级类别:' prop='parentId'>
          <el-select v-model="ruleForm.parentId" placeholder="请选择分类">
            <el-option :label="item.typeName" :value="item.id" v-for="(item, index) in classList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop='navSort'>
          <el-input v-model="ruleForm.navSort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类目图标: " prop="navIcon" class='propSort'>
          <img :src="ruleForm.navIcon" alt="" class="form-img" v-if="ruleForm.navIcon">
          <div class="upload-wrapper">
            <label for="upload" class="upload-btn"><el-button type='primary' :size='"small"'>上传图片</el-button></label>
            <input @change="uploadIcon" id="upload" type="file" class="upload-input" accept="image/jpeg, image/png">
            <p class="tips">图标尺寸为18*18比例，大小不能超过200KB，图片只能为jpg、png、gif格式</p>
          </div>
        </el-form-item>
        <el-form-item label="类目描述: " prop="navDesc">
          <el-input type="textarea" v-model="ruleForm.navDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="submit('ruleForm')">提交</el-button>
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
    let navIconValid = function (item, value, callback) {
        if (!this.ruleForm.navIcon){
          callback(new Error('请上传类目图标'));
        } else {
          callback();
        }
      };
    return {
      classList: [{id: 0,typeName: '顶级分类'}],
      adLink:'',
      isAdd:true,
      inputValue:'',
      visible:false,
      ruleForm: {
          navName: '',
          parentId: 0,
          navSort: '',
          status: '0',
          navIcon: '',
          navDesc: ''
        },
      rules: {
          navName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
          ],
          // navIcon: [
          //   { validator: navIconValid, trigger: 'change'}
          // ]
        },  
     }
  },
  created(){
  	this.$axios.post("merchantGoodsType/query_goods_type_tree").then((res)=>{
  		this.classList = [...this.classList,...res.data.data]
  	})
    if(this.$route.query.id){
      this.isAdd = false;
      this.$axios.post("merchantGoodsType/merchant_goods_type_by_id",{
        id: this.$route.query.id
      }).then((res)=>{
            this.$set(this.ruleForm, 'navName', res.data.data.navName);
            this.$set(this.ruleForm, 'parentId', res.data.data.parentId);
            this.$set(this.ruleForm, 'navSort', res.data.data.navSort);
            this.$set(this.ruleForm, 'status', res.data.data.status);
            this.$set(this.ruleForm, 'navIcon', res.data.data.navIcon);
            this.$set(this.ruleForm, 'navDesc', res.data.data.navDesc);
          }).catch((err)=>{
          	this.$message.error(err.msg)
          })
    }
  },
  methods:{
    uploadIcon(val){
      this.uploadFile(val).then((res) => {
          this.$set(this.ruleForm, 'navIcon', res.imgUrl);
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
    afterSubmit(){
      setTimeout(()=>{
        this.$router.push("/operate/list")
      },500)
    },
    submit(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          if(this.isAdd){
            this.$axios.post("merchantGoodsType/merchant_add_goods_type",this.ruleForm).then(()=>{
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
            this.$axios.post("merchantGoodsType/merchant_goods_type_update",this.ruleForm).then(()=>{
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
    width:650px
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