// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import Axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './common/css/reset.css'
import './common/fonts/iconfont.css'
import store from "./store/index.js"
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Axios.defaults.baseURL = '/api'
Vue.use(Element)
Vue.use(VueQuillEditor)



router.beforeEach((to, from, next) => {
	let module = to.path.split('/')[1] ? to.path.split('/')[1] : 'index';
	store.commit('changeNav', module);
	next();
});
//请求拦截
// Axios.interceptors.request.use(function (config) {
//     // 在发送请求之前做些什么   此处是以处理post参数格式为例
//   	if(config.method == "post"){
//   		config.data = qs.stringify(config.data);
//   	}
//     return config;
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
