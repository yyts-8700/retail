<template>
  <div class='addClass'>
    <subtitle :subtitle="'添加分类'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form">
        <el-form-item label='分类名称:' prop='typeName'>
          <el-input  v-model='ruleForm.typeName'></el-input>
        </el-form-item>
        <el-form-item label='上级分类:' prop='styleId'>
          <el-select :disabled='isAddClass' v-model='ruleForm.parentId' placeholder="请选择分类">
            <el-option v-for='(item,index) in classList' :value='item.id' :label='item.typeName' :key='index'></el-option>
          </el-select>
          <p class="tips" v-if="!isAddClass">不选择分类默认为顶级分类</p>
        </el-form-item>
        <el-form-item label="数量单位: " prop="goodsUnit">
          <el-input v-model="ruleForm.goodsUnit"></el-input>
        </el-form-item>
        <el-form-item label="排序: " prop="goodsSort">
          <el-input v-model="ruleForm.goodsSort" type="number"></el-input>
        </el-form-item>
        
        <el-form-item label='是否显示:' prop='showStatus'>
          <el-radio-group v-model="ruleForm.showStatus">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
       
        <el-form-item label="分类图标: " prop="typeIcon">
          <img :src="ruleForm.typeIcon" v-if="ruleForm.typeIcon">
          <div class="upload-btn-wrapper">
            <label for="upload"><el-button size="small" type="primary">上传图片</el-button></label>
            <input class='upload-input' @change="uploadTypeIcon" id="upload" type="file" accept="image/jpeg, image/png">
            <p class="tips">图标尺寸为18*18比例，大小不能超过200KB，图片只能为jpg、png、gif格式</p>
          </div>
        </el-form-item>
        <el-form-item label='分类描述:'  prop='typeDesc'>
          <el-input type="textarea" v-model="ruleForm.typeDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
export default {
  name: 'addProp',
  components:{
    subtitle,
    pagination
  },
  data () {
    let validProp = (item, value, callback) => {
        if (this.dynamicTags.length == 0){
          callback(new Error('请添加属性值'));
        } else if (this.ruleForm.propertySelect == 0 && this.dynamicTags.length > 1){
          callback(new Error('唯一属性只能添加一个属性值'));
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
          typeName: '',
          parentId: 0,
          goodsUnit: '',
          goodsSort: '',
          showStatus: '1',
          typeIcon: ''
        },
      rules: {
        typeName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
        ],
      },
       
        
        
     
     }
  },
  created(){
    this.$axios.post("merchantGoodsType/query_goods_type_tree").then((res)=>{
      this.classList = [...this.classList,...res.data.data]
      if(this.$route.query.id){
        this.isAdd = false
        this.$axios.post("merchantGoodsType/merchant_goods_type_by_id",{
          id:this.$route.query.id
        }).then((res)=>{
          this.$set(this.ruleForm, 'typeName', res.data.data.typeName);
          this.$set(this.ruleForm, 'parentId', res.data.data.parentId);
          this.$set(this.ruleForm, 'goodsUnit', res.data.data.goodsUnit);
          this.$set(this.ruleForm, 'goodsSort', res.data.data.goodsSort);
          this.$set(this.ruleForm, 'status', res.data.data.status);
          this.$set(this.ruleForm, 'typeIcon', res.data.data.typeIcon);
        }).catch((err)=>{
          this.$message.error(err.msg)
        })
      }
      if(this.$route.query.parentId){
        this.$set(this.ruleForm, 'parentId', Number(this.$route.query.parentId));
        this.isAddClass = true
      }
    })
  },
  methods:{
    uploadTypeIcon(){

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
            this.$axios.post("merchantGoodsType/merchant_add_goods_type",this.ruleForm).then((res)=>{
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
            this.$axios.post("merchantGoodsType/merchant_goods_type_update",this.ruleForm).then(()=>{
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
    width:700px
    .upload-btn-wrapper
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