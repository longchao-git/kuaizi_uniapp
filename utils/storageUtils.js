/**
 * 本地存储工具函数
 */

/**
 * 移除某个本地储存
 * @param  {...any} arr 要删除的key数组
 */
export function removeStorage(...arr) {
	arr.forEach(value => {
		uni.removeStorage({
			key: value,
			success: function(res) {}
		});
	});
}

/**
 * 设置本地储存
 * @param {String} key 键
 * @param {Any} data 值
 */
export function setStorage(key, data) {
	uni.setStorage({
		key: key,
		data: data,
		success: function(res) {}
	});
}

/**
 * 获取存储
 * @param {String} key 键
 * @param {Function} successCall 成功回调
 * @param {Function} failCall 失败回调
 */
export function getStorage(key, successCall, failCall) {
	successCall = typeof successCall == 'function' ? successCall : function(res) {};
	failCall = typeof failCall == 'function' ? failCall : function() {};
	
	uni.getStorage({
		key: key,
		success: function(res) {
			successCall(res);
		},
		fail: function() {
			failCall();
		}
	});
}
