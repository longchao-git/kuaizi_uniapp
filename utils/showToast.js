/**
 * 全局工具方法
 * 提供授权设置弹窗功能
 */

// 用户授权设置弹窗

function OpenSettingShow(boo, typeV) {
	var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例  

	that.OpenSettingShow = boo;

	if (typeV) {
		that.OpenSettingType = typeV;
	}
}

uni.pubOpenSetting = OpenSettingShow; 