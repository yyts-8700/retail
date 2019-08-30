const adPositionList = {
  '1': 'APP首页轮播',
  '2': '分类轮播',
};

const propSelectList = {
  '0': '唯一属性',
  '1': '单选属性',
  '2': '复选属性',
};

const sexList = {
  '0': '女',
  '1': '男',
  '2': '未知',
};

const orderStatus = {
  '0': '已关闭',
  '1': '待付款',
  '2': '待发货',
  '3': '待收货',
  '4': '待评价',
  '5': '已完成',
};

const recommendStatus = {
  '0': '未推荐',
  '1': '推荐中',
};

function getAdPosition(param) {
  return adPositionList[param]
}

function getPropSelect(param) {
  return propSelectList[param]
}

function getSex(param) {
  return sexList[param]
}

function getOrderStatus(param) {
  return orderStatus[param]
}

function getRecommendStatus(param) {
  return recommendStatus[param]
}

export default {
  // adPositionList: adPositionList,
  getAdPosition: getAdPosition,
  getPropSelect: getPropSelect,
  getSex: getSex,
  getOrderStatus: getOrderStatus,
  // recommendStatus: recommendStatus,
  getRecommendStatus: getRecommendStatus,
}