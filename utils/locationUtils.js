/**
 * 定位相关工具函数
 */

let isNumber = 0;

/**
 * 获取用户位置授权状态
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function getUserLocationState(callback, appInstance) {
	callback = callback || function() {};
	
	//#ifdef H5
	// H5 环境直接获取定位
	getLocation(callback, appInstance);
	//#endif
	
	//#ifdef MP-WEIXIN || MP-ALIPAY
	// 小程序环境检查定位授权
	uni.getSetting({
		success(res) {
			//#ifdef MP-WEIXIN
			if (res.authSetting['scope.userLocation'] != undefined && !res.authSetting['scope.userLocation']) {
				uni.showModal({
					content: '请打开微信定位',
					success(res1) {
						if (res1.confirm) {
							uni.openSetting({
								success(res2) {
									if (res2.authSetting['scope.userLocation']) {
										getLocation(callback, appInstance);
									}
								}
							});
						}
					}
				});
			} else {
				getLocation(callback, appInstance);
			}
			//#endif
			
			//#ifdef MP-ALIPAY
			if (res.authSetting.userLocation != undefined && !res.authSetting.userLocation) {
				uni.showModal({
					content: '请打开支付宝定位',
					success(res1) {
						if (res1.confirm) {
							uni.openSetting({
								success(res2) {
									if (res2.authSetting.userLocation) {
										getLocation(callback, appInstance);
									}
								}
							});
						}
					}
				});
			} else {
				getLocation(callback, appInstance);
			}
			//#endif
		}
	});
	//#endif
}

/**
 * 获取地址经纬度
 * @param {Function} callback 回调函数
 * @param {Object} appInstance App实例
 */
export function getLocation(callback, appInstance) {
	callback = callback || function() {};
	
	// 如果经纬度已存在,直接执行回调
	if (appInstance._CFG.lng && appInstance._CFG.lat) {
		callback();
		return;
	}
	
	// 如果正在获取中,等待获取完成
	if (isNumber > 0) {
		let checkInterval = setInterval(() => {
			if (appInstance._CFG.lng && appInstance._CFG.lat) {
				clearInterval(checkInterval);
				callback();
			}
		}, 100);
		
		// 最多等待5秒
		setTimeout(() => {
			clearInterval(checkInterval);
			if (!appInstance._CFG.lng || !appInstance._CFG.lat) {
				appInstance._CFG.lng = '-3.709870';
				appInstance._CFG.lat = '40.422980';
				appInstance._CFG.currentlng = appInstance._CFG.lng;
				appInstance._CFG.currentlat = appInstance._CFG.lat;
				callback();
			}
		}, 5000);
		return;
	}
	
	// 开始获取定位
	isNumber++;
	uni.getLocation({
		type: 'gcj02',
		altitude: true,
		success: function(res) {
			appInstance._CFG.lng = res.longitude.toString();
			appInstance._CFG.lat = res.latitude.toString();
			appInstance._CFG.currentlng = appInstance._CFG.lng;
			appInstance._CFG.currentlat = appInstance._CFG.lat;
			isNumber = 0;
			callback();
		},
		fail: function(err) {
			appInstance._CFG.lng = '-3.709870';
			appInstance._CFG.lat = '40.422980';
			appInstance._CFG.currentlng = appInstance._CFG.lng;
			appInstance._CFG.currentlat = appInstance._CFG.lat;
			isNumber = 0;
			callback();
			
			//#ifdef H5
			return;
			//#endif
			
			uni.showToast({
				title: '定位失败',
				icon: 'none'
			});
			setTimeout(() => {
				uni.pubOpenSetting(true, "openSetting");
			}, 1500);
		}
	});
}
