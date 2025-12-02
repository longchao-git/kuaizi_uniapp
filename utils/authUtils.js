/**
 * 认证相关工具函数
 */

import { http } from '@/api/request.js';

/**
 * 用户登录
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function onLogin(callback, appInstance) {
	appInstance.onLogin_callback = callback || function() {};
	
	if (!appInstance._CFG.TOKEN) {
		if (appInstance._CFG.wx_unionid) {
			initLogin(appInstance.onLogin_callback, appInstance);
		} else {
			//#ifdef H5
			topage('/subPages/user/binding/binding', null, appInstance);
			return;
			//#endif
		}
	} else {
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
	} else {
		//#ifdef MP-ALIPAY || H5
		onLogin(function() {
			if (checkLogin(appInstance)) {
				callback();
			} else {
				let url = "/subPages/user/bindingauto/bindingauto";
				topage(url, "redirect", appInstance);
			}
		}, appInstance);
		return;
		//#endif
		
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
								var url = "/subPages/user/bindingauto/bindingauto";
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
			fail(err) {}
		});
	}
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
