/**
 * HTTP请求封装
 */

import { APP_CONFIG } from '@/config/appConfig.js';
import { setRandom, saveCookies } from '@/utils/commonUtils.js';
import { getLocation } from '@/utils/locationUtils.js';

/**
 * API请求
 * @param {String} api 接口地址
 * @param {Object} params 请求参数
 * @param {Function} callback 回调函数
 * @param {Boolean} nothasloading 是否显示loading
 * @param {Object} appInstance App实例
 */
export function http(api, params, callback, nothasloading, appInstance) {
	let crypto = require("crypto");
	let CLIENT_VER = appInstance._CFG.version || '';
	params = params || {};
	
	var paramsString = JSON.stringify(params);
	let salt = (Date.parse(new Date()) / 1000).toString();
	
	// 生成header签名
	let header_hash = crypto.createHash('md5');
	header_hash.update(APP_CONFIG.HEADER_SIGN_KEY + CLIENT_VER + api + salt + paramsString);
	let header_sign = header_hash.digest('hex');
	
	// 生成数据签名
	let hash = crypto.createHash('md5');
	let token = appInstance._CFG.TOKEN || '';
	let nonce = setRandom(16);
	hash.update(paramsString + token + '' + CLIENT_VER + api + nonce + salt + APP_CONFIG.SIGN_KEY);
	let sign = hash.digest('hex');
	
	// 处理cookies
	let cookies = appInstance.cookies;
	var cookie = '';
	for (var key in cookies) {
		cookie += (key + '=' + cookies[key]['value'] + ';');
	}
	
	getLocation(() => {
		if (uni.showLoading && !nothasloading) {
			uni.showLoading({
				title: '加载中...'
			});
		}
		
		callback = typeof callback == 'function' ? callback : function(res) {};
		
		var json = {
			"CLIENT_OS": "UNIAPP",
			"CLIENT_API": "CUSTOM",
			"CLIENT_VER": CLIENT_VER,
			"WX_OPENID": appInstance._CFG.wx_openid,
			"ALI_OPENID": appInstance._CFG.ali_openid,
			"API": api,
			"TOKEN": appInstance._CFG.TOKEN || '',
			"PHPSESSID": appInstance._CFG.PHPSESSID || "",
			"LNG": appInstance._CFG.lng || '',
			"LAT": appInstance._CFG.lat || '',
			"CITY_ID": appInstance.city_id || '',
			"SIGN": sign,
			"SALT": salt,
			"data": paramsString
		};
		
		// #ifdef MP-ALIPAY
		json.CLIENT_OS = "UNIAPP";
		// #endif
		
		// #ifdef MP-WEIXIN
		json.CLIENT_OS = "WXAPP";
		// #endif
		
		var API_BASE = APP_CONFIG.URL + '/api/v1/' + api;
		var dataType = 'json';
		var responseType = 'text';
		
		if (api == 'magic/verify') {
			dataType = '其他';
			responseType = 'arraybuffer';
		}
		
		uni.request({
			url: API_BASE,
			dataType: dataType,
			responseType: responseType,
			data: json,
			method: "POST",
			timeout: 15000,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Cookie': cookie,
				'x-cookie': cookie,
				'X-SALT': salt,
				'X-SIGN': header_sign,
				'X-NONCE': nonce
			},
			success: function(res) {
				uni.hideLoading();
				
				if (api == 'magic/verify') {
					const imageData = wx.arrayBufferToBase64(res.data);
					callback(imageData);
					return;
				}
				
				if (api == 'magic/image') {
					callback(res.data.data.img);
					return;
				}
				
				saveCookies(res, appInstance);
				
				if (res.data.PHPSESSID) {
					appInstance._CFG.PHPSESSID = res.data.PHPSESSID;
				}
				
				if (res.data.error == "101") {
					appInstance._CFG.TOKEN = '';
					appInstance._CFG.userInfo = {};
					appInstance._CFG.userInfo2 = {};
					appInstance._CFG.wx_unionid = '';
					appInstance._CFG.wx_openid = '';
					
					uni.removeStorage({ key: 'userinfo' });
					uni.removeStorage({ key: 'userinfo2' });
					uni.removeStorage({ key: 'token' });
					uni.removeStorage({ key: 'unionid' });
					uni.removeStorage({ key: 'wx_openid' });
					
					// 需要重新登录
					if (appInstance.onLogin) {
						appInstance.onLogin();
					}
				} else if (res.data.error == "105") {
					callback(res.data);
				} else {
					callback(res.data);
				}
			},
			fail: function(error) {
				uni.hideLoading();
				uni.showToast({
					title: '网络请求错误',
					icon: 'none'
				});
			}
		});
	}, appInstance);
}
