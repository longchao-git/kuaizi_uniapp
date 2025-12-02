/**
 * 页面导航工具函数
 */

/**
 * 通用页面跳转
 * @param {String} url 跳转地址
 * @param {String} method 跳转方式：redirect/tab/back
 * @param {Object} appInstance App实例
 */
export function gopage(url, method, appInstance) {
	if (url.length < 1) {
		uni.showToast({
			title: "请设置小程序的链接"
		});
	} else if (url.indexOf('https://') == 0) {
		topage("/subPages/other/webview/webview?url=" + url, method, appInstance);
	} else if (url.indexOf('http://') == 0) {
		uni.showToast({
			title: "您设置的链接不合法"
		});
	} else if (url.indexOf("/pages/mine/") == 0 || url.indexOf("/pages/order/") == 0 || 
			   url.indexOf("../mine/mine") == 0 || url.indexOf("../order/order") == 0) {
		topage(url, 'tab', appInstance);
	} else {
		topage(url, method, appInstance);
	}
}

/**
 * 页面跳转
 * @param {String} url 跳转地址
 * @param {String} method 跳转方式
 * @param {Object} appInstance App实例
 */
export function topage(url, method, appInstance) {
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

/**
 * 页面分享
 * @param {String} title 分享标题
 * @param {String} path 分享路径
 * @returns {Object}
 */
export function share(title, path) {
	return {
		title: title,
		path: path,
		success: function(res) {},
		fail: function(res) {}
	};
}

/**
 * 分享到朋友圈
 * @param {String} title 分享标题
 * @param {String} path 分享路径
 * @param {String} img 分享图片
 * @returns {Object}
 */
export function shareTimeline(title, path, img) {
	return {
		title: title,
		query: path,
		imageUrl: img ? img : '',
		success: function(res) {},
		fail: function(res) {}
	};
}
