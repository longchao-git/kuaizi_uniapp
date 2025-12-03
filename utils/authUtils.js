/**
 * 认证相关工具函数
 */

import {
	http
} from '@/api/request.js';

/**
 * 用户登录
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function onLogin(callback, appInstance) {
	appInstance.onLogin_callback = callback || function() {};
	console.log('wx_unionid:', appInstance._CFG.wx_unionid);
	
	if (!appInstance._CFG.TOKEN) {
		if (appInstance._CFG.wx_unionid) {
			// 已有 unionid，直接初始化登录
			initLogin(appInstance.onLogin_callback, appInstance);
		} else {
			//#ifdef H5
			// H5 环境直接跳转到绑定页面
			topage('/subPages/user/binding/binding', null, appInstance);
			//#endif
			
			//#ifdef MP-WEIXIN || MP-ALIPAY
			// 小程序环境，调用 uni.login 获取 code
			uni.login({
				//#ifdef MP-ALIPAY
				scopes: 'auth_user',
				//#endif
				complete: () => {
					uni.hideLoading();
				},
				fail: () => {
					uni.showToast({
						title: '您未授权，无法进行登录',
						icon: 'none'
					});
				},
				success: function(rs) {
					if (rs.code) {
						appInstance._CFG.auth_code = rs.code;
						
						// #ifdef MP-ALIPAY
						// 支付宝小程序：通过 code 获取 ali_openid
						http('client/bind/alipay_auth', {
							'code': rs.code
						}, function(res) {
							if (res.error == 0) {
								console.log('服务端auth认证用户id：' + res.data.ali_openid);
								appInstance._CFG.ali_openid = res.data.ali_openid;
								uni.setStorage({
									key: 'ali_openid',
									data: res.data.ali_openid
								});
								initLogin(appInstance.onLogin_callback, appInstance);
							} else {
								uni.showToast({
									title: res.message || '授权失败',
									icon: 'none'
								});
							}
						}, true, appInstance);
						// #endif
						
						// #ifdef MP-WEIXIN
						// 微信小程序：检查用户信息授权状态
						uni.getSetting({
							success(rt) {
								console.log('getSetting:', rt);
								console.log('scope.userInfo:', rt.authSetting['scope.userInfo']);
								
								if (rt.authSetting['scope.userInfo'] != undefined) {
									if (rt.authSetting['scope.userInfo']) {
										// 已授权，获取用户信息
										uni.getUserInfo({
											success: function(res) {
												uni.setStorage({
													key: 'userinfo',
													data: res.userInfo
												});
												uni.setStorage({
													key: 'userinfo2',
													data: res.userInfo
												});
												appInstance._CFG.userInfo = res.userInfo;
												appInstance._CFG.userInfo2 = res.userInfo;
												
												// 调用后端接口解密用户数据
												http("client/wxapp/endata", {
													"endata": res.encryptedData,
													"iv": res.iv,
													"code": appInstance._CFG.auth_code
												}, (ret) => {
													if (ret.error != "0") {
														uni.showToast({
															title: ret.message || '解密失败',
															icon: 'none'
														});
													} else {
														uni.setStorage({
															key: 'unionid',
															data: ret.data.unionId
														});
														uni.setStorage({
															key: 'wx_openid',
															data: ret.data.openId
														});
														appInstance._CFG.wx_info = ret.data;
														appInstance._CFG.wx_openid = ret.data.openId;
														appInstance._CFG.wx_unionid = ret.data.unionId;
														initLogin(appInstance.onLogin_callback, appInstance);
													}
												}, true, appInstance);
											}
										});
									} else {
										// 未授权，打开授权设置
										console.log('用户未授权，打开授权设置');
										uni.pubOpenSetting(true, "openSetting");
									}
								} else {
									// 首次使用，需要授权
									console.log('首次使用，需要授权');
									uni.pubOpenSetting(true, "getUserInfo");
								}
							}
						});
						// #endif
					}
				}
			});
			//#endif
		}
	} else {
		// 已登录，直接执行回调
		appInstance.onLogin_callback();
	}
}

/**
 * 初始化登录
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function initLogin(callback, appInstance) {
	callback = callback || function() {};

	http('client/passport/login', {
		//#ifdef MP-ALIPAY
		'ali_openid': appInstance._CFG.ali_openid,
		//#endif
		//#ifdef MP-WEIXIN
		'wx_unionid': appInstance._CFG.wx_unionid,
		'wx_openid': appInstance._CFG.wx_openid,
		'wx_nickname': appInstance._CFG.userInfo.nickName,
		'wx_headimgurl': appInstance._CFG.userInfo.avatarUrl || '',
		//#endif
	}, function(ret) {
		if (ret.error == "105") {
			topage('/subPages/user/binding/binding', null, appInstance);
		} else if (ret.error != "0") {
			uni.showToast({
				title: ret.message,
				icon: 'none'
			});
			callback();
		} else {
			uni.setStorage({
				key: 'token',
				data: ret.data.token
			});
			uni.setStorage({
				key: 'userinfo',
				data: ret.data
			});
			uni.getUserInfo({
				success: function(res) {
					uni.setStorage({
						key: 'userinfo2',
						data: res.userInfo
					});
					appInstance._CFG.userInfo2 = res.userInfo;
				}
			});
			appInstance._CFG.TOKEN = ret.data.token;
			appInstance._CFG.userInfo = ret.data;
			callback();
		}
	}, true, appInstance);
}

/**
 * 检查是否登录
 * @param {Object} appInstance App实例
 * @returns {Boolean}
 */
export function checkLogin(appInstance) {
	return appInstance._CFG.TOKEN && appInstance._CFG.TOKEN.length > 0 ? true : false;
}

/**
 * 判断是否登陆，并执行回调函数
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function afterCheckLogin(callback, appInstance) {
	callback = callback || function() {};

	if (checkLogin(appInstance)) {
		callback();
		return;
	}
	
	//#ifdef MP-ALIPAY || H5
	onLogin(function() {
		if (checkLogin(appInstance)) {
			callback();
		} else {
			let url = "/subPages/user/bindingauto/bindingauto";
			topage(url, "redirect", appInstance);
		}
	}, appInstance);
	//#endif
	
	//#ifdef MP-WEIXIN
	uni.getSetting({
		success(rr) {
			if (rr.authSetting['scope.userInfo'] != undefined) {
				if (!rr.authSetting['scope.userInfo']) {
					uni.pubOpenSetting(true, "openSetting");
				} else {
					onLogin(function() {
						if (checkLogin(appInstance)) {
							callback();
						} else {
							let url = "/subPages/user/bindingauto/bindingauto";
							topage(url, null, appInstance);
						}
					}, appInstance);
				}
			} else {
				onLogin(function() {
					callback();
				}, appInstance);
			}
		},
		fail(err) {
			console.error('获取授权设置失败:', err);
		}
	});
	//#endif
}

/**
 * 页面跳转（临时引用，后续会从navigationUtils导入）
 */
function topage(url, method, appInstance) {
	if (appInstance._CFG.double) {
		appInstance._CFG.double = false;

		if (!method) {
			uni.navigateTo({
				url: url,
				fail(res) {}
			});
		}

		if (method == 'redirect') {
			uni.redirectTo({
				url: url
			});
		}

		if (method == 'tab') {
			uni.switchTab({
				url: url
			});
		}

		if (method == 'back') {
			if (isNaN(url)) {
				uni.navigateBack({
					url: url
				});
			} else {
				uni.navigateBack({
					delta: url
				});
			}
		}

		setTimeout(function() {
			appInstance._CFG.double = true;
		}, 1000);
	}
}