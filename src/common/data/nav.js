export default{
	index:{
		title:'首页',
		path:'/index/systemIndex',
		child:[
			{
				sub:'系统首页',
				menu:[
					{
						name:'系统首页',
						path:'/index/systemIndex'
					},
					{
						name:'账户设置',
						path:'/index/accountSetting'
					},
					{
						name:'系统信息',
						path:'/index/systemInfo'
					},
					{
						name:'登录日志',
						path:'/index/loginJournal'
					}
				]
			}
		]
	},
	goods:{
		title:'商品',
		path:'/goods/list',
		child:[
			{
				sub:'商品管理',
				menu:[
					{
						name:'商品列表',
						path:'/goods/list'
					},
					{
						name:'添加商品',
						path:'/goods/addGoods'
					},
					{
						name:'商品回收站',
						path:'/goods/recycle'
					},
					{
						name:'商品评价',
						path:'/goods/evaluate'
					},
					// {
					// 	name:'商品配置',
					// 	path:'/goods/config'
					// },
					{
						name:'商品分类',
						path:'/goods/class'
					},
					{
						name:'商品类型',
						path:'/goods/type'
					},
					{
						name:'品牌管理',
						path:'/goods/brandManage'
					},
					{
						name:'商品图片库',
						path:'/goods/libManage'
					}
				]
			}
		]
	},
	orders:{
		title:'订单',
		path:'/orders/list',
		child:[
			{
				sub:'订单管理',
				menu:[
					{
						name:'订单列表',
						path:'/orders/list'
					},
					{
						name:'确认收货',
						path:'/orders/confirm'
					},
					{
						name:'订单设置',
						path:'/orders/setting'
					},
					// {
					// 	name:'退款及退货',
					// 	path:'/orders/rr'
					// },
					{
						name:'退货申请处理',
						path:'/orders/return'
					},
					{
						name:'退款申请处理',
						path:'/orders/refund'
					},
					{
						name:'退货原因设置',
						path:'/orders/returnReason'
					},
					{
						name:'发货点信息管理',
						path:'/orders/sendAddress'
					}
				]
			}
		]
	},
	stock:{
		title:'库存',
		path:'/stock/in',
		child:[
			{
				sub:'库存记录',
				menu:[
					{
						name:'商品入库',
						path:'/stock/in'
					},
					{
						name:'商品出库',
						path:'/stock/out'
					}
				]
			}
		]
	},
	users:{
		title:'用户',
		path:'/users/list',
		child:[
			{
				sub:'用户管理',
				menu:[
					{
						name:'用户列表',
						path:'/users/list'
					}
				]
			}
		]
	},
	promotion:{
		title:'促销',
		path:'/promotion/header',
		child:[
			{
				sub:'头部类目',
				menu:[
					{
						name:'头部列表',
						path:'/promotion/header'
					},
					{
						name:'添加头部',
						path:'/promotion/addHeader'
					}
				]
			}
		]
	},
	operate:{
		title:'运营',
		path:'/operate/list',
		child:[
			{
				sub:'广告管理',
				menu:[
					{
						name:'广告列表',
						path:'/operate/list'
					},
					{
						name:'添加广告',
						path:'/operate/addAd'
					}
				]
			}
		]
	},	
	// stat:{
	// 	title:'统计',
	// 	path:'/stat/trade',
	// 	child:[
	// 		{
	// 			sub:'统计分析',
	// 			menu:[
	// 				{
	// 					name:'交易统计',
	// 					path:'/stat/trade'
	// 				},
	// 				{
	// 					name:'商品统计',
	// 					path:'/stat/goods'
	// 				},
	// 				{
	// 					name:'搜索统计',
	// 					path:'/stat/search'
	// 				},
	// 			]
	// 		}
	// 	]
	// },	
	// finance:{
	// 	title:'财务',
	// 	path:'/finance/bill',
	// 	child:[
	// 		{
	// 			sub:'财务报表',
	// 			menu:[
	// 				{
	// 					name:'对账列表',
	// 					path:'/finance/bill'
	// 				},
	// 				{
	// 					name:'对账管理',
	// 					path:'/finance/billmanage'
	// 				},
	// 				{
	// 					name:'销售统计',
	// 					path:'/finance/sell'
	// 				},
	// 				{
	// 					name:'综合统计',
	// 					path:'/finance/comp'
	// 				},
	// 			]
	// 		}	
	// 	]
	// },
	setting:{
		title:'设置',
		path:'/setting/pay',
		child:[
			{
				sub:'基础设置',
				menu:[
					{
						name:'支付设置',
						path:'/setting/pay'
					},
					{
						name:'退款证书',
						path:'/setting/certificate'
					}
				]
			}
		]
	},
	autho:{
		title:'权限',
		path:'/autho/journal',
		child:[
			{
				sub:'权限管理',
				menu:[
					{
						name:'操作日志',
						path:'/autho/journal'
					}
				]
			}
		]
	},
}