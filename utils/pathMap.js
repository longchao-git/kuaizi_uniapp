/**
 * 页面路径映射表
 * 用于处理分包后的路径跳转
 */
const pathMap = {
	// 订单相关 - 移动到 subPages/order
	'/pages/payment/payment': '/subPages/order/payment/payment',
	'/pages/wm_order/wm_order': '/subPages/order/wm_order/wm_order',
	'/pages/orderDetail/detail': '/subPages/order/orderDetail/detail',
	'/pages/payOrder/payOrder': '/subPages/order/payOrder/payOrder',
	'../payment/payment': '/subPages/order/payment/payment',
	'../orderDetail/detail': '/subPages/order/orderDetail/detail',
	
	// 商家相关 - 移动到 subPages/shop
	'/pages/shoptail/shoptail': '/subPages/shop/shoptail/shoptail',
	'/pages/shoplist/shoplist': '/subPages/shop/shoplist/shoplist',
	'/pages/shopsearch/shopsearch': '/subPages/shop/shopsearch/shopsearch',
	'/pages/searchshoplist/shoplist': '/subPages/shop/searchshoplist/shoplist',
	'../shoptail/shoptail': '/subPages/shop/shoptail/shoptail',
	
	// 团购相关 - 移动到 subPages/qianggou
	'/pages/qiangOrder/qiangOrder': '/subPages/qianggou/qiangOrder/qiangOrder',
	'/pages/qianglist/qianglist': '/subPages/qianggou/qianglist/qianglist',
	'/pages/qiangdetail/qiangdetail': '/subPages/qianggou/qiangdetail/qiangdetail',
	'../qiangOrder/qiangOrder': '/subPages/qianggou/qiangOrder/qiangOrder',
	
	// 邀请相关 - 移动到 subPages/invite
	'/pages/invite/index/index': '/subPages/invite/index/index',
	'/pages/invite/share/share': '/subPages/invite/share/share',
	'/pages/invite/getNewHongbao/getNewHongbao': '/subPages/invite/getNewHongbao/getNewHongbao',
	
	// 会员相关 - 移动到 subPages/member
	'/pages/member/card/card': '/subPages/member/card/card',
	'/pages/member/card_payment/payment': '/subPages/member/card_payment/payment',
	
	// 用户中心相关 - 移动到 subPages/user
	'/pages/user/ordevlt/ordevlt': '/subPages/user/ordevlt/ordevlt',
	'/pages/user/address/address': '/subPages/user/address/address',
	'/pages/user/addaddress/addaddress': '/subPages/user/addaddress/addaddress',
	'/pages/user/coupon/coupon': '/subPages/user/coupon/coupon',
	
	// 其他功能 - 移动到 subPages/other
	'/pages/webview/webview': '/subPages/other/webview/webview',
	'/pages/feedback/feedback': '/subPages/other/feedback/feedback'
};

/**
 * 转换路径
 * @param {string} path - 原始路径
 * @returns {string} - 转换后的路径
 */
export function convertPath(path) {
	if (!path) return path;
	
	// 分离路径和参数
	const [pathPart, queryPart] = path.split('?');
	
	// 查找映射
	const newPath = pathMap[pathPart] || pathPart;
	
	// 重新组合路径和参数
	return queryPart ? `${newPath}?${queryPart}` : newPath;
}

export default {
	pathMap,
	convertPath
};
