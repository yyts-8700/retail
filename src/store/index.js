import Vuex from "vuex"
import Vue from 'vue'
Vue.use(Vuex)
export default new Vuex.Store({
	state:{
		userInfo:localStorage.getItem('userInfo') || {},
		activeNav:'index'
	},
	getters:{
		activeNav:(state)=>state.activeNav,	
		userInfo:(state)=>state.userInfo
	},
	mutations:{
		changeNav(state,module){
			state.activeNav = module
		},
		setUserinfo(state, userInfo){
	      state.userInfo = userInfo;
	      localStorage.setItem('userInfo', userInfo);
	    },
	    clearUserinfo(state){
	    	state.userInfo = {}
	    	localStorage.removeItem('userInfo')
	    }
	},
	actions : {
		
	}
})