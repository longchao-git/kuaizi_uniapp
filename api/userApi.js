/**
 * 用户中心相关API
 */

import { http } from './request.js';

/**
 * 我的信息
 */
export function mineInfo(params, callback, nothasloading, appInstance) {
	return http('client/member/info', params, callback, nothasloading, appInstance);
}

/**
 * 我的余额日志
 */
export function moneyLog(params, callback, nothasloading, appInstance) {
	return http('client/member/money/log', params, callback, nothasloading, appInstance);
}

/**
 * 我的余额提现 
 */
export function moneyCash(params, callback, nothasloading, appInstance) {
	return http('client/member/money/apply', params, callback, nothasloading, appInstance);
}

/**
 * 余额充值
 */
export function moneyRecharge(params, callback, nothasloading, appInstance) {
	return http('client/payment/package', params, callback, nothasloading, appInstance);
}

/**
 * 余额充值支付
 */
export function moneyPay(params, callback, nothasloading, appInstance) {
	return http('client/payment/money', params, callback, nothasloading, appInstance);
}

/**
 * 我的地址
 */
export function mineAddr(params, callback, nothasloading, appInstance) {
	return http('client/member/addr/index', params, callback, nothasloading, appInstance);
}

/**
 * 修改地址
 */
export function editCreate(params, callback, nothasloading, appInstance) {
	return http('client/member/addr/update', params, callback, nothasloading, appInstance);
}

/**
 * 创建地址
 */
export function addrCreate(params, callback, nothasloading, appInstance) {
	return http('client/member/addr/create', params, callback, nothasloading, appInstance);
}

/**
 * 删除地址
 */
export function addrDel(params, callback, nothasloading, appInstance) {
	return http('client/member/addr/delete', params, callback, nothasloading, appInstance);
}

/**
 * 配送会员卡
 */
export function peicard(params, callback, nothasloading, appInstance) {
	return http('client/member/peicard/peicard', params, callback, nothasloading, appInstance);
}

/**
 * 配送会员卡使用记录
 */
export function peicardLogs(params, callback, nothasloading, appInstance) {
	return http('client/member/peicard/cardlogs', params, callback, nothasloading, appInstance);
}

/**
 * 我的配送会员卡
 */
export function minePeicard(params, callback, nothasloading, appInstance) {
	return http('client/member/peicard/mycard', params, callback, nothasloading, appInstance);
}

/**
 * 支付配送会员卡接口
 */
export function payPeicard(params, callback, nothasloading, appInstance) {
	return http('client/payment/peicard', params, callback, nothasloading, appInstance);
}

/**
 * 我的收藏
 */
export function mineCollect(params, callback, nothasloading, appInstance) {
	return http('client/member/collect/shop', params, callback, nothasloading, appInstance);
}

/**
 * 收藏事件
 */
export function tapCollect(params, callback, nothasloading, appInstance) {
	return http('client/member/collect/collect', params, callback, nothasloading, appInstance);
}

/**
 * 我的优惠券
 */
export function mineCoupons(params, callback, nothasloading, appInstance) {
	return http('client/member/coupon/index', params, callback, nothasloading, appInstance);
}

/**
 * 我的红包列表
 */
export function mineHongbao(params, callback, nothasloading, appInstance) {
	return http('client/member/hongbao/index', params, callback, nothasloading, appInstance);
}

/**
 * 分享邀请数据
 */
export function invite(params, callback, nothasloading, appInstance) {
	return http('client/member/invite/invite', params, callback, nothasloading, appInstance);
}

/**
 * 我的消息分类
 */
export function mineMessageCates(params, callback, nothasloading, appInstance) {
	return http('client/member/msg/index', params, callback, nothasloading, appInstance);
}

/**
 * 我的消息
 */
export function mineMessage(params, callback, nothasloading, appInstance) {
	return http('client/member/msg/msg', params, callback, nothasloading, appInstance);
}

/**
 * 读取我的消息接口
 */
export function readMessage(params, callback, nothasloading, appInstance) {
	return http('client/member/msg/readmsg', params, callback, nothasloading, appInstance);
}

/**
 * 兑换优惠码邀请码
 */
export function redeempromocode(params, callback, nothasloading, appInstance) {
	return http('client/member/promotion/validate_code', params, callback, nothasloading, appInstance);
}
