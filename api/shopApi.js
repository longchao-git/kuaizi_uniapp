/**
 * 商家相关API
 */

import { http } from './request.js';

/**
 * 搜索热词
 */
export function hotSearch(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/hotsearch', params, callback, nothasloading, appInstance);
}

/**
 * 获取搜索商家列表结果接口
 */
export function shopSearchs(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/search', params, callback, nothasloading, appInstance);
}

/**
 * 商家列表数据
 */
export function shopLists(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/shoplist', params, callback, nothasloading, appInstance);
}

/**
 * 商家列表全部分类
 */
export function shopListsCates(params, callback, nothasloading, appInstance) {
	return http('client/waimai/cate/index', params, callback, nothasloading, appInstance);
}

/**
 * 商家数据
 */
export function shopDetail(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/detail', params, callback, nothasloading, appInstance);
}

/**
 * 商家详情商品搜索
 */
export function shopDetailSearch(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/shop_so', params, callback, nothasloading, appInstance);
}

/**
 * 商家评论
 */
export function shopComments(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/comments', params, callback, nothasloading, appInstance);
}

/**
 * 商家详情信息数据
 */
export function shopInfo(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/info', params, callback, nothasloading, appInstance);
}

/**
 * 商家优惠券
 */
export function shopCoupons(params, callback, nothasloading, appInstance) {
	return http('client/waimai/coupon/coupons', params, callback, nothasloading, appInstance);
}

/**
 * 领取商家优惠券
 */
export function getCoupons(params, callback, nothasloading, appInstance) {
	return http('client/waimai/coupon/getcoupon', params, callback, nothasloading, appInstance);
}

/**
 * 商家分享图片
 */
export function shareImg(params, callback, nothasloading, appInstance) {
	return http('client/waimai/shop/shareImg', params, callback, nothasloading, appInstance);
}

/**
 * 入驻商家
 */
export function enterShop(params, callback, nothasloading, appInstance) {
	return http('client/waimai/signup/shop', params, callback, nothasloading, appInstance);
}
