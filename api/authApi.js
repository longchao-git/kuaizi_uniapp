/**
 * 认证相关API
 */

import { http } from './request.js';

/**
 * 解码接口
 */
export function endata(params, callback, nothasloading, appInstance) {
	return http('client/wxapp/endata', params, callback, nothasloading, appInstance);
}

/**
 * 获取手机验证码接口
 */
export function sendSms(params, callback, nothasloading, appInstance) {
	return http('magic/sendsms', params, callback, nothasloading, appInstance);
}

/**
 * 获取图片验证码
 */
export function getVerifyCode(params, callback, nothasloading, appInstance) {
	return http('magic/verify', params, callback, nothasloading, appInstance);
}

/**
 * 获取图片验证码
 */
export function getVerifyImage(params, callback, nothasloading, appInstance) {
	return http('magic/image', params, callback, nothasloading, appInstance);
}

/**
 * 客户端认证
 */
export function getClientPassport(params, callback, nothasloading, appInstance) {
	return http('client/passport', params, callback, nothasloading, appInstance);
}

/**
 * 客户端登录
 */
export function getClientLogin(params, callback, nothasloading, appInstance) {
	return http('client/passport/login', params, callback, nothasloading, appInstance);
}

/**
 * 客户端注册
 */
export function getClientSignup(params, callback, nothasloading, appInstance) {
	return http('client/passport/signup', params, callback, nothasloading, appInstance);
}

/**
 * 微信绑定手机号接口
 */
export function wxbind(params, callback, nothasloading, appInstance) {
	return http('client/passport/wxbind', params, callback, nothasloading, appInstance);
}

/**
 * 支付宝绑定手机号接口
 */
export function alipayBind(params, callback, nothasloading, appInstance) {
	return http('client/passport/alibind', params, callback, nothasloading, appInstance);
}

/**
 * 支付宝授权认证
 */
export function alipayAuthToken(params, callback, nothasloading, appInstance) {
	return http('client/bind/alipay_auth', params, callback, nothasloading, appInstance);
}
