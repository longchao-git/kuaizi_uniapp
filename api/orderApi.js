/**
 * 订单相关API
 */

import { http } from './request.js';

/**
 * 下单页信息
 */
export function orderForm(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/order', params, callback, nothasloading, appInstance);
}

/**
 * 下单页请求信息
 */
export function orderFormInfo(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/preinfo', params, callback, nothasloading, appInstance);
}

/**
 * 下单页地址
 */
export function orderFormAddr(params, callback, nothasloading, appInstance) {
	return http('client/member/addr/orderAddr', params, callback, nothasloading, appInstance);
}

/**
 * 下单页地址创建
 */
export function orderFormAddrCreate(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/create', params, callback, nothasloading, appInstance);
}

/**
 * 下单页地址删除
 */
export function orderFormAddrDel(params, callback, nothasloading, appInstance) {
	return http('client/wmclient/addr/del', params, callback, nothasloading, appInstance);
}

/**
 * 订单预支付
 */
export function orderInfo(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/orderinfo', params, callback, nothasloading, appInstance);
}

/**
 * 订单支付
 */
export function orderPay(params, callback, nothasloading, appInstance) {
	return http('client/payment/order', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单列表
 */
export function orders(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/index', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单详情
 */
export function ordersDetail(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/detail', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单退款
 */
export function ordersTui(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/payback', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单取消
 */
export function ordersCancel(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/chargeback', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单确认
 */
export function ordersConfirm(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/confirm', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单催单
 */
export function ordersCui(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/remind', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单客服申请
 */
export function ordersKefu(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/kefu', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单状态
 */
export function ordersStatus(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/status', params, callback, nothasloading, appInstance);
}

/**
 * 我的订单评价提交
 */
export function ordersCommentSubmt(params, callback, nothasloading, appInstance) {
	return http('client/waimai/order/comment', params, callback, nothasloading, appInstance);
}
