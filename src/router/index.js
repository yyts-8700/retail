import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login.vue'
import index from '../components/index/index.vue'
import indexFirst from '../components/index/indexFirst.vue'
import accountSetting from '../components/index/accountSetting.vue'
import loginJournal from '../components/index/loginJournal.vue'
import systemInfo from '../components/index/systemInfo.vue'

import list from '../components/goods/list.vue'
import addGoods from '../components/goods/addGoods.vue'
import recycle from '../components/goods/recycle.vue'
import evaluate from '../components/goods/evaluate.vue'
import config from '../components/goods/config.vue'
import classes from '../components/goods/class.vue'
import type from '../components/goods/type.vue'
import brandManage from '../components/goods/brandManage.vue'
import libManage from '../components/goods/libManage.vue'
import detail from '../components/goods/detail.vue'
import prop from '../components/goods/prop.vue'
import param from '../components/goods/param.vue'
import addProp from '../components/goods/addProp.vue'
import addParam from '../components/goods/addParam.vue'
import addClass from '../components/goods/addClass.vue'
import addBrand from '../components/goods/addBrand.vue'
import addImage from '../components/goods/addImage.vue'
import imageList from '../components/goods/imageList.vue'



import orderslist from '../components/orders/list.vue'
import confirm from '../components/orders/confirm.vue'
import setting from '../components/orders/setting.vue'
import rr from '../components/orders/rr.vue'
import returns from '../components/orders/return.vue'
import rufund from '../components/orders/rufund.vue'
import returnReason from '../components/orders/returnReason.vue'
import sendAddress from '../components/orders/sendAddress.vue'
import orderDetail from '../components/orders/orderDetail.vue'
import refundDetail from '../components/orders/refundDetail.vue'
import addAddress from '../components/orders/addAddress.vue'



import getin from '../components/stock/in.vue'
import out from '../components/stock/out.vue'

import userlist from '../components/users/list.vue'
import info from '../components/users/info.vue'


import promotionlist from '../components/promotion/header.vue'
import times from '../components/promotion/addHeader.vue'

import operatelist from '../components/operate/list.vue'
import addAd from '../components/operate/addAd.vue'

import trade from '../components/stat/trade.vue'
import goods from '../components/stat/goods.vue'
import search from '../components/stat/search.vue'

import bill from '../components/finance/bill.vue'
import billmanage from '../components/finance/billmanage.vue'
import sell from '../components/finance/sell.vue'
import comp from '../components/finance/comp.vue'


import tracks from '../components/setting/track.vue'
import areaSetting from '../components/setting/areaSetting.vue'

import journal from '../components/autho/journal.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass:"active",
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
    	path:'/index',
    	name:'index',
    	component:index,
      redirect:'/index/systemIndex',
      children:[
        {
          path:'/index/systemIndex',
          component:indexFirst
        },
        {
          path:'/index/accountSetting',
          component:accountSetting
        },
        {
          path:'/index/loginJournal',
          component:loginJournal
        },
        {
          path:'/index/systemInfo',
          component:systemInfo
        },
        {
          path:'/goods/list',
          component:list
        },
        {
          path:'/goods/addGoods',
          component:addGoods
        },
        {
          path:'/goods/recycle',
          component:recycle
        },
        {
          path:'/goods/evaluate',
          component:evaluate
        },
        {
          path:'/goods/evaluate/detail',
          component:detail
        },
        {
          path:'/goods/config',
          component:config
        },
        {
          path:'/goods/class',
          component:classes
        },
        {
          path:'/goods/class/addClass',
          component:addClass
        },
        {
          path:'/goods/type',
          component:type
        },
        {
          path:'/goods/type/prop',
          component:prop
        },
        {
          path:'/goods/type/param',
          component:param
        },
        {
          path:'/goods/type/addProp',
          component:addProp
        },
        {
          path:'/goods/type/addParam',
          name:'addParam',
          component:addParam
        },
        
        {
          path:'/goods/brandManage',
          component:brandManage
        },
        {
          path:'/goods/brandManage/addBrand',
          component:addBrand
        },
        {
          path:'/goods/libManage',
          component:libManage
        },
        {
          path:'/goods/libManage/imageList',
          component:imageList
        },
        {
          path:'/goods/libManage/addImage',
          component:addImage
        },
        {
          path:'/orders/list',
          component:orderslist
        },
        {
          path:'/orders/list/orderDetail',
          component:orderDetail
        },
        {
          path:'/orders/confirm',
          component:confirm
        },
        {
          path:'/orders/setting',
          component:setting
        },
        {
          path:'/orders/rr',
          component:rr
        },
        {
          path:'/orders/return',
          component:returns
        },
        {
          path:'/orders/refund',
          component:rufund
        },
        {
          path:'/orders/refund/refundDetail',
          component:refundDetail
        },
        {
          path:'/orders/returnReason',
          component:returnReason
        },
        {
          path:'/orders/sendAddress',
          component:sendAddress
        },
        {
          path:'/orders/sendAddress/addAddress',
          component:addAddress
        },
        {
          path:'/stock/in',
          component:getin
        },
        {
          path:'/stock/out',
          component:out
        },
        {
          path:'/users/list',
          component:userlist
        },
        {
          path:'/users/list/info',
          component:info
        },
        {
          path:'/promotion/header',
          component:promotionlist
        },
        {
          path:'/promotion/addHeader',
          component:times
        },
        {
          path:'/operate/list',
          component:operatelist
        },
        {
          path:'/operate/addAd',
          component:addAd
        },
        {
          path:'/stat/trade',
          component:trade
        },
        {
          path:'/stat/goods',
          component:goods
        },
        {
          path:'/stat/search',
          component:search
        },
        {
          path:'/finance/bill',
          component:bill
        },
        {
          path:'/finance/billmanage',
          component:billmanage
        },
        {
          path:'/finance/sell',
          component:sell
        },
        {
          path:'/finance/comp',
          component:comp
        },
        {
          path:'/setting/pay',
          component:tracks
        },
        {
          path:'/setting/certificate',
          component:areaSetting
        },
        {
          path:'/autho/journal',
          component:journal
        }
      ]
    }
  ]
})
