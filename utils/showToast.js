/*  
显示toast提示  
title:    提示的内容 必填  
icon:     图标，//请指定正确的路径，选填  
duration: 提示的延迟时间，单位毫秒，默认：1500, 10000永远存在除非手动清除 选填  
mask:     是否显示透明蒙层，防止触摸穿透，默认：true 选填  
cb:       接口调用成功的回调函数 选填  
 */
function showToast(obj) {
	if (typeof obj == 'object' && obj.title) {
		var duration = obj.duration && typeof obj.duration == 'number' ? obj.duration : 1800; //默认1.8s后消失  

		var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例  

		// 创建新对象避免直接修改 prop
		var toastData = {
			...obj,
			isShow: true,
			duration: duration
		};

		if (duration < 10000) {
			setTimeout(function() {
				obj.cb && typeof obj.cb == 'function' && obj.cb(); //如果有成功的回调则执行  
				
				if (that.showToast) {
					that.showToast.isShow = false;
				}
			}, duration);
		}

		that.showToast = toastData;
	} else {
		console.log('showToast fail:请确保传入的是对象并且title必填');
	}
}
/**  
 *手动关闭toast提示  
 */


function hideToast() {
	var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例  

	if (that.showToast) {
		that.showToast.isShow = false;
	}
}

uni.showToast = showToast;
uni.pubHide = hideToast; //加载；

function loading(ing) {
	var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例

	if (ing == true) {
		that.ing = ing;
		that.end = false;
	} else {
		that.ing = ing;
		that.end = true;
	}
}

uni.pubLoading = loading; //无数据；

function nodata(nodata) {
	var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例

	that.nodata = nodata;
}

uni.pubNodata = nodata; //用户授权设置

function OpenSettingShow(boo, typeV) {
	var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例  

	that.OpenSettingShow = boo;

	if (typeV) {
		that.OpenSettingType = typeV;
	}
}

uni.pubOpenSetting = OpenSettingShow; 