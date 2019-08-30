<template>
  <div class='addGoods'>
    <subtitle :subtitle="'添加商品'"/>
    <div class="body">
      <el-steps :active="active" align-center class='steps'>
          <el-step title="选择商品分类"></el-step>
          <el-step title="填写商品信息"></el-step>
          <el-step title="填写商品属性"></el-step>
          <el-step title="选择商品关联"></el-step>
       </el-steps>
       <div class='step-wrapper'>
         <div class='step1' v-if='active == 1' >
           <div class='step-label'>基本信息</div>
           <div class="step-content">
             <div class="goods-class">
               <span class='tips'>您最近使用的商品分类:</span>
               <el-select v-model='goodsClass' placeholder="请选择商品分类" class="search-input">
                 <el-option v-for='(item,index) in classList' :value='item.id' :label='item.typeName' :key='index'></el-option>
               </el-select>
             </div>
             <div class='chooseClass'>
               <div class='left'>
                 <div class='title'>
                   选择一级分类
                 </div>
                 <ul class="class1">
                   <li :class="ruleForm.typeId == item.id ? 'active' : ''" v-for='(item,index) in classList' :key='index' @click='getCategory(item)'>
                     <span>{{item.typeName}}</span>
                     <i class="el-icon-arrow-right"></i>
                   </li>
                 </ul>
               </div>
               <div class="img">
                 <img src="@/assets/icon-arrow.png" alt="" class='arrow'>
               </div>
               <div class='right'>
                 <div class='title'>
                   选择二级分类
                 </div>
                 <ul class="class1" v-if='childCategoryList.length>0'>
                   <li :class="ruleForm.childId == item.id ? 'active' : ''" v-for='(item,index) in childCategoryList' :key='index' @click='getChildCategory(item)'>
                     <span>{{item.typeName}}</span>
                   </li>
                 </ul>
                 <div v-if='childCategoryList.length == 0' class="empty">
                     暂无分类
                 </div>
               </div>
             </div>
             <div class='nowClass'>
               <p class='tips'>您当前选择的商品类别是：
                <span>{{categoryName || '未选择'}}</span>
                <span v-show="childCategoryName"> > {{ childCategoryName || '未选择' }}</span>
               </p>
             </div>
             <div class='button-wrapper'>
              <el-button type="primary" @click="submit1" class='button'>下一步，填写商品信息</el-button>
             </div>
           </div>
         </div>
         <div class="step2" v-if='active == 2'>
           <div class="step-label-wrapper">
              <div class="step-label">基本信息</div>
              <div class="step-label step-last">库存规格</div>
            </div>
            <div class="step-content">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="form">
                <el-form-item label="商品分类: ">
                  <span class="nowClass" @click="active = 1">{{ categoryName }}</span>
                  <span class="nowClass" v-show="childCategoryName">{{' > ' + childCategoryName }}</span>
                </el-form-item>
                <el-form-item label="商品名称: " prop="goodsName">
                  <el-input v-model="ruleForm.goodsName"></el-input>
                </el-form-item>
                <el-form-item label="副标题: " prop="goodsSubtitle">
                  <el-input v-model="ruleForm.goodsSubtitle"></el-input>
                </el-form-item>
                <el-form-item label="商品品牌: " prop="brandId">
                  <el-select v-model="ruleForm.brandId" placeholder="请选择品牌">
                    <el-option :label="item.name" :value="item.id" v-for="(item,index) in brandList" :key='index'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品介绍" prop="goodsDesc">
                  <el-input type="textarea" v-model="ruleForm.goodsDesc"></el-input>
                </el-form-item>
                <el-form-item label="商品货号: " prop="goodsNo">
                  <el-input v-model="ruleForm.goodsNo" placeholder=""></el-input>
                  <p class="tips">如果您不输入商品货号，系统将自动生成一个唯一的货号</p>
                </el-form-item>
                <el-form-item label="商品售价: " prop="goodsPrice">
                  <el-input v-model="ruleForm.goodsPrice" type="number"></el-input>
                </el-form-item>
                <el-form-item label="市场价: " prop="marketPrice">
                  <el-input v-model="ruleForm.marketPrice" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品库存: " prop="goodsStock">
                  <el-input v-model="ruleForm.goodsStock" type="number"></el-input>
                  <p class="tips">该设置只对单品有效，当商品存在多规格货品时为不可编辑状态，库存数值取决于货品数量</p>
                </el-form-item>
                <el-form-item label="库存预警值: " prop="goodsWarning">
                  <el-input v-model="ruleForm.goodsWarning" type="number"></el-input>
                </el-form-item>
                <el-form-item label="计量单位: " prop="goodsUnit">
                  <el-input v-model="ruleForm.goodsUnit"></el-input>
                </el-form-item>
                <el-form-item label="商品重量: " prop="goodsWeight">
                  <el-input v-model="ruleForm.goodsWeight"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="active = 1">上一步,选择商品分类</el-button>
                  <el-button type="primary" @click="submit2('ruleForm')">下一步,填写商品属性</el-button>
                </el-form-item>
              </el-form>
            </div>
         </div>
         <div class="step3" v-if='active == 3'>
           <div class="goods-prop">
             <div class='step-label'>商品属性</div>
             <div class="goods-type">
               <el-form class="form-prop" label-width="100px">
                  <el-form-item label="商品类型: ">
                    <el-select v-model="ruleForm.styleId" placeholder="请选择商品类型" @change="getProp">
                      <el-option :label="item.styleName" :value="item.id" v-for="(item,index) in typeList" :key='index'></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="商品规格: " v-if="propList.length > 0">
                    <div class="prop-wrapper">
                      <el-checkbox-group v-model="checkProp" v-for="(item,index) in propList" :key="index">
                        <div class="prop-name" style="font-size:14px">{{ item.name }}</div>
                        <el-checkbox @change="handleCheckProp(prop, item.name, $event)" :label="item.name + prop" v-for="(prop,index) in item.value" :key='index'>{{ prop }}</el-checkbox>
                      </el-checkbox-group>
                      <div class='btn-wrapper'>
                        <el-button size="small" type="primary" @click="addProps">添加</el-button>
                      </div>
                    </div>
                  </el-form-item>
               </el-form>
               <table class="goods-table" border="1" v-show="propSpecList.length > 0">
                  <thead>
                    <td v-for="(item,index) in propHeader" :key='index'>{{ item }}</td>
                    <td>销售价格</td>
                    <td>商品库存</td>
                    <td>库存预警值</td>
                  </thead>
                  <tbody>
                    <tr v-for="item in propSpecList">
                      <td v-for="val in item.nameValue">{{ val.value }}</td>
                      <td><el-input v-model="item.goodsSalePrice" size="mini" type="number" :max="99999"></el-input></td>
                      <td><el-input v-model="item.goodsStock" size="mini" type="number" :max="99999"></el-input></td>
                      <td><el-input v-model="item.stockWarning" size="mini" type="number" :max="99999"></el-input></td>
                    </tr>
                  </tbody>
               </table>
             </div>
           </div>
           <div class='goods-params'>
             <div class='step-label'>商品属性</div>
             <table class="goods-table" border="1">
                <thead>
                  <td>参数类型</td>
                  <td>录入参数</td>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in paramsList" :key='index'>
                    <td>{{ item.name || item.paramDetailName }}</td>
                    <td>
                      <el-select v-model="ruleForm.merchantParamDetailIds.merchantParamDetails[index].specificationsValue" placeholder="请选择商品参数值" class='select'>
                        <el-option :label="val" :value="val" v-for="(val,index) in item.list" :key='index'></el-option>
                      </el-select>
                    </td>
                  </tr>
                <tr>
                  <td>主材含量</td>
                  <td><el-input v-model="ruleForm.merchantParamDetailIds.mainMaterial" size="mini" class='input'></el-input></td>
                </tr>
                <tr>
                  <td>适用对象</td>
                  <td><el-input v-model="ruleForm.merchantParamDetailIds.paramObject" size="mini" class='input'></el-input></td>
                </tr>
                </tbody>
              </table>
           </div>
           <div class='upload-img'>
             <div class="step-label">商品相册</div>
             <div class='content'>
               <div class="super-img-wrapper">
               <div class="img-wrapper" v-for="(item,index) in imgList" :key="index">
                  <div class="img">
                    <img :src="item" alt="">
                    <i class="el-icon-picture" v-if="!item"></i>
                  </div>
                  <div class="des">
                    <span class="zhutu" v-if="index == 0">商品主图</span>
                    <span class="swzhutu" v-if="index != 0" @click="setMainPic(item, index)">设为主图</span>
                    <span class="sczhutu" @click="deleteImg(index)">删除图片</span>
                  </div>
               </div>
               </div>
               <div class='upload-btn'>
                <div class="upload-btn-wrap">
                  <label for="upload"><el-button type="primary">上传图片</el-button></label>
                  <input id="upload" @change="uploadGoodImg" type="file" class="upload-input" accept="image/jpeg, image/png">
                </div>
                <el-button type="primary" @click="dialogVisible = true">从图片库选择</el-button>
               </div>
                <p class="tips">最多可以上传5张图片，建议尺寸800*800px</p>
             </div>
           </div>
           <div class="good-detail">
             <div class="step-label">商品详情</div>
             <div class="wrapper">
               <div class="editor-wrapper">
                 <quill-editor v-model="ruleForm.goodsMobileImg" class="editor"></quill-editor>
               </div>
               <div class="btn-wrapper">
                 <el-button @click='active = 2'>上一步,填写商品信息</el-button>
                 <el-button type="primary" @click='submitGood'>下一步,选择商品类目</el-button>
               </div>
             </div>
           </div>
         </div>
         <div class='step4' v-if='active == 4'>
           <div class='step-label'>关联类目</div>
           <div class="step-content">
             <div class="goods-class">
               <span class='tips'>* 类目非必选 | 选了一级类目必须选择二级类目</span>
             </div>
             <div class='chooseClass'>
               <div class='left'>
                 <div class='title'>
                   选择一级分类
                 </div>
                 <ul class="class1">
                   <li :class="ruleForm.navId == item.id ? 'active' : ''" v-for='(item,index) in headerList' :key='index' @click='getHeader(item)'>
                     <span>{{item.navName}}</span>
                     <i class="el-icon-arrow-right"></i>
                   </li>
                 </ul>
               </div>
               <div class="img">
                 <img src="@/assets/icon-arrow.png" alt="" class='arrow'>
               </div>
               <div class='right'>
                 <div class='title'>
                   选择二级分类
                 </div>
                 <ul class="class1" v-if='childHeaderList.length>0'>
                   <li :class="ruleForm.navChildId == item.id ? 'active' : ''" v-for='(item,index) in childHeaderList' :key='index' @click='getChildHeader(item)'>
                     <span>{{item.navName}}</span>
                   </li>
                 </ul>
                 <div v-if='childHeaderList.length == 0' class="empty">
                     暂无分类
                 </div>
               </div>
             </div>
             <div class='button-wrapper'>
              <el-button @click="active = 3" class='button'>上一步,填写商品属性</el-button>
              <el-button type="primary" @click="submitGoods" class='button'>完成,提交商品</el-button>
             </div>
           </div>
         </div>
       </div>
    </div>
    <el-dialog title="从图库选择" :visible.sync="dialogVisible" class='dialog'>
      <div class="title">
        <span>商品图库 > 全部图片</span>
        <el-select @change="getAlbumImg" v-model="input" placeholder="请选择图库分类" size="small" class="search-input">
          <el-option :value="item.id" :label="item.name" v-for="(item,index) in albumList" :key='index'></el-option>
        </el-select>
      </div>
      <div class="img-table">
        <div v-for="(item, index) in albumImgList" :key="index" @click="checkAlbumImg(item)" class="img-wrapper">
          <img :src="item.imgUrl" alt="">
          <i class="el-icon-success" v-if="checkAlbumImgList.indexOf(item.imgUrl) >= 0"></i>
        </div>
      </div>
      <pagination :isBatch="false" @next="next" :total="total" :pageSize="pageSize" class="pagination" style='background-color: #fff'></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import subtitle from '../subtitle'
import pagination from '../pagination'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'addGoods',
  components:{
    subtitle,
    pagination,
    quillEditor
  },
  data () {
    let validGoodsStock = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入商品库存'));
        } else if (value > 99999) {
          callback(new Error('商品库存最大值为99999'));
        } else if (value < 0) {
          callback(new Error('商品库存不能小于0'));
        } else {
          callback();
        }
    };
    return {
      isAdd:true,
      childHeaderList:[],
      headerList:[],
      currentPage:1,
      albumId:'',
      pageSize:10,
      total:0,
      checkAlbumImgList:[],
      albumImgList:[],
      albumList:[],
      input:'',
      checkPropList:[],
      dialogVisible:false,
      active:1,
      goodsClass:'',
      classList:'',
      childCategoryList: [],
      categoryName:'',
      childCategoryName:'',
      brandList:[],
      propList:[],
      typeList:[],
      checkProp:[],
      propSpecList: [],
      propHeader:[],
      paramsList:[],
      imgList:[],
      ruleForm: {
          typeId: '', //一级分类ID
          childId: '', //二级分类ID
          goodsName: '', //商品名称
          goodsSubtitle: '', //副标题
          brandId: '', //商品品牌
          goodsDesc: '', //商品介绍
          goodsNo: '', //商品货号
          goodsPrice: '', //商品售价
          marketPrice: '', //市场价
          goodsStock: '', //商品库存
          goodsWarning: '', //库存预警值
          goodsUnit: '', //计量单位
          goodsWeight: '', //商品重量
          styleId: '', //类型ID
          merchantSpecifications: [], //商品属性列表
          merchantGoodsTypePropertyList: [], //商品属性值列表
          merchantParamDetailIds: {
            merchantParamDetails: [],
            mainMaterial: '',
            paramObject: '',
          }, //商品参数值列表
          goodsImg: '', //商品图片
          navId: '',
          navChildId: '',
      },
      rules: {
          goodsName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {max: 20, message: '长度必须小于20个字符', trigger: 'blur'},
          ],
          goodsSubtitle: [
            {required: true, message: '请输入副标题', trigger: 'blur'},
            {max: 20, message: '长度必须小于20个字符', trigger: 'blur'},
          ],
          brandId: [
            {required: true, message: '请选择品牌', trigger: 'change'},
          ],
          goodsDesc: [
            {required: true, message: '请输入商品介绍', trigger: 'blur'},
          ],
          goodsPrice: [
            {required: true, message: '请输入商品售价', trigger: 'blur'},
          ],
          goodsStock: [
            {required: true, validator: validGoodsStock, trigger: 'blur'},
          ],
          goodsWarning: [
            {required: true, message: '请输入库存预警值', trigger: 'blur'},
          ],
        },

     }

  },
  mounted(){
    this.$axios.post("merchantGoodsType/query_goods_type_tree").then((res)=>{
      this.classList = res.data.data
      this.$axios.post("merchant_goods_brand/query_list").then((res)=>{
        this.brandList = res.data.data
        this.$axios.post("merchantGoodsStyle/merchant_goods_style_list_page",{
          currentPage: 1,
          pageSize: 100
        }).then((res)=>{
          this.typeList = res.data.data.list
          this.$axios.post("merchant_goods_galleries/query_for_page",{
            currentPage: 1,
            pageSize: 100,
          }).then((res)=>{
            this.albumList = res.data.data.list;
            this.$axios.post("merchantNavigation/query_navigation_type_tree").then((res)=>{
              this.headerList = res.data.data
              if(this.$route.query.id){
                this.isAdd = false;
                this.$axios.post("merchantGoods/merchant_goods_by_id",{
                  id: this.$route.query.id
                }).then((res)=>{
                  this.categoryName = res.typeName;
                  this.childCategoryName = res.childName;
                  this.$set(this.ruleForm,'typeId',res.data.data.typeId);
                  if (String(res.data.data.childId)){
                      this.$set(this.ruleForm, 'childId', res.data.data.childId);
                      this.categoryList.map((item) => {
                        if (item.id == res.data.data.typeId){
                          this.childCategoryList = item.list;
                        }
                      })
                  }
                  this.$set(this.ruleForm, 'goodsName', res.data.data.goodsName);
                  this.$set(this.ruleForm, 'goodsSubtitle', res.data.data.goodsSubtitle);
                  this.$set(this.ruleForm, 'brandId', res.data.data.brandId);
                  this.$set(this.ruleForm, 'goodsDesc', res.data.data.goodsDesc);
                  this.$set(this.ruleForm, 'goodsNo', res.data.data.goodsNo);
                  this.$set(this.ruleForm, 'goodsPrice', res.data.data.goodsPrice);
                  this.$set(this.ruleForm, 'marketPrice', res.data.data.marketPrice);
                  this.$set(this.ruleForm, 'goodsStock', res.data.data.goodsStock);
                  this.$set(this.ruleForm, 'goodsWarning', res.data.data.goodsWarning);
                  this.$set(this.ruleForm, 'goodsUnit', res.data.data.goodsUnit);
                  this.$set(this.ruleForm, 'goodsWeight', res.data.data.goodsWeight);
                  this.$set(this.ruleForm, 'styleId', res.data.data.styleId);
                  this.$set(this.ruleForm, 'merchantParamDetailIds', res.data.data.merchantParamDetailIds);
                  this.$set(this.ruleForm, 'navId', res.data.data.navId);
                  this.$set(this.ruleForm, 'navChildId', res.data.data.navChildId);
                  if (String(res.data.data.navId)){
                      this.headerList.map((item) => {
                        if (item.id == res.data.data.navId){
                          this.childHeaderList = item.list;
                        }
                      })
                  }
                  this.paramsList = res.data.data.merchantParamDetailIds.merchantParamDetails;
                  this.propSpecList = res.data.data.merchantGoodsTypePropertyList;
                  this.$axios.post("merchantGoodsProperty/merchant_goods_property_list_page", {
                      styleId: res.data.data.styleId,
                      currentPage: 1,
                      pageSize: 100,
                    }).then((data) => {
                      let list = [];
                      data.list.map((item) => {
                        list.push({
                          name: item.propertyName,
                          value: item.propertyList.split(",")
                        });
                      });
                      this.propList = list;
                      this.checkPropList = res.data.data.map;
                      let checkProp = [];
                      let propHeader = [];
                      this.checkPropList.map((item) => {
                        propHeader.push(item.name);
                        item.value.map((prop) => {
                          checkProp.push(item.name + prop);
                        })
                      });
                      this.checkProp = checkProp;
                      this.propHeader = propHeader;

                      this.oldStyleId = res.data.data.styleId;
                      this.oldPropList = list;
                      this.oldCheckProp = checkProp;
                      this.oldCheckPropList = res.data.data.map;
                      this.oldPropHeader = propHeader;
                      this.oldPropSpecList = res.data.data.merchantGoodsTypePropertyList;
                      this.oldMerchantParamDetailIds = res.data.data.merchantParamDetailIds;
                      if (res.data.data.goodsImg){
                        this.imgList = res.data.data.goodsImg.split(',');
                      }
                    });
                })
              }
            })
          })
        })
      })
    })
  },
  methods:{
    back(){
      this.$router.go(-1)
    },
    submitGoods(){
      if (this.ruleForm.navId && !this.ruleForm.navChildId){
          this.$message({
            type:'warning',
            message:'选了一级类目必须选择二级类目'
          });
          return
        }
        let formData = JSON.parse(JSON.stringify(this.ruleForm));
        if (!formData.merchantParamDetailIds.merchantParamDetails){
          formData.merchantParamDetailIds.merchantParamDetails = [];
        }
        formData.goodsImg = this.imgList.join(',');
        formData.merchantSpecifications = this.checkPropList;
        formData.merchantGoodsTypePropertyList = this.propSpecList;
        if (this.isAdd){
          this.$axios.post('merchantGoods/merchant_goods_add',formData).then(() => {
            this.$message({
              type:'success',
              message:"添加商品成功"
            });
            setTimeout(() => {
              this.back();
            }, 500)
          }, (err) => {
            this.$message.error(err.msg);
          })
        } else {
          formData.id = this.$route.query.id;
          this.$axios.post('merchantGoods/merchant_goods_update',formData).then(() => {
            this.$message({
              type:'success',
              message:"修改成功"
            });
            setTimeout(() => {
              this.back();
            }, 500)
          }, (err) => {
            this.$message.error(err.msg);
          })
        }
    },
    getChildHeader(item){
      this.ruleForm.navChildId = item.id;
    },
    getHeader(item){
      if (this.ruleForm.navId != item.id){
          this.ruleForm.navId = item.id;
          this.ruleForm.navChildId = '';
          this.childHeaderList = item.list;
        }else {
          this.ruleForm.navId = '';
          this.ruleForm.navChildId = '';
          this.childHeaderList = [];
        }
    },
    next(val){
      this.currentPage = val;
      this.getAlbumImg(this.albumId);
    },
    addImg(){
      this.imgList = [...this.imgList, ...this.checkAlbumImgList];
      this.checkAlbumImgList = [];
      this.dialogVisible = false;
    },
    checkAlbumImg(item){
      if (this.checkAlbumImgList.indexOf(item.imgUrl) < 0){
          if (this.checkAlbumImgList.length + this.imgList.length == 5){
            this.$message({
              message:"最多添加5张",
              type:'warning'
            });
            return
          }
          this.checkAlbumImgList.push(item.imgUrl);
        } else {
          this.checkAlbumImgList.splice(this.checkAlbumImgList.indexOf(item.imgUrl), 1);
        }
    },
    getAlbumImg(val){
      this.albumId = val;
      this.$axios.post("merchant_goods_galleries_detail/query_for_page",{
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        galleriesId: val
      }).then((res) => {
        this.albumImgList = res.data.data.list;
        this.total = res.data.data.totalCount;
      })
    },
    submitGood(){
      let formData = this.ruleForm;
      if (!formData.styleId){
          this.$message({
            type:'warning',
            message:"请选择商品类型"
          });
          return
        }
        if (this.checkPropList.length == 0){
          this.$message({
            type:'warning',
            message:"请选择商品规格"
          });
          return
        }
        if (this.propSpecList.length == 0){
          this.$message({
            type:'warning',
            message:"请添加商品规格列表"
          });
          return
        }
        for (let j = 0; j < this.propSpecList.length; j++){
          let data =  this.propSpecList[j];
          if (!data.goodsSalePrice || !data.goodsStock || !data.stockWarning){
            this.$message({
              type:'warning',
              message:"请填写完整商品规格列表"
            });
            return
          }
          if (data.goodsStock > 99999 || !data.stockWarning > 99999){
            this.$message({
              type:'warning',
              message:"库存最大值为99999"
            });
            return
          }
          if (data.goodsSalePrice < 0){
            this.$message({
              type:'warning',
              message:"规格列表销售价格不能小于0"
            });
            return
          }
          if (data.goodsStock < 0){
            this.$message({
              type:'warning',
              message:"规格列表库存不能小于0"
            });
            return
          }
          if (data.stockWarning < 0){
            this.$message({
              type:'warning',
              message:"规格列表库存预警值不能小于0"
            });
            return
          }
          if (data.goodsStock < data.stockWarning){
            this.$message({
              type:'warning',
              message:"规格列表库存预警值不能大于商品库存"
            });
            return
          }
        }
        for (let i = 0; i < formData.merchantParamDetailIds.merchantParamDetails.length; i++){
          if (!formData.merchantParamDetailIds.merchantParamDetails[i].specificationsValue){
            this.$message({
              type:'warning',
              message:"请选择商品参数"
            });
            return
          }
        }
        if (!formData.merchantParamDetailIds.mainMaterial || !formData.merchantParamDetailIds.paramObject){
          this.$message({
            type:'warning',
            message:"请填写商品参数"
          });
          return
        }
        if (this.imgList.length == 0){
          this.$message({
            type:'warning',
            message:"请上传商品图片"
          });
          return
        }
        this.active = 4;
    },
    uploadGoodImg(){

    },
    deleteImg(index){
      this.imgList.splice(index, 1);
    },
    setMainPic(url,index){
      this.imgList.splice(index, 1);
      this.imgList.unshift(url);
    },
    addProps(){
      if(!this.ruleForm.styleId){
          this.$message({
            type:'warning',
            message:"请选择商品类型"
          });
          return false
      };
      if(this.checkPropList.length == 0){
        this.$message({
          type:'warning',
          message:"请选择商品属性"
        });
        return false
      };
      let propHeader = [];
      let propArr = [];
      this.checkPropList.map((item,index) => {
          propHeader.push(item.name);
          propArr[index] = [];
          this.checkPropList[index].value.map((val) => {
            propArr[index].push({
              name: this.checkPropList[index].name,
              value: val
            })
          })
        });
        this.propHeader = propHeader;
        let propItem = sortAll(propArr);
        this.propSpecList = [];
        propItem.map((item) => {
          this.propSpecList.push({
            nameValue: item instanceof Array ? item : [item],
            goodsSalePrice: '',
            goodsStock: '',
            stockWarning: '',
            skuCode: '',
          })
        });
        function sortAll(arr){
          var len = arr.length;
          if(len >= 2){
            var len1 = arr[0].length;
            var len2 = arr[1].length;
            var lenBoth = len1 * len2;
            var items = new Array(lenBoth);
            var index = 0;
            for(var i = 0; i<len1; i++){
              for(var j = 0; j < len2; j++){
                if (arr[0][i] instanceof Array){
                  items[index] = [...arr[0][i],arr[1][j]];
                }else {
                  items[index] = [arr[0][i],arr[1][j]];
                }
                index++;
              }
            }
            var newArr = new Array(len - 1);
            for(var i = 2; i < arr.length; i++){
              newArr[i-1] = arr[i];
            }
            newArr[0] = items;
            return sortAll(newArr);
          }else{
            return arr[0]
          }
        }

    },
    handleCheckProp(prop, name, e){
      if(e){
        if(this.checkPropList.length == 0){
          this.checkPropList.push({
            name:name,
            value:[prop]
          })
        }else{
          let isExist = false;
          for(let i=-0;i<this.checkPropList.length; i++){
            if(this.checkPropList[i].name == name){
              this.checkPropList[i].value.push(prop);
              isExist = true;
              break;
            }
          }
          if (!isExist){
            this.checkPropList.push({
              name: name,
              value: [prop]
            })
          }
        }
      }else{
        for (let i = 0; i < this.checkPropList.length; i++){
          if (this.checkPropList[i].name == name){
            for (let j = 0; j < this.checkPropList[i].value.length; j++){
              if (this.checkPropList[i].value[j] == prop){
                this.checkPropList[i].value.splice(j, 1);
                if (this.checkPropList[i].value.length == 0){
                  this.checkPropList.splice(i, 1)
                }
                return
              }
            }
          }
        }
      }
    },
    getProp(val){
      this.checkProp = [];
      this.checkPropList = [];
      this.propHeader = [];
      this.propSpecList = [];
      this.$axios.post("merchantGoodsProperty/merchant_goods_property_list_page",{
        styleId: val,
        currentPage: 1,
        pageSize: 100
      }).then((res)=>{
        let list = [];
        res.data.data.list.map((item) => {
          list.push({
            name: item.propertyName,
            value: item.propertyList.split(",")
          });
        });
        this.propList = list;
      });
      this.$axios.post("merchantGoodsParam/merchant_goods_property_list_page",{
        styleId: val,
        currentPage: 1,
        pageSize: 100,
      }).then((res)=>{
        let list = [];
        let formList = [];
        res.data.data.list.map((item)=>{
          list.push({
            name: item.paramName,
            list: item.paramList.split(",")
          });
          formList.push({
            paramDetailName: item.paramName,
            specificationsValue: ''
          });
        });
        this.paramsList = list;
        this.$set(this.ruleForm,'merchantParamDetailIds',{
          'merchantParamDetails': formList,
          'mainMaterial': '',
          'paramObject': '',
        });
      })
    },
    submit2(val){
      this.$refs[val].validate((valid)=>{
        if(valid){
          this.active = 3;
          document.documentElement.scrollTop = 0;
        }else{
          return false
        }
      })
    },
    submit1(){
      if (!this.ruleForm.typeId){
          this.$message({
            type:'warning',
            message:"请先选择商品分类"
          });
          return false
        }
        this.active = 2
    },
    getCategory(item){
      if(this.childCategoryName){
        this.childCategoryName = ''
      }
      if (this.ruleForm.typeId != item.id){
          this.ruleForm.typeId = item.id;
          this.ruleForm.childId = '';
          this.childCategoryList = item.list;
          this.categoryName = item.typeName;
        }
    },
    getChildCategory(item){
      this.ruleForm.childId = item.id
      this.childCategoryName = item.typeName
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
.body
  width:98%
  margin:30px auto   
  .steps
    margin-bottom:30px
  .step-wrapper
    .step1,.step4
      display:flex
      .step-label
        flex:0 1 auto
        width: 150px
        height: 50px
        line-height: 50px
        color: #fff
        padding: 0 20px
        box-sizing: border-box
        background-color: #5BC0BF
        position: relative
        margin-right: 70px
        &:after
          content: ''
          display: block
          position: absolute
          top: 0
          right: -50px
          border: 25px solid transparent
          border-left-color: #5BC0BF
      .step-content
        flex: 1 1 auto
        .goods-class
          display:flex
          align-items:center
          margin-bottom:30px
          .tips
            font-size:16px
            color:#5a5a5a
            margin-right:20px
        .chooseClass
          display:flex
          align-items:center
          .left,.right
            flex:1 1 auto
            max-width:380px
            .title
              font-size:18px
              color:#5a5a5a
              font-weight:bold
              height: 48px
              line-height: 48px
              border: 1px solid #b4b4b4
              border-bottom-color: transparent
              padding: 0 24px
            .class1
              color:#5a5a5a
              height:380px
              border: 1px solid #b4b4b4
              border-top-color: transparent
              li
                border-top: 1px solid #b4b4b4
                height:48px
                line-height:48px
                padding:0 24px
                cursor:pointer
                &.active
                  background-color:#5bc0bf
                  color:#fff
                &:last-child
                  border-bottom: 1px solid #b4b4b4
                i
                  float:right
                  margin-top:17px     
          .right
            .empty
              border: 1px solid #b4b4b4
              height:380px
              line-height:380px
              text-align:center
              color:#5a5a5a
              font-size:16px
          .img
            margin:0 36px
        .nowClass
          font-size: 14px
          margin: 20px 0
          
          span
            color:#5BC0BF
    .step2
      display:flex
      .step-label-wrapper
        flex:0 1 auto
        .step-label
          width: 150px
          height: 50px
          line-height: 50px
          color: #fff
          padding: 0 20px
          box-sizing: border-box
          background-color: #5BC0BF
          position: relative
          margin-right: 70px
          &:after
            content: ''
            display: block
            position: absolute
            top: 0
            right: -50px
            border: 25px solid transparent
            border-left-color: #5BC0BF
        .step-last
          margin-top:275px
        
      .step-content
        flex:1 1 auto
        .form
          width:50%
          .nowClass
            color:#5BC0BF
            &:hover
              cursor:pointer
          .tips
            font-size: 12px
            color: #5a5a5a
            line-height: 16px
            margin-top: 5px
    .step3
      .goods-prop
        display:flex
        margin-bottom:40px
        .step-label
          flex:0 1 auto
          width: 150px
          height: 50px
          line-height: 50px
          color: #fff
          padding: 0 20px
          box-sizing: border-box
          background-color: #5BC0BF
          position: relative
          margin-right: 70px
          &:after
            content: ''
            display: block
            position: absolute
            top: 0
            right: -50px
            border: 25px solid transparent
            border-left-color: #5BC0BF
        .goods-type
          flex:1 1 auto
          .form-prop
            width:45%
            .prop-wrapper
              padding:20px
              border:1px solid #b4b4b4
              border-radius:5px
          .goods-table
            min-width:60%
            border-right: 1px solid #b4b4b4
            border-bottom: 1px solid #b4b4b4
            td
              height: 50px
              color: #5a5a5a
              text-align: center
              border-left: 1px solid #b4b4b4
              border-top: 1px solid #b4b4b4
              padding: 0 20px
            thead
              background-color: #EEEEEE    
      .goods-params
        display:flex
        margin-bottom:40px
        .step-label
          flex:0 1 auto
          width: 150px
          height: 50px
          line-height: 50px
          color: #fff
          padding: 0 20px
          box-sizing: border-box
          background-color: #5BC0BF
          position: relative
          margin-right: 70px
          &:after
            content: ''
            display: block
            position: absolute
            top: 0
            right: -50px
            border: 25px solid transparent
            border-left-color: #5BC0BF
        .goods-table
          flex:0 1 auto
          width:30%
          border-right: 1px solid #b4b4b4
          border-bottom: 1px solid #b4b4b4
          td
            height: 50px
            color: #5a5a5a
            text-align: center
            border-left: 1px solid #b4b4b4
            border-top: 1px solid #b4b4b4
            padding: 0 20px
            .select
              width:200px
            .input
              width:200px
          thead
            background-color: #EEEEEE
      .upload-img
        display:flex
        margin-bottom:40px
        .step-label
          flex:0 1 auto
          width: 150px
          height: 50px
          line-height: 50px
          color: #fff
          padding: 0 20px
          box-sizing: border-box
          background-color: #5BC0BF
          position: relative
          margin-right: 70px
          &:after
            content: ''
            display: block
            position: absolute
            top: 0
            right: -50px
            border: 25px solid transparent
            border-left-color: #5BC0BF
        .content
          flex:1 1 auto
          .super-img-wrapper
            display:flex
            margin-bottom:20px
            .img-wrapper
              border:1px solid #b4b4b4             
              margin-right:20px
              width:160px
              .img
                width:160px
                height:160px
                img
                  max-width:160px
              .des
                border-top:1px solid #b4b4b4
                display:flex
                align-items:center
                justify-content:space-around
                height: 40px
                font-size:14px
                color:#5BC0BF
                background-color: #f8f9fc  
                .zhutu
                  color:#D23029
                .swzhutu,.sczhutu
                  &:hover
                    cursor:pointer
          .upload-btn
            display:flex
            .upload-btn-wrap
              position:relative
              margin-right:20px
              .upload-input
                position:absolute
                top:0
                left:0
                width:98px
                height:40px
                cursor:pointer
                z-index:5
                opacity:0
          .tips
              font-size: 12px
              color: #5a5a5a
              line-height: 16px
              margin-top: 5px  
      .good-detail
        display:flex
        .step-label
          flex:0 1 auto
          width: 150px
          height: 50px
          line-height: 50px
          color: #fff
          padding: 0 20px
          box-sizing: border-box
          background-color: #5BC0BF
          position: relative
          margin-right: 70px
          &:after
            content: ''
            display: block
            position: absolute
            top: 0
            right: -50px
            border: 25px solid transparent
            border-left-color: #5BC0BF  
        .wrapper
          .editor-wrapper
            .editor
              width:800px
              height:300px
          .btn-wrapper
            margin-top:100px
    .step4
      .step-content
        .goods-class
          .tips
            font-size: 12px
            color: #5a5a5a
            line-height: 16px
            margin-top: 5px
        .button-wrapper
          margin-top:20px
.dialog 
  .title
    display:flex
    justify-content:space-between     
    align-items:center  
    margin-bottom:20px
    .search-input
      margin-right:20px
  .img-table
    display:flex
    margin-bottom:15px
    .img-wrapper
      position:relative
      margin-right:20px
      img
        max-width:150px
      i
        position:absolute
        top:0
        right:0 
        color:#278d27
        border-radius:50%
        background-color:#fff
        font-size:24px   
</style>
<style>
.dialog .el-button--primary{
  background: #5bc0bf;
  border-color: #5bc0bf;
  color: #fff;
}
.dialog .el-button--primary:hover{
    border-color: #7ccdcc;
    background-color: #7ccdcc;
}
.body .step-wrapper .el-button--primary{
  background: #5bc0bf;
  border-color: #5bc0bf;
  color: #fff;
}
.body .step-wrapper .el-button--primary:hover{
    border-color: #7ccdcc;
    background-color: #7ccdcc;
}
.body .steps .is-finish{
    color: #5BC0BF;
    border-color: #5BC0BF;
}
</style>