<template>
  <div class='addProp'>
    <subtitle :subtitle="'添加参数'"/>
    <div class='body'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="form">
        <el-form-item label='参数名称:' prop='paramName'>
          <el-input  v-model='ruleForm.paramName'></el-input>
        </el-form-item>
        <el-form-item label='商品类型:' prop='styleId'>
          <el-select v-model='ruleForm.styleId' placeholder="请选择类型">
            <el-option v-for='(item,index) in typeList' :value='item.id' :label='item.styleName' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class='changeProp' label="参数是否可选: " prop="paramSelect">
          <el-radio v-model="ruleForm.paramSelect" :label="0" >唯一属性</el-radio>
          <el-radio v-model="ruleForm.paramSelect" :label="1" >单选属性</el-radio>
          <el-radio v-model="ruleForm.paramSelect" :label="2" >复选属性</el-radio>
          <p class="tips">选择"单选/复选属性"时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择"唯一属性"时，商品的该属性值只能设置一个值，用户只能查看该值。</p>
        </el-form-item>
        <el-form-item class='props' label="属性值: " prop="paramList">
          <el-tag class='props-tag' @close="closeTag(item)" closable v-for='(item,index) in dynamicTags' :key='index'>{{item}}</el-tag>
          <el-input size='small' class='props-input' v-model='inputValue' ref="tagInput" v-if='visible' @blur="handleInputConfirm" @keyup.enter.native="handleInputConfirm"></el-input>
          <el-button size='small' class='props-button' v-else @click='showInput'>添加属性值</el-button>
        </el-form-item>
        <el-form-item class='propSort' label='属性排序:' prop='paramSort'>
          <el-input v-model="ruleForm.paramSort" type="number"></el-input>
          <p class="tips">排序级别最高的属性可单独上传属性图片</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
          <el-button  @click="back">返回</el-button>
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
    let validParam = (item, value, callback) => {
        if (this.dynamicTags.length == 0){
          callback(new Error('请添加属性值'));
        } else if (this.ruleForm.paramSelect == 0 && this.dynamicTags.length > 1){
          callback(new Error('唯一属性只能添加一个属性值'));
        }else{
          callback();
        }
      };
    return {
      isAdd:true,
      inputValue:'',
      visible:false,
      typeList:[],
      dynamicTags: [],
      ruleForm: {
        paramName: '',
        styleId: '',
        paramSelect: 1,
        paramList: '',
        paramSort: '',
      },
      rules: {
        paramName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { max: 20, message: '长度必须小于20个字符', trigger: 'blur' }
        ],
        styleId: [
          { required: true, message: '请选择商品类型', trigger: 'change' },
        ],
        paramList: [
          { validator: validParam, required: true, trigger: 'change'  },
        ],
      }
       
        
        
     
     }
  },
  mounted(){
    this.$axios.post("merchantGoodsStyle/merchant_goods_type_list").then((res)=>{
      this.typeList = res.data.data
      if(this.$route.query.id){
        this.isAdd = false
        this.$axios.post("merchantGoodsParam/merchant_goods_type_by_id",{
          id:this.$route.query.id
        }).then((res)=>{
          this.$set(this.ruleForm,'paramName',res.data.data.paramName)
          this.$set(this.ruleForm, 'styleId', res.data.data.styleId)
          this.$set(this.ruleForm, 'paramSelect', res.data.data.paramSelect)
          if(res.data.data.paramList.length>0){
            this.dynamicTags = res.data.data.paramList.split(',')
          }
          this.$set(this.ruleForm, 'paramSort', res.data.data.paramSort)
        })
      }
    })
  },
  methods:{
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
          this.$set(this.ruleForm,'paramList',this.dynamicTags.join(','))
          if(this.isAdd){
            this.$axios.post('merchantGoodsParam/merchant_goods_type_add',this.ruleForm).then(()=>{
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
            this.$axios.post('merchantGoodsParam/merchant_goods_type_update',this.ruleForm).then(()=>{
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