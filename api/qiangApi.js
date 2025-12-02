/**
 * 抢购相关API
 */

import { http } from './request.js';

/**
 * 抢购首页风格
 */
export function qiangTheme(params, callback, nothasloading, appInstance) {
	return http('client/qiang/qiang/theme', params, callback, nothasloading, appInstance);
}

/**
 * 抢购列表
 */
export function qiangIndex(params, callback, nothasloading, appInstance) {
	return http('client/qiang/qiang/index', params, callback, nothasloading, appInstance);
}

/**
 * 创建订单
 */
export function orderCreate(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/create', params, callback, nothasloading, appInstance);
}

/**
 * 抢购订单评论
 */
export function qiangComment(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/comment', params, callback, nothasloading, appInstance);
}

/**
 * 抢购订单票据
 */
export function qiangTicket(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/ticket', params, callback, nothasloading, appInstance);
}

/**
 * 预订单
 */
export function qiangOrder(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/order', params, callback, nothasloading, appInstance);
}

/**
 * 修改订单
 */
export function perinfoOrder(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/perinfo', params, callback, nothasloading, appInstance);
}

/**
 * 抢购搜索
 */
export function qiangSearch(params, callback, nothasloading, appInstance) {
	return http('client/qiang/qiang/search', params, callback, nothasloading, appInstance);
}

/**
 * 抢购详情
 */
export function productGet(params, callback, nothasloading, appInstance) {
	return http('client/qiang/qiang/detail', params, callback, nothasloading, appInstance);
}

/**
 * 抢购订单列表
 */
export function qiangClientOrder(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order', params, callback, nothasloading, appInstance);
}

/**
 * 取消订单
 */
export function orderTicket(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/chargeback', params, callback, nothasloading, appInstance);
}

/**
 * 取消订单详情
 */
export function ticketDetail(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/ticket_detail', params, callback, nothasloading, appInstance);
}

/**
 * 抢购订单退款
 */
export function qiangPayback(params, callback, nothasloading, appInstance) {
	return http('client/qiang/order/payback', params, callback, nothasloading, appInstance);
}
