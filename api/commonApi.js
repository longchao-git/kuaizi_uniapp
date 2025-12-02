/**
 * 公共API
 */

import { http } from './request.js';

/**
 * 首页数据
 */
export function home(params, callback, nothasloading, appInstance) {
	return http('client/waimai/index/index', params, callback, nothasloading, appInstance);
}

/**
 * 首页模块化数据
 */
export function homeInfo(params, callback, nothasloading, appInstance) {
	return http('client/app/info', params, callback, nothasloading, appInstance);
}

/**
 * 首页红包
 */
export function homeHongbao(params, callback, nothasloading, appInstance) {
	return http('client/member/hongbao/getNewHongbao', params, callback, nothasloading, appInstance);
}

/**
 * 领取首页红包
 */
export function getHomeHongbao(params, callback, nothasloading, appInstance) {
	return http('client/member/hongbao/getNewHongbao', params, callback, nothasloading, appInstance);
}

/**
 * 根据经纬度获取地址城市
 */
export function addrdecode(params, callback, nothasloading, appInstance) {
	return http('/client/wxapp/addrdecode', params, callback, nothasloading, appInstance);
}

/**
 * 获取所有城市列表
 */
export function getcitylist(params, callback, nothasloading, appInstance) {
	return http('client/data/all_cities', params, callback, nothasloading, appInstance);
}

/**
 * 城市列表
 */
export function citys(params, callback, nothasloading, appInstance) {
	return http('client/data/city', params, callback, nothasloading, appInstance);
}

/**
 * 活动
 */
export function huodong(params, callback, nothasloading, appInstance) {
	return http('client/waimai/huodong/index', params, callback, nothasloading, appInstance);
}

/**
 * 分享邀请落地页数据(已领取)
 */
export function invitePage(params, callback, nothasloading, appInstance) {
	return http('client/invite/detail', params, callback, nothasloading, appInstance);
}

/**
 * 分享邀请落地页数据(未领取)
 */
export function invitePage2(params, callback, nothasloading, appInstance) {
	return http('client/invite/index', params, callback, nothasloading, appInstance);
}

/**
 * 分享邀请领取事件
 */
export function tapInvite(params, callback, nothasloading, appInstance) {
	return http('client/invite/invite_handle', params, callback, nothasloading, appInstance);
}

/**
 * 获取静态二维码
 */
export function getStaticQrcode(params, callback, nothasloading, appInstance) {
	return http('client/wxapp/getStaticQrcode', params, callback, nothasloading, appInstance);
}

/**
 * 红包套餐支付
 */
export function hbpackagePay(params, callback, nothasloading, appInstance) {
	return http('client/payment/hbPackage', params, callback, nothasloading, appInstance);
}

/**
 * 入驻骑手
 */
export function enterStaff(params, callback, nothasloading, appInstance) {
	return http('client/waimai/signup/staff', params, callback, nothasloading, appInstance);
}
